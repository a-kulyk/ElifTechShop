angular.module('app').controller('orderController', ['$scope', '$rootScope', '$location', 'orderService',
    function($scope, $rootScope, $location, orderService) {
        var order = this;
        var user = $rootScope.currentUser;

        if (user) {
            orderService.getCart()
                .then(function(response) {
                    $rootScope.shoppingCart = response.data;

                });
        }

        order.removeItem = function(id) {
            orderService.updateCart(id)
                .then(function(response) {
                    $rootScope.shoppingCart = response.data;
                    if ($rootScope.shoppingCart.order.itemSet.length === 0) {
                        orderService.delete();
                        $rootScope.shoppingCart = null;
                        $location.path("/");
                    }
                });
        };

        order.confirm = function() {
            $location.path('/confirmAddress');
        };

    }
]);
