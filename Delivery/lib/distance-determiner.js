/**
 * Created by dmytro on 03.07.16.
 */
var https = require('https');
var config = require('../config');
var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

module.exports = function (from, to) {
    determineDistance(from, to);
    return emitter;
}

function determineDistance(from, to) {
    var googleRequestOptions = {
        host: config.get('googleApi:host'),
        path: config.get('googleApi:path') + 'origins=' + from.lat + ',' + from.lng +
        '&destinations=' + to.lat + ',' + to.lng + '&key=' + config.get('googleApi:key')
    }

    https.request(googleRequestOptions, callback).end();
}
var callback = function (response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });
    response.on('end', function () {
        emitter.emit('resultIsReady', str);
    });
}

