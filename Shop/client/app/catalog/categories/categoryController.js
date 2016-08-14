angular.module('app')
  .controller('CategoriesController', ['$scope', 'Parameters','$routeParams', '$httpParamSerializer', function ($scope, Parameters,$routeParams,$httpParamSerializer) {
      var that = this;
      Parameters.all().success(function(data){
        that.data = [];
        for(var i in data) {
          var url = {};
          url.categories = data[i];
          var categoryInfo = {name : data[i], url : $httpParamSerializer(url)};
          that.data.push(categoryInfo);
        }
      }).error(function(data, status){
        console.log(data, status);
        that.categories = [];
      });
     }]);

    
 	
