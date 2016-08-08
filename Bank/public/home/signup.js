//var bank = require("../app");
export default (app) => {
    app.controller('signup', function ($scope, $http, $location) {
        $scope.signup = function () {
            if ($scope.password != $scope.repeat) {
                $scope.signupError = "Passwords must be the same";
                return;
            }
            $http.post("/signup", {
                    "username": $scope.username,
                    "password": $scope.password
                })
                .success(function (data) {
                    console.log(data);
                    if (data.success) {
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
                        $scope.signupError = data.errorDescription;
                    }
                })
                .error(function (err) {
                    $scope.signupError = err;
                    console.log(err);
                });

        };
    });
}
