/**
 * Created by dmytro on 09.07.16.
 */
"use strict";
var Order = require('../models/order');
var googleConnector = require('../lib/distance-determiner');
var uuid = require('uuid');
var carService = require('./car-service');

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
            order.estimatedTime = JSON.parse(resultJSON).rows[0].elements[0].duration.value;
            var trackingCode = uuid.v4();
            order.trackingCode = trackingCode;
            order.created = new Date();
            new Order(order).save(function (err, doc) {
                if (!err) {
                    carService.loadOrderOnCar(doc);
                    resolve(doc);
                } else {
                    reject(err);
                }
            });
        }).catch(error=> {
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