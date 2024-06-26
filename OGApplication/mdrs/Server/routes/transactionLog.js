const express = require("express");
const {processQueryResult} = require("../utils");
const { verify } = require('jsonwebtoken');
const { verifyAuthorization } = require('../middleware/authorization');
const router = express.Router();

//GET all records from the transaction log
router.get("/", verifyAuthorization, function (req, res, next) {
  req.db.raw(`
      SELECT *
      FROM transactionlog t
               LEFT JOIN bin b ON t.binID = b.binID 
               LEFT JOIN siding s ON t.sidingID = s.sidingID
               LEFT JOIN harvester h ON t.harvesterID = h.harvesterID
               LEFT JOIN locomotive l ON t.locoID = l.locoID
  `)
      .then(processQueryResult)
      .then((rows) => {
        res.status(200).json(rows);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
});

module.exports = router;
