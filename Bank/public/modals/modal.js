bank.controller('modal', function ($scope, $http) {
    

    $scope.closeModal = function () {
        document.getElementById("modal").style.display = "none";
    };
    $scope.closeModalTransfer = function () {
        document.getElementById("modalTransfer").style.display = "none";
    };

    $scope.pay = function () {
        $http.post("/pay",{"amount": $scope.formData.amount})
            .success(function (data) {
                if(data.success){
                    $scope.amount = data.amount;
                    document.getElementById("modal").style.display = "none";
                    $scope.history();
                } else {
                    $scope.payError = data.errorDescription;
                }
            })
            .error(function (err) {
                console.log(err);
            });
    };

    $scope.transfer = function () {
        $http.post("/transfer", {
            "to": $scope.formData.receiver,
            "amount": $scope.formData.amount
        })
            .success(function (data) {
                $scope.amount = data.amount;
                document.getElementById("modalTransfer").style.display = "none";
                $scope.history();
            })
            .error(function (err) {
                console.log(err);
            });
    };
});
