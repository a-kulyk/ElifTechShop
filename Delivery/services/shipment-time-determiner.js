/**
 * Created by dmytro on 05.08.16.
 */
'use strict';
let Order = require('../models/order');
let Car = require('../models/car');
var Sugar = require('sugar');

module.exports = function () {
    return new Promise((resolve, reject)=> {
        let carsArray;
        getCarsTravelTime()
            .then((cars)=> {
                carsArray = cars;
                return getShippingOrders();
            }).then((orders)=> {
            resolve(getArrivalTime(orders, carsArray));
        }).catch(err=> {
            reject(err)
        })
    })

}
function getCarsTravelTime() {
    return new Promise((resolve, reject)=> {
        Car.find({}).select('arrivalTime').exec(function (err, cars) {
            if (err) {
                reject(err);
            }
            resolve(cars);
        })
    })
}
function getShippingOrders() {
    return new Promise((resolve, reject)=> {
        Order.find({"state": 0}).sort("created").exec(function (err, orders) {
            if (err) {
                reject(err);
            }
            resolve(orders)
        })
    })
}

function getArrivalTime(orders, cars) {
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
            return  Sugar.Array.min(carsTime);
        }
    }
}