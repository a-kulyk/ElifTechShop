var angular = require('angular');
var ngRoute = require('angular-route');
var angularModalService = require('angular-modal-service');
var ngTable = require('ng-table');

var bank = angular.module('bank',['ngRoute', 'angularModalService', 'ngTable']);

bank.config(function ($routeProvider) {
  //  $locationProvider.html5Mode(true);
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
    //testing

    // $scope.transaction = function () {
    //     $http.post("/transaction", {
    //         "API_KEY": "d6911f567ef734f18ea176481638cc8a",
    //         "from": "5773d50ef6e5bd063d119d27",
    //         "to": "5773c1b809aaa4fd2f7c4f9e",
    //         "amount": 2
    //     })
    //         .success(function (data) {
    //             console.log(data);
    //         })
    //         .error(function (err) {
    //             console.log(err);
    //         })
    // };

    // $scope.transaction = function () {
    //   $http.get("/history")
    //       .success(function (data) {
    //           $scope.history = [];
    //
    //           for (var transaction in data.transactions) {
    //               // skip loop if the property is from prototype
    //               if (!data.transactions.hasOwnProperty(transaction)) continue;
    //               var obj = data.transactions[transaction];
    //               if(obj.from == obj.to){
    //                   obj.from = "Payment";
    //                   obj.event = "payment";
    //               } else if(obj.from == $scope.id){
    //                   obj.event = "transfer";
    //               } else if(obj.to = $scope.id){
    //                   obj.event = "receive";
    //               }
    //                 $scope.history.push(obj);
    //
    //           }
    //       })
    //       .error(function (err) {
    //           console.log(err);
    //       });
    // };

    // $scope.transaction = function () {
    //
    //     $http({
    //         method: "GET",
    //         url: "/get_transaction",
    //         params:{
    //             "id": "577e43023eff537121910095",
    //             "from": "5773c1b809aaa4fd2f7c4f9e",
    //             "to": "5773d50ef6e5bd063d119d27",
    //             "date": "2016-07-07",
    //             "amount": 2
    //         }
    //     })
    //         .success(function (data) {
    //             console.log(data);
    //         })
    //         .error(function (err) {
    //             console.log(err);
    //         })
    // }
});

module.exports = bank;