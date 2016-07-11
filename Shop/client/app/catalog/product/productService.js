
 	angular.module('app').factory('Items', ['$http', function ProductFactory($http){
 		return {
 			    all: function(object) {
              return $http({
              withCredentials: false,
              method: 'GET',
              url: "/catalog/filter/",
              params: object,
              headers : {'Content-Type': 'application/json'}
            });
    			},
          item : function(id) {
            return $http({
              method: 'GET',
              url : "/catalog/product/"+id
            })
          }
 		}
    }])

    

 