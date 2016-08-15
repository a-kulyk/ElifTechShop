angular.module('app')
    .controller('CatalogController', ['Items', '$route','$routeParams' ,'$httpParamSerializer','$rootScope','$location','$scope','$timeout' ,function (Items, $route,$routeParams,$httpParamSerializer,$rootScope,$location,$scope,$timeout) {
        $scope.complete = false;
        $scope.currentSort = $routeParams.sort || '';
        $scope.sort = ['cheap','expensive'];
        $scope.sortThis = function() {
            $routeParams.sort = $scope.sorted || 'cheap';
            $location.url('?'+$httpParamSerializer($routeParams));
        }
        Items.all($route.current.params)
            .then (response => {
                response.data.items.forEach(function (element) {
                element.smallDescription = element.description.slice(0,105) + "...";
                })
                for (let product in response.data.items) {
                    response.data.items[product].smallDescription = response.data.items[product].description.slice(0,105) + "...";
                }

                $scope.items = response.data.items;

                if($scope.items.length === 0) {
                    $scope.items.not = true;
                   $scope.complete = true;
                    return;
                }

                let pages = response.data.pages || 0;
                $scope.pages = [];

                for (let i = 1; i <= pages;i++){
                    let params = angular.copy($route.current.params);;
                    params.page = i;
                    let page = {number: i, url: $httpParamSerializer(params)};
                    $scope.pages.push(page);
                }
                $scope.complete = true;

                setTimeout(function(){
                    makeVisualEffects();
                }, 0);

            }, error => {
            console.log(error);
            $scope.items  = [];
            $scope.items.error = true;
            $scope.complete = true;

        })


    }])
    .controller('ProductShowController',['$scope', '$rootScope', 'Items', '$route', 'orderService', function ($scope, $rootScope, Items, $route, orderService) {
        Items.item($route.current.params.id).success(function(data) {
            $scope.product = data;

            $scope.addToCart = function(cart) {
                if (!$rootScope.shoppingCart) {
                    orderService.createCart(cart)
                        .then(function(response) {
                            console.log("create response :  ", response.data);
                            $rootScope.shoppingCart = response.data;
                        });
                } else {
                    orderService.addToCart(cart)
                        .then(function(response) {
                            console.log("addItem response :  ", response.data);
                            $rootScope.shoppingCart = response.data;
                        });
                }
            };
            
            $scope.doTheBack = function() {
                window.history.back();
            };

        });
    }]);
    
    
    
    
 	
