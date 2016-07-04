
 	angular.module('app').factory('Items', ['$http', function ProductFactory($http){
 		return {
 			all: function() {
      			return $http({method: 'GET', url: "/catalog/items"});
    			},
    		find: function(id){
      		return $http({method:'GET', url: '/catalog/items/' + id});
    		},
    		page: function(number){
      		return $http({method:'GET', url: '/catalog/page/' + number});
    		},

        filter: function(name,value,number) {
          return $http({method:'GET', url: '/catalog/filter/'+name+'/'+value+ '/page/' + number});
        },
    		pagination: function() {
    			return $http({method:'GET', url: '/catalog/pages/'});
    		},
        paginationFilter: function(name,value) {
          return $http({method:'GET', url: '/catalog/filter/'+name+'/'+value+ '/pages/'});
        }
 		}
    }])
    

 