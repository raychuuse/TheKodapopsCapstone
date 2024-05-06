const express = require('express');
const { processQueryResult } = require('../utils');
const { isValidId } = require('../utils');
const router = express.Router();

const createRuns = (rows) => {
    if (rows.length === 0) return null;
    const run = {
        runID: rows[0].runID,
        date: rows[0].date,
        runName: rows[0].runName,
        stops: [],
    };

    for (const row of rows) {
        const stop = {
            stopID: row.stopID,
            sidingID: row.sidingID,
            sidingName: row.sidingName,
            collectQuantity: row.collectQuantity,
            dropOffQuantity: row.dropOffQuantity,
            isCompleted: !!row.isCompleted,
        };
        run.stops.push(stop);
    }
    return run;
};

router.get('/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        console.error('Invalid id');
        return res.status(400).json({ message: 'Please provide a valid id' });
    }

    req.db.raw(`SELECT *
                FROM runs
                WHERE runID = ?`, [req.params.id])
        .then(processQueryResult)
        .then(runsResult => {
            if (runsResult.length !== 1)
                return res.status(404).json({ message: 'No run found with id ' + req.params.id });

            const run = runsResult[0];
            req.db.raw(`SELECT rs.*,
                               s.sidingName,
                               CAST(COALESCE(t.picked_up_count, 0) AS UNSIGNED)   as 'collectCount',
                               CAST(COALESCE(t.dropped_off_count, 0) AS UNSIGNED) as 'dropOffCount'
                        FROM run_stops rs
                                 LEFT JOIN siding s ON rs.sidingID = s.sidingID
                                 LEFT JOIN (SELECT stopID,
                                                   SUM(type = 'PICKED_UP')   AS picked_up_count,
                                                   SUM(type = 'DROPPED_OFF') AS dropped_off_count
                                            FROM transactionlog
                                            GROUP BY stopID) AS t ON rs.stopID = t.stopID
                        WHERE rs.runID = ?`, [run.runID])
                .then(processQueryResult)
                .then(stopsResult => {
                    run.stops = stopsResult;
                    console.info(run);
                    return res.status(200).json(run);
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
        });
});

router.get('/:locoID/:date', (req, res) => {
    const locoID = req.params.locoID;
    if (isNaN(locoID)) {
        console.error('Invalid locoID');
        return res.status(400).json({ message: 'Please provide a valid locoID' });
    }
    const date = req.params.date;
    const parsed = Date.parse(date);
    if (isNaN(parsed)) {
        console.error('Invalid date');
        return res.status(400).json({ message: 'Please provide a valid date' });
    }

    req.db.raw(`SELECT *
                FROM runs r
                         LEFT JOIN run_stops rs ON r.runID = rs.runID
                         LEFT JOIN siding s ON rs.sidingID = s.sidingID
                WHERE locoID = ?
                  AND date = ?`, [locoID, date])
        .then(processQueryResult)
        .then(runsResult => {
            const t = createRuns(runsResult);
            if (t == null)
                return res.status(404).json({ message: 'No runs found with locoID and date' });
            return res.status(200).json(t);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
        });
});

