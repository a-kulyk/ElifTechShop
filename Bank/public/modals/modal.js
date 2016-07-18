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
                    $('.modal').modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    close({
                        "amount": data.userAmount,
                        "accountId": data.accountId,
                        "history": {
                            "_id": data.transactionId,
                            "amount": data.amount,
                            "event": "payment",
                            "destination": "Payment",
                            "date": new Date()
                        }
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
                    close({
                        "senderAmount": data.senderAmount,
                        "sender": data.sender,
                        "receiver": data.receiver,
                        "receiverAmount": data.receiverAmount,
                        "history": {
                            "_id": data.transactionId,
                            "amount": data.amount,
                            "event": "transfer",
                            "destination": data.receiver,
                            "date": new Date()
                        }
                    }, 500);
                    ModalService.close();
                }
                
                
                
                console.log(data);
                $scope.cabinet.amount = data.amount;
                document.getElementById("modalTransfer").style.display = "none";
                $scope.cabinet.history.unshift({
                    "_id": data.transactionId,
                    "event": "transaction",
                    "destination": data.receiver,
                    "date": new Date()
                });
            })
            .error(function (err) {
                console.log(err);
            });
    };
});
