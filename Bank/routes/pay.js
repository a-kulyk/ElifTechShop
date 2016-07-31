var Transaction = require('../models/transaction').Transaction;
var Account = require('../models/account').Account;

exports.post = function(req, res){
    Account.findOne({_id: req.body.account})
        .then(function (account) {
            if(account.owner == req.session.user) {
                return Transaction.action(account._id, account._id, req.body.amount);
            } else {
                throw new Error("Forbidden");
            }
        })
        .then(function (result) {
            if (result) {
                res.send({
                    "success": true,
                    "id": result.transactionId,
                    "accountAmount": result.to.amount,
                    "accountId": result.to._id,
                    "transactionId": result.transactionId,
                    "amount": result.amount
                });
            } else {
                throw new Error("Server error")
            }
        })
        .catch(function (error) {
            res.send({
                "success": false,
                "errorDescription": error
            });
        })

};
