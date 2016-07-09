angular.module('app').factory('Parameters',['$http', function($http) {
      return {
 			all: function() {
      			return $http({
      				method: 'GET', 
      				url: "/catalog/find/all"
      			});
    		},
    		paramsOfCat: function(cat) {
    			return $http({
    				method: 'GET',
    				url: "/catalog/find/" + cat,
    			});
    		}
 		}
    }])
