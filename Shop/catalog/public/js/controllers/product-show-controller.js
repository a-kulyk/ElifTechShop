
angular.module('app')
    .controller('ProductShowController',['$scope', 'Items', '$routeParams', function ($scope, Items, $routeParams) {
      Items.find($routeParams.id).success(function(data) {
     $scope.product = data;
  });
    }]);
    
 	
