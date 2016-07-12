
angular.module('app')
    .controller('CatalogController', ['Items', '$route','$routeParams' ,'$httpParamSerializer' ,function (Items, $route,$routeParams,$httpParamSerializer) {  
        var that = this; 

        Items.all($route.current.params)
        .success(function(data){
       	  
        that.items = data.items;
        if(that.items.length === 0) {
          that.items.notMatch = true;
        }
        for (product in that.items) {
          that.items[product].smallDescription = that.items[product].description.slice(0,130) + "...";
          console.log(that.items[product].description);
        }
        var pages = data.pages || 0;
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
        that.items.error = true;
      });
    }])
    .controller('ProductShowController',['$scope', 'Items', '$route', function ($scope, Items, $route) {
      Items.item($route.current.params.id).success(function(data) {
     $scope.product = data;

      });
    }]);
    
    
    
 	
