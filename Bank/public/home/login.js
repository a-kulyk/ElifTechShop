bank.controller('login', function ($scope, $location, $http) {
    $scope.login = function () {
        $http.post("/login",{
            "username": $scope.username,
            "password": $scope.password
        })
            .success(function (data) {
                if(data.success) {
                    $location.path("/cabinet");
                    // $scope.username = data.user.username;
                    // $scope.id = data.user._id;
                    // $scope.amount = data.user.amount;
                    // document.getElementById("auth").style.display = "none";
                    // document.getElementById("cabinet").style.display = "block";
                    // $scope.formData.username = "";
                    // $scope.formData.password = "";
                    // $scope.loginError = "";
                } else {
                    $scope.loginError = data.errorDescription;
                }
            })
            .error(function (err) {
                $scope.loginError = err;
                console.log(err);
            });
        $scope.history();
    };
});