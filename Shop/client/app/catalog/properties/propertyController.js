angular.module('app')
    .controller('PropertyController', ['Parameters','$route','$scope','$rootScope','$httpParamSerializer' ,'$location',function (Parameters,$route,$scope,$rootScope,$httpParamSerializer,$location) {
        $scope.displayCount = false;
        $scope.complete = false;
        var currentCategory = $route.current.params.categories;
        $scope.isCat = typeof currentCategory == "undefined";
        if($rootScope.data.price) {
            $scope.price = JSON.parse(JSON.stringify($rootScope.data.price));
        }
        let defineProperty = function() {
            if(!$rootScope.data.properties) return;
            let currentUrl = JSON.parse(JSON.stringify($route.current.params));
            if(currentUrl.searchField) $rootScope.data.searchField = currentUrl.searchField
            for(let item in currentUrl) {
                $rootScope.data.properties.forEach(function(property) {
                    if(property.name == item) {
                        property.value.forEach(function (value) {
                            if(angular.isArray(currentUrl[item])) {
                                if(currentUrl[item].includes(value.respond)) {
                                    console.log(value.respond,true);
                                    value.state = true;
                                }
                            } else {
                                if (currentUrl[item] == value.respond) {
                                    value.state = true;
                                }
                            }
                        })
                    }
                })

            }

        };
        $scope.createPropertyScreen = function (data) {
            var propertyScreen = {};
            propertyScreen.categories = $route.current.params.categories;
            if($rootScope.data.searchField) {
                let additionalSearchQuery = {
                    searchField : $rootScope.data.searchField || ''
                };
                Object.assign(propertyScreen,additionalSearchQuery);
            }
            if($route.current.params.sort) {
                let additionalSortQuery = {
                    sort : $route.current.params.sort || 'cheap'
                };
                Object.assign(propertyScreen,additionalSortQuery);
            }

            if (typeof data == 'undefined') return propertyScreen;
            if(data.hasOwnProperty('properties')) {
                data.properties.forEach(function (item) {
                    if (item.hasOwnProperty('value')) {
                        item.value.forEach(function (val) {
                            if (val.state) {
                                if (!propertyScreen[item.name]) {
                                    propertyScreen[item.name] = []
                                }
                                propertyScreen[item.name].push(val.respond)
                            }
                        })
                    }

                })
            }

            return propertyScreen;
        };

        $scope.clickToProperty = function () {
            let urlObj = $scope.createFilterParams()
            $location.url("?" + $httpParamSerializer(urlObj));
        };

        $scope.createFilterParams = function () {
            let urlObj = $scope.createPropertyScreen($rootScope.data) || {};
            if($rootScope.data.price && $route.current.params.categories) {
                let additionalPriceQuery = {
                    minprice: $rootScope.data.price.min || 0,
                    maxprice: $rootScope.data.price.max || Math.pow(10, 6)
                };
                Object.assign(urlObj,additionalPriceQuery);
            }
            return urlObj;
        }

        if($rootScope.category != currentCategory) {
            Parameters.paramsOfCat(currentCategory)
                .then(result => {
                    if (result.data.price) $scope.price = JSON.parse(JSON.stringify(result.data.price));
                    $rootScope.category = currentCategory;
                    let newResult = JSON.parse(JSON.stringify(result.data));
                    if (newResult.hasOwnProperty('properties')) {
                        newResult.properties.forEach(function (item) {
                            if (item.hasOwnProperty('value')) {
                                for (let i = 0; i < item.value.length; i++) {
                                    let newValue = {
                                        respond: item.value[i],
                                        state: false,
                                        count: null
                                    };
                                    item.value[i] = newValue
                                }
                            }
                        });
                    }
                    $rootScope.data = newResult || [];
                    defineProperty();
                    $scope.complete = true;

                },
                error => {
                    console.log(error);
                    $scope.categories = [];
                    $scope.complete = true;
                });
        }
        (function() {
            let params = JSON.parse(JSON.stringify($route.current.params));
            delete params.per_page;
            delete params.page;
            Parameters.countOfCat(currentCategory, params)
                .then(result => {
                        $rootScope.data = result.data;
                        $scope.displayCount = true;
                        defineProperty();
                    },
                    error => {
                        console.log(error);
                    })
            defineProperty();
        })()

    }]);