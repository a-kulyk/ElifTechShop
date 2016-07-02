
angular.module('app')
    .controller('ProductItemsController', ['$scope', 'Items', '$routeParams' ,function ($scope, Items, $routeParams) {
       Items.page($routeParams.number).success(function(data){
        $scope.items = data;
      }).error(function(data, status){
        console.log(data, status);
        $scope.items = [];
      });
    }])
    
 	
