/**
 * Created by dmytro on 08.08.16.
 */
'use strict';
let orderService = require('../services/order-service');
let deliveryNotifier = require('../utils/delivery-notifier');
let eachLimit = require('async/eachLimit');
let config = require('../config');
let responseFactory = require('../common/response-factory');

exports.post = function (req, res) {
    let ordersIdArray = req.body;
    eachLimit(ordersIdArray, config.get('email-sender:send-at-once'), function (orderId, callback) {
        let deliveredOrder;
        let servicePromise = orderService.findById(orderId);
        servicePromise.then((order)=> {
            deliveredOrder = order;
            console.log("API_KEY : " + deliveredOrder.API_KEY);
            if (deliveredOrder.API_KEY === config.get("shop:API_KEY")) {
                return deliveryNotifier.notifyShop(deliveredOrder);
            }
            return;
        }).catch(err=> {
            console.log('error with shop notification ' + err);
            return;
        }).then(()=> {
            return deliveryNotifier.sendEmail(deliveredOrder.to.username, deliveredOrder.trackingCode);
        }).then(()=> {
            callback();
        }).catch((error=> {
            console.log('error in /delivered route')
            callback(error);
        }));
    }, function (err) {
        if (err) {
            console.log(err);
        }
    })
    res.json(responseFactory.successMessage());
}