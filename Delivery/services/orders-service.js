/**
 * Created by dmytro on 09.07.16.
 */
"use strict";
var Order = require('../models/order');
var googleConnector = require('../lib/distance-determiner');
var uuid = require('uuid');

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
            var deliveryDate = new Date(Date.now()
                + JSON.parse(resultJSON).rows[0].elements[0].duration.value * 1000);
            order.deliveryDate = deliveryDate;
            var trackingCode = uuid.v4();
            order.trackingCode = trackingCode;
            new Order(order).save(function (err, doc) {
                if (!err) {
                    resolve(doc);
                } else {
                    reject(err);
                }
            });
        });
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
