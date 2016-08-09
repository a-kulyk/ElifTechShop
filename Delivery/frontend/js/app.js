/**
 * Created by dmytro on 04.08.16.
 */
var angular = require('angular');
var ngRoute = require('angular-route');
var ngMessages = require('angular-messages');
var pagination = require('angular-utils-pagination');
require('angularjs-acl/dist/acl.js');

var app = angular.module('delivery', [ngRoute, ngMessages, pagination, 'ng-acl']);

require('./config/app-config')(app);
require('./services/order-states-service')(app);
require('./controllers/create-order-controller')(app);
require('./controllers/history-controller')(app);
require('./controllers/order-info-controller')(app);
require('./controllers/track-order-controller')(app);
require('./controllers/login-controller')(app);
require('./controllers/cars-controller')(app);