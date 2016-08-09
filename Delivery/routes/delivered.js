/**
 * Created by dmytro on 08.08.16.
 */
'use strict';
let orderService = require('../services/order-service');
let deliveryNotifier = require('../lib/delivery-notifier');
let eachLimit = require('async/eachLimit');
let config = require('../config');

exports.post = function (req, res) {
    let successMsg = {"success": true};
    let failedMsg = {"success": false};
    let ordersArray = req.body;
    eachLimit(ordersArray, config.get('email-sender:send-at-once'), function (order, callback) {
        let servicePromise = orderService.findById(order);
        servicePromise.then((order)=> {
            return deliveryNotifier.notifyAboutDelivery(order.to.username, order.trackingCode);
        }).then(()=> {
            callback();
        }).catch((error=> {
            callback(error);
        }));
    }, function (err) {
        if (err) {
            console.log(err);
        }
    })
    res.json(successMsg);
}