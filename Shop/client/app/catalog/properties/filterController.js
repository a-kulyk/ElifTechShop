
angular.module('app')
    .controller('FilterController', ['$scope', 'Items','$routeParams','$httpParamSerializer',function ($scope,Items,$routeParams,$httpParamSerializer) {  
        var that = this; 
        this.filter = {
          input : ""
        }
        this.url = {};
        this.url.categories = $routeParams.categories;
        console.log($routeParams.categories);
    }])
    .filter("setUrl", ['$httpParamSerializer',function($httpParamSerializer){
   return function(input){
      output = $httpParamSerializer(input)
      return output; 
   }
}]);
    
    
    
 	
