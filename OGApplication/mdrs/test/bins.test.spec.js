import createServer from "./Server/server";
import request from 'supertest';
import { expect } from 'chai';

// Hardcoded auth data for testing
import authdata from '../testdata/authdata.json';

// See user test for general comments

const app = createServer();

const apiRoute = "/bins";

describe('Bins API tests', () => {

    it(`Consign a bin`, (done) => {
		// Body : BinID, full, userID
        let body = [1, 1, 1];

		request(app)
			.post(`${apiRoute}/${param[0]}/complete-stop/${param[1]}/${param[2]}`)
            .send({binID: body[0], full: body[1], userID: body[2], Authorization: authdata.Authorization})
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
                done();
			});
	});
});
