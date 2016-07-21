angular.module('app').controller('confirmController', ['$scope', '$rootScope', '$location', 'orderService',
    function($scope, $rootScope, $location, orderService) {
        var confirm = this;
        var user = $rootScope.currentUser;

        confirm.address = {
            country: user.address.country,
            city: user.address.city,
            street: user.address.street
        };

        confirm.confirmAddress = function(addr) {
            orderService.setAddress(addr)
                .then(function(resp) {
                    console.log(resp.data);
                });
        };

    }
]);
