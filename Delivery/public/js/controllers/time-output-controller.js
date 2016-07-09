/**
 * Created by dmytro on 09.07.16.
 */
app.controller('timeOutputCtrl', function ($rootScope, $scope, $routeParams, $http) {
    $rootScope.panelTitle = 'Order info';
    $scope.trackingCode = $routeParams.trackingCode;
    $http.get('/order/' + $routeParams.trackingCode).success(function (data, status, headers) {
        $scope.deliveryDate = data.deliveryDate;
        console.log(data)
    }).error(function (data, status, headers) {
        console.log('error');
    })
});