angular.module('myApp').controller('mainController',
  ['$scope', '$rootScope', '$location', 'AuthService',
  function ($scope, $rootScope, $location, AuthService) {
    var main = this;

    AuthService.getUser()
      .then(function(data) {
        // console.log(data);
        $rootScope.currentUser = data;
      });

    $scope.login = function() {
      $location.path('/login');
    }  
    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $rootScope.currentUser = null;
          $location.path('/login');
          
        });
    };
}]);


angular.module('myApp').controller('loginController',
  ['$scope', '$rootScope', '$location', 'AuthService',
  function ($scope, $rootScope, $location, AuthService) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      
      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          
          $scope.disabled = false;
          AuthService.getUser()
            .then(function(data) {
              // console.log(data);
              $rootScope.currentUser = data;
            });
          $scope.loginForm = {};
          $location.path('/');
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
    };

    $scope.register = function() {
      $location.path('/register');
    };

}]);

angular.module('myApp').controller('logoutController',
  ['$rootScope', '$scope', '$location', 'AuthService',
  function ($rootScope, $scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $rootScope.currentUser = null;
          $location.path('/login');
        });
    };

}]);

angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      console.log($scope.registerForm)

      // call register from service
      AuthService.register($scope.registerForm)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
    };

    $scope.login = function() {
      $location.path('/login');
    };
}]);