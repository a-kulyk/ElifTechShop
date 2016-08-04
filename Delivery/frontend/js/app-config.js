/**
 * Created by dmytro on 04.08.16.
 */
"use strict";
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
    })/*.run(function ($rootScope) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            switch (next.templateUrl) {
                case 'templates/track-order.html':
                    require.ensure(['./controllers/track-order-controller'], function () {
                        require('./controllers/track-order-controller')(app);
                    })
            }
        });
    })*/
}