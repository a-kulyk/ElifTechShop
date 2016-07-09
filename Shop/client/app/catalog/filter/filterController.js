
angular.module('app')
    .controller('FilterItemsController', ['$scope', 'FilteredItems', '$routeParams', '$location' ,function ($scope, FilteredItems, $routeParams, $location) {
       FilteredItems.filter($routeParams.name,$routeParams.value,parseInt($routeParams.page)).success(function(data){
        console.log($routeParams.name + " " + $routeParams.value + " " + $routeParams.page);
       	if(angular.equals([], data)) {
       		$location.path("/");
       	}
        $scope.items = data;
        $scope.items.forEach(function(element,index,array) {
          element.properties.forEach(function (el,ind,ar) {
             el.url = '?name=' +encodeURIComponent(el.name) + '&value=' + encodeURIComponent(el.value);
          })
        })
      }).error(function(data, status){
        console.log(data, status);
        $scope.items = [];
      });
    }])
    .controller('PaginationFilterController', ['$scope', 'FilteredItems', '$routeParams', function ($scope, FilteredItems,$routeParams) {
      var pages = 1;
      var range = [];
      var current = this;
      var name = $routeParams.name;
      var value = $routeParams.value;
      FilteredItems.paginationFilter(name,value).success(function(data){
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
    
  

    