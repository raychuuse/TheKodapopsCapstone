var express = require("express");
var router = express.Router();

//helper function for filtering Status
const filter = require("../filter");

const { validateID } = require("../middleware/validateID")

//path for getting all current harvester data
router.get("/", (req, res) => {
  //all harvesters from db
  const allHarvesters = req.db.from("harvester").select("*");
  allHarvesters
    .then((harvesters) => {
      res.json({ Error: false, Message: "Success", Harvesters: harvesters });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

//path for getting all bin data i.e full bins at siding, empty bins at siding and allocated bins on route
router.get("/harvester", validateID, (req, res) => {
  const id = req.query.id;

  const harvestData = req.db
    .from("bins")
    .leftOuterJoin("siding", "bins.sidingID", "siding.sidingID")
    .leftOuterJoin("harvester", "bins.harvesterID", "=", "harvester.harvesterID")
    .leftOuterJoin("locomotive", "bins.locoID", "=", "locomotive.locoID")
    .select("*")
    .where("bins.harvesterID", "=", id);

  //obtaining the havester name from db
  const harvesterName = req.db.from("harvester").select("harvesterName").where("harvesterID", "=", id);

  const Status = {
    1: 'Empty At Mill',
    2: 'Empty',
    3: 'Empty',
    4: 'Full',
    5: 'Full - On Route to Mill',
    6: 'Delivered to Mill'
  }

  harvestData
    .then((rows) => {
      //formatting bins for the status
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

      //format of the data filtering
      const data = {
        bins: bins,
        mill: filter.filterById(rows, 6),
        full: filter.filterById(rows, 4),
        empty: filter.filterById(rows, 3),
        route: filter.filterById(rows, 5),
        sidings: filter.groupBins(rows, "sidingID"),
      };

      return data;
    })
    .then((data) => {
      //getting the name to send back to front end
      harvesterName
        .then((name) => {
          //checking that provided havester exists
          if (name.length === 0) {
            throw Error("Harvester Not Found")
          }
          res.json({ Error: false, Message: "Success", name: name, data: data });
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

//Harvester data grouped by sidings
router.get("/siding_breakdown", validateID, (req, res) => {
  const id = req.query.id;
  // console.log(req.query.id);
  const idExists = req.db.from("harvester").count({ valid: 'harvesterID' }).where("harvesterID", "=", id);

  const breakdownData = req.db
    .from("bins")
    .join("siding", "bins.sidingID", "=", "siding.sidingID")
    .select(
      "bins.sidingID",
      "siding.sidingName",
      "bins.locoID",
      "bins.statusID",
      "bins.harvesterID",
      "bins.binsID"
    )
    .where("harvesterID", "=", id);

  idExists
    .then((idCheck) => {
      if (idCheck[0].valid === 0) {
        throw Error("Invalid ID: Breakdown Not Found")
      }
      breakdownData
        .then((rows) => {
          const unsortedData = filter.groupBins(rows, "sidingID");
          const data = filter.sidingSort(unsortedData);
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
