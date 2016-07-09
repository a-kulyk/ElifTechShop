/**
 * Created by dmytro on 08.07.16.
 */
app.controller('trackOrderCtrl', function ($rootScope, $scope, $http, $window) {
    $rootScope.makeOrderActiveClass = '';
    $rootScope.trackOrderActiveClass = 'active';
    $rootScope.panelTitle = 'Track';

    $scope.trackOrder = function () {
        $window.location.href = '#/delivery_time/' + $scope.trackingCode;
    }
})
;