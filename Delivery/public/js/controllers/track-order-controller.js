/**
 * Created by dmytro on 08.07.16.
 */
app.controller('trackOrderCtrl', function ($rootScope, $scope, $http) {
    $rootScope.makeOrderActiveClass = '';
    $rootScope.trackOrderActiveClass = 'active';
    $rootScope.panelTitle = 'Track';
})
;