const express = require("express");
const router = express.Router();

// GET
router.get("/", (req, res) => {
  req.db
      .from("bin")
      .leftOuterJoin("siding", "bins.sidingID", "siding.sidingID")
      .leftOuterJoin("harvester", "bins.harvesterID", "=", "harvester.harvesterID")
      .leftOuterJoin("locomotive", "bins.locoID", "=", "locomotive.locoID")
      .select("*")
      .then((bins) => {
        res.status(200).json(bins);
      })
      .catch((err) => {
        console.error(err);
        // TODO Error codes
        res.status(500).json({message: err.message});
      });
});

router.post('/', (req, res) => {
  console.info(req.body);
  req.db.insert({binsID: req.body.id}).into('bins')
      .then((result) => {
        res.json({Error: false, Message: 'Success', data: result})
      })
      .catch(error => {
        console.error(error);
        res.json({Error: true, Message: error.message})
      });
});

router.put('/:id', (req, res) => {
  req.db('bins').update({binData: req.body.data}).where({binsID: req.params.id})
      .then(result => {
        res.json({Error: false, Message: 'Success'});
      })
      .catch(error => {

        // Note this will not trigger other catch
        console.error(error);
        res.json({Error: true, Message: error.message});
      })
});

router.delete('/:id', (req, res) => {
  req.db('bins').where({binsID: req.params.id}).del()
      .then(result => {
        res.json({Error: false, Message: 'Success'});
      })
      .catch(error => {
        res.json({Error: true, Message: error.message})
      });
});


module.exports = router;
