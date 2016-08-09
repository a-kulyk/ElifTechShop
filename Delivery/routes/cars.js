/**
 * Created by dmytro on 09.08.16.
 */
'use strict'
let carService = require('../services/car-service');

exports.get = function (req, res) {
    let successMsg = {"success": true};
    let failedMsg = {"success": false};
    console.log(req.session.user);
    if (req.session.user == 'admin') {
        carService.findAll()
            .then((cars)=> {
                successMsg.cars = cars;
                res.json(successMsg);
            }).catch((err)=> {
            console.error(err);
            failedMsg.message = err.message;
            res.json(failedMsg);
        })
    } else {
        failedMsg.message = 'AccessDenied'
        res.json(failedMsg);
    }
}