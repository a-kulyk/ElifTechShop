
angular.module('app')
    .controller('CatalogController', ['Items', '$route' ,'$httpParamSerializer' ,function (Items, $route,$httpParamSerializer) {  
        var that = this; 
        Items.all($route.current.params)
        .success(function(data){
       	  
        that.items = data.items;
        for (product in that.items) {
          that.items[product].smallDescription = that.items[product].description.slice(0,130) + "...";
          console.log(that.items[product].description);
        }
        var pages = data.pages || 1;
        that.pages = [];
        for (var i = 1; i <= pages;i++){
          var params = $route.current.params;

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
    
    
    
 	
