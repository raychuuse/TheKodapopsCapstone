import createServer from "./Server/server";
import request from 'supertest';
import { expect } from 'chai';
import milluserauthdata from '../testdata/milluserauthdata.json';
import haruserauthdata from '../testdata/haruserauthdata.json';
import locouserauthdata from '../testdata/locouserauthdata.json';
import newharuserdata from '../testdata/newharuserdata.json';

/* Could use beforeEach to set initial data, i.e. load sugarcanesql from scratch
   and potentially an afterEach to clear or reset (but could leave this for reset.)
   In practicality highly recommend importing req from knex config or similar
   1: https://stackoverflow.com/questions/22276763/use-nodejs-to-run-an-sql-file-in-mysql
   ^ Justin shows a demonstration of running a big sql script
   2: As noted in the page, could also allow multiple statements and reformat
   3: In mind of client, it's likely the db will be shifted alongside TOTool 
   backend, so this method would vary, do as needed for current use case.
*/
const app = createServer();
// For supertest, is not needed to server.listen and server.stop, app object is used

// Test code for rest password tests, 0 originally
const code = 0;

const apiRoute = "/user"

describe('User API tests', () => {
	it('should successfully login for a mill user', (done) => {
		request(app)
			.post(`${apiRoute}/login`)
			.query(milluserauthdata)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data[0].token).to.be.equal('Bearer\s[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}')
				done();
			});
	});
    
	it('should successfully login for a harvester user', (done) => {
		request(app)
			.post(`/user/har/login`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.query(haruserauthdata)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data[0].token).to.be.equal('Bearer\s[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}')
                done();
			});
	});

	it('should successfully login for a locomotive user', (done) => {
		request(app)
			.post(`/user/loco/login`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.query(locouserauthdata)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data[0].token).to.be.equal('Bearer\s[\d|a-f]{8}-([\d|a-f]{4}-){3}[\d|a-f]{12}');
                done();
			});
	});

    it('should successfully return all user information', (done) => {
		request(app)
			.get(`/user`)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data[0]).not.to.be.null;
                done();
                // Can opt for more specific checks, like counts etc based on loaded data
			});
	});

    // Testing based on user ID 1 pertaining to mill email account
    it('should successfully return user info based on their ID', (done) => {
		request(app)
			.get(`/user/` + 1)
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(200);
				expect(res.body.data[0].email).to.equal("mill@email.com");
                done();
                // .not.to.be.null; can also be used if using seperate mock data
			});
	});

    it('should set an existing user to active', (done) => {
        let params = [1,1];
		request(app)
			.post(`${apiRoute}/${params[0]}/${params[1]}`)
			.end(function (err, res) {
				expect(res.statusCode).to.be.equal(204);
                done();
			});
	});

    it('should successfully create a harvester', (done) => {
        request(app)
            .post(apiRoute)
            .send(newharuserdata)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(201);
                expect(res.body.userID).not.to.be.null;
                done();
            });
    });

    it('should successfully send a mill reset token', (done) => {
        request(app)
            .post(`${apiRoute}/reset-code`)
            .send({
                email: "mill@email.com"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200);
                done();
            });
    });

    // Code must be a valid code in the db, atm requires hardcoding for used email
    // but recommended to use knex and req.db before the mocha request
    it('should successfully reset a mill user password', (done) => {
        request(app)
            .post(`${apiRoute}/reset-password`)
            .send({
                email: "mill@email.com",
                code: code,
                password: "root2",
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200);
                done();
            });
    });

    it('should successfully send a harvester reset token', (done) => {
        request(app)
            .post(`${apiRoute}/har/reset-code`)
            .send({
                email: "harvester@email.com"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200);
                done();
            });
    });

    // Next reset and this are same note as prior regarding code checking
    it('should successfully reset a harvester user password', (done) => {
        request(app)
            .post(`${apiRoute}/har/reset-password`)
            .send({
                email: "harvester@email.com",
                code: code,
                password: "root2",
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200);
                done();
            });
    });

    it('should successfully send a loco reset token', (done) => {
        request(app)
            .post(`${apiRoute}/loco/reset-code`)
            .send({
                email: "loco@email.com"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200);
                done();
            });
    });

    // Same note as prior
    it('should successfully reset a loco user password', (done) => {
        request(app)
            .post(`${apiRoute}/loco/reset-password`)
            .send({
                email: "loco@email.com",
                code: code,
                password: "root2",
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(200);
                done();
            });
    });

    it('should update a user correctly if a harvester', (done) => {
        request(baseurl)
            .put(apiRoute)
            .send({
                firstName: "Florence",
                lastName: "Vonzein",
                userRole: "Harvester",
                harvesterID: "1",
                email: "harvester@email.com"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(204);
                done();
            });
    });

    it('should update a user correctly if a locomotive driver', (done) => {
        request(baseurl)
            .put(apiRoute)
            .send({
                firstName: "Seinman",
                lastName: "Euran",
                userRole: "Locomotive",
                harvesterID: null,
                email: "loco@email.com"
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function(err, res) {
                expect(res.statusCode).to.be.equal(204);
                done();
            });
    });
});