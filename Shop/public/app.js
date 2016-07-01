'use strict';

angular.module('catalog', [
    'ngRoute',
    'catalog.list'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/list'});
}]);
