'use strict';

//import angular from 'bower_components/angular'
const angular = require('./bower_components/angular');
const ngRoute = require('./bower_components/angular-route');
require('./bower_components/jquery/dist/jquery');
//import angular from 'bower_components/angular';
//import  from 'bower_components/angular-route';
//import  from 'bower_components/jquery/dist/';

require('./list/list');
require('./error/error');
require('./item/item');


angular.module('catalog', [
    ngRoute,
    'catalog.list',
    'catalog.item',
    'error'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/list'});
}]);
