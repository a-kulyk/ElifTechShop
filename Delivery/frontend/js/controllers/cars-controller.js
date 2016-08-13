/**
 * Created by dmytro on 09.08.16.
 */
"use strict";

var moment = require('moment');

module.exports = function (app) {
    app.controller('carsCtrl', function ($rootScope, $scope, $http, $window) {
        $http.get('/cars').success(function (data, status, headers) {
            $scope.isTableVisible = data.cars.length;
            console.log(data);
            $scope.cars = data.cars;
            $scope.formatDate = function (date) {
                return moment(date).format('DD.MM.YY, HH:mm');
            }

            $scope.redirectToOrder = function (order) {
                $http.get('/order/id/' + order).success(function (data, status, headers) {
                    if(data.success){
                        $window.location.href = '#/order_info/' + data.trackingCode;
                    }
                });
            }
        });
    })
}