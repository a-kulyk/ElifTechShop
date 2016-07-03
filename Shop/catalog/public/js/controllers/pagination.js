
angular.module('app')
    .controller('PaginationController', ['$scope', 'Items', function ($scope, Items) {
    	var pages = 1;
    	var range = [];
    	var current = this;
      Items.pagination().success(function(data){
        current.pages = parseInt(data);
        for (var i = 1; i <= current.pages;i++){
        	range.push(i);
        };
        $scope.range = range;
      }).error(function(data, status){
        console.log(data, status);
      });
    }])
    
 	
