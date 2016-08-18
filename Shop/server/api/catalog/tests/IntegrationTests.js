/**
 * Created by devilmini on 18.08.16.
 */
let chai = require('chai');
let expect = chai.expect;
var Filter = require('../filter.js');
var request = require("request");
var app = require('./../../../app');
var config = require('./../../../config');

describe('Integration tests',function () {
    let server;
    before(function () {
         server = app.listen(config.port);
    })
    let serverUrl = "http://localhost:3000/";
    it("server return status 200", function(done) {
        request(serverUrl, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    let url = "http://localhost:3000/catalog/filter";
    it("filter return status 200", function(done) {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it("have items", function(done) {
        request(url, function(error, response, body) {
            let answer = JSON.parse(body)
            expect(answer.items).to.exist;
            done();
        });
    });
    it("have pages", function(done) {
        request(url, function(error, response, body) {
            let answer = JSON.parse(body)
            expect(answer.pages).to.exist;
            done();
        });
    });
    it("not items pages", function(done) {
        request(url+'?categories=blabla', function(error, response, body) {
            let answer = JSON.parse(body)
            expect(answer).to.exist;
            done();
        });
    });
    after(function () {
        server.close();
    })

});