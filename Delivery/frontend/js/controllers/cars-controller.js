/**
 * Created by dmytro on 09.08.16.
 */
"use strict";

var moment = require('moment');

module.exports = function (app) {
    app.controller('carsCtrl', function ($rootScope, $scope, $http, $window) {
        loadTable();
        $scope.formatDate = function (date) {
            return moment(date).format('DD.MM.YY, HH:mm');
        }
        $scope.redirectToOrder = function (order) {
            $http.get('/order/id/' + order).success(function (data) {
                if (data.success) {
                    $window.location.href = '#/order_info/' + data.trackingCode;
                }
            });
        };
        $scope.deactivateCar = function (car) {
            $http.post("/deactivate_car", {"id": car._id}).success(function (data) {
                console.log("deactivated: "+data.success);
                loadTable();
            });
        }
        $scope.activateCar=function (car) {
            $http.post("/activate_car", {"id": car._id}).success(function (data) {
                console.log("activated: "+data.success);
                loadTable();
            });
        }
        function loadTable() {
            $http.get('/cars').success(function (data, status, headers) {
                $scope.isTableVisible = data.cars.length;
                console.log(data);
                $scope.cars = data.cars;
            });
        }
    })
}