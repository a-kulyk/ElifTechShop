
angular.module('app')
.controller('CategoriesController', ['$scope', 'Categories', function ($scope, Categories) {
      Categories.all().success(function(data){
        $scope.categories = data;
      }).error(function(data, status){
        console.log(data, status);
        $scope.categories = [];
      });
     }])