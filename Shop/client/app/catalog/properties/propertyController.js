angular.module('app')
    .controller('PropertyController', ['Parameters','$route','$scope','$rootScope','$httpParamSerializer' ,'$location',function (Parameters,$route,$scope,$rootScope,$httpParamSerializer,$location) {
        var currentCategory = $route.current.params.categories;
        if($rootScope.category != currentCategory) {
            $rootScope.data = {}
        }
        $scope.displayCount = false;
        $scope.complete = false;
        $scope.isCat = typeof currentCategory == "undefined";
        if($rootScope.data.price) {
            $scope.price = _.cloneDeep($rootScope.data.price);
        }

        let defineProperty = function() {
            let currentUrl = _.cloneDeep($route.current.params);
            if(currentUrl.searchField && !$rootScope.data.searchField) {
                $rootScope.data.searchField = currentUrl.searchField;
            }
            if(!$rootScope.data.properties) return;
            for(let item in currentUrl) {
                $rootScope.data.properties.forEach(function(property) {
                    if(property.name == item) {
                        property.value.forEach(function (value) {
                            if(angular.isArray(currentUrl[item])) {
                                if(currentUrl[item].includes(value.respond)) {
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
                $rootScope.data.company.forEach(function(company) {
                    if("company" == item) {
                            if(angular.isArray(currentUrl[item])) {
                                if(currentUrl[item].includes(company.name)) {
                                    company.state = true;
                                    company.count = null;
                                }
                            } else {
                                if (currentUrl[item] == company.name) {
                                    company.state = true;
                                    company.count = null;
                                }
                            }

                    }
                })

            }

        };
        defineProperty();
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
            if(data.hasOwnProperty('company')) {
                data.company.forEach(function (item) {
                            if (item.state) {
                                if (!propertyScreen['company']) {
                                    propertyScreen['company'] = []
                                }
                                propertyScreen['company'].push(item.name)
                            }
                })
            }

            return propertyScreen;
        };

        $scope.clickToProperty = function () {
            let urlObj = $scope.createFilterParams();
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
        };
        Parameters.paramsOfCat(currentCategory)
            .then(result => {
                if(result.status >= 500) {
                    $scope.error = true;
                    $scope.complete = true;
                    return;
                }
                if(result.data.length === 0) {
                    $scope.notFound = true;
                    $scope.complete = true;
                    return;
                }
                if (result.data.price) $scope.price =_.cloneDeep(result.data.price);
                $rootScope.category = currentCategory;
                let newResult = _.cloneDeep(result.data);
                if (newResult.hasOwnProperty('company')) {
                    _(newResult.company).forEach( function(value, key) {
                        let newCompany = {
                            name : value,
                            state : false,
                            count: null
                        };
                        newResult.company[key] = newCompany
                    });

                };
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
                $scope.error = true;
                $scope.complete = true;
            });

        (function() {
            let params = _.cloneDeep($route.current.params);
            delete params.per_page;
            delete params.page;
            if(!currentCategory) return;
            Parameters.countOfCat(currentCategory, params)
                .then(result => {
                        if(result.status >= 500 || result.data.length === 0) return;
                        $rootScope.data.properties = result.data.properties;
                        $rootScope.data.company = result.data.company;
                        $scope.displayCount = true;
                        defineProperty();
                        $scope.complete = true;
                    },
                    error => {
                        console.log(error);
                    })
            defineProperty();
        })()

    }]);