angular.module('app')
    .controller('PropertyController', ['Parameters','$route','$scope','$rootScope','$httpParamSerializer' ,'$location',function (Parameters,$route,$scope,$rootScope,$httpParamSerializer,$location) {
        let that = this;
        if($rootScope.data.price) {
            that.price = JSON.parse(JSON.stringify($rootScope.data.price));
        }

        let defineProperty = function() {
            let currentUrl = JSON.parse(JSON.stringify($route.current.params));
            for(let item in currentUrl) {
                for(let i in $rootScope.data.properties) {
                    if($rootScope.data.properties[i].name == item) {

                        $rootScope.data.properties[i].value.forEach(function (value) {
                            if(Array.isArray(currentUrl[item])) {
                                if(currentUrl[item].includes(value.name)) {
                                    value.state = true;
                                }
                            } else {
                                if (currentUrl[item] == value.name) {
                                    value.state = true;
                                }
                            }
                        })
                    }
                }

            }

        };


        that.createPropertyScreen = function (data) {
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
                                propertyScreen[item.name].push(val.name)
                            }
                        })
                    }

                })
            }
            return propertyScreen;
        };

        that.clickToProperty = function () {
            let urlObj = that.createPropertyScreen($rootScope.data) || {};

            if($rootScope.data.price && $route.current.params.categories) {
                let additionalPriceQuery = {
                    minprice: $rootScope.data.price.min || 0,
                    maxprice: $rootScope.data.price.max || Math.pow(10, 6)
                };
                Object.assign(urlObj,additionalPriceQuery);
            }

            $location.url("?" + $httpParamSerializer(urlObj));
        };

        function creatCountObject (data) {
            let object = {};
            object.categories = $route.current.params.categories;
            if($route.current.params.searchField) object.searchField = $route.current.params.searchField;
            object[data.item] = data.name;

            return object;
        }


        function addCount () {


            if(typeof $rootScope.data == 'undefined') return;
            let propScr = that.createPropertyScreen($rootScope.data);
            data = $rootScope.data;
            for (let property in data.properties) {
                for (var i in data.properties[property].value) {
                    let params = JSON.parse(JSON.stringify(propScr));

                    if (params[data.properties[property].name]) {
                        params[data.properties[property].name].push(data.properties[property].value[i].name)
                        //setAdditionalCount(property,i);
                    }


                    function setAdditionalCount(property,i) {

                        if(typeof params == 'undefined') return null;
                        let srcCount = 0;
                        Parameters.count(propScr)
                            .then(
                                result => {
                            srcCount = result.data;
                        return Parameters.count(params)
                    }
                    )
                    .then(
                            result => {
                            if(srcCount < result.data) {
                            $rootScope.data.properties[property].value[i].count = "+" + (result.data - srcCount);
                        } else {
                            var countQuery = creatCountObject(data.properties[property].value[i]);

                            function setCount (property,i) {
                                Parameters.count(countQuery)
                                    .then(
                                        result => {

                                    $rootScope.data.properties[property].value[i].count = result.data;
                                if($rootScope.data.properties[property].value[i].state) {
                                    $rootScope.data.properties[property].value[i].count = null;
                                }
                            }
                            )
                            }
                            setCount(property,i);
                        }
                    }
                    )
                    .catch(function(error) {
                            $rootScope.data.properties[property].value[i].count = null;
                        })

                    }
                    setAdditionalCount(property,i);
                }
            }

        }



        var currentCategory = $route.current.params.categories;
        that.isCat = typeof currentCategory == "undefined";
        if($rootScope.category != currentCategory) {
            Parameters.paramsOfCat(currentCategory)
                .success(function (result) {
                    if(result.price) that.price= JSON.parse(JSON.stringify(result.price));
                    $rootScope.complete.property = false;
                    $rootScope.category = currentCategory;
                    $rootScope.data = result || [];

                    if($rootScope.data.hasOwnProperty('properties')) {
                        $rootScope.data.properties.forEach(function (item) {
                            if (item.hasOwnProperty('value')) {
                                for (var i in item.value) {
                                    var newValue = {
                                        name: item.value[i],
                                        item: item.name,
                                        state: false,
                                        count: null
                                    };
                                    item.value[i] = newValue;

                                }
                            }
                        });
                    }

                    defineProperty();
                    this.propScr = that.createPropertyScreen($rootScope.data);
                    addCount();
                    $rootScope.complete.property = true;

                })
                .error(function(data, status){
                    console.log(data, status);
                    that.categories = [];
                    $rootScope.complete.property = true;
                });
        } else {
            defineProperty();
            addCount();
        }

    }]);