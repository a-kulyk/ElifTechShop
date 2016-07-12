/**
 * Created by dmytro on 12.07.16.
 */
var Car = require('../models/car');
var Order = require('../models/order');
var orderStates = require('../enums/order-states').orderStates;

var timer;
//var currentTime;
var timerArray = [];
var currentPromise;
var currentArrivalTime;

module.exports = function deliveryTimer(estimatedTime, arrivalTime) {
    if (!timer) {
        currentArrivalTime = arrivalTime;
        timer = setTimeout(function timerFunc() {
                var promise = notifier();
                promise.then(()=> {
                    if (timerArray.length == 0) {
                        timer = null;
                    } else {
                        timer = setTimeout(timerFunc, timerArray.shift());
                    }
                })
            }
            ,
            estimatedTime
        )
        ;
    } else {
        var timeDifference = Date.now() + estimatedTime - currentArrivalTime;
        timerArray.push(Math.abs(timeDifference));
        timerArray.sort(function (a, b) {
            return a - b;
        });

        if (timeDifference < 0) {
            currentArrivalTime = arrivalTime;
            //currentTime = estimatedTime;
            clearTimeout(timer);
            timer = setTimeout(function timerFunc() {
                var promise = notifier();
                promise.then(()=> {
                    if (timerArray.length == 0) {
                        timer = null;
                    } else {
                        timer = setTimeout(timerFunc, timerArray.shift());
                    }
                });
            }, estimatedTime);

        }
    }
}

function notifier() {
    return new Promise((resolve, reject)=> {
        Car.find({arrivalTime: {$lt: new Date()}}, function (err, cars) {
            if (!err) {
                new Promise((resolve, reject)=> {
                    for (var i = 0; i <= cars.length; i++) {
                        if (i == cars.length) {
                            resolve();
                            break;
                        }
                        cars[i].isAvailable = true;
                        cars[i].arrivalTime = null;
                        var orderId = cars[i].order;
                        cars[i].order = null;
                        cars[i].save(function (err) {
                            if (err) {
                                reject(err);
                            }
                        })
                        Order.findById(orderId, function (err, order) {
                            if (!err) {
                                order.state = orderStates.DELIVERED;
                                order.save(function (err) {
                                    if (err) {
                                        reject(err);
                                    }
                                })
                            } else {
                                reject(err);
                            }
                        })
                    }
                }).then(()=> {
                        console.log('resolved inner promise')
                        resolve();
                    }
                ).catch((err)=> {
                    reject(err);
                });

            } else {
                reject(err);
            }
        });
    }).catch((err)=> {
        console.log(err)
    });

}