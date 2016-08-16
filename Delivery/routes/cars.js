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
    carService.findAllActive().then(cars=> {
        if (cars.length == 1) {
            throw new Error('cannot deactivate last car');
        }
        else {
            carService.deactivateById(req.body.id).then(()=> {
                res.json(successMsg);
            }).catch(err=> {
                throw err;
            })
        }
    })
        .catch(err=> {
            console.log(err);
            res.json(failedMsg);
        })
}
exports.activateCar = function (req, res) {
    let successMsg = {"success": true};
    let failedMsg = {"success": false};
    carService.findById(req.body.id).then(car=> {
        console.log('avail: ' + car.isAvailable)
        if (car.isAvailable) {
            carService.activateByIdAsAvailable(req.body.id).then(()=> {
                res.json(successMsg);
            }).catch(err=> {
                throw err;
                //res.json(failedMsg);
            })
        } else {
            carService.activateByIdAsNotAvailable(req.body.id).then(()=> {
                res.json(successMsg);
            }).catch(err=> {
                throw err;
            })

        }
    }).catch(err=> {
        console.log(err);
        res.json(failedMsg);
    })

}