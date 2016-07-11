
angular.module('app')
	.controller('PropertyController', ['Parameters','$route', function (Parameters,$route) {
      var that = this;
      Parameters.paramsOfCat($route.current.params.categories).success(function(data){
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

    
 	
