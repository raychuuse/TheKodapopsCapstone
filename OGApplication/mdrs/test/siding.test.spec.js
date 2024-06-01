const createServer = require("../Server/server")
const request = require('supertest');
const expect = require('chai').expect;
const generateRandomString = require('../Server/utils').generateRandomString;

// Hardcoded auth data for testing
const authdata = require('../testdata/authdata.json');

// See user test for general comments

const app = createServer();

const apiRoute = "/sidings"
describe('Sidings API tests', () => {
    it('should successfully return all siding info for mill website', (done) => {
		request(app)
			.get(`${apiRoute}`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should successfully return breakdown of a siding, i.e. bin history', (done) => {
		// Param : LocoID
        let param = [1];
		request(app)
			.get(`${apiRoute}/${param[0]}/breakdown`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});
    


    it('should provide loco breakdown based on provided siding ID', (done) => {
        // sidingID parameter
        let param = [1];
		request(app)
			.get(`${apiRoute}/${param[0]}/loco_breakdown`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should provide harvester breakdown based on provided siding ID', (done) => {
        // sidingID parameter
        let param = [1];
		request(app)
			.get(`${apiRoute}/${param[0]}/harvester_breakdown`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should successfully add a siding with a unique name', (done) => {
		request(app)
			.post(apiRoute)
            .send({ name: generateRandomString()})
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(201);
                done();
			});
	});

    it('should successfully update siding name', (done) => {
        // Params are harvesterID and harvesterName
        let params = [1, generateRandomString()]
		request(app)
			.put(`${apiRoute}/${params[0]}/${params[1]}`)
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});

    it('should successfully delete siding', (done) => {
        // Params are harvesterID
        let params = [12]
		request(app)
			.delete(`${apiRoute}/${params[0]}`)
			.set('Authorization', authdata.Authorization)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});
});
