/**
 * Created by dmytro on 08.08.16.
 */
'use strict';
let historyService = require('../services/history-service');
let responseFactory = require('../common/response-factory');

exports.get = function (req, res) {
    let successMsg = responseFactory.successMessage();
    let failedMsg = responseFactory.failedMessage();
    let servicePromise = historyService.fetchHistoryByReqParams(req.params);
    servicePromise.then((orders)=> {
        successMsg.orders = orders;
        res.json(successMsg);
    }).catch((err)=> {
        console.error(err);
        failedMsg.message = err.message;
        res.json(failedMsg);
    });
}