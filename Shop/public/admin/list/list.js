'use strict';

angular.module('adminCatalog.list', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'listCtrl'
        });
    }])

    .controller('listCtrl', function($scope, $http) {
        $http.get('/admin/items')
            .success(function (data) {
                $scope.items = data.items;//ToDo: if fail
            }).error(function (data) {
                console.log(data);
            });
    });