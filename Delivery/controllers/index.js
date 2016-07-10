/**
 * Created by dmytro on 29.06.16.
 */
"use strict";
var validationSchema = require('../lib/validation-schema');
var service = require('../services/orders-service');

module.exports = function (app) {
    
    app.get('/', function (req, res) {
        res.sendFile('index.html');
    });

    app.get('/order/:id', function (req, res) {
        var successMsg = {"success": "true"};
        var failedMsg = {"success": "false"};
        let servicePromise = service.findByTrackingCode(req.params.id);
        servicePromise.then((order)=> {
            successMsg.deliveryDate = order.deliveryDate;
            successMsg.from=order.from;
            successMsg.to=order.to;
            res.json(successMsg);
        }).catch((err)=> {
            console.error(err);
            failedMsg.message = err.message;
            res.json(failedMsg);
        });
    });
    app.post('/order', function (req, res) {
            var successMsg = {"success": "true"};
            var failedMsg = {"success": "false"};
            req.checkBody(validationSchema);
            var errors = req.validationErrors();
            if (errors) {
                console.error(errors);
                res.sendStatus(400);
            } else {
                let servicePromise = service.createOrder(req.body);
                servicePromise.then((order)=> {
                    successMsg.deliveryDate = order.deliveryDate;
                    successMsg.trackingCode = order.trackingCode;
                    res.json(successMsg)
                }).catch((err)=> {
                    console.error(err);
                    failedMsg.message = err.message;
                    res.json(failedMsg);
                });
            }
        }
    );
}







