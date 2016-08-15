angular.module('app').controller('ModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', 'item', 'orderService',
    function($scope, $rootScope, $uibModalInstance, item, orderService) {
        var modal = this;

        modal.item = item;
        modal.quantity = 1;

        modal.total = function() {
            return modal.item.price * modal.quantity;
        };

        modal.ok = function(cart) {
            if (!$rootScope.shoppingCart) {
                orderService.createCart(cart)
                    .then(function(response) {
                        $rootScope.shoppingCart = response.data;
                    });
            } else {
                orderService.addToCart(cart)
                    .then(function(response) {
                        $rootScope.shoppingCart = response.data;
                    });
            }
            $uibModalInstance.close();
        };

        modal.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
