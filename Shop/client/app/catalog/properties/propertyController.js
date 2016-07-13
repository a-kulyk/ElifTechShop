
angular.module('app')
	.controller('PropertyController', ['Parameters','$route', function (Parameters,$route) {
      var that = this;
      Parameters.paramsOfCat($route.current.params.categories).success(function(data){
        that.data = [];
        that.url = {};
        for(item in data) {
          that.data.push({
            name : item,
            data : data[item]
          })
          that.url[item] = [];
        }  
        

        that.url.categories = $route.current.params.categories;
        that.isCat = (typeof that.url.categories == "undefined");
        
      }).error(function(data, status){
        console.log(data, status);
        that.categories = [];
      });
     }])
 .filter("setUrl", ['$httpParamSerializer',function($httpParamSerializer){
    return function(input){
      output = $httpParamSerializer(input)
      return output; 
   }
}]);
