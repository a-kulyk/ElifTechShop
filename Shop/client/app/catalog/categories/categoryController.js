
angular.module('app')
	.controller('CategoriesController', ['$scope', 'Parameters','$routeParams', '$httpParamSerializer', function ($scope, Parameters,$routeParams,$httpParamSerializer) {
      var that = this;
      Parameters.all().success(function(data){
        that.data = [];
        for(i in data) {
          var url = $routeParams;
          url.categories = data[i];
          url.page = null;
          var categoryInfo = {name : data[i], url : $httpParamSerializer(url)};
          that.data.push(categoryInfo);
         
        }
        
      }).error(function(data, status){
        console.log(data, status);
        that.categories = [];
      });
     }])

    
 	
