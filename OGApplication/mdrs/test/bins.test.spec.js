const createServer = require("../Server/server")
const request = require('supertest');
const chai = require('chai');
require('dotenv').config({path: './Server/.env'})
const jwt = require('jsonwebtoken');

// See user test for general comments

const app = createServer();

const apiRoute = "/bins";

if (global.testAuthToken == null) {
	const expires_in = 60 * 4;
	const exp = Date.now() / 1000 + expires_in;
	global.testAuthToken = jwt.sign({ userID: 1, exp }, process.env.SECRET_KEY);
}

describe('Bins API tests', () => {

    it(`Consign a bin`, (done) => {
		// Body : BinID, full, userID
		request(app)
			.post(`${apiRoute}/consign`)
            .send({binID: 1, full: false})
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				chai.expect(res.statusCode).to.be.equal(200);
                done();
			});
	});
});
