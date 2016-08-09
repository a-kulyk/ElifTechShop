angular.module('app')
    .filter('moment', function() {
        return function(dateString) {
            return moment(dateString).format("D MMMM YYYY, HH:mm");
        };
    })
    .controller('OrderController', ['$rootScope', '$location', '$timeout', '$uibModal', 'orderService',
        function($rootScope, $location, $timeout, $uibModal, orderService) {
            var order = this;

            orderService.getCart()
                .then(function(response) {
                    $rootScope.shoppingCart = response.data;
                });

            order.updQuantity = function(id, quan) {
                if (quan === 0) { order.removeItem(id); }
                orderService.updQuantity(id, quan)
                    .then(function(response) {
                        $rootScope.shoppingCart = response.data;
                    });
            };

            order.removeItem = function(id) {
                orderService.removeItem(id)
                    .then(function(response) {
                        console.log(response.data);
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

            order.pay = function() {
                orderService.pay()
                    .then(function(bank_resp) {
                        console.log("bank_resp : ", bank_resp.data);
                        if (bank_resp.data.success === true) {
                            saveOrder();
                        } else if (bank_resp.data.success === false) {
                            console.log("Insufficient funds on Your bank account");
                            $uibModal.open({
                                templateUrl: './app/order/modals/paymentFail.html'
                            });
                        } else if (bank_resp.data.error) {
                            $uibModal.open({
                                templateUrl: './app/order/modals/connectionErr.html'
                            });
                            console.log('Could not connect to Your bank');
                        }
                    });
            };

            function saveOrder() {
                orderService.saveOrderDetails()
                    .then(function(resp) {
                        console.log("resp : ", resp);
                        $uibModal.open({
                            templateUrl: './app/order/modals/paymentDone.html',
                            backdrop: 'static',
                            keyboard: false,
                            controller: function($uibModalInstance, $scope) {
                                $scope.next = function() {
                                    $uibModalInstance.close();
                                    $location.path('/confirmAddress');
                                    
                                };
                            }
                        });
                    });
            }
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
