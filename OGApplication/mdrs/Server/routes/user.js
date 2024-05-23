const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const hashKey = 8;

const secretKey = "secret key";
const mailer = "sugarcaneconsignment@gmail.com";
const mailPassword = "hhuh jtmg qhkg alqn";
const harvesterRole = "Harvester";
const locoRole = "Locomotive";
const millRole = "Mill";

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: mailer,
    pass: mailPassword,
  },
});

function GenerateUniqueID() {
  // Set as 5 digits
  return Math.floor(Math.random() * 100000);
}

const { validateUserBody } = require("../middleware/validateUser");
const { processQueryResult, validationErrorToError, htmlResetCode } = require("../utils");
const { isNumeric } = require("validator");
const e = require("express");
const { verifyAuthorization } = require("../middleware/authorization");

const loginValidationRulesID = [
  body("id").isInt({ min: 1 }).withMessage("Please provide valid user id"),
  body("password").notEmpty().withMessage("Please provide your password"),
];

// Add specific regex for email validation
// Temporarily removed during testing
const loginValidationRulesEmail = [
  body("email").notEmpty().withMessage("Please provide your password"),
  body("password").notEmpty().withMessage("Please provide your password"),
];

function checkJWT(jwt) {
  return jwt.verify(token, secretKey);
}

const sendCode = async (userEmail, resetCode, app) => {
  try {
    let info = await transporter.sendMail({
      from: mailer,
      to: userEmail,
      subject: `Reset Code - ${app} Consignment App`,
      html: htmlResetCode(app, resetCode),
    });
    return info;
  } catch (err) {
    console.log(err);
  }
};

router.post("/login", loginValidationRulesID, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.body.id;
  const password = req.body.password;

  req.db
    .raw(
      `SELECT *
                FROM users u
                WHERE userID = ? AND userRole = "${millRole}"`,
      [id]
    )
    .then(processQueryResult)
    .then((response) => {
      if (response.length === 0) {
        return res.status(401).json({ message: "No matching user ID and password" });
      }

      bcrypt.compare(password, response[0].password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An unknown error occurred. Please try again." });
        }

        if (!result) {
          return res.status(401).json({ message: "No matching user ID and password" });
        }

        const user = response[0];

        // Remove password from user object so that it is not sent to client.
        delete user.password;

        const expires_in = 60 * 60 * 24;
        const exp = Date.now() + expires_in * 1000;
        const token = jwt.sign({ id, exp }, secretKey);
        res.status(200).json({ token: token, user: user });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(401).json({ message: err.message });
    });
});

router.post("/har/login", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const password = req.body.password;
  req.db
    .raw(
      `SELECT u.*, h.harvesterName
                FROM users u
                LEFT JOIN harvester h ON h.harvesterID = u.harvesterID
                WHERE email = "${email}" AND userRole = "${harvesterRole}"`
    )
    .then(processQueryResult)
    .then((response) => {
      if (response.length === 0) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
      bcrypt.compare(password, response[0].password, (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "An unknown error occurred. Please try again." });
        }
        if (!result) {
          return res.status(401).json({ message: "No matching user ID and password" });
        }

        const user = response[0];
        const userID = user.userID;

        // Remove inappropriate info from user object so that it is not sent to client.
        delete user.password;
        delete user.userRole;
        delete user.Permission;

        const expires_in = 60 * 60 * 24;
        const exp = Date.now() + expires_in * 1000;
        const token = jwt.sign({ userID, email, exp }, secretKey);
        return res.status(200).json({ token, user });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(520).json({ message: err.message });
    });
});

