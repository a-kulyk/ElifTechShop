/**
 * Created by dmytro on 18.08.16.
 */
'use strict';
let app = require('../app');
let chai = require('chai');
let expect = chai.expect();
let distanceDeterminer = require('../lib/distance-determiner');

describe("Distance determiner", function () {
    it("get order travel time", function () {
        let from = {
            "lat": 49.80292559999999,
            "lng": 23.994827299999997
        };
        let to = {
            "lat": 49.84269599999999,
            "lng": 24.032024999999976
        }
        distanceDeterminer(from, to).then((result)=> {
            expect(JSON.parse(resultJSON).rows[0].elements[0].duration.value).toEqual(1084);
        })
    })
})