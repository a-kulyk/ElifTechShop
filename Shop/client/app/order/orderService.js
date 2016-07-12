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
            updateCart: function(id, item) {
                return $http({
                    method: 'PUT',
                    url: '/order/update',
                    data: {
                        cartId: id,
                        itemSet: {
                            productId: item._id,
                            quantity: 1
                        }
                    }
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
            }
        };
    }
]);
