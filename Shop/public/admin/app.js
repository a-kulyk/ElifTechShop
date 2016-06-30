'use strict';

angular.module('adminCatalog', [
    'ngRoute',
    'adminCatalog.list'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/list'});
}]);
