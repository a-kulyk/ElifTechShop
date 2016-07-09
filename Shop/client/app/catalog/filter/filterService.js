
 	angular.module('app').factory('FilteredItems', ['$http',function FilteredProductFactory($http){
 		return {
        filter: function(name,value,number) {
        	return $http.get( '/catalog/filter/', {params: {name : name,value : value, page : number}})
       
        },
        paginationFilter: function(name,value) {
          return $http({method:'GET', url: '/catalog/filter/pages/?name=' + name + '&value=' + value});
        }
 		}
    }])
    

 