const createServer = require("../Server/server")
const request = require('supertest');
const expect = require('chai').expect;
const generateRandomString = require('../Server/utils').generateRandomString;
require('dotenv').config({path: './Server/.env'})
const jwt = require('jsonwebtoken');

// See user test for general comments

const app = createServer();

const apiRoute = "/harvesters"

if (global.testAuthToken == null) {
	const expires_in = 60 * 4;
	const exp = Date.now() / 1000 + expires_in;
	global.testAuthToken = jwt.sign({ userID: 1, exp }, process.env.SECRET_KEY);
}

describe('Harvester API tests', () => {
	it('should successfully return all harvesters and their info', (done) => {
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

    it('should provide siding breakdown based on provided harvester ID', (done) => {
        // harvesterID parameter
        let param = [1];
		request(app)
			.get(`${apiRoute}/${param[0]}/siding_breakdown`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should successfully add a harvester with a unique name', (done) => {
		request(app)
			.post(apiRoute)
            .send({ name: generateRandomString()})
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(201);
                done();
			});
	});

    it('should successfully update harvester name', (done) => {
        // Params are harvesterID and harvesterName
        let params = [20, generateRandomString()]
		request(app)
			.put(`${apiRoute}/${params[0]}/${params[1]}`)
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
                done();
			});
	});

    it('should successfully delete harvester', (done) => {
        // Params are harvesterID
        let params = [20]
		request(app)
			.delete(`${apiRoute}/${params[0]}`)
			.set('Authorization', `Bearer ${global.testAuthToken}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});
});
