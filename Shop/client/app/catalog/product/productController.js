angular.module('app')
    .controller('CatalogController', ['Items', '$route','$routeParams' ,'$httpParamSerializer','$rootScope','$location','$scope','$timeout' ,function (Items, $route,$routeParams,$httpParamSerializer,$rootScope,$location,$scope,$timeout) {

        var that = this;
        $scope.complete = false;
        if(!$route.current.params.categories) {
            for(var property in $rootScope.data.properties) {
                for(var i in $rootScope.data.properties[property].value) {
                    $rootScope.data.properties[property].value.state = false;
                }
            }
        }

        that.currentSort = $routeParams.sort || '';
        that.sort = ['cheap','expensive'];

        that.sortThis = function() {
            $routeParams.sort = that.sorted || 'cheap';
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
                console.log( $scope.items);
                if($scope.items.length === 0) {
                   $scope.complete = true;
                    $scope.items.notMatch = true;
                    return;
                }
                var pages = response.data.pages || 0;
                $scope.pages = [];
                for (var i = 1; i <= pages;i++){
                    var params = $route.current.params;
                    params.page = i;
                    var page = {number: i, url: $httpParamSerializer(params)};
                    $scope.pages.push(page);
                }
                $scope.complete = true;
                setTimeout(function(){
                    //do this after view has loaded :)\
                    makeVisualEffects();



                }, 0);


            }, error => {
            console.log(error);
            that.items  = [];
            that.items.error = true;
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
    
    
    
    
 	
