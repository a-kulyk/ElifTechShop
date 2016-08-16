/**
 * Created by dmytro on 08.08.16.
 */
'use strict';
let orderService = require('../services/order-service');
let deliveryNotifier = require('../lib/delivery-notifier');
let eachLimit = require('async/eachLimit');
let config = require('../config');
let responseFactory = require('../common/response-factory');

exports.post = function (req, res) {
    let ordersIdArray = req.body;
    eachLimit(ordersIdArray, config.get('email-sender:send-at-once'), function (orderId, callback) {
        let servicePromise = orderService.findById(orderId);
        servicePromise.then((order)=> {
            return deliveryNotifier.sendEmail(order.to.username, order.trackingCode);
        }).then((trackingCode)=> {
            return deliveryNotifier.notifyShop(trackingCode);
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
    res.json(responseFactory.successMessage());
}