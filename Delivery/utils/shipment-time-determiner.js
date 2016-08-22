/**
 * Created by dmytro on 05.08.16.
 */
'use strict';
let minArrivalTimeCalc = require('./min-arrival-time-calc');
let carService = require('../services/car-service');
let orderService = require('../services/order-service');

module.exports = function () {
    return new Promise((resolve, reject)=> {
        let carsArray;
        carService.getCarsTravelTime()
            .then((cars)=> {
                carsArray = cars;
                return orderService.getShippingOrders();
            }).then((orders)=> {
            resolve(minArrivalTimeCalc(orders, carsArray));
        }).catch(err=> {
            reject(err)
        })
    })

}
