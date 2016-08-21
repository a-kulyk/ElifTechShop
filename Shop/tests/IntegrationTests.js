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
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
    it("filter return status 200", function(done) {
        request(app)
            .get('/catalog/filter')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });


    });
    it("have items", function(done) {
        request(app)
            .get('/catalog/filter')
            .expect(function(res) {
                expect(res.body.items).to.exist;
            })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });

    });
    it("have pages", function(done) {
        request(app)
            .get('/catalog/filter')
            .expect(function(res) {
                expect(res.body.pages).to.exist;
            })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });

    });
    it("not items pages", function(done) {
        request(app)
            .get('/catalog/filter?categories=blabla')
            .expect(function(res) {
                expect(res.body).to.exist;
            })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });

    });

});