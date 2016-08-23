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
        if($routeParams.sortBy) $scope.sortBy = $routeParams.sortBy < 0 ? 1 : -1;
        $scope.sortThis = function() {
            /** @namespace $scope.sorted */
            $routeParams.sort = _.lowerCase($scope.sorted) || 'name';
            $routeParams.sortBy =  $scope.sortBy || 1;
            $location.url('?'+$httpParamSerializer($routeParams));
        };
        Items.all($route.current.params)
            .then (response => {

                if(response.status >= 500) {
                    console.log(response);
                    $scope.error = true;
                    $scope.complete = true;
                    return;
                }
                if(response.data.items.length === 0) {
                    console.log(response);
                    $scope.notItems = true;
                    $scope.complete = true;
                    return;
                }

                response.data.items.forEach(function (element) {
                element.smallDescription = element.description.slice(0,105) + "...";
                });

                _(response.data.items).forEach(function (value) {
                    value.smallDescription = value.description.slice(0,105) + "...";
                })


                $scope.items = response.data.items;



                let pages = _.range(1,response.data.pages+1) || 0;
                $scope.pages = [];
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
            $scope.error = true;
            $scope.complete = true;

        })


    }])

    .controller('ProductShowController',['$scope', '$rootScope', 'Items', '$route', 'orderService', function ($scope, $rootScope, Items, $route, orderService) {
        self = this;
        $scope.complete = false;
        Items.item($route.current.params.id).then(respone => {
            //console.log(respone);
            if(respone.status >= 500) {
                $scope.error = true;
                $scope.complete = true;
                return;
            }
            console.log(respone.data);

            if(!respone.data || respone.data.error) {
                self.notFound = true;
                $scope.complete = true;
                return;
            }
            $scope.product = respone.data;


            $scope.addToCart = function(cart) {
                if (!$rootScope.shoppingCart) {
                    orderService.createCart(cart)
                        .then(function(response) {
                            $rootScope.shoppingCart = response.data;
                        });
                } else {
                    orderService.addToCart(cart)
                        .then(function(response) {
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
                $scope.product  = [];
                $scope.error = true;
                $scope.complete = true;
        });
    }]);
    
    
    
    
 	
