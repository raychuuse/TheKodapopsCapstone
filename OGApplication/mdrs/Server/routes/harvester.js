const express = require("express");
const router = express.Router();

const {isValidId, processQueryResult} = require("../utils");

// GET
router.get("/", (req, res) => {
  req.db.raw(`SELECT *
              FROM harvester`)
      .then(processQueryResult)
      .then((harvesters) => {
        res.status(200).json(harvesters);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
});

//Harvester data grouped by sidings
router.get("/:harvesterId/siding_breakdown", (req, res) => {
  const id = req.params.harvesterId;
  if (!isValidId(id)) return;

  req.db.raw(`
      SELECT h.harvesterID, h.harvesterName, s.sidingID, s.sidingName, COUNT(*) as binsFilled
      FROM transactionlog t
               LEFT JOIN harvester h ON h.harvesterID = t.harvesterID
               LEFT JOIN siding s ON s.sidingID = t.sidingID
      WHERE h.harvesterID = ?
        AND t.type = 'FILLED'
      GROUP BY s.sidingID
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

router.post('/', (req, res) => {
    req.db.insert({harvesterName: req.body.name}).into('harvester')
        .then((response) => {
            res.status(201).send(response);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        });
});

router.put('/:id/:name', (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    if (!isValidId(id)) return;
    
    req.db.raw(`select count(harvesterName) AS count from harvester WHERE harvesterName = ?`, [name])
    .then(processQueryResult)
    .then(data => {
      if (data[0].count > 0)
        return res.status(409).json({message: 'A harvester with that name already exists.'});
      else {
        req.db('harvester').update({harvesterName: name}).where({harvesterID: id})
        .then(response => {
            res.status(200).send();
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        })
      }
    })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    if (!isValidId(id)) return;

    req.db.raw(`DELETE FROM harvester 
                WHERE harvesterID = '${id}'`)
    .then(result => {
      res.status(204).send();
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({message: 'An unknown error occurred. Please try again.'});
    });
});


module.exports = router;
