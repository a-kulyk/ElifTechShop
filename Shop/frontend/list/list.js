'use strict';

const ngRoute = require('../bower_components/angular-route');

require('../service/errorService');

angular.module('catalog.list', [ngRoute, 'service.error'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'listCtrl'
        });
    }])

    .controller('listCtrl', function($scope, $http, errorService, $location) {
        $http.get('/items')
            .success(function (data) {
                if(data.success) {
                    $scope.items = data.items;
                } else {
                    errorService.error(data.error);
                }
            }).error(function (data, status, headers, config) {
                errorService.error({
                    name: "Request failed",
                    message: "Request failed"
                });
            });
    });