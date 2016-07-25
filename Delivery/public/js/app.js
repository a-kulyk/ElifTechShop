/**
 * Created by dmytro on 02.07.16.
 */
var app = angular.module('delivery', ['ngRoute', 'ngMessages', 'angularUtils.directives.dirPagination']);
app.config(function ($routeProvider) {
    $routeProvider.when('/create_order', {
        templateUrl: 'templates/create-order.html',
        controller: 'createOrderCtrl'
    }).when('/', {
        templateUrl: 'templates/track-order.html',
        controller: 'trackOrderCtrl'
    }).when('/order_info/:trackingCode', {
        templateUrl: 'templates/order-info.html',
        controller: 'timeOutputCtrl'
    }).when('/history', {
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
    }).when('/history/:fromUsername/:toUsername', {
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
    })
});