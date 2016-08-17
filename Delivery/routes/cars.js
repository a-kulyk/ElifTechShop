/**
 * Created by dmytro on 09.08.16.
 */
'use strict'
let carService = require('../services/car-service');
let responseFactory = require('../common/response-factory');

exports.get = function (req, res) {
    let successMsg = responseFactory.successMessage();
    let failedMsg = responseFactory.failedMessage();
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
    carService.findAllActive().then(cars=> {
        if (cars.length == 1) {
            throw new Error('cannot deactivate last car');
        }
        else {
            carService.deactivateById(req.body.id).then(()=> {
                res.json(responseFactory.successMessage());
            }).catch(err=> {
                console.log(err);
                res.json(responseFactory.failedMessage());
            })
        }
    })
        .catch(err=> {
            console.log(err);
            res.json(responseFactory.failedMessage());
        })
}
exports.activateCar = function (req, res) {
    carService.findById(req.body.id).then(car=> {
        console.log('avail: ' + car.isAvailable)
        if (car.isAvailable) {
            carService.activateByIdAsAvailable(req.body.id).then(()=> {
                res.json(responseFactory.successMessage());
            }).catch(err=> {
                console.log(err);
                res.json(responseFactory.failedMessage());
            })
        } else {
            carService.activateByIdAsNotAvailable(req.body.id).then(()=> {
                res.json(responseFactory.successMessage());
            }).catch(err=> {
                console.log(err);
                res.json(responseFactory.failedMessage());
            })
        }
    }).catch(err=> {
        console.log(err);
        res.json(responseFactory.failedMessage());
    })

}