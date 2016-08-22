/**
 * Created by dmytro on 21.08.16.
 */
'use strict';
let Sugar = require('sugar');

module.exports = function (orders, cars) {
    let carsTime = [];
    for (let i = 0; i < cars.length; i++) {
        let travelTimeLeft;
        if (( travelTimeLeft = cars[i].arrivalTime - Date.now()) < 0) {
            return 0;
        }
        carsTime[i] = travelTimeLeft;
    }
    if (orders.length == 0) {
        return Sugar.Array.min(carsTime);
    }
    for (let i = 0; i < orders.length; i++) {
        let minCarTime = Sugar.Array.min(carsTime);
        let index = carsTime.indexOf(minCarTime);
        carsTime[index] += orders[i].travelTime * 1000;
        if (i == orders.length - 1) {
            return Sugar.Array.min(carsTime);
        }
    }
}