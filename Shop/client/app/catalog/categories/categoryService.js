angular.module('app').factory('Parameters',['$http', function($http) {
      return {
        all: function() {
            return $http({
              method: 'GET', 
              url: "/catalog/find/all"
            });
        },
        countOfCat: function(cat,object) {
              return $http({
              withCredentials: false,
              method: 'GET',
              url: "/catalog/filtration/" + cat,
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
