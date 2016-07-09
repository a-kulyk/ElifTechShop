/**
 * Created by dmytro on 02.07.16.
 */
var app = angular.module('delivery', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/create-order.html',
        controller: 'createOrderCtrl'
    }).when('/track', {
        templateUrl: 'templates/track-order.html',
        controller: 'trackOrderCtrl'
    }).when('/delivery_time/:trackingCode', {
        templateUrl: 'templates/time-output.html',
        controller: 'timeOutputCtrl'
    });
});
app.run(function ($rootScope) {
    $rootScope.panelTitle = '';
});