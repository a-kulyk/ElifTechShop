/**
 * Created by dmytro on 25.07.16.
 */
"use strict";
let orderService = require('../services/order-service');

exports.fetchHistoryByReqParams = function (reqParams) {
    let queryObject = {};
    if (reqParams.fromUsername !== 'null') {
        queryObject['from.username'] = reqParams.fromUsername;
    }
    if (reqParams.toUsername !== 'null') {
        queryObject['to.username'] = reqParams.toUsername;
    }
    return orderService.findByCriteria(queryObject);
}