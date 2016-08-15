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

            order.updQuantity = _.debounce(function(id, quan) {
                orderService.updQuantity(id, quan)
                    .then(function(response) {
                        $rootScope.shoppingCart = response.data;
                    });
            }, 500);

            order.increment = function(id) {
                order.updQuantity(id, 1);
            };

            order.decrement = function(id, quan) {
                --quan;
                if (quan !== 0) { 
                    order.updQuantity(id, -1);
                } else {
                    order.removeItem(id);
                }
            };

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
    .controller('HistoryCtrl', ['$scope', 'orderService', function($scope, orderService) {
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
