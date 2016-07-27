'use strict';

//const ngRoute = require('../bower_components/angular-route');
const angular = require('../bower_components/angular/angular');

require('../service/errorService');
require('../service/multipartForm');
//require('../directives/fileModel');

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

angular.module('catalog.item', ['ngRoute', 'ngMessages', 'service.error', 'service.multipartForm'])

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

    .directive('fileModel', ['$parse', function($parse){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    })
                })
            }
        }
    }])
    
    .controller('newItemCtrl', function($scope, $http, $location, errorService, multipartForm) {
        $scope.form = {};
        $scope.errors = {};
        $scope.submitItem = function() {
            if($scope.itemForm.$invalid) {
                return;
            }
            //$http.put('/items', $scope.form)
            multipartForm.put('/items', $scope.form)
                .success(function (data) {
                    if(data.success) {
                        $location.path('/list');
                    } else {
                        if(data.error.type === 'ValidationError') {
                            $scope.errors = data.error.errors;//ToDo: too deep
                            return;
                        }
                        errorService.error(data.error);
                    }
                }).error(function () {
                    errorService.error({
                        name: 'Request failed',
                        message: 'Request failed'
                    });
                });
        };

        $scope.addProperty = addProperty;
        $scope.addImage = addImage;
        $scope.removeByIndex = removeByIndex;
    })

    .controller('editItemCtrl', function($scope, $http, $routeParams, $location, errorService, multipartForm) {
        $scope.form = {};
        $http.get('/items/' + $routeParams.id)
            .success(function (data) {
                if(data.success) {
                    $scope.form = data.item;
                } else {
                    errorService.error(data.error);
                }
            }).error(function () {
                errorService.error({
                    name: 'Request failed',
                    message: 'Request failed'
                });
            });

        $scope.submitItem = function() {
            if($scope.itemForm.$invalid) {
                return;
            }
            //$http.post('/items/' + $routeParams.id, $scope.form)
            multipartForm.post('/items/' + $routeParams.id, $scope.form)
                .success(function (data) {
                    if(data.success) {
                        $location.path('/list');
                    } else {
                        if(data.error.type === 'ValidationError') {
                            $scope.errors = data.error.errors;//ToDo: too deep
                            return;
                        }
                        errorService.error(data.error);
                    }
                }).error(function () {
                    errorService.error({
                        name: 'Request failed',
                        message: 'Request failed'
                    });
                });
        };

        $scope.addProperty = addProperty;
        $scope.addImage = addImage;
        $scope.removeByIndex = removeByIndex;
    })

    .controller('deleteItemCtrl', function($scope, $http, $routeParams, $location, errorService) {
        $http.get('/items/' + $routeParams.id)
            .success(function (data) {
                if(data.success) {
                    $scope.item = data.item;
                } else {
                    errorService.error(data.error);
                }
            }).error(function () {
                errorService.error({
                    name: 'Request failed',
                    message: 'Request failed'
                });
            });
        $scope.deleteItem = function() {
            $http.delete('/items/' + $routeParams.id)
                .success(function (data) {
                    if(data.success) {
                        $location.path('/list');
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
    });