/**
 * Created by dmytro on 09.08.16.
 */
'use strict'
let carService = require('../services/car-service');

exports.get = function (req, res) {
    let successMsg = {"success": true};
    let failedMsg = {"success": false};
    carService.findAll()
        .then((cars)=> {
            successMsg.cars = cars;
            res.json(successMsg);
        }).catch((err)=> {
        console.error(err);
        failedMsg.message = err.message;
        res.json(failedMsg);
    })
}

exports.deactivateCar = function (req, res) {
    let successMsg = {"success": true};
    let failedMsg = {"success": false};
    console.log(req.body.id);
    carService.deactivateById(req.body.id).then(()=> {
        res.json(successMsg);
    }).catch(err=> {
        console.log(err);
        res.json(failedMsg);
    })
}