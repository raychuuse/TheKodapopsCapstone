var express = require("express");
var router = express.Router();

//helper functions
const filter = require("../filter");

//Middleware
const { validateID } = require("../middleware/validateID")

//path for getting all current Sidings in db
router.get("/", (req, res) => {
  //all sidings from db
  const allSidings = req.db.from("siding").select("*");

  allSidings
    .then((sidings) => {
      res.json({ Error: false, Message: "Success", Sidings: sidings });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});


//path for getting all bin data for relevant siding i.e full bins at siding, empty bins at siding and allocated bins on route
router.get("/siding", validateID, (req, res) => {
  const id = req.query.id;

  const sidingData = req.db
    .from("bins")
    .leftOuterJoin("siding", "bins.sidingID", "siding.sidingID")
    .leftOuterJoin("harvester", "bins.harvesterID", "=", "harvester.harvesterID")
    .leftOuterJoin("locomotive", "bins.locoID", "=", "locomotive.locoID")
    .select("*")
    .where("bins.sidingID", "=", id);

  const sidingName = req.db.from("siding").select("sidingName").where("sidingID", "=", id);

  const Status = {
    1: 'Empty At Mill',
    2: 'Empty',
    3: 'Empty',
    4: 'Full',
    5: 'Full - On Route to Mill',
    6: 'Delivered to Mill'
  }

  sidingData
    .then((rows) => {
      const bins = rows.map((bin) => ({
        binsID: bin.binsID,
        statusID: bin.statusID,
        status: (Status[parseInt(bin.statusID)]),
        sidingID: bin.sidingID,
        locoID: bin.locoID,
        harvesterID: bin.harvesterID,
        sidingName: bin.sidingName,
        harvesterName: bin.harvesterName,
        locoName: bin.locoName
      }))

      // changed the format of the data filtering
      const data = {
        bins: bins,
        mill: filter.filterById(rows, 6),
        full: filter.filterById(rows, 4),
        empty: filter.filterById(rows, 3),
        route: filter.filterById(rows, 5),
        harvesters: filter.groupBins(rows, "harvesterID"),
      };

      return data;
    })
    .then((data) => {
      //getting the name to send back to front end
      sidingName
        .then((name) => {
          //Validates if siding exists in the database
          if (name.length === 0) {
            throw Error("Siding Not Found")
          }
          res.json({ Error: false, Message: "Success", name: name, data: data });
        })
        .catch((err) => {
          console.log(err);
          res.json({ Error: true, Message: err.message });
        });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

//Siding data grouped by harvesters 
router.get("/harvester_breakdown", validateID, (req, res) => {
  const id = req.query.id;

  const idExists = req.db.from("siding").count({ valid: 'sidingID' }).where("sidingID", "=", id);

  const breakdownData = req.db
    .from("bins")
    .join("harvester", "bins.harvesterID", "=", "harvester.harvesterID")
    .select(
      "bins.harvesterID",
      "harvester.harvesterName",
      "bins.locoID",
      "bins.statusID",
      "bins.harvesterID",
      "bins.binsID"
    )
    .where("bins.sidingID", "=", id);

  //checking for valid ID 
  idExists
    .then((idCheck) => {
      if (idCheck[0].valid === 0) {
        throw Error("Invalid ID: Breakdown Not Found")
      }
      breakdownData
        .then((rows) => {
          const unsortedData = filter.groupBins(rows, "harvesterID");
          const data = filter.harvesterSort(unsortedData);
          return data;
        })
        .then((data) => {
          res.json({ Error: false, Message: "Success", data: data });
        })
        //Error Handling
        .catch((err) => {
          console.log(err);
          res.json({ Error: true, Message: err.message });
        });
    })
    //Error Handling
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});
module.exports = router;
