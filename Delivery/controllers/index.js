/**
 * Created by dmytro on 29.06.16.
 */
"use strict";
let validationSchema = require('../common/validation-schema');
let orderService = require('../services/order-service');
let deliveryNotifier = require('../lib/delivery-notifier');
let historyService = require('../services/history-service');
let eachLimit = require('async/eachLimit');
let config = require('../config');
let ValidationError = require('../common/errors/validation-error');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.sendFile('index.html');
    });

    app.get('/order/:trackingCode', function (req, res) {
            let successMsg = {"success": true};
            let failedMsg = {"success": false};
            let servicePromise = orderService.findByTrackingCode(req.params.trackingCode);
            servicePromise.then((order)=> {
                if (order != null) {
                    successMsg.arrivalTime = order.arrivalTime;
                    successMsg.travelTime = order.travelTime;
                    successMsg.state = order.state;
                    successMsg.from = order.from;
                    successMsg.to = order.to;
                    res.json(successMsg);
                } else {
                    res.json(failedMsg);
                }
            }).catch((err)=> {
                console.error(err);
                console.error(err.stack);
                failedMsg.message = err.message;
                res.json(failedMsg);
            });
        }
    )
    ;
    app.post('/order', function (req, res) {
            let successMsg = {"success": true};
            let failedMsg = {"success": false};
            console.log(req.body);
            req.checkBody(validationSchema);
            let errors = req.validationErrors();
            if (errors) {
                console.error(errors);
                failedMsg.error = new ValidationError('Incorrect fields');
                res.json(failedMsg);
            } else {
                let servicePromise = orderService.createOrder(req.body);
                servicePromise.then((order)=> {
                    successMsg.trackingCode = order.trackingCode;
                    res.json(successMsg)
                }).catch((err)=> {
                    console.error(err);
                    console.error(err.stack);
                    failedMsg.error = err;
                    res.json(failedMsg);
                });
            }
        }
    );
    app.post('/delivered', function (req, res) {
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
    });
    app.get('/history/:fromUsername/:toUsername', function (req, res) {
        let successMsg = {"success": true};
        let failedMsg = {"success": false};
        let servicePromise = historyService.fetchHistoryByReqParams(req.params);
        servicePromise.then((orders)=> {
            successMsg.orders = orders;
            res.json(successMsg);
        }).catch((err)=> {
            console.error(err);
            failedMsg.message = err.message;
            res.json(failedMsg);
        });
    });
}

