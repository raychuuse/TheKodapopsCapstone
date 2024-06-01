import createServer from "./Server/server";
import request from 'supertest';
import { expect } from 'chai';

// See user test for general comments
const app = createServer();

const apiRoute = "/log";

describe('Loco API tests', () => {

	it('should successfully return all transaction log history', (done) => {
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
});
