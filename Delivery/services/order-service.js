/**
 * Created by dmytro on 09.07.16.
 */
"use strict";
let Order = require('../models/order');
let googleConnector = require('../lib/distance-determiner');
let uuid = require('uuid');
let carService = require('./car-service');
let shipmentTimeDeterminer = require('./shipment-time-determiner');
let orderStates = require('../common/enums/order-states').orderStates;

exports.createOrder = function (order) {
    return new Promise((resolve, reject)=> {
        let googlePromise = googleConnector({
                lat: order.from.lat,
                lng: order.from.lng
            },
            {
                lat: order.to.lat,
                lng: order.to.lng
            });
        googlePromise.then(resultJSON=> {
            order.travelTime = JSON.parse(resultJSON).rows[0].elements[0].duration.value;
            var trackingCode = uuid.v4();
            order.trackingCode = trackingCode;
            order.created = new Date();
            return shipmentTimeDeterminer();
        })
            .then((val)=> {
                order.arrivalTime = Date.now() + val + order.travelTime * 1000;
            })
            .then(()=> {
                new Order(order).save(function (err, doc) {
                    if (!err) {
                        carService.loadOrderOnCar(doc);
                        resolve(doc);
                    } else {
                        reject(err);
                    }
                });
            })
            .catch(error=> {
                reject(error);
            })
    })
}

exports.findByTrackingCode = function (trackingCode) {
    return new Promise((resolve, reject)=> {
        Order.findOne({trackingCode: trackingCode}, function (err, doc) {
            if (!err) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
}

exports.findById = function (id) {
    return new Promise((resolve, reject)=> {
        Order.findById(id, function (err, doc) {
            if (!err) {
                resolve(doc);
            } else {
                reject(err);
            }
        });
    });
}
exports.findByCriteria = function (queryOb) {
    return new Promise((resolve, reject)=> {
        Order.find(queryOb, function (err, docs) {
            if (!err) {
                resolve(docs);
            } else {
                reject(err);
            }
        })
    });
}
exports.pollOrderFromQueue = function () {
    return new Promise((resolve, reject)=> {
        Order.find({"state": orderStates.SHIPMENT}).sort({'created': 1}).limit(1).exec(function (err, docs) {
            if (err) {
                reject(err);
            }
            resolve(docs[0]);
        })
    })
}