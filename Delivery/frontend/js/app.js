/**
 * Created by dmytro on 04.08.16.
 */
var angular = require('angular');
var ngRoute = require('angular-route');
var ngMessages = require('angular-messages');
var pagination = require('angular-utils-pagination');
require('angularjs-acl/dist/acl.js');

var app = angular.module('delivery', [ngRoute, ngMessages, pagination, 'ng-acl']);
fetchData().then(bootstrapApplication);
function fetchData() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");

    return $http.get("/status").then(function (response) {
        console.log(response.data);
        app.constant("config", response.data);
    }, function (errorResponse) {
        console.log(errorResponse);
    });
}
function bootstrapApplication() {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['delivery']);
    });
}


require('./config/app-config')(app);
require('./services/order-states-service')(app);
require('./controllers/root-controller')(app);
require('./controllers/create-order-controller')(app);
require('./controllers/history-controller')(app);
require('./controllers/order-info-controller')(app);
require('./controllers/track-order-controller')(app);
require('./controllers/login-controller')(app);
require('./controllers/cars-controller')(app);
