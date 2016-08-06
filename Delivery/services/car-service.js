/**
 * Created by dmytro on 12.07.16.
 */
var Car = require('../models/car');
var Order = require('../models/order');
var orderStates = require('../common/enums/order-states').orderStates;

exports.loadOrderOnCar = function (order) {
    Car.findOne({isAvailable: true}, function (err, car) {
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
