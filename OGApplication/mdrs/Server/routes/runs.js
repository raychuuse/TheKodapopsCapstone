const express = require('express');
const {processQueryResult} = require('../utils');
const {isValidId} = require('../utils');
const {verifyAuthorization} = require("../middleware/authorization");
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
            collectComplete: !!row.collectComplete,
            dropOffComplete: !!row.dropOffComplete,
            collectCount: row.collectCount,
            dropOffCount: row.dropOffCount,
        };
        run.stops.push(stop);
    }
    return run;
};

router.get('/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        console.error('Invalid id');
        return res.status(400).json({message: 'Please provide a valid id'});
    }

    req.db.raw(`SELECT *
                FROM runs
                WHERE runID = ?`, [req.params.id])
        .then(processQueryResult)
        .then(runsResult => {
            if (runsResult.length !== 1)
                return res.status(404).json({message: 'No run found with id ' + req.params.id});

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
                    return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
                });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        });
});

router.get('/:locoID/:date', (req, res) => {
    const locoID = req.params.locoID;
    if (isNaN(locoID)) {
        console.error('Invalid locoID');
        return res.status(400).json({message: 'Please provide a valid locoID'});
    }
    const date = req.params.date;
    const parsed = Date.parse(date);
    if (isNaN(parsed)) {
        console.error('Invalid date');
        return res.status(400).json({message: 'Please provide a valid date'});
    }

    req.db.raw(`SELECT r.*,
                       rs.*,
                       s.*,
                       CAST(COALESCE(t.picked_up_count, 0) AS UNSIGNED)   as 'collectCount',
                       CAST(COALESCE(t.dropped_off_count, 0) AS UNSIGNED) as 'dropOffCount'
                FROM runs r
                         LEFT JOIN run_stops rs ON r.runID = rs.runID
                         LEFT JOIN siding s ON rs.sidingID = s.sidingID
                         LEFT JOIN (SELECT stopID,
                                           SUM(type = 'PICKED_UP')   AS picked_up_count,
                                           SUM(type = 'DROPPED_OFF') AS dropped_off_count
                                    FROM transactionlog
                                    GROUP BY stopID) AS t ON rs.stopID = t.stopID
                WHERE locoID = ?
                  AND date = ?`, [locoID, date])
        .then(processQueryResult)
        .then(runsResult => {
            const t = createRuns(runsResult);
            if (t == null)
                return res.status(404).json({message: 'No runs found with locoID and date'});
            return res.status(200).json(t);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        });
});

