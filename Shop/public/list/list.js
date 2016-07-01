'use strict';

angular.module('catalog.list', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'listCtrl'
        });
    }])

    .controller('listCtrl', function($scope, $http) {
        $http.get('/items')
            .success(function (data) {
                $scope.items = data.items;//ToDo: if fail
            }).error(function (data) {
                console.log(data);
            });
    });