/**
 * Created by dmytro on 04.08.16.
 */

module.exports = function (app) {
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
}