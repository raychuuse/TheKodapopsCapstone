const createServer = require("../Server/server")
const request = require('supertest');
const expect = require('chai').expect;
require('dotenv').config({path: './Server/.env'})
const jwt = require('jsonwebtoken');

// See user test for general comments

const app = createServer();

const apiRoute = "/log";

if (global.testAuthToken == null) {
	const expires_in = 60 * 4;
	const exp = Date.now() / 1000 + expires_in;
	global.testAuthToken = jwt.sign({ userID: 1, exp }, process.env.SECRET_KEY);
}

console.info(global.testAuthToken);

describe('Transaction Log tests', () => {

	it('should successfully return all transaction log history', (done) => {
		request(app)
			.get(apiRoute)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});
});
