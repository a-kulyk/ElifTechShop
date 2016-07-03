
 	angular.module('app').factory('Items', ['$http', function ProductFactory($http){
 		return {
 			all: function() {
      			return $http({method: 'GET', url: "/shop/items"});
    			},
    		find: function(id){
      		return $http({method:'GET', url: '/shop/items/' + id});
    		},
    		page: function(number){
      		return $http({method:'GET', url: '/shop/page/' + number});
    		},
    		pagination: function() {
    			return $http({method:'GET', url: '/shop/pages/'});
    		}
 		}
    }])
    

 