/**
 * Created by dmytro on 08.08.16.
 */
"use strict";
module.exports = function (app) {
    app.controller('loginCtrl', function ($rootScope, $scope, $http, $window, AclService) {
        $scope.login = function () {
            var requestJSON = {};
            requestJSON.username = $scope.username;
            requestJSON.password = $scope.password;
            console.log(requestJSON.username + " " + requestJSON.password);
            $http.post("/login", requestJSON).success(function (data, status, headers) {
                if (data.success) {
                    console.log(data);
                    var admin = {
                        getRoles: function () {
                            return ['admin'];
                        },
                    };
                    AclService.setUserIdentity(admin);
                    $window.location.href = '#/cars'
                } else {
                    console.log(data);
                }
            }).error(function (data, status, headers) {
                console.log(status + ' ' + data);
            });
        }
    });
}