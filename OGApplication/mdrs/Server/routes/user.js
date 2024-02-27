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
      return bcrypt.compare(password, users[0].password)

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


module.exports = router;
