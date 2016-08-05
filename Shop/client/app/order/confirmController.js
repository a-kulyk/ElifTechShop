angular.module('app').controller('ConfirmCtrl', ['$scope', '$rootScope', '$location', 'orderService',
    function($scope, $rootScope, $location, orderService) {
        var confirm = this;
        var user = $rootScope.currentUser;

        confirm.address = user.address.str;

        confirm.ok = function() {
            var lat,lng;
            if (confirm.mylat) {
                lat = confirm.mylat;
                lng = confirm.mylng;
            } else {
                lat = user.address.lat;
                lng = user.address.lng;
            }
            orderService.setAddress({str: confirm.address, lat: lat, lng: lng})
                .then(function(resp) {
                    console.log(resp.data);
                    
                });
        };

        // confirm.doTheBack = function() {
        //   window.history.back();
        // };
    }
]);
