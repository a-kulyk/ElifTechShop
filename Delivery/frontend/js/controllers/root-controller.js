/**
 * Created by dmytro on 11.08.16.
 */
"use strict";
module.exports = function (app) {
    app.controller('rootCtrl', ['$scope', '$http', 'AclService', '$location', 'config',
        function ($scope, $http, AclService, $location, config) {
            $scope.can = AclService.can;
            $scope.logout = function () {
                $http.post('/logout', {}).success(function (data, status, headers) {
                    console.log('logout complete');
                });
                console.log('logout');
                config.role = 'guest';//for otherwise routing
                AclService.setUserIdentity({
                    getRoles: function () {
                        return ['guest'];
                    }
                });
            }
            $scope.isActive = function (viewLocation) {
                return $location.path().startsWith(viewLocation);
            }
        }])
}