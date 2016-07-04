
angular.module('app')
    .controller('ProductOnPageController',['$scope', 'Items', '$routeParams', function ($scope, Items, $routeParams) {
      Items.page($routeParams.number).success(function(data) {
     $scope.product = data;
  });
 }]);
    
 	
