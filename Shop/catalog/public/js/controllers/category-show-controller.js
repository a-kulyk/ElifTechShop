
angular.module('app')
    .controller('CategoryShowController',['$scope', 'Categories', '$routeParams', function ($scope, Categories, $routeParams) {
      Categories.find($routeParams.name).success(function(data) {
     $scope.categories = data;
  });
    }]);
    
 	
