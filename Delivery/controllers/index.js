/**
 * Created by dmytro on 29.06.16.
 */
"use strict";
var Order = require('../models/order');
var googleConnector = require('../lib/distance-determiner');
var validationSchema = require('../lib/validation-schema');
var uuid = require('uuid');



module.exports = function (app) {
    app.get('/', function (req, res) {
        res.sendFile('index.html');
    });

    app.get('/order/:id', function (req, res) {
        var successMsg = {"status": "true"};
        var failedMsg = {"status": "false"};
        Order.findOne({trackingCode: req.params.id}, function (err, doc) {
            if (err) {
                res.json(failedMsg);
            } else {
                successMsg.deliveryDate = doc.deliveryDate;
                res.json(successMsg);
            }
        })
    })

    app.post('/order', function (req, res) {
        var successMsg = {"status": "true"};
        var failedMsg = {"status": "false"};
        
        console.log(req.body)
        req.checkBody(validationSchema);

        var errors = req.validationErrors();
        if (errors) {
            console.error(errors);
            res.sendStatus(400);
        } else {
            let p = googleConnector({lat: req.body.from.lat, lng: req.body.from.lng}, {
                lat: req.body.to.lat,
                lng: req.body.to.lng
            });
            p.then(resultJSON=> {
                console.log(resultJSON);
                var estimatedTime = JSON.parse(resultJSON).rows[0].elements[0].duration.value;
                var deliveryDate = new Date(Date.now()
                    + JSON.parse(resultJSON).rows[0].elements[0].duration.value * 1000);
                var order = req.body;
                order.deliveryDate = deliveryDate;
                var trackingCode = uuid.v4();
                order.trackingCode = trackingCode;
                successMsg.estimatedTime = estimatedTime;
                new Order(order).save(function (err, doc) {
                    if (err) {
                        console.error(err);
                        res.json(failedMsg);
                    } else {
                        successMsg.trackingCode = doc.trackingCode;
                        console.log(successMsg);
                        res.json(successMsg);
                    }
                });
            })
        }
    });
}







