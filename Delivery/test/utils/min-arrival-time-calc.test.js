/**
 * Created by dmytro on 21.08.16.
 */
'use strict';
let minArrivalTimeCalc = require('../../utils/min-arrival-time-calc');
let chai = require('chai');
let expect = chai.expect;

const deviation = 1000;

describe('Test min-arrival-time-calc', ()=> {
    describe('Test min-arrival-time-calc', ()=> {
        it('it should calculate minArrivalTime', (done)=> {
            const dateNow = Date.now();
            let carsArray = [
                {arrivalTime: dateNow + 80 * 60 * 1000},
                {arrivalTime: dateNow + 100 * 60 * 1000},
                {arrivalTime: dateNow + 30 * 60 * 1000}
            ];
            let ordersArray = [
                {travelTime: 60 * 60},
                {travelTime: 30 * 60},
                {travelTime: 40 * 60}
            ];
            let minArrivalTime = minArrivalTimeCalc(ordersArray, carsArray);
            expect(Math.abs(6000000 - minArrivalTime) < deviation).to.be.ok;
            done();
        });
    });
    describe('Test min-arrival-time-calc', ()=> {
        it('it should return 0, when there is free car', (done)=> {
            const dateNow = Date.now();

            let carsArray = [
                {arrivalTime: null},
                {arrivalTime: dateNow + 100 * 60 * 1000},
                {arrivalTime: dateNow + 30 * 60 * 1000}
            ];
            let ordersArray = [
                {travelTime: 60 * 60},
                {travelTime: 30 * 60},
                {travelTime: 40 * 60}
            ];

            let minArrivalTime = minArrivalTimeCalc(ordersArray, carsArray);
            expect(minArrivalTime).to.equal(0);
            done();
        });
    });
})


