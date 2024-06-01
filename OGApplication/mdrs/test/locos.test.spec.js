const createServer = require("../Server/server")
const request = require('supertest');
const expect = require('chai').expect;
const generateRandomString = require('../Server/utils').generateRandomString;


// Hardcoded auth data for testing
const authdata = require('../testdata/authdata.json');

// See user test for general comments

const app = createServer();

const apiRoute = "/locos";
describe('Loco API tests', () => {
	it('should successfully return all loco info', (done) => {
		request(app)
			.get(apiRoute)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body).not.to.be.null;
                done();
			});
	});

    it('should successfully return modified breakdown without error', (done) => {
        // LocoID paramater
        let param = [1];
		request(app)
			.get(`${apiRoute}/${param[0]}/siding_breakdown`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should successfully return load data for a locomotive', (done) => {
        // LocoID paramater
        let param = [1];
		request(app)
			.get(`${apiRoute}/${param[0]}/load`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should successfully add a locomotive with a unique name', (done) => {
		request(app)
			.post(apiRoute)
            .send({ name: generateRandomString()})
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(201);
                done();
			});
	});

    it('should successfully update locomotive name', (done) => {
        // Params are locoID and locoName
        let params = [1, generateRandomString()]
		request(app)
			.put(`${apiRoute}/${params[0]}/${params[1]}`)
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});

    it('should successfully delete locomotive', (done) => {
        // Params are locoID
        let params = [8]
		request(app)
			.delete(`${apiRoute}/${params[0]}`)
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});
});
