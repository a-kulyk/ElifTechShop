'use strict';

angular.module('catalog.list', ['ngRoute', 'service.error'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'listCtrl'
        });
    }])

    .controller('listCtrl', function($scope, $http, errorService, $location) {
        //errorService.error({name: 'ssssss', message: '111111'});
        $http.get('/items')
            .success(function (data) {
                if(data.success) {
                    $scope.items = data.items;
                } else {
                    errorService.error(data.error);
                }
            }).error(function (data, status, headers, config) {
                errorService.error({//ToDO:
                    name: "Request failed",
                    message: "Request failed"
                });
            });
    });