/**
 * Created by dmytro on 08.07.16.
 */
module.exports = function (app) {
    app.controller('trackOrderCtrl', function ($rootScope, $scope, $http, $window) {
        $rootScope.makeOrderActiveClass = '';
        $rootScope.historyActiveClass = '';
        $rootScope.trackOrderActiveClass = 'active';

        $scope.trackOrder = function () {
            $window.location.href = '#/order_info/' + $scope.trackingCode;
        }
    });
}