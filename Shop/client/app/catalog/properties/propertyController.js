
angular.module('app')
  .controller('PropertyController', ['Parameters','$route','$scope','$rootScope', function (Parameters,$route,$scope,$rootScope) {
      var that = this;
      that.isCat = typeof $route.current.params.categories == "undefined";
      //console.log(typeof $route.current.params.categories !== "undefined")
/*
          for(item in $rootScope.data) {
            for (i in $rootScope.data[item].data) {
              
              if ($rootScope.data[item].data[i].state) {
                var object = {
                  categories : $route.current.params.categories,
                }
                object[$rootScope.data[item].name] = $rootScope.data[item].data[i].value;
                console.log($rootScope.data[item].data[i] , $rootScope.data[item].name , $rootScope.data[item].data[i].value);
                Parameters.count(object).success(function(data) {

                  console.log(object);
                  $rootScope.data[item].data[i].count = data.count;
                  //console.log($rootScope.data[item].data[i]);
                }).error(function(data,status) {
                  console.log(data,status);
                })
              }
            }
          }
       */
      if($rootScope.category != $route.current.params.categories) {
      Parameters.paramsOfCat($route.current.params.categories).success(function(result){
        $rootScope.category = $route.current.params.categories;
        $rootScope.data = [];
        $rootScope.prices = {
          minprice : parseInt(result.price.min),
          maxprice : parseInt(result.price.max)
        }
        for(item in result.data) {
          values = new Object();
          values[item] = [];
          for(value in result.data[item]) {
            var object = {}
            var object = {
              value : result.data[item][value],
              state : false,
              count : null
            }
            values[item].push(object);      
          }
          $rootScope.data.push({
            name : item,
            data : values[item]
          })
         
        }  
        
      }).error(function(data, status){
        console.log(data, status);
        that.categories = [];
      });
    };
}])
.filter("setUrl", ['Parameters','$httpParamSerializer','$route','$rootScope',function(Parameters,$httpParamSerializer,$route,$rootScope){
    debugger;
    return function(input){
      debugger;
      
      if( typeof input !== 'undefined') {
        var propertyObject = new Object();
        propertyObject.categories = $route.current.params.categories;
        console.log($rootScope.prices);
        propertyObject.minprice = parseInt($rootScope.prices.minprice);
        propertyObject.maxprice = parseInt($rootScope.prices.maxprice);
        for (item in input) {
          valuesArray = [];
          for(i in input[item].data) {
            if(input[item].data[i].state) {
              valuesArray.push(input[item].data[i].value);
              propertyObject[input[item].name] = valuesArray;
              //console.log(propertyObject);
              /*Parameters.count(propertyObject).success(function(data) {
                console.log(data)
              })
*/
  
            }
          }  
        }
       if(typeof input.searchField !== "undefined") {
        propertyObject.searchField = input.searchField;
       }
        var out = $httpParamSerializer(propertyObject)
        return out; 
      }
   }
}]);

