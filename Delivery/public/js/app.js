/**
 * Created by dmytro on 02.07.16.
 */
var app = angular.module('delivery', ['ngRoute', 'ngMessages']);
app.config(function ($routeProvider) {
    $routeProvider.when('/create_order', {
        templateUrl: 'templates/create-order.html',
        controller: 'createOrderCtrl'
    }).when('/', {
        templateUrl: 'templates/track-order.html',
        controller: 'trackOrderCtrl'
    }).when('/delivery_time/:trackingCode', {
        templateUrl: 'templates/time-output.html',
        controller: 'timeOutputCtrl'
    }).when('/history',{
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
    });
});