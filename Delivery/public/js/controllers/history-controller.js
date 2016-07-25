/**
 * Created by dmytro on 24.07.16.
 */
"use strict"
app.controller('historyCtrl', function ($rootScope, $scope, $http, $window, $routeParams) {
        $rootScope.makeOrderActiveClass = '';
        $rootScope.trackOrderActiveClass = '';
        $rootScope.historyActiveClass = 'active';

        if ($routeParams.fromUsername && $routeParams.toUsername) {
            $scope.fromUsername = $routeParams.fromUsername !== 'null' ? $routeParams.fromUsername : '';
            $scope.toUsername = $routeParams.toUsername !== 'null' ? $routeParams.toUsername : '';
            $http.get('/history/' + $routeParams.fromUsername + '/'
                + $routeParams.toUsername).success(function (data, status, headers) {
                $scope.isTableVisible = data.orders.length;
                console.log(data);
                $scope.orders = data.orders;
            });
        }
        $scope.showHistory = function () {
            var url = '#/history/';
            url += $scope.fromUsername ? $scope.fromUsername : null;
            url += '/';
            url += $scope.toUsername ? $scope.toUsername : null;
            console.log(url);
            $window.location.href = url;
        }
        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;
            $scope.reverse = !$scope.reverse;
        }
        $scope.redirectToOrder = function (trackingCode) {
            $window.location.href = '#/order_info/' + trackingCode
        }
    }
);