angular.module('app')
    .controller('CatalogController', ['Items', '$route','$routeParams' ,'$httpParamSerializer','$rootScope','$location' ,function (Items, $route,$routeParams,$httpParamSerializer,$rootScope,$location) {
        var that = this;


        that.currentSort = $routeParams.sort || '';
        that.sort = ['cheap','expensive'];

        that.sortThis = function() {
          $routeParams.sort = that.sorted || 'cheap';
          $location.url('?'+$httpParamSerializer($routeParams));
        }
        Items.all($route.current.params)
        .success(function(data){

          $rootScope.complete.product = false;
          that.items = data.items;
          if(that.items.length === 0) {
            $rootScope.complete.product = true;
            that.items.notMatch = true;
            return;
          }
        
          for (var product in that.items) {
            that.items[product].smallDescription = that.items[product].description.slice(0,130) + "...";
          }
          var pages = data.pages || 0;
          that.pages = [];
          for (var i = 1; i <= pages;i++){
            var params = $route.current.params;

            params.page = i;
            var page = {number: i, url: $httpParamSerializer(params)};
            that.pages.push(page);
          }
          for(var property in that.items.properties) {
            property.url = $httpParamSerializer(property);
          }
          $rootScope.complete.product = true;
            if($rootScope.data) $rootScope.data.count = data.count;


      }).error(function(data, status){
        console.log(data, status);
        that.items  = [];
        that.items.error = true;
        $rootScope.complete.product = true;
      });
    }])
    .controller('ProductShowController',['$scope', 'Items', '$route', function ($scope, Items, $route) {
      Items.item($route.current.params.id).success(function(data) {
     $scope.product = data;

      });
    }]);
    
    
    
    
 	
