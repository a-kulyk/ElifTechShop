/**
 * Created by devilmini on 18.08.16.
 */
let chai = require('chai');
let expect = chai.expect;
let request = require('supertest');
var app = require('../server/app');
var config = require('../server/config');

describe('Integration tests',function () {

    it("server return status 200", function(done) {
        request(app)
            .get('/')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });

    });
    it("filter return status 200", function(done) {
        request(app)
            .get('/catalog/filter')
            .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });

    });
    it("have items", function(done) {
        request(app)
            .get('/catalog/filter')
            .end(function(err, res) {
                let answer = JSON.parse(res.body)
                expect(answer.items).to.exist;
                done();
            });
    });
    it("have pages", function(done) {
        request(app)
            .get('/catalog/filter')
            .end(function(err, res) {
                let answer = JSON.parse(res.body)
                expect(answer.pages).to.exist;
                done();
            });

    });
    it("not items pages", function(done) {
        request(app)
            .get('/catalog/filter?categories=blabla')
            .end(function(err, res) {
                let answer = JSON.parse(res.body)
                expect(answer).to.exist;
                done();
            });

    });

});