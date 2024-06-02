const express = require("express");
const router = express.Router();

const {isValidId, processQueryResult} = require("../utils");
const { verifyAuthorization } = require('../middleware/authorization');

// Get all locomotives
router.get("/", verifyAuthorization, (req, res) => {
  req.db.raw("SELECT * FROM locomotive ORDER BY locoName")
      .then(processQueryResult)
      .then((locos) => {
        res.status(200).json(locos);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
});

router.get(`/locos-with-run`, verifyAuthorization, (req, res) => {
    req.db.raw(`SELECT l.* 
                FROM locomotive l
                INNER JOIN runs r ON l.locoID = r.locoID AND r.date = CURDATE()`)
        .then(processQueryResult)
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        });
});

// Returns the sidings the loco has visited in the last period, and how many bins have been picked up and dropped
// off at each siding during that period.
router.get("/:locoId/siding_breakdown", verifyAuthorization, (req, res) => {
  const id = req.params.locoId;
  if (!isValidId(id)) return;

  req.db.raw(`SELECT l.locoID, l.locoName, s.sidingID, s.sidingName, t.type, COUNT(t.type) as count
              FROM transactionlog t
                       LEFT JOIN siding s ON s.sidingID = t.sidingID
                       LEFT JOIN locomotive l on l.locoID = t.locoID
              WHERE l.locoID = ?
                AND (t.type = 'PICKED_UP' OR t.type = 'DROPPED_OFF')
              GROUP BY l.locoID, s.sidingID, t.type
  `, [id])
      .then(processQueryResult)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      });
});

router.get('/:locoId/load', verifyAuthorization, (req, res) => {
  const id = req.params.locoId;
  if (!isValidId(id, res)) return;

  const withoutStopId = `SELECT b.*, l.locoID, l.locoName
      FROM locomotive l
      LEFT JOIN bin b ON b.locoID = l.locoID
      WHERE l.locoID = ?
      ORDER BY b.full, b.pickedUpInRun`;

  req.db.raw(withoutStopId, [id])
      .then(processQueryResult)
      .then(data => {
        if (data.length === 0)
          return res.status(404).json({message: 'No loco found with the id: ' + id});
        const loco = {
            locoID: data[0].locoID,
            locoName: data[0].locoName,
            bins: []
        };
        for (const bin of data) {
            // No bin on this loco
            if (bin.binID == null)
                continue;
            loco.bins.push({
                binID: bin.binID,
                code: bin.code,
                status: bin.status,
                full: !!bin.full,
                burnt: !!bin.burnt,
                pickedUpInRun: !!bin.pickedUpInRun,
                droppedOffInRun: !!bin.droppedOffInRun
            });
        }
        res.status(200).json(loco);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      })
});

router.post('/', verifyAuthorization, (req, res) => {
    req.db.insert({locoName: req.body.name}).into('locomotive')
        .then((result) => {
            res.status(201).send();
        })
        .catch(error => {
            console.error(error);
            if (error?.code === 'ER_DUP_ENTRY' && error?.sqlMessage.includes('locomotive_locoName_uindex'))
              return res.status(409).json({message: 'A loco with that name already exists.'});
            res.status(500).json(error)
        });
});

router.put('/:id/:name', verifyAuthorization, (req, res) => {
    const id = req.params.id;
    if (!isValidId(id)) return;
    const name = req.params.name;
      // Multiple locos existing?
    req.db.raw(`select count(locoName) AS count from locomotive WHERE locoName = ?`, [name])
    .then(processQueryResult)
    .then(data => {
      if (data[0].count > 0)
        return res.status(409).json('A loco with that name already exists.');
      req.db('locomotive').update({locoName: name}).where({locoID: id})
      .then(result => {
          res.status(204).send();
      })
      .catch(error => {
          console.error(error);
          res.status(500).json(error);
      })
    })
});

router.delete('/:id', verifyAuthorization, (req, res) => {
    const id = req.params.id;
    if (!isValidId(id, res)) return;

    req.db.raw(`DELETE FROM locomotive 
              WHERE locoID = ?`, [id])
        .then(result => {
            res.status(204).send();
        })
        .catch(error => {
            console.error('errrrrrrr', error);
            res.status(500).json(error);
        });
});

module.exports = router;