router.post('/:locoID/stop-action/:stopID/:binID', (req, res) => {
    if (isNaN(req.params.binID))
        return res.status(400).json({ message: 'Please provide a valid bin ID' });
    if (isNaN(req.params.stopID))
        return res.status(400).json({ message: 'Please provide a valid stop ID' });
    if (isNaN(req.params.locoID))
        return res.status(400).json({ message: 'Please provide a valid loco ID' });
    if (req.query.type == null || (req.query.type !== 'COLLECT' && req.query.type !== 'DROP_OFF'))
        return res.status(400).json({ message: 'Please provide an action type' });

    const type = req.query.type;
    let stop;
    let bin;
    let loco;
    req.db.raw(`SELECT *
                FROM run_stops
                WHERE stopID = ?`, [req.params.stopID])
        .then(processQueryResult)
        .then(stopTemp => {
            stop = stopTemp[0];
            if (stop == null)
                throw {status: 404, message: 'No stop found with stop ID ' + req.params.stopID};
            return req.db.raw(`SELECT *
                               FROM bin
                               WHERE binID = ?`, [req.params.binID]);
        })
        .then(processQueryResult)
        .then(binTemp => {
            bin = binTemp[0];
            if (bin == null)
                throw {status: 404, message: 'No bin found with bin ID ' + req.params.binID};
            return req.db.raw(`SELECT *
                               FROM locomotive
                               WHERE locoID = ?`, [req.params.locoID]);
        })
        .then(processQueryResult)
        .then(locoTemp => {
            loco = locoTemp[0];
            if (loco == null)
                throw {status: 404, message: 'No loco found with loco ID ' + req.params.locoID};

            if (type === 'COLLECT' && bin.sidingID == null)
                throw {status: 400, message: 'Can\'t collect a bin unless it is at a siding'};
            else if (type === 'DROP_OFF' && bin.locoID == null)
                throw {status: 400, message: 'Can\'t drop off a bin unless it is on a loco'};

            return req.db.raw(`SELECT *
                               FROM transactionlog
                               WHERE userID = ?
                                 AND binID = ?
                                 AND stopID = ?
                                 AND locoID = ?
                                 AND type = ?`, [9, bin.binID, stop.stopID, loco.locoID, type === 'COLLECT' ? 'DROPPED_OFF' : 'PICKED_UP']);
        })
        .then(processQueryResult)
        .then(previousTransactionArr => {
            const previousTransaction = previousTransactionArr[0];
            let updateBin = false;
            let updateTransaction = false;
            req.db.transaction(trx => {
                if (type === 'COLLECT') {
                    if (bin.droppedOffInRun) bin.droppedOffInRun = false;
                    else bin.pickedUpInRun = true;
                } else {
                    if (bin.pickedUpInRun) bin.pickedUpInRun = false;
                    else bin.droppedOffInRun = true;
                }
                const sidingIDQuery = type === 'COLLECT' ? 'null' : '?';
                const locoIDQuery = type === 'COLLECT' ? '?' : 'null';
                trx.raw(`UPDATE bin
                         SET sidingID=${sidingIDQuery},
                             locoID=${locoIDQuery},
                             pickedUpInRun=?,
                             droppedOffInRun=?
                         WHERE binID = ?`, [type === 'COLLECT' ? loco.locoID : stop.sidingID, bin.pickedUpInRun, bin.droppedOffInRun, bin.binID])
                    .then(result => {
                        updateBin = true;
                        if (updateTransaction) {
                            trx.commit();
                            return true;
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        trx.rollback();
                        throw {status: 500, message: 'An unknown error occurred. Please try again.'};
                    });

                if (previousTransaction != null) {
                    trx.raw(`DELETE
                             FROM transactionlog
                             WHERE transactionID = ?`, [previousTransaction.transactionID])
                        .then(result => {
                            updateTransaction = true;
                            if (updateBin) {
                                trx.commit();
                                return true;
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            throw {status: 500, message: 'An unknown error occurred. Please try again.'};
                        });
                } else {
                    trx.raw(`INSERT INTO transactionlog (userID, binID, sidingID, locoID, stopID, type)
                             VALUES (?, ?, ?, ?, ?, ?)`,
                        [9, bin.binID, stop.sidingID, loco.locoID, stop.stopID, type === 'COLLECT' ? 'PICKED_UP' : 'DROPPED_OFF'])
                        .then(result => {
                            updateTransaction = true;
                            if (updateBin) {
                                trx.commit();
                                return true;
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            trx.rollback();
                            throw {status: 500, message: 'An unknown error occurred. Please try again.'};
                        });
                }
            });
        })
        .then(response => {
            req.db.raw(`
                SELECT CAST(COALESCE(SUM(type = 'PICKED_UP'), 0) AS UNSIGNED)   AS collectCount,
                       CAST(COALESCE(SUM(type = 'DROPPED_OFF'), 0) AS UNSIGNED) AS dropOffCount
                FROM transactionlog
                WHERE stopID = ?
            `, [stop.stopID])
                .then(processQueryResult)
                .then(rows => {
                    const row = rows[0];
                    if (row == null)
                        return res.status(404).json({ message: 'No stop found with stop id ' + stop.stopID });
                    console.info('Here', row);

                    let collectTest = row.collectCount >= stop.collectQuantity;
                    let collectDone = !collectTest;
                    let dropOffTest = row.dropOffCount >= stop.dropOffQuantity;
                    let dropOffDone = !dropOffTest;

                    if (!collectTest && !dropOffTest) {
                        return res.status(200).send();
                    }

                    if (collectTest) {
                        req.db.raw(`UPDATE run_stops SET collectComplete=1 WHERE stopID=?`, [stop.stopID])
                            .then(result => {
                                collectDone = true;
                                if (dropOffDone)
                                    return res.status(200).send();
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }

                    if (dropOffTest) {
                        req.db.raw(`UPDATE run_stops SET dropOffComplete=1 WHERE stopID=?`, [stop.stopID])
                            .then(result => {
                                dropOffDone = true;
                                if (collectDone)
                                    return res.status(200).send();
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
                });
        })
        .catch(err => {
            console.error(err);
            if (err.status != null && err.message != null)
                return res.status(err.status).json({message: err.message});
            return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
        });
});

module.exports = router;