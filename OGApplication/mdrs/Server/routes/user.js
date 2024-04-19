const express = require("express");
const router = express.Router();

const {body, validationResult} = require('express-validator');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {validateUserBody} = require("../middleware/validateUser")
const {processQueryResult, validationErrorToError} = require("../utils");
const {isNumeric} = require("validator");

const loginValidationRules = [
    body('id').isInt({min: 1}).withMessage("Please provide valid user id"),
    body('password').notEmpty().withMessage('Please provide your password')
];

router.post("/login", loginValidationRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const id = req.body.id;
    const password = req.body.password;

    req.db.raw(`SELECT u.*, h.harvesterName
                FROM users u
                LEFT JOIN harvester h ON h.harvesterID = u.harvesterID
                WHERE userID = ?`, [id])
        .then(processQueryResult)
        .then((response) => {
            if (response.length === 0) {
                return res.status(401).json({message: "No matching user ID and password"});
            }

            bcrypt.compare(password, response[0].password, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({message: 'An unknown error occurred. Please try again.'});
                }

                if (!result) {
                    return res.status(401).json({message: "No matching user ID and password"});
                }

                const user = response[0];

                // Remove password from user object so that it is not sent to client.
                delete user.password;

                const secretKey = "secret key"
                const expires_in = 60 * 60 * 24
                const exp = Date.now() + expires_in * 1000
                const token = jwt.sign({id, exp}, secretKey,);
                res.status(200).json({token: token, user: user})
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(401).json({message: err.message});
        });
});

router.get('/:id', (req, res) => {
    if (!req.params.id || !isNumeric(req.params.id))
        return res.status(400).json({message: 'Please provide a valid user ID.'});

    req.db.raw(`SELECT u.*, h.harvesterName
        FROM users u 
        LEFT JOIN harvester h ON h.harvesterID = u.harvesterID
        WHERE userID = ?`, [req.params.id])
        .then(processQueryResult)
        .then(rows => {
            if (rows == null || rows.length !== 1)
                return res.status(404).json({message: 'No user found with userID ' + req.params.id});
            res.status(200).json(rows[0]);
        })
        .catch(err => {
            res.status(500).json({message: 'An unknown error occurred. Please try again.'})
        });
});

router.post('/set-active/:id/:active', (req, res) => {
    if (!req.params.id || !isNumeric(req.params.id))
        return res.status(400).json({message: 'Please provide a valid user ID.'});
    if (req.params.active == null || !isNumeric(req.params.active) || (req.params.active !== '0' && req.params.active !== '1'))
        return res.status(400).json({message: 'Please provide a valid active status.'});

    req.db.raw(`UPDATE users SET active=? WHERE userID = ?`, [req.params.active, req.params.id])
        .then(processQueryResult)
        .then(result => {
            if (result == null || result.affectedRows !== 1)
                return res.status(404).json({message: 'No user found with userID ' + req.params.id});
            res.sendStatus(204);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'An unknown error occurred. Please try again.'})
        });
});

const createValidationRules = [
    body('password').notEmpty().withMessage("Please provide a valid password"),
    body('firstName').notEmpty().withMessage("Please provide your first name"),
    body('lastName').notEmpty().withMessage("Please provide your last name"),
    body('role').notEmpty().withMessage('Please provide a role')
];

router.post('/', createValidationRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error(errors);
        return res.status(400).json(validationErrorToError(errors));
    }

    const {password, firstName, lastName, role} = req.body;
    const selectedHarvester = role === 'Harvester' ? req.body.selectedHarvester : null;
    console.info(selectedHarvester);
    if (role === 'Harvester' && selectedHarvester == undefined) {
        console.error("Need selected harvester");
        return res.status(400).json({message: 'Please select the harvesting company this user works for'});
    }

    bcrypt.hash(password, 8, (err, hashPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).json({message: 'An unknown error occurred, please try again.'});
        }

        req.db('users').insert({
            firstName: firstName,
            lastName: lastName,
            userRole: role,
            password: hashPassword,
            harvesterID: selectedHarvester
        })
            .then(result => {
                res.status(201).json({userID: result});
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({message: 'An unknown error occurred, please try again.'})
            })
    });
});

router.post("/reset-password", (req, res) => {

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
            const token = jwt.sign({id, exp}, secretKey,);
            res.status(200).send({auth: true, token: token, id: id})
        })
        .catch((err) => {
            console.log(err);
            res.json({Error: true, Message: err.message});
        });
});

router.get('/', (req, res) => {
    req.db.raw(`SELECT u.*, h.harvesterName
                FROM users u
                LEFT JOIN harvester h ON h.harvesterID = u.harvesterID`)
        .then(processQueryResult)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'An unknown error occurred. Please try again.'});
        });
});

const updateValidationRules = [
    body('userID').notEmpty().isNumeric().withMessage("Please provide your userID"),
    body('firstName').notEmpty().withMessage("Please provide your first name"),
    body('lastName').notEmpty().withMessage("Please provide your last name"),
    body('role').notEmpty().withMessage('Please provide a role')
];

router.put('/', updateValidationRules, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {userID, firstName, lastName, role} = req.body;
    const selectedHarvester = role === 'Harvester' ? req.body.selectedHarvester : null;
    if (role === 'Harvester' && selectedHarvester == undefined) {
        console.error("Need selected harvester");
        return res.status(400).json({message: 'Please select the harvesting company this user works for'});
    }

    req.db.raw(`UPDATE users
                SET firstName=?,
                    lastName=?,
                    userRole=?,
                    harvesterID=?
                WHERE userID = ?`, [firstName, lastName, role, selectedHarvester, userID])
        .then(processQueryResult)
        .then(result => {
            if (result.affectedRows < 1) {
                res.status(400).json({message: 'Provided userID did not match any users. Please try again.'});
                return;
            }
            res.status(204).send();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});

module.exports = router;
