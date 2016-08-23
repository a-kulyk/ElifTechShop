/**
 * Created by dmytro on 08.08.16.
 */
"use strict";
module.exports = function (app) {
    app.controller('loginCtrl', function ($rootScope, $scope, $http, $window, AclService, config) {
        $scope.login = function () {
            var requestJSON = {};
            requestJSON.username = $scope.username;
            requestJSON.password = $scope.password;
            $http.post("/login", requestJSON).success(function (data) {
                if (data.success) {
                    config.role = 'admin';//for otherwise routing
                    var admin = {
                        getRoles: function () {
                            return ['admin'];
                        },
                    };
                    AclService.setUserIdentity(admin);
                    $window.location.href = '#/cars'
                } else {
                    console.log(data);
                    $scope.accessError = true;
                }
            }).error(function (data, status) {
                console.log(status + ' ' + data);
            });
        }
    });
}