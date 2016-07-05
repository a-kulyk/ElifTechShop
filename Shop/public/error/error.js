'use strict';

angular.module('error', ['ngRoute', 'service.error'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/error', {
            templateUrl: 'error/error.html',
            controller: 'errorCtrl'
        });
    }])

    .controller('errorCtrl', function($scope, errorService) {
        $scope.error = errorService.getError();
    });