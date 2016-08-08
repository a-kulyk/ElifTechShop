/**
 * Created by dmytro on 08.08.16.
 */
'use strict';
let historyService = require('../services/history-service');

exports.get = function (req, res) {
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
}