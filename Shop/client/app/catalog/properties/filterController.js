
angular.module('app')
    .controller('FilterController', ['$route',function ($route) {  
        this.url = {};
        this.url.categories = $route.current.params.categories;
        this.isCat = (typeof this.url.categories == "undefined");
    }])
    .filter("setUrl", ['$httpParamSerializer',function($httpParamSerializer){
    return function(input){
      output = $httpParamSerializer(input)
      return output; 
   }
}]);
    
    
    
 	
