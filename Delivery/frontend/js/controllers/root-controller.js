/**
 * Created by dmytro on 11.08.16.
 */
"use strict";
module.exports = function (app) {
    app.controller('rootCtrl', ['$scope', '$http', 'AclService', function ($scope, $http, AclService) {
        $scope.can = AclService.can;
        $scope.logout = function () {
            $http.post('/logout', {}).success(function (data, status, headers) {
                console.log('logout complete');
            });
            console.log('logout');
            AclService.setUserIdentity({
                getRoles: function () {
                    return ['guest'];
                }
            });
        }
    }])
}