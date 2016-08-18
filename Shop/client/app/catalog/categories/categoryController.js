angular.module('app')
  .controller('CategoriesController', ['$scope', 'Parameters','$routeParams', '$httpParamSerializer', function ($scope, Parameters,$routeParams,$httpParamSerializer) {
      var that = this;
      $scope.complete = false;
      Parameters.all().success(function(data){

        that.data = [];
        _(data).forEach(function(value) {
          var url = {};
          url.categories = value;
          var categoryInfo = {name : value, url : $httpParamSerializer(url)};
          that.data.push(categoryInfo);
        })
          $scope.complete = true;
      }).error(function(data, status){
        console.log(data, status);
        that.categories = [];
        $scope.complete = true;
      });
  }]);

    
 	
