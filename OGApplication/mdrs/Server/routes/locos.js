var express = require("express");
var router = express.Router();

//helper functions
const filter = require("../filter");

const { validateID } = require("../middleware/validateID")

// //path for getting all current loco data
router.get("/", (req, res) => {
  //all locos from db
  const allLocos = req.db.from("locomotive").select("*");

  allLocos
    .then((locos) => {
      res.json({ Error: false, Message: "Success", data: locos });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

//getting bin data with specific loco id
router.get("/loco", validateID, (req, res) => {
  const id = req.query.id;

  const locoData = req.db
    .from("bins")
    .leftOuterJoin("siding", "bins.sidingID", "siding.sidingID")
    .leftOuterJoin("harvester", "bins.harvesterID", "=", "harvester.harvesterID")
    .select("*")
    .where("bins.locoID", "=", id);

  const locoName = req.db.from("locomotive").select("locoName").where("locoID", "=", id);

  const Status = {
    1: 'Empty At Mill',
    2: 'Empty',
    3: 'Delivered to Siding - Empty',
    4: 'At Siding - Full',
    5: 'Full',
    6: 'Delivered to Mill'
  }

  locoData
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
      }))

      // Changed the format of the data filtering
      const data = {
        bins: bins,
        mill: filter.filterById(rows, 6),
        full: filter.filterById(rows, 5),
        empty: filter.filterById(rows, 2),
      };
      return data;
    })
    .then((data) => {
      // Getting the name to send back to the frontend
      locoName
        .then((name) => {
          if (name.length === 0) {
            throw Error("Loco Not Found");
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
module.exports = router;
