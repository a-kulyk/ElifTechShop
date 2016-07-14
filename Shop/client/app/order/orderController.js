angular.module('app').controller('orderController', ['$scope', '$location', '$routeParams', 'orderService',
    function($scope, $location, $routeParams, orderService) {
        var order = this;

        orderService.order($routeParams.id)
            .success(function(data) {
                order.current = data.order;
                order.total = data.total;
                console.log(order.current);
            });

        order.removeItem = function(id) {
            var index = -1;
            var itemArr = order.current.itemSet;
            for (var i = 0; i < itemArr.length; i++) {
                if (itemArr[i]._id === id) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                alert("Something gone wrong");
            }
            order.current.itemSet.splice(index, 1);
            console.log(order.current.itemSet);



            var updItemSet = order.current.itemSet.map(function(obj) {
                var newObj = {};
                newObj.productId = obj.productId._id;
                newObj.quantity = obj.quantity;
                return newObj;
            });
            console.log(updItemSet);
            console.log(order.current);

            orderService.updateCart(order.current._id, updItemSet)
                .success(function(data) {
                	console.log(data);
                    order.current = data.order;
                    order.total = data.total;
                    console.log(order.current);
                });

            if (order.current.itemSet.length === 0) {
                orderService.delete(order.current._id);
                order.current = null;
                $location.path("/");
            }
        };



        // order.proceed = function() {
        // 	$location.path('/order/confirmAddress');
        // };



    }
]);
