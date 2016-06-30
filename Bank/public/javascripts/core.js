var bank = angular.module('bank',[]);
bank.controller('loginController', function ($scope, $http) {
    $scope.title = "Bank";
    $scope.formData = {};
    $scope.signup = function () {
        if($scope.formData.password != $scope.formData.repeat){
            $scope.signup.error = "Passwords must be the same";
            return;
        }
      $http.post("/signup",{
            "username": $scope.formData.username,
            "password": $scope.formData.password
        })
          .success(function (data) {
          console.log(data);
              if(data.success) {
                  $scope.username = data.user.username;
                  $scope.id = data.user._id;
                  $scope.amount = data.user.amount;
                  document.getElementById("auth").style.display = "none";
                  document.getElementById("cabinet").style.display = "block";
                  $scope.formData.username = "";
                  $scope.formData.password = "";
                  $scope.loginError = "";
              } else{
                  $scope.signupError = data.errorDescription;
              }
      })
          .error(function (err) {
          console.log(err);
      })
    };

    $scope.login = function () {
        $http.post("/login",{
            "username": $scope.formData.username,
            "password": $scope.formData.password
        })
            .success(function (data) {
                if(data.success) {
                    $scope.username = data.user.username;
                    $scope.id = data.user._id;
                    $scope.amount = data.user.amount;
                    document.getElementById("auth").style.display = "none";
                    document.getElementById("cabinet").style.display = "block";
                    $scope.formData.username = "";
                    $scope.formData.password = "";
                    $scope.loginError = "";
                } else {
                    $scope.loginError = data.errorDescription;
                }
            })
            .error(function (err) {
                console.log(err);
            })
    };

    $scope.logout = function () {
      $http.post("/logout",{})
          .success(function (data) {
              if(data.success){
                  document.getElementById("cabinet").style.display = "none";
                  document.getElementById("auth").style.display = "block";
              }
          })
          .error(function (err) {
              console.log(err);
          })
    };

    $scope.payModal = function () {
        document.getElementById("modal").style.display = "block";
    };

    $scope.closeModal = function () {
        document.getElementById("modal").style.display = "none";
    };

    $scope.pay = function () {
        $http.post("/pay",{"amount": $scope.formData.amount})
            .success(function (data) {
                if(data.success){
                    $scope.amount = data.amount;
                    document.getElementById("modal").style.display = "none";
                } else {
                    $scope.payError = data.errorDescription;
                }
            })
            .error(function (err) {
                console.log(err);
            })
    };

    //testing

    // $scope.transaction = function () {
    //     $http.post("/transaction", {
    //         "API_KEY": "d6911f567ef734f18ea176481638cc8a",
    //         "from": "5773d50ef6e5bd063d119d27",
    //         "to": "5773c1b809aaa4fd2f7c4f9e",
    //         "amount": 2
    //     })
    //         .success(function (data) {
    //             console.log(data);
    //         })
    //         .error(function (err) {
    //             console.log(err);
    //         })
    // }

    $scope.transaction = function () {

        $http({
            method: "GET",
            url: "/get_transaction",
            params:{
                "id": "57740e570f1a20345ea4129a",
                "from": "5773d50ef6e5bd063d119d27",
                "to": "5773c1b809aaa4fd2f7c4f9e",
                "date": "2016-06-29",
                "amount": 5
            }
        })
            .success(function (data) {
                console.log(data);
            })
            .error(function (err) {
                console.log(err);
            })
    }

});