angular.module('app')
    .controller('CatalogController', ['Items', '$route','$routeParams' ,'$httpParamSerializer','$rootScope','$location','$scope','$timeout' ,function (Items, $route,$routeParams,$httpParamSerializer,$rootScope,$location,$scope,$timeout) {
        $scope.complete = false;
        let capitalizeFirstLetter = function(string) {
            return string[0].toUpperCase() + string.slice(1);
        }
        let sort = _.lowerCase($routeParams.sort);
        if(sort != 'price' && sort != 'name') {
            $scope.currentSort = ''
        } else {
            $scope.currentSort = capitalizeFirstLetter($routeParams.sort);
        }
        $scope.sort = ['Name','Price'];
        $scope.sortBy = $routeParams.sortBy < 0 ? 1 : -1;
        $scope.sortThis = function() {
            /** @namespace $scope.sorted */
            $routeParams.sort = $scope.sorted || 'name';
            $routeParams.sortBy =  $scope.sortBy || 1;
            $location.url('?'+$httpParamSerializer($routeParams));
        };
        Items.all($route.current.params)
            .then (response => {
                response.data.items.forEach(function (element) {
                element.smallDescription = element.description.slice(0,105) + "...";
                });

                if(response.data.items.length == 0) {
                    $scope.notItems = true;
                    $scope.complete = true;
                    return;
                }

                _(response.data.items).forEach(function (value) {
                    value.smallDescription = value.description.slice(0,105) + "...";
                })


                $scope.items = response.data.items;



                let pages = _.range(1,response.data.pages+1) || 0;
                $scope.pages = [];
                console.log(response.data.pages);
                _(pages).forEach(function(pageNumber) {
                    let params = $route.current.params;
                    params.page = pageNumber;
                    let page = {number: pageNumber, url: $httpParamSerializer(params)};
                    $scope.pages.push(page);
                })



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
        $scope.complete = false;
        Items.item($route.current.params.id).then(respone => {
            $scope.product = respone.data;

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
            $scope.complete = true;
            setTimeout(function(){
               addGalleryView();
            }, 0);

        },error => {
                console.log(error);
                $scope.items  = [];
                $scope.items.error = true;
                $scope.complete = true;
        });
    }]);
    
    
    
    
 	
