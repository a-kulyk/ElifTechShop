
angular.module('app')
    .controller('FilterItemsController', ['$scope', 'Items', '$routeParams', '$location' ,function ($scope, Items, $routeParams, $location) {

       Items.filter($routeParams.name,$routeParams.value,parseInt($routeParams.number)).success(function(data){
       	if(angular.equals([], data)) {
       		$location.path("/");
       	}
       	
        $scope.items = data;

        $scope.items.forEach(function(element,index,array) {
          console.log(element);
          element.properties.forEach(function (el,ind,ar) {
            el.url = encodeURIComponent(el.name) + '/' + encodeURIComponent(el.value);
            
          })
        })

      }).error(function(data, status){
        console.log(data, status);
        $scope.items = [];
      });
    }])
    