
angular.module('app')
	.controller('PropertyController', ['Parameters','$routeParams', '$httpParamSerializer', function (Parameters,$routeParams,$httpParamSerializer) {
      var that = this;
      console.log($routeParams.categories);
      Parameters.paramsOfCat($routeParams.categories).success(function(data){
        that.data = [];
        for(item in data) {
          that.data.push({
            name : item,
            data : data[item]
          })
        }
        console.log(data);
        
      }).error(function(data, status){
        console.log(data, status);
        that.categories = [];
      });
     }])

    
 	
