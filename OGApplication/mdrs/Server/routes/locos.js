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
  if (!isValidId(id)) return;

  req.db.raw(`
      SELECT b.binID, b.code, b.status, l.locoID, l.locoName
      FROM bin b
               LEFT JOIN locomotive l ON b.locoID = l.locoID
      WHERE b.locoID = ?
  `, [id])
      .then(processQueryResult)
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json(err);
      })
});

module.exports = router;
