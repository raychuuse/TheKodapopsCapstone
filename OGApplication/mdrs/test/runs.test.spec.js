const createServer = require("../Server/server")
const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config({path: './Server/.env'})
const jwt = require('jsonwebtoken');

// See user test for general comments

const app = createServer();

const apiRoute = "/runs"

if (global.testAuthToken == null) {
	const expires_in = 60 * 4;
	const exp = Date.now() / 1000 + expires_in;
	global.testAuthToken = jwt.sign({ userID: 1, exp }, process.env.SECRET_KEY);
}

describe('Runs API tests', () => {

    it('should return run info on a specific date', (done) => {
		// Param : runID, date (example date)
        let param = [1, new Date().toISOString().split('T')[0]];
		request(app)
			.get(`${apiRoute}/${param[0]}/${param[1]}`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    
    // Functionality is either COLLECT or DROP_OFF
    let typeChosen = "DROP_OFF"
    it(`should apply an action (${typeChosen}) to a bin in a run`, (done) => {
		// Param : locoID, stopID, binID
        let param = [1, 1, 1];

		request(app)
			.post(`${apiRoute}/${param[0]}/stop-action/${param[1]}/${param[2]}`)
            .query({type: typeChosen})
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});

    it(`Complete an action (${typeChosen}) regarding a bin at a stop`, (done) => {
		// Param : stopID, type, completed (completed as 1)
        let param = [1, typeChosen, 1];

		request(app)
			.post(`${apiRoute}/${param[0]}/complete-stop/${param[1]}/${param[2]}`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});
});
