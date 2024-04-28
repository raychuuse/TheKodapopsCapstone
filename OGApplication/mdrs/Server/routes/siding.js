const express = require("express");
const router = express.Router();

const {processQueryResult, isValidId} = require("../utils");

//path for getting all current Sidings in db
router.get("/", (req, res) => {
  req.db.raw(`SELECT *
              FROM siding`)
      .then(processQueryResult)
      .then((sidings) => {
        res.status(200).json(sidings);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
});

// Returns the status of a siding, including how many, and which, bins are full and empty, as well as when the bin
// was filled or dropped off, telling the user how long the bin has been sitting at the siding in its current state,
// potentially pointing out data entry errors.
router.get("/:sidingId/breakdown", (req, res) => {
  const id = req.params.sidingId;
  if (!isValidId(id, res)) return;
  const stopID = req.query.stopID;
  console.info(stopID);
  if (stopID != null && !isValidId(stopID, res))
      return;

  const withStopQuery = `SELECT b.binID, b.status, b.sidingID, b.full, b.burnt, s.sidingName, t.transactionTime, t.type, stopState.picked_up_in_stop, stopState.dropped_off_in_stop
      FROM bin b
               LEFT JOIN siding s ON b.sidingID = s.sidingID
               LEFT JOIN (SELECT tl.*, ROW_NUMBER() OVER (PARTITION BY binID ORDER BY transactionTime DESC) AS rn
                          FROM transactionlog tl) t ON t.binID = b.binID AND t.rn = 1
               LEFT JOIN (SELECT binID,
                                 IF(SUM(type = 'PICKED_UP') > 0, true, false) as 'picked_up_in_stop', 
                                 IF(SUM(type = 'DROPPED_OFF') > 0, true, false) as 'dropped_off_in_stop'
                          FROM transactionlog
                          WHERE stopID = ?
                            AND transactionTime > DATE_SUB(NOW(), INTERVAL 1 DAY)
                          GROUP BY binID) as stopState ON stopState.binID = b.binID
      WHERE b.sidingID = ?`;

  const withoutStopQuery = `SELECT b.binID, b.status, b.sidingID, b.full, b.burnt, s.sidingName, t.transactionTime, t.type
      FROM bin b
               LEFT JOIN siding s ON b.sidingID = s.sidingID
               LEFT JOIN (SELECT tl.*, ROW_NUMBER() OVER (PARTITION BY binID ORDER BY transactionTime DESC) AS rn
                          FROM transactionlog tl) t ON t.binID = b.binID AND t.rn = 1
      WHERE b.sidingID = ?
  `;

  req.db.raw(stopID != null ? withStopQuery : withoutStopQuery, stopID != null ? [stopID, id] : [id])
      .then(processQueryResult)
      .then(data => {
        for (const datum of data) {
            datum.full = !!datum.full;
            datum.burnt = !!datum.burnt;
            if (stopID != null) {
              datum.dropped_off_in_stop = !!datum.dropped_off_in_stop;
              datum.picked_up_in_stop = !!datum.picked_up_in_stop;
            }
        }
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      });
});

router.get('/:sidingId/loco_breakdown', (req, res) => {
  const sidingId = req.params.sidingId;
  if (!isValidId(sidingId)) return;

  req.db.raw(`
      SELECT s.sidingID, s.sidingName, l.locoID, l.locoName, COUNT(*) as pickedUpBins
      FROM transactionlog t
               LEFT JOIN locomotive l ON l.locoID = t.locoID
               LEFT JOIN siding s on t.sidingID = s.sidingID
      WHERE t.type = 'PICKED_UP'
        AND s.sidingID = ?
      GROUP BY s.sidingID, l.locoID
  `, [sidingId])
      .then(processQueryResult)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      });
})

// Return the harvesters that have filled a bin in this siding in the last month, and how many bins they filled.
router.get("/:sidingId/harvester_breakdown", (req, res) => {
  const id = req.params.sidingId;
  if (!isValidId(id)) return;

  req.db.raw(`SELECT s.sidingID, s.sidingName, h.harvesterID, h.harvesterName, COUNT(t.binID) as filledBins
              FROM transactionlog t
                       LEFT JOIN harvester h ON t.harvesterID = h.harvesterID
                       LEFT JOIN siding s on t.sidingID = s.sidingID
              WHERE t.type = 'FILLED'
                AND s.sidingID = ?
              GROUP BY h.harvesterID, s.sidingID;`, [id])
      .then(processQueryResult)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      });
});

router.post('/', (req, res) => {
  req.db.insert({sidingName: req.body.name}).into('siding')
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
  req.db('siding').update({sidingName: req.body.name}).where({sidingID: id})
      .then(result => {
        res.status(204).send();
      })
      .catch(error => {
        console.error(error);
        res.status(500).json(error);
      })
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) return;

  req.db('siding').where({sidingID: id}).del()
      .then(result => {
        res.status(204).send();
      })
      .catch(error => {
        console.error(error);
        res.status(500).json(error);
      });
});

module.exports = router;
