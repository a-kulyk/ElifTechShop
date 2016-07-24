angular.module('app').factory('Parameters',['$http', function($http) {
      return {
        
        all: function() {
            return $http({
              method: 'GET', 
              url: "/catalog/find/all"
            });
        },
        count: function(object) {
              return $http({
              withCredentials: false,
              method: 'GET',
              url: "/catalog/filter/count/",
              params: object,
              headers : {'Content-Type': 'application/json'}
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
