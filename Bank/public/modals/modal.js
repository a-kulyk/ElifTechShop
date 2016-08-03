var bank = require("../app");
var shared = require("../cabinet/shared");

bank.controller('modal', function ($scope, close, $http, ModalService, shared) {

    $scope.accounts = shared.getAccounts();
    $scope.focusAccount = shared.getAccount();
    $scope.message = shared.getMessage();
    $scope.close = function () {
        ModalService.close();
    };
    $scope.pay = function () {
        $http.post("/pay",{
            "account": $scope.focusAccount,
            "amount": $scope.formData.amount
        })
            .success(function (data) {
                if(data.success){
                   // console.log(data);
                    $('.modal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    close({
                        "id": data.id,
                        "accountAmount": data.accountAmount,
                        "accountId": data.accountId,
                        "accountName": data.accountName,
                        "amount": data.amount
                    }, 500);
                    ModalService.close();
                } else {
                    $scope.payError = data.errorDescription;
                }
            })
            .error(function (err) {
                console.log(err);
            });
    };
    
    $scope.confirm = function (result) {
        $('.modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        close({
            "result": result
        }, 500);
        ModalService.close();
    };
    
    $scope.transfer = function () {
        $http.post("/transfer", {
            "from": $scope.formData.from,
            "to": $scope.formData.receiver,
            "amount": $scope.formData.amount
        })
            .success(function (data) {
                if(data.success){
                    $('.modal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    console.log(data);
                    close({
                        "id": data.id,
                        "senderAmount": data.senderAmount,
                        "amount": data.amount,
                        "sender": data.senderName,
                        "receiver": data.receiverName + " " + data.receiverAccountName,
                        "receiverAmount": data.receiverAmount

                    }, 500);
                    ModalService.close();
                }
                
            })
            .error(function (err) {
                console.log(err);
            });
    };
    
    $scope.newAccount = function () {
        $http.post("/account",{name: $scope.name})
            .success(function (account) {
                if(account.success){
                    $('.modal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    close({
                        account: account.account
                    }, 500);
                    ModalService.close();
                }
            })
            .error(function (error) {
                console.log(error);
            });
    }
});
