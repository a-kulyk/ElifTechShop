let app = require('../server/app.js');
let config = require('../server/config');
let request = require('supertest');
let expect = require('chai').expect;

describe('User', function() {
    it('should return error trying to log in with incorrect credentials',function(done) {
    	let user = {
    		username: 'testUser',
    		password: 'blabla'
    	};
    	
    	request(app)
    		.post('/user/login')
    		.send(user)
    		.end(function(err, res) {
    			expect(res.statusCode).to.equal(401);
    			done();
    		});
    });
    it('should log in with correct credentials',function(done) {
    	let user = {
    		username: 'andriikulyk',
    		password: '210666'
    	};
    	request(app)
    		.post('/user/login')
    		.send(user)
    		.end(function(err, res) {
    			expect(res.statusCode).to.equal(200);
    			expect(res.body.status).to.equal('Login successful!');
    			done();
    		});
    });
    it('should register new user',function(done) {
    	let body = {
    		username: 'testUser'+ Math.random(),
    		email: 'test@test.com'+ Math.random(),
    		password: 'test'
    	};
    	request(app)
    		.post('/user/register')
    		.send(body)
    		.end(function(err, res) {
    			expect(res.body.status).to.equal('Registration successful!');
    			done();
    		});
    });
    it('should not register new user without email',function(done) {
    	let body = {
    		username: 'testUser'+ Math.random(),
    		password: 'test'
    	};
    	request(app)
    		.post('/user/register')
    		.send(body)
    		.end(function(err, res) {
    			expect(res.body.message).to.equal("users validation failed");
    			done();
    		});
    });
    it('should return false status if user is not logged in',function(done) {
    	request(app)
    		.get('/user/status')
    		.end(function(err, res) {
    			expect(res.body.status).to.equal(false);
    			done();
    		});
    });
});