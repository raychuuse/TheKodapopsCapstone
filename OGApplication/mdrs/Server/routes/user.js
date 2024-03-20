var express = require("express");
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const { validateUserBody } = require("../middleware/validateUser")

router.post("/login", validateUserBody, (req, res) => {
  //prints login creds to console terminal
  // console.log(req.body);

  // Used in creating hashed passwords for new users
  // hash password, generate salt of length 8
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  //id and password submitted
  const id = req.body.id;
  const password = req.body.password;

  const queryUsers = req.db.from("users").select("*").where("userID", "=", id);

  //checking db for matching user
  queryUsers
    .then((users) => {
      //checking if any matching user ids found
      if (users.length == 0) {
        throw Error("User Not Found: Incorrect ID");
      }
      // console.log(users)
      // console.log(users[0].password)

      //match passwords
      // return bcrypt.compare(password, users[0].password)

      return true;
    })
    .then((match) => {
      if (!match) {
        // console.log(password)
        // console.log(hashedPassword)
        // console.log("Passwords do not match");
        throw Error("Invalid Password")
      }

      const secretKey = "secret key"
      const expires_in = 60 * 60 * 24
      const exp = Date.now() + expires_in * 1000
      const token = jwt.sign({ id, exp }, secretKey,);
      res.status(200).send({ auth: true, token: token, id: id })

    })
    //Error Handling
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

//Modify login routers for mobile users
// and for the type of user logging

// reset-password

router.post("/reset-password", validateUserBody, (req, res) => {

  //include id and email
  const id = req.body.id;
  // data is sent in jwt... refer to andrew code
  const email = req.body.email

  const queryUsers = req.db.from("users").select("*").where("email", "=", email);

  //checking db for matching users with emails
  queryUsers
    .then((users) => {
      //checking if any matching user ids found
      if (users.length == 0) {
        throw Error("Email address not found in system");
      }

      // Consider adding another .then for added security (a check for multiple requests)
      
      
      // add logic here for found email, hasn't been changed yet
      const secretKey = "secret key"
      const expires_in = 60 * 60 * 24
      const exp = Date.now() + expires_in * 1000
      const token = jwt.sign({ id, exp }, secretKey,);
      res.status(200).send({ auth: true, token: token, id: id })
    })
    //Error Handling
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

// going to pause on the gets in mind of the db, focusing on jwt and auth setup

// implement user/$userid/sidings and other user related gets
module.exports = router;
