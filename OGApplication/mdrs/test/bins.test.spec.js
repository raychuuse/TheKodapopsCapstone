const createServer = require("../Server/server")
const request = require('supertest');
const chai = require('chai');

// Hardcoded auth data for testing
const authdata = require('../testdata/authdata.json');

// See user test for general comments

const app = createServer();

const apiRoute = "/bins";

describe('Bins API tests', () => {

    it(`Consign a bin`, (done) => {
		// Body : BinID, full, userID
		request(app)
			.post(`${apiRoute}/consign`)
            .send({binID: 1, full: false})
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				chai.expect(res.statusCode).to.be.equal(200);
                done();
			});
	});
});
