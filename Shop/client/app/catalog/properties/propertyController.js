
angular.module('app')
	.controller('PropertyController', ['Parameters','$routeParams', '$httpParamSerializer', function (Parameters,$routeParams,$httpParamSerializer) {
      var that = this;
      
      Parameters.paramsOfCat($routeParams.categories).success(function(data){
        that.data = [];
        for(item in data) {
          that.data.push({
            name : item,
            data : data[item]
          })
        }
    
        
      }).error(function(data, status){
        console.log(data, status);
        that.categories = [];
      });
     }])

    
 	
