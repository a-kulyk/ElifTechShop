'use strict';

//import angular from 'bower_components/angular'
//const angular = require('./bower_components/angular');
//const ngRoute = require('./bower_components/angular-route');
//require('./bower_components/jquery/dist/jquery');
//import angular from 'bower_components/angular';
//import  from 'bower_components/angular-route';
//import  from 'bower_components/jquery/dist/';
// require('./bower_components/angular/angular');
// require('./bower_components/angular-route/angular-route');
// require('./bower_components/jquery/dist/jquery');
const angular = require('./bower_components/angular/angular');
require('./list/list');
require('./error/error');
require('./item/item');
require('./login/login');



angular.module('catalog', [
    'ngRoute',
    'catalog.list',
    'catalog.item',
    'catalog.login',
    'error'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/list'});
}]);
