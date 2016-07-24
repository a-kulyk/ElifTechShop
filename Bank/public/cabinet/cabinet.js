var bank = require("../app");
var shared = require("./shared");
bank.controller('cabinet', function ($scope, $http, $location, ModalService, shared) {
    
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
    
    $http.get("/account")
        .success(function (result) {
            $scope.accounts = [];
            for(let account in result.accounts){
                $scope.accounts.push(result.accounts[account]);
            }
        })
        .error(function (error) {
           console.log(error);
        });
    
    $scope.history = function () {
        $http.get("/history")
            .success(function (data) {
                console.log(data);
                $scope.history = data.history;

            })
            .error(function (err) {
                console.log(err.message);
            });
    };

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

    $scope.payModal = function (id) {
        shared.setAccount(id);
        ModalService.showModal({
            templateUrl: "../modals/pay.html",
            controller: "modal"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result) {
                   // console.log(result);
                    for(let i=0; i<$scope.accounts.length; i++){
                        if($scope.accounts[i]._id == result.accountId){
                            $scope.accounts[i].amount = result.amount;
                        }
                    }
                    $scope.history.unshift(result.history);
                }
            });
        });
    };

    $scope.transferModal = function () {
        shared.setAccounts($scope.accounts);
        ModalService.showModal({
            templateUrl: "../modals/transfer.html",
            controller: "modal"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result) {
                    for(let i=0; i<$scope.accounts.length; i++){
                        if($scope.accounts[i]._id == result.sender){
                            $scope.accounts[i].amount = result.senderAmount;
                        }
                        if($scope.accounts[i]._id == result.receiver){
                            $scope.accounts[i].amount = result.receiverAmount;
                        }
                    }
                }
            });
        });
    };
    
    $scope.newAccount = function () {
        shared.setMessage("Are you sure, that you want to create new account?");
        ModalService.showModal({
            templateUrl: "../modals/confirm.html",
            controller: "modal"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result.result) {
                    $http.post("/account",{})
                        .success(function (account) {
                            $scope.accounts.push(account.account);
                        })
                        .error(function (error) {
                            console.log(error);
                        });
                }
            });
        });

    };

    $scope.deleteAccount = function(id){
        shared.setMessage("Are you sure, that you want to delete this account?");
        shared.setAccount(id);
        ModalService.showModal({
            templateUrl: "../modals/confirm.html",
            controller: "modal"
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result.result) {
                    $http.delete("/account/" + id)
                        .success(function (data) {
                            if(data.success){
                              for(let i = 0; i < $scope.accounts.length; i++){
                                  if($scope.accounts[i]._id == id){
                                      $scope.accounts.splice(i,1);
                                  }
                              }
                            }
                        });
                }
            });
        });
    };

    // $scope.transferModal = function () {
    //     document.getElementById("modalTransfer").style.display = "block";
    // };


});