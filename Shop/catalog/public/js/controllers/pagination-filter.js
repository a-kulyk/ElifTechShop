
angular.module('app')
    .controller('PaginationFilterController', ['$scope', 'Items', '$routeParams', function ($scope, Items,$routeParams) {
    	var pages = 1;
    	var range = [];
      var current = this;
    	var name = $routeParams.name;
      var value = $routeParams.value;
      Items.paginationFilter(name,value).success(function(data){
        current.pages = parseInt(data);
        for (var i = 1; i <= current.pages;i++){
        	range.push(i);
        };
        $scope.range = range;
        $scope.name = name;
        $scope.value = value;
      }).error(function(data, status){
        console.log(data, status);
      });
    }])
    
 	
