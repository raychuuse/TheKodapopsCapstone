var express = require("express");
var router = express.Router();

//GET all records from the transaction log
router.get("/", function (req, res, next) {
  req.db
    .from("transactionlog")
    .leftOuterJoin("siding", "transactionlog.sidingID", "siding.sidingID")
    .leftOuterJoin("harvester", "transactionlog.harvesterID", "=", "harvester.harvesterID")
    .leftOuterJoin("locomotive", "transactionlog.locoID", "=", "locomotive.locoID")
    .select("*")
    .then((rows) => {
      res.json({ Error: false, Message: "Success", data: rows });
    })

    //Error Handling
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});


module.exports = router;
