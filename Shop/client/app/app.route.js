var myApp = angular.module('app', ['ngRoute','ui-rangeSlider', 'ngAnimate', 'ui.bootstrap','ui.select2']);


myApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/main.html',
            access: { restricted: true }
        })
        .when('/login', {
            templateUrl: './app/auth/login.html',
            controller: 'loginController',
            access: { restricted: false }
        })
        .when('/logout', {
            controller: 'logoutController',
            access: { restricted: true }
        })
        .when('/register', {
            templateUrl: './app/auth/register.html',
            controller: 'registerController',
            access: { restricted: false }
        })
        .when('/product/:id', {
            templateUrl: './app/catalog/product/productShowView.html',
            controller: 'ProductShowController',
            controllerAs: 'product',
            access: { restricted: true }
        })
        .when('/category/:name', {
            templateUrl: './app/catalog/categories/categoryShowView.html',
            controller: 'CategoryShowController',
            controllerAs: 'categories',
            access: {restricted: true}
        })
        .when('/filter/', {
            templateUrl: './app/catalog/filter/filterView.html',
            controller: 'FilterItemsController',
            controllerAs: 'product',
            access: {restricted: true}
        })
        .when('/order/cart', {
            templateUrl: './app/order/shoppingCart.html',
            controller: 'OrderController',
            controllerAs: 'order',
            access: { restricted: true }
        })
        .when('/confirmAddress', {
            templateUrl: './app/order/confirmAddress.html',
            controller: 'ConfirmCtrl',
            controllerAs: 'confirm',
            access: {restricted: true}
        })
        .when('/order/all', {
            templateUrl: './app/order/history.html',
            controller: 'HistoryCtrl',
            controllerAs: 'history',
            access: { restricted: true }
        })
        .when('/order/:id', {
            templateUrl: './app/order/orderDetail.html',
            controller: 'OrderDetailController',
            controllerAs: 'detail',
            access: { restricted: true }
        })
        .otherwise({
            redirectTo: '/'
        });
    })
    .run(function($rootScope, $location, $route, AuthService) {
        $rootScope.$on('$routeChangeStart',
            function(event, next, current) {
                AuthService.getUserStatus()
                    .then(function() {
                        if (next.access !== undefined && next.access.restricted && !AuthService.isLoggedIn()) {
                            $location.path('/login');
                            $route.reload();
                        }
                    });
            });
    });
