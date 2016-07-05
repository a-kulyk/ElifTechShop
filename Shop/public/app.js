'use strict';

angular.module('catalog', [
    'ngRoute',
    'catalog.list',
    'catalog.item',
    'error'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/list'});
}]);
