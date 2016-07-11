bank.controller('cabinet', function ($scope, $http, $location) {
    
    $http.get("/islogin")
        .success(function (result) {
            if(!result.success){
                $location.path("/");
            }
        })
        .catch(function (error) {
           console.log(error);
            $location.path("/");
        });

    $http.get("/user")
        .success(function (data) {
            $scope.username = data.username;
            $scope.id = data.id;
            $scope.amount = data.amount;
        })
        .error(function (error) {
            console.log(error);
        });

    $scope.history();

    $scope.logout = function () {
        $http.post("/logout",{})
            .success(function (data) {
                if(data.success){
                    $location.path("/");
                }
            })
            .error(function (err) {
                console.log(err);
            })
    };

    $scope.payModal = function () {
        document.getElementById("modal").style.display = "block";
    };

    $scope.transferModal = function () {
        document.getElementById("modalTransfer").style.display = "block";
    };


});