router.post('/:locoID/stop-action/:stopID/:binID', (req, res) => {
    if (isNaN(req.params.binID))
        return res.status(400).json({message: 'Please provide a valid bin ID'});
    if (isNaN(req.params.stopID))
        return res.status(400).json({message: 'Please provide a valid stop ID'});
    if (isNaN(req.params.locoID))
        return res.status(400).json({message: 'Please provide a valid loco ID'});
    if (req.query.type == null || (req.query.type !== 'COLLECT' && req.query.type !== 'DROP_OFF'))
        return res.status(400).json({message: 'Please provide an action type'});

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
            let collectCount, dropOffCount;
            req.db.transaction(trx => {
                // Determine the state of the bin
                if (type === 'COLLECT') {
                    if (bin.droppedOffInRun) bin.droppedOffInRun = false;
                    else bin.pickedUpInRun = true;
                } else {
                    if (bin.pickedUpInRun) bin.pickedUpInRun = false;
                    else bin.droppedOffInRun = true;
                }

                const updateBinQuery = () => {
                    const sidingIDQuery = type === 'COLLECT' ? 'null' : '?';
                    const locoIDQuery = type === 'COLLECT' ? '?' : 'null';

                    return trx.raw(`UPDATE bin
                                    SET sidingID=${sidingIDQuery},
                                        locoID=${locoIDQuery},
                                        pickedUpInRun=?,
                                        droppedOffInRun=?
                                    WHERE binID = ?`,
                        [type === 'COLLECT' ? loco.locoID : stop.sidingID, bin.pickedUpInRun, bin.droppedOffInRun, bin.binID]);
                };

                const deleteOrInsertTransaction = () => {
                    if (previousTransaction != null) {
                        return trx.raw(`DELETE
                                        FROM transactionlog
                                        WHERE transactionID = ?`, [previousTransaction.transactionID]);
                    } else {
                        return trx.raw(`INSERT INTO transactionlog (userID, binID, sidingID, locoID, stopID, type)
                                        VALUES (?, ?, ?, ?, ?, ?)`,
                            [9, bin.binID, stop.sidingID, loco.locoID, stop.stopID, type === 'COLLECT' ? 'PICKED_UP' : 'DROPPED_OFF']);
                    }
                };

                const getStopCounts = () => {
                    return trx.raw(`
                        SELECT CAST(COALESCE(SUM(type = 'PICKED_UP'), 0) AS UNSIGNED)   AS collectCount,
                               CAST(COALESCE(SUM(type = 'DROPPED_OFF'), 0) AS UNSIGNED) AS dropOffCount
                        FROM transactionlog
                        WHERE stopID = ?
                    `, [stop.stopID])
                        .then(processQueryResult)
                        .then(rows => {
                            console.info('hello', rows);
                            if (rows.length === 0)
                                return Promise.resolve();
                            console.info('the good one')
                            collectCount = rows[0].collectCount;
                            dropOffCount = rows[0].dropOffCount;
                            console.info(collectCount, dropOffCount);
                            return Promise.resolve();
                        });
                };

                const updateStopCompleteState = () => {
                    const collectTest = collectCount >= stop.collectQuantity;
                    const dropOffTest = dropOffCount >= stop.dropOffQuantity;
                    console.info('here', collectTest, dropOffTest);

                    if (collectTest || dropOffTest) {
                        return req.db.raw(`UPDATE run_stops
                                           SET collectComplete = ?,
                                               dropOffComplete = ?
                                           WHERE stopID = ?`,
                            [collectTest ? 1 : 0, dropOffTest ? 1 : 0, stop.stopID]);
                    } else {
                        return Promise.resolve();
                    }
                };

                return updateBinQuery()
                    .then(() => deleteOrInsertTransaction())
                    .then(() => getStopCounts())
                    .then(() => trx.commit())
                    .then(() => updateStopCompleteState())
                    .then(() => {
                        // Commit the transaction
                        return res.status(204).send();
                    })
                    .catch(err => {
                        console.error('Error:', err);
                        return trx.rollback().then(() => {
                            if (err.status != null) {
                                return res.status(err.status).json({message: err.message});
                            }
                            return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
                        });
                    });
            })
        })
        .catch(err => {
            console.error(err);
            if (err.status != null && err.message != null)
                return res.status(err.status).json({message: err.message});
            return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        })
});

router.post('/:stopID/complete-stop/:type/:complete', verifyAuthorization, (req, res) => {
    const stopID = req.params.stopID;
    if (!isValidId(stopID, res)) return;
    const type = req.params.type;
    if (type !== 'COLLECT' && type !== 'DROP_OFF')
        return res.status(400).json({message: 'Type must be either COLLECT or DROP_OFF'});
    const complete = req.params.complete;
    if (complete !== '0' && complete !== '1')
        return res.status(400).json({message: 'Complete must be either 1 or 0'});

    const update = (type === 'COLLECT' ? 'collectComplete = ' + complete : 'dropOffComplete = ' + complete);
    req.db.raw(`SELECT * FROM run_stops WHERE stopID = ?`, [stopID])
        .then(processQueryResult)
        .then(response => {
            if (response.length === 0)
                throw {status: 404, message: 'No stop found with id: ' + stopID};
            return req.db.raw(`UPDATE run_stops SET ` + update + ` WHERE stopID = ?`, [stopID]);
        })
        .then(response => {
            return res.status(204).send();
        })
        .catch(err => {
            console.error(err);
            if (err.status != null && err.message != null)
                return res.status(err.status).json({message: err.message});
            return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        })
});

module.exports = router;