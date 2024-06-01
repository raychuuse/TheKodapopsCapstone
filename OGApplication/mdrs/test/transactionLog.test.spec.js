const createServer = require("../Server/server")
const request = require('supertest');
const expect = require('chai').expect;

// Hardcoded auth data for testing
const authdata = require('../testdata/authdata.json');

// See user test for general comments

const app = createServer();

const apiRoute = "/log";

describe('Loco API tests', () => {

	it('should successfully return all transaction log history', (done) => {
		request(app)
			.get(apiRoute)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});
});
