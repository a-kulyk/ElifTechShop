'use strict';

// const ngRoute = require('../bower_components/angular-route');
const angular = require('../bower_components/angular/angular');

require('../service/errorService');

angular.module('catalog.list', ['ngRoute', 'service.error'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'listCtrl'
        });
    }])

    .controller('listCtrl', function($scope, $http, errorService) {
        $http.get('/items')
            .success(function (data) {
                if(data.success) {
                    $scope.items = data.items;
                } else {
                    errorService.error(data.error);
                }
            }).error(function () {
                errorService.error({
                    name: 'Request failed',
                    message: 'Request failed'
                });
            });
    });