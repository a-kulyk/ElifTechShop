
angular.module('app')
    .controller('CatalogController', ['Items', '$routeParams' ,'$location','$httpParamSerializer' ,function (Items, $routeParams, $location,$httpParamSerializer) {  
        var that = this; 
        Items.all($routeParams)
        .success(function(data){

       	  if(angular.equals([], data)) {
       		 $location.path("/");
       	  }
      
        that.items = data.items;
        var pages = data.pages || 1;
        that.pages = [];
        for (var i = 1; i <= pages;i++){
          var params = $routeParams;
          params.page = i
          var page = {number: i, url: $httpParamSerializer(params)}
          that.pages.push(page);
        };
        for(property in that.items.properties) {
          property.url = $httpParamSerializer(property);
         
        }
       

      }).error(function(data, status){
        console.log(data, status);
        that.items  = [];
      });
    }])
    
    .controller('ProductShowController',['$scope', 'Items', '$routeParams', function ($scope, Items, $routeParams) {
      Items.item($routeParams.id).success(function(data) {
     $scope.product = data;
  });
    }]);
    
    
    
 	
