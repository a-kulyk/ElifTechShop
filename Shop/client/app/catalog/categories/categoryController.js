
angular.module('app')
	.controller('CategoriesController', ['$scope', 'Categories', function ($scope, Categories) {
      Categories.all().success(function(data){
        $scope.categories = data;
        console.log(data);
      }).error(function(data, status){
        console.log(data, status);
        $scope.categories = [];
      });
     }])
    .controller('CategoryShowController',['$scope', 'Categories', '$routeParams', function ($scope, Categories, $routeParams) {
      Categories.find($routeParams.name).success(function(data) {
     $scope.categories = data;
  });
    }]);
    
 	
