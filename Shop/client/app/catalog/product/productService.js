angular.module('app').factory('Items', ['$http', function ProductFactory($http){
  return {
        all: function(object) {
            if(!object.per_page) {
                object.per_page = 9
            }
           return $http({
           withCredentials: false,
           method: 'GET',
           url: "/catalog/filter/",
           params: object
         });
      },
       item : function(id) {
         return $http({
           method: 'GET',
           url : "/catalog/product/"+id
         });
       }
  };
 }]);

    

 