/**
 * Created by dmytro on 29.06.16.
 */
"use strict";
let validationSchema = require('../common/validation-schema');
let orderService = require('../services/order-service');
let emailSender=require('../lib/email-sender');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.sendFile('index.html');
    });

    app.get('/order/:id', function (req, res) {
            let successMsg = {"success": "true"};
            let failedMsg = {"success": "false"};
            let servicePromise = orderService.findByTrackingCode(req.params.id);
            servicePromise.then((order)=> {
                if (order != null) {
                    successMsg.estimatedTime = order.estimatedTime;
                    successMsg.state = order.state;
                    successMsg.from = order.from;
                    successMsg.to = order.to;
                    res.json(successMsg);
                } else {
                    res.json(failedMsg);
                }
            }).catch((err)=> {
                console.error(err);
                failedMsg.message = err.message;
                res.json(failedMsg);
            });
        }
    )
    ;
    app.post('/order', function (req, res) {
            let successMsg = {"success": "true"};
            let failedMsg = {"success": "false"};
            req.checkBody(validationSchema);
            let errors = req.validationErrors();
            if (errors) {
                console.error(errors);
                res.json(failedMsg);
            } else {
                let servicePromise = orderService.createOrder(req.body);
                servicePromise.then((order)=> {
                    successMsg.estimatedTime = order.estimatedTime;
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
    app.post('/delivered',function (req,res) {
        let successMsg = {"success": "true"};
        let failedMsg = {"success": "false"};
        let ordersArray=req.body;
        for(let i=0;i<ordersArray.length;i++){
            let servicePromise = orderService.findById(ordersArray[i]);
            servicePromise.then((order)=>{
                emailSender.notifyAboutDelivery(order.to.username);
                console.log(order.to.username);
            }).catch((err)=> {
                console.error(err);
            });
        }

        res.json(successMsg);
    })
}







