const createServer = require("../Server/server")
const request = require('supertest');
const expect = require('chai').expect;
const generateRandomString = require('../Server/utils').generateRandomString;

// Hardcoded auth data for testing
const authdata = require('../testdata/authdata.json');

// See user test for general comments

const app = createServer();

const apiRoute = "/harvesters"
describe('Harvester API tests', () => {
	it('should successfully return all harvesters and their info', (done) => {
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

    it('should provide siding breakdown based on provided harvester ID', (done) => {
        // harvesterID parameter
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

    it('should successfully add a harvester with a unique name', (done) => {
		request(app)
			.post(apiRoute)
            .send({ name: generateRandomString()})
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(201);
                done();
			});
	});

    it('should successfully update harvester name', (done) => {
        // Params are harvesterID and harvesterName
        let params = [1, generateRandomString()]
		request(app)
			.put(`${apiRoute}/${params[0]}/${params[1]}`)
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
                done();
			});
	});

    it('should successfully delete harvester', (done) => {
        // Params are harvesterID
        let params = [10]
		request(app)
			.delete(`${apiRoute}/${params[0]}`)
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});
});
