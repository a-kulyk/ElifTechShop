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
            updateCart: function(itemId) {
                return $http({
                    method: 'PUT',
                    url: '/order/update',
                    data: { itemId: itemId }
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
            },
            pay: function(obj) {
                return $http({
                    method: 'POST',
                    url: 'http://localhost:3001/transaction',
                    data: obj,
                    dataType:JSON
                });
            }
        };
    }
]);