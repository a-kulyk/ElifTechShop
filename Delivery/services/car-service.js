/**
 * Created by dmytro on 12.07.16.
 */
"use strict";
let Car = require('../models/car');
let orderStates = require('../common/enums/order-states').orderStates;
let orderService = require('./order-service');
let _ = require("underscore");

exports.loadOrderOnCar = function (order) {
    orderService.pollOrderFromQueue().then(topOrder=> {
            if (topOrder.trackingCode == order.trackingCode) {
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
        }
    );

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
exports.activateByIdAsAvailable = function (id) {
    return new Promise((resolve, reject)=> {
            orderService.pollOrderFromQueue().then((topOrder)=> {
                if (topOrder) {
                    Car.update({_id: id}, {
                            $set: {
                                isActive: true,
                                isAvailable: false,
                                _order: topOrder._id,
                                arrivalTime: new Date(Date.now() + topOrder.travelTime * 1000)
                            }
                        },
                        function (err) {
                            if (!err) {
                                topOrder.arrivalTime = new Date(Date.now() + topOrder.travelTime * 1000);
                                topOrder.state = orderStates.TRANS;
                                topOrder.save(function (err, order) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            } else {
                                reject(err);
                            }
                        }
                    )
                } else {
                    Car.update({_id: id}, {$set:{isActive: true}}, function (err) {
                        if (!err) {
                            resolve();
                        } else {
                            reject(err);
                        }
                    })
                }
            })

        }
    )
}
exports.findById = function (id) {
    return new Promise((resolve, reject)=> {
        Car.findById(id, function (err, doc) {
            if (!err) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
}
exports.activateByIdAsNotAvailable = function (id) {
    return new Promise((resolve, reject)=> {
        Car.update({_id: id}, {$set: {isActive: true}}, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })

}
exports.findAllActive = function () {
    return new Promise((resolve, reject)=> {
        Car.find({isActive: true}, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        })
    })
}