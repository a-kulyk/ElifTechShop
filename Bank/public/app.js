var angular = require('angular');
var ngRoute = require('angular-route');
var angularModalService = require('angular-modal-service');
var ngTable = require('ng-table');
import cabinet from './cabinet/cabinet';
import home from './home/auth';
import login from './home/login';
import signup from './home/signup';
import modal from './modals/modal';
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

bank.controller('main', function ($scope, $http, $location) {
    $scope.title = "Bank";
    $scope.formData = {};

    $http.get("/user")
        .success(function (data) {
            $scope.username = data.username;
            $scope.id = data.id;
            $scope.amount = data.amount;
        })
        .error(function (error) {
            console.log(error);
        });
});

cabinet(bank);
home(bank);
login(bank);
signup(bank);
modal(bank);

module.exports = bank;