const express = require("express");
const router = express.Router();

const {processQueryResult, isValidId} = require("../utils");
const { verifyAuthorization } = require('../middleware/authorization');

router.get("/", (req, res) => {
  req.db.raw(`SELECT * FROM bin`)
      .then(processQueryResult)
      .then((bins) => {
        res.status(200).json(bins);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
});

router.post('/find-bin/:code', verifyAuthorization, (req, res) => {
    const code = req.params.code;
    if (code == null)
        return res.status(400).json({message: 'Please provide a bin code'});
    const sidingID = req.query.sidingID;
    const locoID = req.query.locoID;
    if ((sidingID == null && locoID == null) || (sidingID != null && locoID != null))
        return res.status(400).json({message: 'Please provide a sidingID or a locoID'});
    console.info(req.query, req.params);

    req.db.raw(`SELECT *
                FROM bin
                WHERE code = ?`, [code])
        .then(processQueryResult)
        .then(response => {
            return response[0];
        })
        .then(bin => {
            if (bin == null) {
                req.db.raw(`INSERT INTO bin (code, ${sidingID != null ? 'sidingID' : 'locoID'}) VALUES (?, ?)`, [code, sidingID != null ? sidingID : locoID])
                    .then(response => {
                        if (response[0] == null) throw {};
                        return req.db.raw(`SELECT * FROM bin WHERE binID = ?`, [response[0].insertId]);
                    })
                    .then(processQueryResult)
                    .then(foundBin => {
                        return res.status(201).json(foundBin.length > 0 ? foundBin[0] : null);
                    })
                    .catch(err => {
                        console.error(err);
                        throw {};
                    });
            } else {
                req.db.raw(`UPDATE bin SET sidingID = ${sidingID != null ? '?' : 'null'}, locoID = ${locoID != null ? '?' : 'null'} WHERE binID = ?`, [sidingID != null ? sidingID : locoID, bin.binID])
                    .then(response => {
                        return req.db.raw(`SELECT * FROM bin WHERE binID = ?`, [bin.binID]);
                    })
                    .then(processQueryResult)
                    .then(foundBin => {
                        return res.status(200).json(foundBin.length > 0 ? foundBin[0] : null);
                    })
                    .catch(err => {
                        console.error(err);
                        throw {};
                    })
            }
        })
        .catch(err => {
            console.error(err);
            if (err.status != null && err.message != null)
                return res.status(err.status).json({message: err.message});
            return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        });
});

router.put('/bin-field-state/:binID', verifyAuthorization, (req, res) => {
    console.info('hello', req.params, req.query);
    if (!isValidId(req.params.binID, res)) return;
    const field = req.query.field;
    if (field !== 'BURNT' && field !== 'REPAIR' && field !== 'MISSING')
        return res.status(400).json({message: 'Please provide a valid field'});
    const state = parseInt(req.query.state);
    if (state !== 1 && state !== 0)
        return res.status(400).json({ message: 'Please provide a 1 or 0 for state' });

    req.db.raw(`SELECT *
                FROM bin
                WHERE binID = ?`, [req.params.binID])
        .then(processQueryResult)
        .then(response => {
            const bin = response[0];
            if (bin == null)
                throw { status: 404, message: 'No bin found with id: ' + req.params.binID };
            return bin;
        })
        .then(bin => {
            let binUpdate = false;
            let transactionUpdate = false;
            req.db.transaction(trx => {
                trx.raw(`UPDATE bin SET ` + field.toLowerCase() + ` = ? WHERE binID = ?`, [state, bin.binID])
                    .then(response => {
                        binUpdate = true;
                        if (transactionUpdate) {
                            trx.commit();
                            return res.status(200).send();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        trx.rollback();
                        throw { status: 500, message: 'An unknown error occurred. Please try again.' };
                    });

                trx.raw(`INSERT INTO transactionlog (userID, binID, type)
                         VALUES (?, ?, ?)`, [req.userID, bin.binID, field])
                    .then(response => {
                        transactionUpdate = true;
                        if (binUpdate) {
                            trx.commit();
                            return res.status(200).send();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        trx.rollback();
                        throw { status: 500, message: 'An unknown error occurred. Please try again.' };
                    });
            });
        })
        .catch(err => {
            if (err.status != null && err.message != null)
                return res.status(err.status).json({message: err.message});
            console.error(err);
        });
});

router.post('/consign', verifyAuthorization, (req, res) => {
    if (!isValidId(req.body.binID, res)) return;

    let bin;
    let user;
    let previousTransaction;
    req.db.raw(`SELECT * FROM users WHERE userID = ?`, [req.userID])
        .then(processQueryResult)
        .then(response => {
            user = response[0];
            console.info(user);
            if (user == null)
                throw {status: 404, message: 'No user found with the id: ' + req.userID};
            if (user.harvesterID == null || user.userRole !== 'Harvester')
                throw {status: 403, message: 'Only harvester users can consign bins'};
            return req.db.raw(`SELECT * FROM bin WHERE binID = ?`, [req.body.binID]);
        })
        .then(processQueryResult)
        .then(response => {
            bin = response[0];
            if (bin == null)
                throw {status: 404, message: 'No bin found with the id: ' + req.body.binID};
            if (!req.body.full)
                return req.db.raw(`SELECT * FROM transactionlog WHERE binID = ? AND harvesterID = ? AND type = ? AND transactionTime >= DATE_SUB(NOW(), INTERVAL 2 HOUR)`, [bin.binID, user.harvesterID, 'FILLED'])
            else return [null];
        })
        .then(processQueryResult)
        .then(previousTransactionResponse => {
            previousTransaction = previousTransactionResponse != null ? previousTransactionResponse[0] : null;
            let binUpdate = false;
            let transactionUpdate = false;
            req.db.transaction(trx => {
                trx.raw(`UPDATE bin
                         SET full = ?
                         WHERE binID = ?`, [req.body.full, req.body.binID])
                    .then(response => {
                        binUpdate = true;
                        if (transactionUpdate) {
                            trx.commit();
                            return res.status(200).send();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        trx.rollback();
                    });

                if (previousTransaction != null) {
                    trx.raw(`DELETE
                                FROM transactionlog
                                WHERE transactionID = ?`, previousTransaction.transactionID)
                        .then(response => {
                            transactionUpdate = true;
                            if (binUpdate) {
                                trx.commit();
                                return res.status(200).send();
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            trx.rollback();
                        });
                } else {
                    trx.raw(`INSERT INTO transactionlog (userID, binID, harvesterID, sidingID, type)
                                VALUES (?, ?, ?, ?, ?)`, [user.userID, bin.binID, user.harvesterID, bin.sidingID, req.body.full ? 'FILLED' : 'EMPTIED'])
                        .then(response => {
                            transactionUpdate = true;
                            if (binUpdate) {
                                trx.commit();
                                return res.status(200).send();
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            trx.rollback();
                        });
                }
            });
        })
        .catch(err => {
            console.error(err);
            if (err.status != null && err.message != null)
                return res.status(err.status).json({message: err.message});
            return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        })
});

router.get("/dash", (req, res) => {
  req.db.raw(`SELECT b.binID, b.status, b.locoID, l.locoName, h.harvesterName, s.sidingName 
      FROM bin b 
          LEFT JOIN siding s ON b.sidingID = s.sidingID
          LEFT JOIN siding s ON b.sidingID = s.sidingID
          LEFT JOIN siding s ON b.sidingID = s.sidingID
      `)
      .then(processQueryResult)
      .then((bins) => {
        res.status(200).json(bins);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
});

//Bin information by sidings and the most recent 
router.get("/:binID/siding_breakdown", (req, res) => {
  const id = req.params.binID;
  if (id == null || isNaN(id)) return;

  req.db.raw(`SELECT s.sidingName,t.type, t.transactionTime
  FROM transactionlog t
           LEFT JOIN siding s ON t.sidingID = s.sidingID
  WHERE t.binID = ?
  ORDER BY t.transactionTime DESC`, [id])
      .then(processQueryResult)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      })
});

router.get("/maintenance_breakdown", (req, res) => {

  req.db.raw(`SELECT * FROM bin
  WHERE flag IS NOT NULL`)
      .then(processQueryResult)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      })
});


router.post('/', (req, res) => {
  const id  = req.body.binID;
  req.db.raw(`INSERT INTO bin (binID, status, sidingID) 
  VALUES (${id}, FALSE, 1)`)
      .then((res) => {
        res.status(201).json({Message: "Success"});
      })
      .catch(error => {
        console.error(error);
        res.json({Error: true, Message: error.message})
      });
});

router.put('/:binID', (req, res) => {
  req.db('bin').update({binData: req.body.data}).where({binID: req.params.id})
      .then(response => {
        res.json({Error: false, Message: 'Success'});
      })
      .catch(error => {

        // Note this will not trigger other catch
        console.error(error);
        res.json({Error: true, Message: error.message});
      })
});

router.delete('/:binID', (req, res) => {
  const id = req.params.binID;
  if (!isValidId(id)) return;
  req.db('bin').where({binID: id}).del()
      .then(response => {
        res.json({Error: false, Message: 'Success'});
      })
      .catch(error => {
        res.json({Error: true, Message: error.message})
      });
});

router.post('/missing/:id'), (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) return;
  req.db('bin').update({binData: req.body.data}).where({binID: req.params.id})
      .then(response => {
        res.json({Error: false, Message: 'Success'});
      })
      .catch(error => {

        // Note this will not trigger other catch
        console.error(error);
        res.json({Error: true, Message: error.message});
      })
}

module.exports = router;
