var bank = angular.module('bank',[]);
bank.controller('loginController', function ($scope, $http) {

    $scope.title = "Bank";
    $scope.formData.username = '';
    $scope.formData.password = '';
    $scope.formData.repeat = '';
    $scope.signup = function () {
        if($scope.formData.password != $scope.formData.password){
            $scope.signup.error = "Passwords must be the same";
            return;
        }
      $http.post("/signup",{
            "username": $scope.formData.username,
            "password": $scope.formData.password
        })
          .success(function (data) {
          console.log(data);
      })
          .error(function (err) {
          console.log(err);
      })
    };

});