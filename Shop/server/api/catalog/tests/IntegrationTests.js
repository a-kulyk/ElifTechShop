/**
 * Created by devilmini on 18.08.16.
 */
let chai = require('chai');
let expect = chai.expect;
var Filter = require('../filter.js');
var request = require("request");

describe('Integration tests',function () {

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

});