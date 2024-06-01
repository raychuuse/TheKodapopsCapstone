import createServer from "./Server/server";
import request from 'supertest';
import { expect } from 'chai';

// Hardcoded auth data for testing
import authdata from '../testdata/authdata.json';

// See user test for general comments

const app = createServer();

const apiRoute = "/runs"
describe('Runs API tests', () => {

    it('should return all run information for a specific run ID', (done) => {
		// Param : runID
        let param = [1];
		request(app)
			.get(`${apiRoute}/${param[0]}`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should return run info on a specific date', (done) => {
		// Param : runID, date (example date)
        let param = [1, "2024-05-20 00:00:00"];
		request(app)
			.get(`${apiRoute}/${param[0]}/${param[1]}`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    
    // Functionality is either collect or drop off
    let typeChosen = "COLLECT"
    it(`should apply an action (${typeChosen}) to a bin in a run`, (done) => {
		// Param : locoID, stopID, binID
        let param = [1, 1, 1];

		request(app)
			.post(`${apiRoute}/${param[0]}/${param[1]}`)
            .send({ type: typeChosen})
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
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
            .send(authdata)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});
});
