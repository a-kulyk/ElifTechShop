angular.module('app').controller('ConfirmCtrl', ['$scope', '$rootScope', '$location', 'orderService', '$uibModal',
    function($scope, $rootScope, $location, orderService, $uibModal) {
        var confirm = this;
        var user = $rootScope.currentUser;

        confirm.address = user.address.str;

        confirm.ok = function() {
            var lat, lng;
            if (confirm.mylat) {
                lat = confirm.mylat;
                lng = confirm.mylng;
            } else {
                lat = user.address.lat;
                lng = user.address.lng;
            }

            orderService.setAddress({ str: confirm.address, lat: lat, lng: lng })
                .then(function(resp) {
                    confirm.track = resp.data.trackingCode;
                    $rootScope.shoppingCart = null;
                    return confirm.track;
                })
                .then(function(track) {
                    return orderService.getDeliveryTime(track);
                })
                .then(function(resp) {
                    if (resp.data.success) {
                        var arrivalTime = resp.data.arrivalTime;
                    }
                    $uibModal.open({
                        templateUrl: './app/order/modals/finalPage.html',
                        controller: function($uibModalInstance, $scope, arrivalTime) {
                            $scope.track = confirm.track;
                            $scope.arrivalTime = arrivalTime;
                            $scope.close = function() {
                                $location.path('/');
                                $uibModalInstance.close();
                            };
                            $scope.$on('modal.closing', function() {
                                $location.path('/');
                            });
                        },
                        resolve: {
                            arrivalTime: function() {
                                return arrivalTime;
                            }
                        }
                    });
                });
        };
    }
]);
