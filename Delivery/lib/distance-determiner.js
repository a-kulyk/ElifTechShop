/**
 * Created by dmytro on 03.07.16.
 */
var https = require('https');
var config = require('../config');

module.exports = function (from, to) {
    return new Promise((resolve, reject)=> {
        var googleRequestOptions = {
            host: config.get('googleApi:host'),
            path: config.get('googleApi:path') + 'origins=' + from.lat + ',' + from.lng +
            '&destinations=' + to.lat + ',' + to.lng + '&key=' + config.get('googleApi:key')
        }
        https.request(googleRequestOptions, (response)=> {
            var str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                resolve(str);
            });
        }).end();
    });
}

