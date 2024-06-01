import createServer from "./Server/server";
import request from 'supertest';
import { expect } from 'chai';

// See user test for general comments

const app = createServer();

// Hard code verfied token, recreate for testing purposes - generated for a user session with expiry
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzE1MDUxMTcwMzU0LCJpYXQiOjE3MTQ5NjQ3NzB9.7mRDeb8rlYAV3Q37aWUJ9KlBx-yMcDea2fZSChUrQB8" 

const apiRoute = "/harvesters"
describe('Harvester API tests', () => {
	it('should successfully return all harvesters and their info', (done) => {
		request(app)
			.get(apiRoute)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
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
			.get(`${apiRoute}/${param[0]}/siding_breadown`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should successfully add a harvester with a unique name', (done) => {
		request(app)
			.post(apiRoute)
            .send({ harvesterName: "brandNewHarvester"})
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(201);
                done();
			});
	});

    it('should successfully update harvester name', (done) => {
        // Params are harvesterID and harvesterName
        let params = [1, "TesterHarvester"]
		request(app)
			.put(`${apiRoute}/${params[0]}/${params[1]}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
                done();
			});
	});

    it('should successfully delete harvester', (done) => {
        // Params are harvesterID
        let params = [1]
		request(app)
			.delete(`${apiRoute}/${params[0]}}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});
});
