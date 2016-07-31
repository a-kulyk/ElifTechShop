/**
 * Created by dmytro on 03.07.16.
 */
"use strict";
let request = require('request');
let config = require('../config');

module.exports = function (from, to) {
    return new Promise((resolve, reject)=> {
        let url = 'https://' + config.get('googleApi:host') + config.get('googleApi:path') + 'origins=' + from.lat + ',' + from.lng +
            '&destinations=' + to.lat + ',' + to.lng + '&key=' + config.get('googleApi:key');
        request(url, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }
            resolve(body);
        });
    });
}
