'use strict';

const ngRoute = require('../bower_components/angular-route');

angular.module('catalog.login', [ngRoute, 'service.error'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'loginCtrl'
        });
    }])
    .controller('loginCtrl', function($scope, $http, errorService, $location) {
        $scope.form = {};

        $scope.submit = function() {
            $http.post('/login', $scope.form)
                .success(function (data) {
                    if(data.success) {
                        $location.path('/list');
                    } else {
                        if(data.error.type === 'AuthError') {
                            $scope.errorMsg = data.error.message;//ToDo: too deep
                            return;
                        }
                        errorService.error(data.error);
                    }
                }).error(function (data) {
                console.log(data);
                errorService.error({
                    name: "Request failed",
                    message: "Request failed"
                });
            });
        };
    });