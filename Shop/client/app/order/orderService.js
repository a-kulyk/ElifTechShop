angular.module('app').factory('orderService', ['$q', '$http', '$rootScope',
    function($q, $http, $rootScope) {
        return {
            getCart: function() {
                return $http({
                    method: 'GET',
                    url: "/order/cart"
                });
            },
            createCart: function(itemId) {
                return $http({
                    method: 'POST',
                    url: '/order/create',
                    data: { itemId: itemId }
                });
            },
            addToCart: function(itemId) {
                return $http({
                    method: 'PUT',
                    url: '/order/addToCart',
                    data: { itemId: itemId }
                });
            },
            updateCart: function(itemId) {
                return $http({
                    method: 'PUT',
                    url: '/order/update',
                    data: { itemId: itemId }
                });
            },
            setAddress: function(addr) {
                return $http({
                    method: 'PUT',
                    url: '/order/setAddress',
                    data: addr
                });
            },
            all: function(object) {
                return $http({
                    method: 'GET',
                    url: "/order/all/"
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
