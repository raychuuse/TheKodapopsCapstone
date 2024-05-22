const createError = require("http-errors");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const router = express.Router();
const WebSocket = require("ws");
const { uuid } = require("uuidv4");

const port = 8080;

const server = http.createServer(app);
const ws = new WebSocket.Server({ server });
const clients = {};

// Websocket integration
// i.e.
// const wss = new WebSocket.Server({ server });
// Run on a seperate port to standard routing, or handle both
// in the one http server
// i.e. through express-ws library
// var expressWs = require('express-ws')(app);

// Routers imports
const locoRouter = require("./routes/locos");
const binRouter = require("./routes/bins");
const userRouter = require("./routes/user");
const sidingRouter = require("./routes/siding");
const harvesterRouter = require("./routes/harvester");
const transactionRouter = require("./routes/transactionLog");
const dashboardRouter = require("./routes/dashboard");
const runsRouter = require("./routes/runs");

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
app.use("/bins?", binRouter);
app.use("/log", transactionRouter);
app.use("/locos?", locoRouter);
app.use("/sidings?", sidingRouter);
app.use("/harvesters?", harvesterRouter);
app.use("/dashboard", dashboardRouter);
app.use("/runs", runsRouter);
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

app.use(function (req, res, next) {
  console.error('Not found', req.url);
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log(err);

  // render the error page
  // res.status(err.status || 500);
});

process.on("unhandledRejection", (error, p) => {
  console.log("=== UNHANDLED REJECTION ===", p);
  console.dir(error.stack);
});

ws.on("connection", (ws, req) => {
  const userId = uuid();

  // May want to use req to specificy client difference more
  // i.e. specific users, or roles for different notifications
  console.log(`New Connection established.`);

  clients[userId] = ws;
  console.log(`${userId} connected.`);

  // Was shifted elsewhere
  // Don't need to multiply by 1000, already done in jwt token creation
  /*
  if (req[0].exp < Date.now()) {
      //removed
  }
  */
});

function handleDC(userId) {
  console.log(`${userId} disconnected.`);
  delete clients[userId];
}

ws.on("close", () => handleDC(userId));

// Functionality for global notifs, may want to seperate user
// by app, then send specific messags to each role...
function broadcastMessage(data) {
  //const data = JSON.stringify(json);
  for (let userId in clients) {
    let client = clients[userId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

server.listen(port, () => console.log(`API runs on http:localhost:${port}`));
