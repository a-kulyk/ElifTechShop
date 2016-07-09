angular.module('app').factory('Categories',['$http', function($http) {
      return {
 			all: function() {
      			return $http({method: 'GET', url: "/catalog/categories"});
    			},
    		find: function(name){
      		return $http({method:'GET', url: '/catalog/category/' + name});
    		}
 		}
    }])
