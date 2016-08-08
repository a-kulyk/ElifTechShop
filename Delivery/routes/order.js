/**
 * Created by dmytro on 08.08.16.
 */
'use strict';

let orderService = require('../services/order-service');
let validationSchema = require('../common/validation-schema');
let ValidationError = require('../common/errors/validation-error');

exports.get = function (req, res) {
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
exports.post = function (req, res) {
    let successMsg = {"success": true};
    let failedMsg = {"success": false};
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