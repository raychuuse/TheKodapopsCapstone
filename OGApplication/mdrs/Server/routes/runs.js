const express = require('express');
const { processQueryResult } = require('../utils');
const { isValidId } = require('../utils');
const router = express.Router();

const createRuns = (runs, stops) => {
    const groupedRunID = stops.reduce((result, item) => {
        (result[item['runID']] = result[item['runID']] || []).push(item);
        return result;
    }, {});
    for (const run of runs) {
        run.stops = groupedRunID[run.runID];
        console.info(runs);
    }
    return runs;
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
                               CAST(COALESCE(t.picked_up_count, 0) AS UNSIGNED)   as 'collect_count',
                               CAST(COALESCE(t.dropped_off_count, 0) AS UNSIGNED) as 'drop_off_count'
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

router.get('/date/:date', (req, res) => {
    const date = req.params.date;
    const parsed = Date.parse(date);
    if (isNaN(parsed)) {
        console.error('Invalid date');
        return res.status(400).json({ message: 'Please provide a valid date' });
    }

    req.db.raw(`SELECT *
                FROM runs
                WHERE date = ?`, [date])
        .then(processQueryResult)
        .then(runsResult => {
            console.info(runsResult);
            const runIDs = runsResult.map(run => run.runID);
            console.info(runIDs);
            req.db.raw(`SELECT rs.*, s.sidingName
                        FROM run_stops rs
                                 LEFT JOIN siding s ON rs.sidingID = s.sidingID in (` + runIDs.map((_) => '?').join(',') + `)`, runIDs)
                .then(processQueryResult)
                .then(stopsResult => {
                    console.info(stopsResult);
                    const t = createRuns(runsResult, stopsResult);
                    return res.status(200).json(t);
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

router.post('/:locoID/drop-off/:stopID/:binID', (req, res) => {
    if (isNaN(req.params.binID))
        return res.status(400).json({ message: 'Please provide a valid bin ID' });
    if (isNaN(req.params.stopID))
        return res.status(400).json({ message: 'Please provide a valid stop ID' });
    if (isNaN(req.params.locoID))
        return res.status(400).json({ message: 'Please provide a valid loco ID' });

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
                return res.status(404).json({ message: 'No stop found with stop ID ' + req.params.stopID });
            return req.db.raw(`SELECT *
                               FROM bin
                               WHERE binID = ?`, [req.params.binID]);
        })
        .then(processQueryResult)
        .then(binTemp => {
            bin = binTemp[0];
            if (bin == null)
                return res.status(404).json({ message: 'No bin found with bin ID ' + req.params.binID });
            return req.db.raw(`SELECT *
                               FROM locomotive
                               WHERE locoID = ?`, [req.params.locoID]);
        })
        .then(processQueryResult)
        .then(locoTemp => {
            loco = locoTemp[0];
            if (loco == null)
                return res.status(404).json({ message: 'No loco found with loco ID ' + req.params.locoID });
            return req.db.raw(`SELECT *
                               FROM transactionlog
                               WHERE userID = ?
                                 AND binID = ?
                                 AND stopID = ?
                                 AND locoID = ?
                                 AND type = 'PICKED_UP'`, [9, bin.binID, stop.stopID, loco.locoID]);
        })
        .then(processQueryResult)
        .then(previousTransactionArr => {
            const previousTransaction = previousTransactionArr[0];
            console.info('Fuck', previousTransaction);
            let updateBin = false;
            let updateTransaction = false;
            req.db.transaction(trx => {
                trx.raw(`UPDATE bin
                         SET sidingID=?,
                             locoID=null
                         WHERE binID = ?`, [stop.sidingID, bin.binID])
                    .then(result => {
                        updateBin = true;
                        if (updateTransaction) {
                            trx.commit();
                            return res.status(200).send();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        trx.rollback();
                        return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
                    });

                if (previousTransaction != null) {
                    trx.raw(`DELETE
                             FROM transactionlog
                             WHERE transactionID = ?`, [previousTransaction.transactionID])
                        .then(result => {
                            updateTransaction = true;
                            if (updateBin) {
                                trx.commit();
                                return res.status(200).send();
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
                        });
                } else {
                    trx.raw(`INSERT INTO transactionlog (userID, binID, sidingID, locoID, stopID, type)
                             VALUES (?, ?, ?, ?, ?,
                                     ?)`, [9, bin.binID, stop.sidingID, loco.locoID, stop.stopID, 'DROPPED_OFF'])
                        .then(result => {
                            updateTransaction = true;
                            if (updateBin) {
                                trx.commit();
                                return res.status(200).send();
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            trx.rollback();
                            return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
                        });
                }
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: 'sadfAn unknown error occurred. Please try again.' });
        });
});

router.post('/:locoID/pick-up/:stopID/:binID', (req, res) => {
    if (isNaN(req.params.binID))
        return res.status(400).json({ message: 'Please provide a valid bin ID' });
    if (isNaN(req.params.stopID))
        return res.status(400).json({ message: 'Please provide a valid stop ID' });
    if (isNaN(req.params.locoID))
        return res.status(400).json({ message: 'Please provide a valid loco ID' });

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
                return res.status(404).json({ message: 'No stop found with stop ID ' + req.params.stopID });
            return req.db.raw(`SELECT *
                               FROM bin
                               WHERE binID = ?`, [req.params.binID]);
        })
        .then(processQueryResult)
        .then(binTemp => {
            bin = binTemp[0];
            if (bin == null)
                return res.status(404).json({ message: 'No bin found with bin ID ' + req.params.binID });
            return req.db.raw(`SELECT *
                               FROM locomotive
                               WHERE locoID = ?`, [req.params.locoID]);
        })
        .then(processQueryResult)
        .then(locoTemp => {
            loco = locoTemp[0];
            if (loco == null)
                return res.status(404).json({ message: 'No loco found with loco ID ' + req.params.locoID });
            return req.db.raw(`SELECT *
                               FROM transactionlog
                               WHERE userID = ?
                                 AND binID = ?
                                 AND stopID = ?
                                 AND locoID = ?
                                 AND type = 'DROPPED_OFF'`, [9, bin.binID, stop.stopID, loco.locoID]);
        })
        .then(processQueryResult)
        .then(previousTransactionArr => {
            const previousTransaction = previousTransactionArr[0];
            let updateBin = false;
            let updateTransaction = false;
            req.db.transaction(trx => {
                trx.raw(`UPDATE bin
                         SET sidingID=null,
                             locoID=?
                         WHERE binID = ?`, [loco.locoID, bin.binID])
                    .then(result => {
                        updateBin = true;
                        if (updateTransaction) {
                            trx.commit();
                            return res.status(200).send();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        trx.rollback();
                        return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
                    });

                if (previousTransaction != null) {
                    trx.raw(`DELETE
                             FROM transactionlog
                             WHERE transactionID = ?`, [previousTransaction.transactionID])
                        .then(result => {
                            updateTransaction = true;
                            if (updateBin) {
                                trx.commit();
                                return res.status(200).send();
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
                        });
                } else {
                    trx.raw(`INSERT INTO transactionlog (userID, binID, sidingID, locoID, stopID, type)
                             VALUES (?, ?, ?, ?, ?, ?)`,
                        [9, bin.binID, stop.sidingID, loco.locoID, stop.stopID, 'PICKED_UP'])
                        .then(result => {
                            updateTransaction = true;
                            if (updateBin) {
                                trx.commit();
                                return res.status(200).send();
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            trx.rollback();
                            return res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
                        });
                }
            });
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: 'sadfAn unknown error occurred. Please try again.' });
        });
});

router.get('/counts/:stopID', (req, res) => {
    const stopID = req.params.stopID;
    if (!isValidId(stopID, res)) return;

    req.db.raw(`
        SELECT CAST(COALESCE(SUM(type = 'PICKED_UP'), 0) AS UNSIGNED) AS picked_up_count, CAST(COALESCE(SUM(type = 'DROPPED_OFF'), 0) AS UNSIGNED) AS dropped_off_count
        FROM transactionlog
        WHERE stopID = ?
    `, [stopID])
        .then(processQueryResult)
        .then(rows => {
            const row = rows[0];
            if (row == null)
                return res.status(404).json({message: 'No stop found with stop id ' + stopID});
            return res.status(200).json({picked_up_count: row.picked_up_count, dropped_off_count: row.dropped_off_count});
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'An unknown error occurred. Please try again.' });
        });

});

module.exports = router;