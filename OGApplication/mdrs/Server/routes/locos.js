const express = require("express");
const router = express.Router();

const {isValidId, processQueryResult} = require("../utils");

// Get all locomotives
router.get("/", (req, res) => {
  req.db.raw("SELECT * FROM locomotive")
      .then(processQueryResult)
      .then((locos) => {
        res.status(200).json(locos);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
});

// Returns the sidings the loco has visited in the last period, and how many bins have been picked up and dropped
// off at each siding during that period.
router.get("/:locoId/siding_breakdown", (req, res) => {
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

router.get('/:locoId/load', (req, res) => {
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

// Same instance of prev route, but want different model of data
router.get('/:locoId/current-load', (req, res) => {
  const id = req.params.locoId;
  if (!isValidId(id, res)) return;
  const withoutStopId = `SELECT b.*, b.locoID, l.locoName
      FROM bin b
      LEFT JOIN locomotive l ON l.locoID = b.locoID
      WHERE b.locoID = ?
      ORDER BY b.full, b.pickedUpInRun`;

  req.db.raw(withoutStopId, [id])
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
    req.db.insert({locoName: req.body.name}).into('locomotive')
        .then((result) => {
            res.status(201).send();
        })
        .catch(error => {
            console.error(error);
            res.status(500).json(error)
        });
});

router.put('/:id/name', (req, res) => {
    const id = req.params.id;
    if (!isValidId(id)) return;
    // Multiple locos existing?
    req.db.raw(`select count(locoName) AS count from locomotive WHERE locoName = '${req.body.name}'`)
    .then(processQueryResult)
    .then(data => {
      if (data[0].count > 0) {
        res.status(510).json('Duplicate appeared.');
      }
      else {
        req.db('locomotive').update({locoName: req.body.name}).where({locoID: id})
        .then(result => {
            res.status(204).send();
        })
        .catch(error => {
            res.status(500).json(error);
            console.error(error);
        })
      }
    })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    if (!isValidId(id)) return;
    
    req.db.raw(`DELETE FROM locomotive 
              WHERE locoID = '${id}'`)
        .then(result => {
            res.status(204).send();
        })
        .catch(error => {
            console.error(error);
            res.status(500).json(error);
        });
});

module.exports = router;
