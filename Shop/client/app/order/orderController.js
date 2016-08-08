angular.module('app')
    .filter('moment', function() {
        return function(dateString) {
            return moment(dateString).format("D MMMM YYYY, HH:mm");
        };
    })
    .controller('OrderController', ['$rootScope', '$location', '$timeout', 'orderService',
        function($rootScope, $location, $timeout, orderService) {
            var order = this;

            orderService.getCart()
                .then(function(response) {
                    $rootScope.shoppingCart = response.data;
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

            order.doTheBack = function() {
                window.history.back();
            };
            // var transaction = {
            //     from: '5793b140faa67ed10cf2bb4e',
            //     to: '5794fcc5c5421ff81b0b8c5e',
            //     amount: $rootScope.shoppingCart.total
            // };

            order.pay = function(amount) {
                orderService.pay(amount)
                    .then(function(bank_resp) {
                        console.log("bank_resp : ", bank_resp);
                    });
                orderService.saveOrderDetails()
                    .then(function(resp) {
                        console.log("resp : ", resp);
                        order.SuccessPayment = true;
                        $timeout(function() {
                            $location.path('/confirmAddress');
                        }, 1000);
                         
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
