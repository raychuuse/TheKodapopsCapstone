var express = require("express");
var router = express.Router();

////GET all records from the bin table 
router.get("/", (req, res) => {
  //all bins from db
  const allBins = req.db
    .from("bins")
    .leftOuterJoin("siding", "bins.sidingID", "siding.sidingID")
    .leftOuterJoin("harvester", "bins.harvesterID", "=", "harvester.harvesterID")
    .leftOuterJoin("locomotive", "bins.locoID", "=", "locomotive.locoID")
    .select("*");
  allBins
    .then((bins) => {
      if(bins.length === 0){
        throw Error("Database Error: No Data")
      }
      res.json({ Error: false, Message: "Success", data: bins });
    })
    //Error Handling
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
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
