angular.module('app')
    .filter('moment', function() {
        return function(dateString) {
            return moment(dateString).format("D MMMM YYYY, HH:mm");
        };
    })
    .controller('OrderController', ['$rootScope', '$location', 'orderService',
        function($rootScope, $location, orderService) {
            var order = this;

            orderService.getCart()
                .then(function(response) {
                    $rootScope.shoppingCart = response.data;
                    // order.timeCreated = moment($rootScope.shoppingCart.order.created).format("D MMMM YYYY, HH:mm");
                });

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

            // var transaction = {
            //     from: '5793b140faa67ed10cf2bb4e',
            //     to: '5794fcc5c5421ff81b0b8c5e',
            //     amount: $rootScope.shoppingCart.total
            // };

            order.pay = function(transaction) {
                // orderService.pay(transaction)
                // .then(function(bank_resp) {
                //     console.log("bank_resp : ", bank_resp);
                // });
                orderService.saveOrderDetails()
                    .then(function(resp) {
                        console.log("resp : ", resp);
                    });
            };

        }
    ])
    .controller('HistoryCtrl',['orderService', function(orderService) {
        var history = this;
        orderService.all()
            .then(function(resp) {
                history.allOrders = resp.data;

            });
        }
    ])
    .controller('OrderDetailController',[ '$route', 'orderService',
        function($route, orderService) {
            var detail = this;

            orderService.getOne($route.current.params.id)
                .then(function(resp) {
                    detail.order = resp.data;
                    console.log('resp: ', resp);
                });
    }]);
