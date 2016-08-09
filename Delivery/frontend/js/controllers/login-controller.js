/**
 * Created by dmytro on 08.08.16.
 */
"use strict";
module.exports = function (app) {
    app.controller('loginCtrl', function ($rootScope, $scope, $http, $window) {
        $scope.login = function () {
            var requestJSON = {};
            requestJSON.username = $scope.username;
            requestJSON.password = $scope.password;
            console.log(requestJSON.username + " " + requestJSON.password);
            $http.post("/login", requestJSON).success(function (data, status, headers) {
                console.log(data);
                if (data.success) {
                    $window.location.href = '#/cars'
                } else {
                    console.log(data.error);
                }
            }).error(function (data, status, headers) {
                console.log(status);
            });
        }
    });
}