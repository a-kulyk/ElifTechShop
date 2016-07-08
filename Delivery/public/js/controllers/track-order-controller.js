/**
 * Created by dmytro on 08.07.16.
 */
app.controller('trackOrderCtrl', function ($rootScope, $scope, $http) {
    $rootScope.makeOrderActiveClass = '';
    $rootScope.trackOrderActiveClass = 'active';
    $rootScope.panelTitle = 'Track';

    $scope.trackOrder = function () {
        $http.get('/order/' + $scope.trackingCode).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        });
    }
})
;