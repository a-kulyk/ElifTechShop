/**
 * Created by dmytro on 08.07.16.
 */
"use strict";
module.exports = function (app) {
    app.controller('trackOrderCtrl', function ($rootScope, $scope, $http, $window) {
        $scope.trackOrder = function () {
            $window.location.href = '#/order_info/' + $scope.trackingCode;
        }
    });
}