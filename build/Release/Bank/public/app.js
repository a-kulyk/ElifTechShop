require('jquery/src/jquery');
require('bootstrap-webpack');
require("./stylesheets/style.css");
var angular = require('angular');
var ngRoute = require('angular-route');
var angularModalService = require('angular-modal-service');
var ngTable = require('ng-table');
var cabinet = require('./cabinet/cabinet');
var home = require('./home/auth');
var login = require('./home/login');
var signup = require('./home/signup');
var modal = require('./modals/modal');
var main = require('./mainController');
var bank = angular.module('bank',['ngRoute', 'angularModalService', 'ngTable']);

bank.config(function ($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl: "home/auth.html"
        })
        .when('/cabinet',{
            templateUrl: "cabinet/cabinet.html"
        })
        .otherwise({
            redirectTo: "/"
        })
});


main(bank);
cabinet(bank);
home(bank);
login(bank);
signup(bank);
modal(bank);