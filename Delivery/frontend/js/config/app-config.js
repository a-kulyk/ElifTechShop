/**
 * Created by dmytro on 04.08.16.
 */
"use strict";
module.exports = function (app) {
    app.config(function ($routeProvider) {
        $routeProvider.when('/create_order', {
            templateUrl: '../templates/create-order.html',
            controller: 'createOrderCtrl'
        }).when('/', {
            templateUrl: '../templates/track-order.html',
            controller: 'trackOrderCtrl'
        }).when('/order_info/:trackingCode', {
            templateUrl: '../templates/order-info.html',
            controller: 'timeOutputCtrl'
        }).when('/history', {
            templateUrl: '../templates/history.html',
            controller: 'historyCtrl',
        }).when('/history/:fromUsername/:toUsername', {
            templateUrl: '../templates/history.html',
            controller: 'historyCtrl'
        }).when('/login', {
            templateUrl: '../templates/login.html',
            controller: 'loginCtrl'
        }).when('/cars', {
            templateUrl: '../templates/cars.html',
            controller: 'carsCtrl',
            resolve: {
                'acl': ['$q', 'AclService', function ($q, AclService) {
                    if (AclService.can('Cars')) {
                        return true;
                    } else {
                        return $q.reject('Unauthorized');
                    }
                }]
            }
        })
    }).run(['$rootScope', 'AclService', function ($rootScope, AclService) {
        AclService.addRole('guest');
        AclService.addRole('admin');

        AclService.addResource('Order');
        AclService.addResource('Cars');
        AclService.addResource('Login');
        AclService.addResource('Logout');

        AclService.allow('guest', 'Order');
        AclService.allow('guest', 'Login');

        AclService.allow('admin', 'Cars');
        AclService.allow('admin', 'Logout');

        AclService.setUserIdentity({
            getRoles: function () {
                return ['guest'];
            }
        });
    }]);
}