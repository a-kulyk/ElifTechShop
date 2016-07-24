/**
 * Created by dmytro on 24.07.16.
 */
app.controller('historyCtrl', function ($rootScope, $scope, $http, $window) {
    console.log('history')
    $rootScope.makeOrderActiveClass = '';
    $rootScope.trackOrderActiveClass = '';
    $rootScope.historyActiveClass = 'active';
    $rootScope.panelTitle = 'History';
});