'use strict';

const ngRoute = require('../bower_components/angular-route');

angular.module('error', [ngRoute, 'service.error'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/error', {
            template: require('./error.html'),
            controller: 'errorCtrl'
        });
    }])

    .controller('errorCtrl', function($scope, errorService) {
        $scope.error = errorService.getError();
    });