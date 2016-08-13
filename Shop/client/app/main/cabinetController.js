angular.module('app').controller('CabinetCtrl',
    ['$scope', '$rootScope', '$location', 'AuthService', '$uibModal',
    function($scope, $rootScope, $location, AuthService, $uibModal) {
        var cabinet = this;
        cabinet.user = $rootScope.currentUser;

        cabinet.edit = false;

        cabinet.update = function (user) {
            AuthService.updateProfile(user)
                .then(function(resp) {
                    $rootScope.currentUser = resp.data;
                    cabinet.edit = !cabinet.edit;
                })
        } 
       
    }
]);