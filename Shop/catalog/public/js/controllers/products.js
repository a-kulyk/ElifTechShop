
angular.module('app')
    .controller('ProductItemsController', ['$scope', 'Items', function ($scope, Items) {
      Items.all().success(function(data){
        $scope.items = data;
      }).error(function(data, status){
        console.log(data, status);
        $scope.items = [];
      });
    }])
    
 	
