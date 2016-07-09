'use strict';

const ngRoute = require('../bower_components/angular-route');

require('../service/errorService');

var addProperty = function(form) {
    if(!form.properties) {
        form.properties = [];
    }
    form.properties.push({name:'', value:''});
};

var addImage = function(form) {
    if(!form.images) {
        form.images = [];
    }
    form.images.push('');
};

var removeByIndex = function(array, index) {
    array.splice(index,1);
};

angular.module('catalog.item', [ngRoute, 'service.error'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/item/:id/delete', {
            templateUrl: 'item/delete_item.html',
            controller: 'deleteItemCtrl'
        }).when('/item/:id', {
            templateUrl: 'item/item.html',
            controller: 'editItemCtrl'
        }).when('/item', {
            templateUrl: 'item/item.html',
            controller: 'newItemCtrl'
        });
    }])

    .controller('newItemCtrl', function($scope, $http, $location, errorService) {
        $scope.form = {};
        $scope.submitItem = function() {
            $http.put('/items', $scope.form)
                .success(function (data) {
                    if(data.success) {
                        $location.path('/list');
                    } else {
                        errorService.error(data.error);
                    }
                }).error(function (data) {
                    console.log(data);
                });
        };

        $scope.addProperty = addProperty;
        $scope.addImage = addImage;
        $scope.removeByIndex = removeByIndex;
    })

    .controller('editItemCtrl', function($scope, $http, $routeParams, $location) {
        $scope.form = {};
        $http.get('/items/' + $routeParams.id)
            .success(function (data) {
                if(data.success) {
                    $scope.form = data.item;
                } else {
                    errorService.error(data.error);
                }
            }).error(function (data) {
                console.log(data);//ToDo: if fail
            });

        $scope.submitItem = function() {
            $http.post('/items/' + $routeParams.id, $scope.form)
                .success(function (data) {
                    if(data.success) {
                        $location.path('/list');
                    } else {
                        errorService.error(data.error);
                    }
                }).error(function (data) {
                    console.log(data);
                });
        };

        $scope.addProperty = addProperty;
        $scope.addImage = addImage;
        $scope.removeByIndex = removeByIndex;
    })

    .controller('deleteItemCtrl', function($scope, $http, $routeParams, $location) {
        $http.get('/items/' + $routeParams.id)
            .success(function (data) {
                if(data.success) {
                    $scope.item = data.item;
                } else {
                    errorService.error(data.error);
                }
            }).error(function (data) {
                console.log(data);//ToDo: if fail
            });
        $scope.deleteItem = function() {
            $http.delete('/items/' + $routeParams.id)
                .success(function (data) {
                    if(data.success) {
                        $location.path('/list');
                    } else {
                        errorService.error(data.error);
                    }
                }).error(function (data) {
                    console.log(data);//ToDo: if fail
                });
        }
    });