router.post("/loco/login", (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;
  const password = req.body.password;
  req.db
    .raw(
      `SELECT *
                FROM users u
                WHERE email = "${email}" AND userRole = "${locoRole}"`
    )
    .then(processQueryResult)
    .then((response) => {
      if (response.length === 0) {
        return res.status(404).json({ message: "User doesn't exist" });
      }
      bcrypt.compare(password, response[0].password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "An unknown error occurred. Please try again." });
        }
        if (!result) {
          return res.status(401).json({ message: "No matching user ID and password" });
        }

        const user = response[0];
        const userID = user.userID;

        // Remove inappropriate info from user object so that it is not sent to client.
        delete user.password;
        delete user.userRole;
        delete user.Permission;

        // Getting a day's worth of seconds once multiplied from milliseconds
        const expires_in = 60 * 60 * 24;
        const exp = Date.now() + expires_in * 1000;
        const token = jwt.sign({ userID, email, exp }, secretKey);
        return res.status(200).json(JSON.stringify({ token: token, user: user }));
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(520).json({ message: err.message });
    });
});

router.get("/:id", (req, res) => {
  if (!req.params.id || !isNumeric(req.params.id))
    return res.status(400).json({ message: "Please provide a valid user ID." });

  req.db
    .raw(
      `SELECT u.*, h.harvesterName
        FROM users u 
        LEFT JOIN harvester h ON h.harvesterID = u.userID
        WHERE userID = ?`,
      [req.params.id]
    )
    .then(processQueryResult)
    .then((rows) => {
      if (rows == null || rows.length !== 1)
        return res.status(404).json({ message: "No user found with userID " + req.params.id });
      res.status(200).json(rows[0]);
    })
    .catch((err) => {
      res.status(500).json({ message: "An unknown error occurred. Please try again." });
    });
});

router.post("/set-active/:id/:active", (req, res) => {
  if (!req.params.id || !isNumeric(req.params.id))
    return res.status(400).json({ message: "Please provide a valid user ID." });
  if (
    req.params.active == null ||
    !isNumeric(req.params.active) ||
    (req.params.active !== "0" && req.params.active !== "1")
  )
    return res.status(400).json({ message: "Please provide a valid active status." });

  req.db
    .raw(`UPDATE users SET active=? WHERE userID = ?`, [req.params.active, req.params.id])
    .then(processQueryResult)
    .then((result) => {
      if (result == null || result.affectedRows !== 1)
        return res.status(404).json({ message: "No user found with userID " + req.params.id });
      res.sendStatus(204);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "An unknown error occurred. Please try again." });
    });
});

const createValidationRules = [
  body("password").notEmpty().withMessage("Please provide a valid password"),
  body("firstName").notEmpty().withMessage("Please provide your first name"),
  body("lastName").notEmpty().withMessage("Please provide your last name"),
  body("role").notEmpty().withMessage("Please provide a role"),
];

router.post("/", createValidationRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors);
    return res.status(400).json(validationErrorToError(errors));
  }

  const { password, firstName, lastName, email, role } = req.body;
  const selectedHarvester = role === "Harvester" ? req.body.selectedHarvester : null;
  if (role === "Harvester" && selectedHarvester == undefined) {
    console.error("Need selected harvester");
    return res.status(400).json({
      message: "Please select the harvesting company this user works for",
    });
  }

  bcrypt.hash(password, hashKey, (err, hashPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "An unknown error occurred, please try again." });
    }

    req
      .db("users")
      .insert({
        firstName: firstName,
        lastName: lastName,
        userRole: role,
        password: hashPassword,
        harvesterID: selectedHarvester,
        email: email,
      })
      .then((result) => {
        res.status(201).json({ userID: result });
      })
      .catch((err) => {
        console.error(err);
        if (err?.code === "ER_DUP_ENTRY" && err?.sqlMessage.includes("users.email"))
          return res.status(409).json({ message: "Account already exists with that email." });
        res.status(500).json({ message: "An unknown error occurred, please try again." });
      });
  });
});

