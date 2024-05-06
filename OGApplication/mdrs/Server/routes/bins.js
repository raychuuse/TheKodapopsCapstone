const express = require("express");
const router = express.Router();

const {processQueryResult, isValidId} = require("../utils");

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
