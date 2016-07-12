/**
 * Created by dmytro on 12.07.16.
 */
var Car = require('../models/car');
var deliveryTimer = require('./timer-service');

exports.loadOrderOnCar = function (order) {
    Car.findOne({isAvailable: true}, function (err, car) {
        if (!err && car != null) {
            car.order = order._id;
            car.isAvailable = false;
            car.arrivalTime = new Date(Date.now() + order.estimatedTime * 1000);
            car.save(function (err, car) {
                if (err) {
                    console.log(err);
                } else {
                    deliveryTimer(order.estimatedTime * 1000, car.arrivalTime);
                    console.log('car sent');
                }
            });
        } else {
            console.log(err);
        }
    });
}