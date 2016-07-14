angular.module('app').factory('orderService', ['$q', '$http',
    function($q, $http) {
        return {
            createCart: function(item) {
                return $http({
                    method: 'POST',
                    url: '/order/create',
                    data: item
                });
            },
            addToCart: function(id, item) {
                return $http({
                    method: 'PUT',
                    url: '/order/addToCart',
                    data: {
                        cartId: id,
                        itemSet: {
                            productId: item._id,
                            quantity: 1
                        }
                    }
                });
            },
            updateCart: function(id, itemSet) {
                return $http({
                    method: 'PUT',
                    url: '/order/update',
                    data: {
                        cartId: id,
                        itemSet: itemSet
                    }
                });
            },
            getCart: function() {
                return $http({
                    method: 'GET',
                    url: "/order/cart"
                });
            },
            all: function(object) {
                return $http({
                    method: 'GET',
                    url: "/order/all/",
                    params: object,
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            order: function(id) {
                return $http({
                    method: 'GET',
                    url: "/order/" + id
                });
            },
            delete: function(id) {
                return $http({
                    method: 'delete',
                    url: "/order/" + id
                });
            }
        };
    }
]);
