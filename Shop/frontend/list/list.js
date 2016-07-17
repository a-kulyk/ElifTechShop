'use strict';

// const ngRoute = require('../bower_components/angular-route');
const angular = require('../bower_components/angular/angular');

require('../service/errorService');

angular.module('catalog.list', ['ngRoute', 'service.error'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'list/list.html',
            controller: 'listCtrl'
        });
    }])

    .controller('listCtrl', function($scope, $http, errorService) {
        $scope.filter = {};
        $scope.selectedFilter = {};
        $http.get('/items')
            .success(function (data) {
                if(data.success) {
                    $scope.items = data.items;
                } else {
                    errorService.error(data.error);
                }
            }).error(function () {
                errorService.error({
                    name: 'Request failed',
                    message: 'Request failed'
                });
            });

        $http.get('/filter/categories')
            .success(function (data) {
                if(data.success) {
                    $scope.filter.categories = data.categories;
                } else {
                    errorService.error(data.error);
                }
            }).error(function () {
                errorService.error({
                    name: 'Request failed',
                    message: 'Request failed'
                });
            });

        $scope.changeCategory = function() {
            $scope.selectedFilter.properties = [];
            $scope.filter.properties = [];
            //ToDO: in move to service
            $http.get('/items', {
                params: $scope.getPreparedFilter()
                //headers : {'Content-Type': 'application/json'}
            })
                .success(function (data) {
                    if(data.success) {
                        $scope.items = data.items;
                    } else {
                        errorService.error(data.error);
                    }
                }).error(function () {
                errorService.error({
                    name: 'Request failed',
                    message: 'Request failed'
                });
            });

            if(!$scope.selectedFilter.category) {
                return;
            }

            $http.get('/filter/' + $scope.selectedFilter.category)
                .success(function (data) {
                    if(data.success) {
                        $scope.filter.properties = data.properties;
                    } else {
                        errorService.error(data.error);
                    }
                }).error(function () {
                    errorService.error({
                        name: 'Request failed',
                        message: 'Request failed'
                    });
                });
        };

        $scope.doFilter = function() {
            //ToDO: in move to service
            $http
                .get('/items', {
                    params: $scope.getPreparedFilter()
                    //headers : {'Content-Type': 'application/json'}
                })
                .success(function (data) {
                    if(data.success) {
                        $scope.items = data.items;
                    } else {
                        errorService.error(data.error);
                    }
                }).error(function () {
                    errorService.error({
                        name: 'Request failed',
                        message: 'Request failed'
                    });
                });
        };

        $scope.getPreparedFilter = function() {
            var result = {};
            if(!$scope.selectedFilter.category) {
                return result;
            }

            result.category = $scope.selectedFilter.category;
            result.properties = [];
            for (var propertyId in $scope.selectedFilter.properties) {
                if( !$scope.selectedFilter.properties.hasOwnProperty(propertyId) ) {
                    continue;
                }
                let value = [];
                for(var valueId in $scope.selectedFilter.properties[propertyId].value) {
                    if( !$scope.selectedFilter.properties[propertyId].value.hasOwnProperty(valueId) ) {
                        continue;
                    }
                    if($scope.selectedFilter.properties[propertyId].value[valueId]) {
                        value.push($scope.filter.properties[propertyId].value[valueId]);
                    }
                }
                if(value.length > 0) {
                    result.properties.push({
                        name: $scope.filter.properties[propertyId].name,
                        value: value
                    });
                }
            }

            return {filter: JSON.stringify(result)};
        };
    });