const createError = require('http-errors');
const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();


// Routers imports
const locoRouter = require("./routes/locos");
const binRouter = require("./routes/bins");
const userRouter = require("./routes/user");
const sidingRouter = require("./routes/siding");
const harvesterRouter = require("./routes/harvester");
const transactionRouter = require("./routes/transactionLog");
const dashboardRouter = require("./routes/dashboard");

//database config
const options = require("./knex.js");
const knex = require("knex")(options);

app.use(cors());
// for parsing application/json
app.use(express.json());

app.use((req, res, next) => {
  req.db = knex;
  next();
});

//Routers
app.use("/bins?", binRouter)
app.use("/log", transactionRouter);
app.use("/locos?", locoRouter);
app.use("/sidings?", sidingRouter);
app.use("/harvesters?", harvesterRouter);
app.use("/dashboard",dashboardRouter);
app.use("/user", userRouter);

//test db connection
app.get("/knex", function (req, res, next) {
  req.db
    .raw("SELECT VERSION()")
    .then((version) => console.log(version[0][0]))
    .catch((err) => {
      console.log(err);
      throw err;
    });
  res.send("Version Logged successfully");
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err)

  // render the error page
  // res.status(err.status || 500);
  res.json({ Error: true, Message: err.message });

});



app.listen(8080, () => console.log("API runs on http:localhost:8080/login"));