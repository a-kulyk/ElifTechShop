angular.module('app')
    .controller('CatalogController', ['Items', '$route','$routeParams' ,'$httpParamSerializer','$rootScope','$location','$scope','$timeout' ,function (Items, $route,$routeParams,$httpParamSerializer,$rootScope,$location,$scope,$timeout) {
        var that = this;
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
            .success(function(data){

                $rootScope.complete.product = false;
                that.items = data.items;
                if(that.items.length === 0) {
                    $rootScope.complete.product = true;
                    that.items.notMatch = true;
                    return;
                }

                for (var product in that.items) {
                    that.items[product].smallDescription = that.items[product].description.slice(0,105) + "...";
                }
                var pages = data.pages || 0;
                that.pages = [];
                for (var i = 1; i <= pages;i++){
                    var params = $route.current.params;

                    params.page = i;
                    var page = {number: i, url: $httpParamSerializer(params)};
                    that.pages.push(page);
                }
                for(var property in that.items.properties) {
                    property.url = $httpParamSerializer(property);
                }
                $rootScope.complete.product = true;
                setTimeout(function(){
                    //do this after view has loaded :)\
                    makeVisualEffects();
                }, 0);


            }).error(function(data, status){
            console.log(data, status);
            that.items  = [];
            that.items.error = true;
            $rootScope.complete.product = true;
        });

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
    
    
    
    
 	