router.post("/reset-password", (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  const password = req.body.password;
  const queryUsers = req.db.from("usertokens").select("*").where("email", "=", email).where("userRole", "=", millRole);
  //checking db for matching users with emails
  queryUsers
    .then((users) => {
      //checking if any matching user emails are found
      if (users.length == 0) {
        res.status(400).json({ Error: true, Message: "No email token has been sent" });
        console.log("No email token has been sent");
        return;
      }
      const trueToken = users[0]["resetToken"];

      if (trueToken == code) {
        try {
          bcrypt.hash(password, hashKey, (err, hashPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                message: "An unknown error occurred, please try again.",
              });
            }
            req.db
              .raw(
                `UPDATE users
                                SET password = '${hashPassword}'
                                WHERE email = '${email}' AND userRole = '${millRole}'`
              )
              .then((result) => {
                if (result == 0) {
                  res.status(500).json({ Error: true, Message: "Unknown error occured." });
                }

                res.status(200).json({ message: "Password updated successfully" });

                // Delete token from saved database
                req.db.raw(`DELETE FROM usertokens WHERE (email = '${email}' AND userRole = '${millRole}')`)
                .catch (err => {
                  console.error(err);
                });
              })
              .catch((err) => {
                console.error(err);
                res.status(500).json({ message: "Failed to update password." });
              });
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to update password." });
        }
      } else {
        res.status(510).json({ message: "Invalid Token" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

router.post("/har/reset-password", (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  const password = req.body.password;
  const queryUsers = req.db
    .from("usertokens")
    .select("*")
    .where("email", "=", email)
    .where("userRole", "=", harvesterRole);
  //checking db for matching users with emails
  queryUsers
    .then((users) => {
      //checking if any matching user emails are found
      if (users.length == 0) {
        res.status(400).json({ Error: true, Message: "No email token has been sent" });
        console.log("No email token has been sent");
        return;
      }
      const trueToken = users[0]["resetToken"];

      if (trueToken == code) {
        try {
          bcrypt.hash(password, hashKey, (err, hashPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                message: "An unknown error occurred, please try again.",
              });
            }
            req.db
              .raw(
                `UPDATE users
                                SET password = '${hashPassword}'
                                WHERE email = '${email}' AND userRole = '${harvesterRole}'`
              )
              .then((result) => {
                if (result == 0) {
                  res.status(500).json({ Error: true, Message: "Unknown error occured." });
                }

                res.status(200).json({ message: "Password updated successfully" });

                // Delete token from saved database
                req.db.raw(`DELETE FROM usertokens WHERE (email = '${email}' AND userRole = '${harvesterRole}')`)
                .catch (err => {
                  console.error(err);
                });
              })
              .catch((err) => {
                console.error(err);
                res.status(500).json({ message: "Failed to update password." });
              });
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to update password." });
        }
      } else {
        res.status(510).json({ message: "Invalid Token" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

router.post("/reset-code", async (req, res) => {
  //Using email!
  const email = req.body.email;
  const queryUsers = req.db.from("users").select("*").where("email", "=", email).where("userRole", "=", millRole);
  //checking db for matching users with emails
  queryUsers
    .then((users) => {
      if (users.length == 0) {
        res.status(400).json({ Error: true, Message: "User does not exist." });
        console.log("No email exists.");
        return;
      }
      code = GenerateUniqueID();

      // In future, check if a token exists... timeout requests... do this by adding
      // an expiry to db tokens or specific Traffic Office setup.
      req.db
        .raw(
          `INSERT INTO usertokens 
                        VALUES ('${email}', '${millRole}', '${code}')
                        ON DUPLICATE KEY UPDATE resetToken = '${code}'`
        )
        .then((result) => {
          if (result == 0) {
            res.status(500).json({ Error: true, Message: "Unknown error occured." });
          }
          sendCode(email, code, millRole);
          res.status(200).json({
            Message: "A link to reset password to the user's email has been sent.",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Failed to register token on server." });
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: true, Message: err.message });
    });
});

router.post("/har/reset-code", async (req, res) => {
  const email = req.body.email;
  const queryUsers = req.db.from("users").select("*").where("email", "=", email).where("userRole", "=", harvesterRole);
  //checking db for matching users with emails
  queryUsers
    .then((users) => {
      if (users.length == 0) {
        res.status(400).json({ Error: true, Message: "User does not exist." });
        console.log("No email exists.");
        return;
      }
      code = GenerateUniqueID();

      // In future, check if a token exists... timeout requests... do this by adding
      // an expiry to db tokens or specific Traffic Office setup.
      req.db
        .raw(
          `INSERT INTO usertokens 
                        VALUES ('${email}', '${harvesterRole}', '${code}')
                        ON DUPLICATE KEY UPDATE resetToken = '${code}'`
        )
        .then((result) => {
          if (result == 0) {
            res.status(500).json({ Error: true, Message: "Unknown error occured." });
          }
          sendCode(email, code, harvesterRole);
          res.status(200).json({
            Message: "A link to reset password to the user's email has been sent.",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Failed to register token on server." });
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: true, Message: err.message });
    });
});

router.post("/loco/reset-password", (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  const password = req.body.password;
  const queryUsers = req.db.from("usertokens").select("*").where("email", "=", email).where("userRole", "=", locoRole);
  //checking db for matching users with emails
  queryUsers
    .then((users) => {
      //checking if any matching user emails are found
      if (users.length == 0) {
        res.status(400).json({ Error: true, Message: "No email token has been sent" });
        console.log("No email token has been sent");
        return;
      }
      const trueToken = users[0]["resetToken"];

      if (trueToken == code) {
        try {
          bcrypt.hash(password, hashKey, (err, hashPassword) => {
            if (err) {
              console.error(err);
              return res.status(500).json({
                message: "An unknown error occurred, please try again.",
              });
            }
            req.db
              .raw(
                `UPDATE users
                                SET password = '${hashPassword}'
                                WHERE email = '${email}' AND userRole = '${locoRole}'`
              )
              .then((result) => {
                if (result == 0) {
                  res.status(500).json({ Error: true, Message: "Unknown error occured." });
                }

                res.status(200).json({ message: "Password updated successfully" });

                // Delete token from saved database
                req.db.raw(`DELETE FROM usertokens WHERE (email = '${email}' AND userRole = '${locoRole}')`)
                .catch (err => {
                  console.error(err);
                });
              })
              .catch((err) => {
                console.error(err);
                res.status(500).json({ message: "Failed to update password." });
              });
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to update password." });
        }
      } else {
        res.status(510).json({ message: "Invalid Token" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: err.message });
    });
});

router.post("/loco/reset-code", async (req, res) => {
  const email = req.body.email;
  const queryUsers = req.db.from("users").select("*").where("email", "=", email).where("userRole", "=", locoRole);
  //checking db for matching users with emails
  queryUsers
    .then((users) => {
      if (users.length == 0) {
        res.status(400).json({ Error: true, Message: "User does not exist." });
        console.log("No email exists.");
        return;
      }
      code = GenerateUniqueID();

      // In future, check if a token exists... timeout requests... do this by adding
      // an expiry to db tokens or specific Traffic Office setup.
      req.db
        .raw(
          `INSERT INTO usertokens 
                        VALUES ('${email}', '${locoRole}', '${code}')
                        ON DUPLICATE KEY UPDATE resetToken = '${code}'`
        )
        .then((result) => {
          if (result == 0) {
            res.status(500).json({ Error: true, Message: "Unknown error occured." });
          }
          sendCode(email, code, locoRole);
          res.status(200).json({
            Message: "A link to reset password to the user's email has been sent.",
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: "Failed to register token on server." });
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: true, Message: err.message });
    });
});

router.get("/", (req, res) => {
  req.db
    .raw(
      `SELECT u.*, h.harvesterName
                FROM users u
                LEFT JOIN harvester h ON h.harvesterID = u.harvesterID`
    )
    .then(processQueryResult)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "An unknown error occurred. Please try again." });
    });
});

const updateValidationRules = [
  body("userID").notEmpty().isNumeric().withMessage("Please provide your userID"),
  body("firstName").notEmpty().withMessage("Please provide your first name"),
  body("lastName").notEmpty().withMessage("Please provide your last name"),
  body("role").notEmpty().withMessage("Please provide a role"),
];

router.put("/", updateValidationRules, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userID, firstName, lastName, role, email } = req.body;
  const selectedHarvester = role === "Harvester" ? req.body.selectedHarvester : null;
  if (role === "Harvester" && selectedHarvester == undefined) {
    console.error("Need selected harvester");
    return res.status(400).json({
      message: "Please select the harvesting company this user works for",
    });
  }

  req.db
    .raw(
      `UPDATE users
                SET firstName=?,
                    lastName=?,
                    userRole=?,
                    harvesterID=?,
                    email=?
                WHERE userID = ?`,
      [firstName, lastName, role, selectedHarvester, email, userID]
    )
    .then(processQueryResult)
    .then((result) => {
      if (result.affectedRows < 1) {
        res.status(400).json({
          message: "Provided userID did not match any users. Please try again.",
        });
        return;
      }
      res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});

router.get("/:id/sidings", verifyAuthorization, (req, res) => {
  // Old auth code
  /*if (!req[0].token) {
        res.status(200)
            .json({success: false, message: "Token was not provided."});
    }*/
  /*
    const decode = checkJWT(req[0].token);
    if (checkIfExpired(decode.exp)) {
        res.status(400)
            .json({success: false, message: "Error! Login Invalid, token expired."});
    }*/
  req.db
    .raw(
      `SELECT *
                FROM siding`
    )
    .then(processQueryResult)
    .then((sidings) => {
      res.status(200).json(sidings);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
});
router.get("/:id/farms", verifyAuthorization, (req, res) => {
  req.db
    .raw(
      `SELECT * FROM farms`
    )
    .then(processQueryResult)
    .then((farms) => {
      console.log(farms);
      res.status(200).json(farms);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
  // Example instructions do not differentiate based on siding/ userID
  /*
    if (!req.params.id) {
        req.db.raw(`SELECT *
                FROM farms`)
        .then(processQueryResult)
        .then((farms) => {
          res.status(200).json(farms);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json(err);
        });
    }
    else {
        req.db.raw(`SELECT *
            FROM farms
        WHERE sidingID = ?`, [id])
        .then(processQueryResult)
        .then((farms) => {
          res.status(200).json(farms);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json(err);
        });
    }*/
});

router.get("/farms/:id/blocks", verifyAuthorization, (req, res) => {
  const farmID = req.params.id;
  if (!farmID) {
    res.status(430).json({ Message: "farmID required." });
  } else {
    req.db
      .raw(
        `SELECT *
        FROM blocks
        WHERE farmID = ?`,
        [farmID]
      )
      .then(processQueryResult)
      .then((blocks) => {
        res.status(200).json(blocks);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  }
});

router.get("/blocks/:farmID/:blockID/subs", (req, res) => {
  const farmID = req.params.farmID;
  const blockID = req.params.blockID;

  if (!farmID || !blockID) {
    res.status(430).json({ Message: "farmID and blockID required." });
  } else {
    req.db
      .raw(
        `SELECT *
        FROM subs
        WHERE blockID = '${blockID}' AND farmID = '${farmID}'`
      )
      .then(processQueryResult)
      .then((subs) => {
        res.status(200).json(subs);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  }
});

router.get("/farms/:id/pads", (req, res) => {
  const farmID = req.params.id;
  if (!farmID) {
    res.status(430).json({ Message: "farmID required." });
  } else {
    req.db
      .raw(
        `SELECT *
                FROM pads
                WHERE farmID = '${farmID}'`
      )
      .then(processQueryResult)
      .then((subs) => {
        res.status(200).json(subs);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  }
});

module.exports = router;
