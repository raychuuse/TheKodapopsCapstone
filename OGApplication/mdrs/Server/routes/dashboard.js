const express = require("express");
const router = express.Router();

//helper function for filtering Status
const filter = require("../filter");

//path for getting all relevant data for dashboard
router.get("/", (req, res) => {
  const data = {}
  const locoData = req.db
    .from("locomotive")
    .join("bin", "bin.locoID", "=", "locomotive.locoID")
    .select(
      "locomotive.locoID",
      "locomotive.locoName",
      "bin.status",
      "bin.binID"
    );
  const sidingData = req.db
    .from("siding")
    .join("bin", "bin.sidingID", "=", "siding.sidingID")
    .select(
      "siding.sidingID",
      "siding.sidingName",
      "bin.status",
      "bin.binID"
    );

  const harvestData = req.db
    .from("harvester")
    .join("bin", "bin.harvesterID", "=", "harvester.harvesterID")
    .select(
      "harvester.harvesterID",
      "harvester.harvesterName",
      "bin.binID",
      "bin.status"
    );

  locoData
    .then((rows) => {
      const unsortedData = filter.groupBins(rows, "locoID");
      const locos = filter.dashSort(unsortedData, 0);
      data.locos = locos;
      return data;
    })
    .then((data) => {
      sidingData
        .then((rows) => {
          const unsortedData = filter.groupBins(rows, "sidingID");
          const sidings = filter.dashSort(unsortedData, 1);
          data.sidings = sidings;
          return data;
        })
        .then((data) => {
          harvestData
            .then((rows) => {
              const unsortedData = filter.groupBins(rows, "harvesterID");
              const harvesters = filter.dashSort(unsortedData, 2);
              data.harvesters = harvesters;
              return data;
            })
            .then((data) => {
              console.log(data);
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
    })
    //Error Handling
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

module.exports = router;
