/**
 * Created by dmytro on 04.08.16.
 */
var angular = require('angular');
var app = angular.module('delivery', [require('angular-route'), require('angular-messages'),
    require('angular-utils-pagination')]);
require('./config/app-config')(app);
require('./services/order-states-service')(app);
require('./controllers/create-order-controller')(app);
require('./controllers/history-controller')(app);
require('./controllers/order-info-controller')(app);
require('./controllers/track-order-controller')(app);
require('./controllers/login-controller')(app);

