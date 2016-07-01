angular.module('app').factory('Categories',['$http', function($http) {
      return {
 			all: function() {
      			return $http({method: 'GET', url: "/shop/categories"});
    			},
    		find: function(name){
      		return $http({method:'GET', url: '/shop/categories/' + name});
    		}
 		}
    }])
