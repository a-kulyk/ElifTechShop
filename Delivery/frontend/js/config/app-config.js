/**
 * Created by dmytro on 04.08.16.
 */
"use strict";
module.exports = function (app) {
    app.config(function ($routeProvider, config) {
        $routeProvider.when('/create_order', {
            templateUrl: '../templates/create-order.html',
            controller: 'createOrderCtrl'
        }).when('/', {
            templateUrl: '../templates/track-order.html',
            controller: 'trackOrderCtrl',
            resolve: {
                'acl': ['$q', 'AclService', function ($q, AclService) {
                    if (AclService.can('Track')) {
                        return true;
                    } else {
                        return $q.reject('Unauthorized');
                    }
                }]
            }
        }).when('/order_info/:trackingCode', {
            templateUrl: '../templates/order-info.html',
            controller: 'timeOutputCtrl'
        }).when('/history', {
            templateUrl: '../templates/history.html',
            controller: 'historyCtrl',
            resolve: {
                'acl': ['$q', 'AclService', function ($q, AclService) {
                    if (AclService.can('History')) {
                        return true;
                    } else {
                        return $q.reject('Unauthorized');
                    }
                }]
            }
        }).when('/history/:fromUsername/:toUsername', {
            templateUrl: '../templates/history.html',
            controller: 'historyCtrl',
            resolve: {
                'acl': ['$q', 'AclService', function ($q, AclService) {
                    if (AclService.can('History')) {
                        return true;
                    } else {
                        return $q.reject('Unauthorized');
                    }
                }]
            }
        }).when('/login', {
            templateUrl: '../templates/login.html',
            controller: 'loginCtrl',
            resolve: {
                'acl': ['$q', 'AclService', function ($q, AclService) {
                    if (AclService.can('Login')) {
                        return true;
                    } else {
                        return $q.reject('Unauthorized');
                    }
                }]
            }
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
        }).otherwise({
            redirectTo: config.role == 'admin' ? '/cars' : '/'
        });


    }).run(['$rootScope', '$http', 'AclService', 'config', function ($rootScope, $http, AclService, config) {
        AclService.addRole('guest');
        AclService.addRole('admin');

        AclService.addResource('Track');
        AclService.addResource('Order');
        AclService.addResource('Cars');
        AclService.addResource('History');
        AclService.addResource('Login');
        AclService.addResource('Logout');

        AclService.allow('guest', 'Order');
        AclService.allow('guest', 'Login');
        AclService.allow('guest', 'Track');

        AclService.allow('admin', 'History');
        AclService.allow('admin', 'Cars');
        AclService.allow('admin', 'Logout');

        AclService.setUserIdentity({
            getRoles: function () {
                return [config.role];
            }
        });
    }]);
}