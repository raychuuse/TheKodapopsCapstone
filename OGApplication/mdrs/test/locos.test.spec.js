import createServer from "./Server/server";
import request from 'supertest';
import { expect } from 'chai';

// See user test for general comments

const app = createServer();

const apiRoute = "/locos";
describe('Loco API tests', () => {
	it('should successfully return all loco info', (done) => {
		request(app)
			.get(apiRoute)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data[0]).not.to.be.null;
                done();
			});
	});

    it('should successfully return modified breakdown without error', (done) => {
        // LocoID paramater
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

    it('should successfully return load data for a locomotive', (done) => {
        // LocoID paramater
        let param = [1];
		request(app)
			.get(`${apiRoute}/${param[0]}/load`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data).not.to.be.null;
                done();
			});
	});

    it('should successfully add a locomotive with a unique name', (done) => {
		request(app)
			.post(apiRoute)
            .send({ locoName: "brandNewLoco"})
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(201);
                done();
			});
	});

    it('should successfully update locomotive name', (done) => {
        // Params are locoID and locoName
        let params = [1, "TesterLoco"]
		request(app)
			.put(`${apiRoute}/${params[0]}/${params[1]}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});

    it('should successfully delete locomotive', (done) => {
        // Params are locoID
        let params = [1]
		request(app)
			.delete(`${apiRoute}/${params[0]}}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});
});
