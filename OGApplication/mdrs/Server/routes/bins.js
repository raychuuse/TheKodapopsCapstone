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

module.exports = router;