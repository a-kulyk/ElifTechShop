/**
 * Created by dmytro on 12.07.16.
 */
"use strict";
let Car = require('../models/car');
//var Order = require('../models/order');
let orderStates = require('../common/enums/order-states').orderStates;
let mongoose = require('../lib/mongoose');

exports.loadOrderOnCar = function (order) {
    Car.findOne({isAvailable: true, isActive: true}, function (err, car) {
        if (!err && car != null) {
            car._order = order._id;
            car.isAvailable = false;
            car.arrivalTime = new Date(Date.now() + order.travelTime * 1000);
            car.save(function (err, car) {
                if (err) {
                    console.log(err);
                } else {
                    order.state = orderStates.TRANS;
                    order.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        } else if (car == null) {
            console.log('there is no free car');
        }
    });
}
exports.findAll = function () {
    return new Promise((resolve, reject)=> {
        Car.find({}, function (err, cars) {
            if (err) {
                reject(err);
            }
            resolve(cars);
        })
    });
}
exports.deactivateById = function (id) {
    return new Promise((resolve, reject)=> {
        Car.update({_id: id}, {$set: {isActive: false}}, function (err) {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            }
        )
    })
}