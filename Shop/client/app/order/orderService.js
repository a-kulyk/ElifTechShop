angular.module('app').factory('orderService', ['$q', '$http', '$rootScope',
    function($q, $http, $rootScope) {
        return {
            getCart: function() {
                return $http({
                    method: 'GET',
                    url: "/order/cart"
                });
            },
            createCart: function(cart) {
                return $http({
                    method: 'POST',
                    url: '/order/create',
                    data: cart
                });
            },
            addToCart: function(cart) {
                return $http({
                    method: 'PUT',
                    url: '/order/addToCart',
                    data: cart
                });
            },
            updQuantity: function(itemId, quantity) {
                return $http({
                    method: 'PUT',
                    url: '/order/updateQuantity',
                    data: { itemId, quantity }
                });
            },
            removeItem: function(itemId) {
                return $http({
                    method: 'PUT',
                    url: '/order/removeItem',
                    data: { itemId: itemId }
                });
            },
            pay: function() {
                return $http({
                    method: 'GET',
                    url: '/order/pay'
                });
            },
            saveOrderDetails: function(cart) {
                return $http({
                    method: 'PUT',
                    url: '/order/saveOrderDetails'
                });
            },
            setAddress: function(addr) {
                return $http({
                    method: 'PUT',
                    url: '/order/setAddress',
                    data: addr
                });
            },
            all: function() {
                return $http({
                    method: 'GET',
                    url: "/order/all/"
                });
            },
            getOne: function(id) {
                return $http({
                    method: 'GET',
                    url: "/order/" + id
                });
            },
            delete: function() {
                return $http({
                    method: 'DELETE',
                    url: "/order/remove"
                });
            }
        };
    }
]);