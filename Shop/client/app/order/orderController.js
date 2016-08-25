angular.module('app')
    .filter('moment', function() {
        return function(dateString) {
            return moment(dateString).format("D MMMM YYYY, HH:mm");
        };
    })
    .controller('OrderController', ['$rootScope', '$scope', '$location', '$timeout', '$uibModal', 'orderService',
        function($rootScope, $scope, $location, $timeout, $uibModal, orderService) {
            var order = this;

            orderService.getCart()
                .then(function(response) {
                    $rootScope.shoppingCart = response.data;
                });

            order.updQuantity = function(id, quan) {
                orderService.updQuantity(id, quan)
                    .then(function(response) {
                        $rootScope.shoppingCart = {order: response.data.order, total: response.data.total};
                        if (response.data.outOfStock) {
                            $uibModal.open({
                                templateUrl: './app/order/modals/outOfStock.html'
                            });
                        }
                    });
            };

            order.decrement = _.debounce(function(id, quan) {
                --quan;
                if (quan !== 0) { 
                    order.updQuantity(id, -1);
                } else {
                    order.removeItem(id);

                }
            }, 500);

            order.removeItem = function(id) {
                orderService.removeItem(id)
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

            order.pay = function() {
                orderService.pay()
                    .then(function(resp) {
                        if (resp.data.outOfStock) {
                            $uibModal.open({
                                templateUrl: './app/order/modals/outOfStock.html',
                                controller: function($uibModalInstance, $scope, outOfStock) {
                                    $scope.outOfStock = outOfStock;
                                },
                                resolve: {
                                    outOfStock: function() {
                                        return resp.data.outOfStock;
                                    }
                                }
                            });
                        }
                        return resp;
                    })
                    .then(function(bank_resp) {
                        if (bank_resp.data.success === true) {
                            saveOrder();
                        } else if (bank_resp.data.success === false) {
                            $uibModal.open({
                                templateUrl: './app/order/modals/paymentFail.html'
                            });
                        } else if (bank_resp.data.error) {
                            $uibModal.open({
                                templateUrl: './app/order/modals/connectionErr.html'
                            });
                        } else if (bank_resp.data.warning === "No bankAccount") {
                           openInputModal();
                        }
                    });
            };

            function saveOrder() {
                orderService.saveOrderDetails()
                    .then(function(resp) {
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

            function openInputModal() {
                $uibModal.open({
                    templateUrl: './app/order/modals/inputBankAcc.html',
                    controller: function($uibModalInstance, $scope, AuthService) {
                        $scope.next = function(account) {
                            AuthService.addBankAccount(account)
                                .then(function(resp) {
                                    $uibModalInstance.close();
                                });
                        };
                    }
                });
            }
        }
    ])
    .controller('HistoryCtrl', ['$scope', '$rootScope', 'orderService', '$location', function($scope, $rootScope, orderService, $location) {
        var history = this;
        history.propertyName = 'date.created';
        history.sortReverse = true;

        history.sortBy = function(propertyName) {
            history.sortReverse = (history.propertyName === propertyName) ? !history.sortReverse : false;
            history.propertyName = propertyName;
        };

        orderService.all().then(function(resp) {
            history.allOrders = resp.data;
        });

        history.openOrder = function(order) {
            $location.path("/order/" + order._id);
        };
    }])
    .controller('OrderDetailController', ['$route', 'orderService',
        function($route, orderService) {
            var detail = this;

            orderService.getOne($route.current.params.id)
                .then(function(resp) {
                    detail.order = resp.data;
                });

            detail.check = function(track) {
                orderService.getDeliveryTime(track)
                    .then(function(resp) {
                        detail.arrivalTime = resp.data.arrivalTime;
                    });
            };
        }
    ]);
