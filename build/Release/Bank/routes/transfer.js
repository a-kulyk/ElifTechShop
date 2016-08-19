let Transaction = require("../models/transaction").Transaction;
let Account = require("../models/account").Account;
let User = require("../models/user").User;

exports.post = function (req, res) {
    if(req.body.to == req.body.from){
        return res.send({
            success: false,
            errorDescription: 'Disable'
        })
    } else {
        Account.findOne({_id: req.body.from, enabled: true})
            .then(function (account) {
               if(account.owner != req.session.user){
                   throw new Error('Forbidden');
               }
                return Transaction.action(req.body.from, req.body.to, req.body.amount);
            })
            .then(function (result) {
                return Promise.all([User.findOne({_id: result.to.owner}), Promise.resolve(result)]);
            })
            .then(function (result) {
                let receiver = result[0];
                let transaction = result[1];
                if(transaction){
                    res.send({
                        "success": true,
                        "id": transaction.transactionId,
                        "sender": transaction.from._id,
                        "senderName": transaction.from.name,
                        "transactionId": transaction.to._id,
                        "amount": transaction.amount,
                        "senderAmount": transaction.from.amount,
                        "receiverAmount": transaction.to.amount,
                        "receiver": transaction.to._id,
                        "receiverAccountName": transaction.to.name,
                        "receiverName": receiver.username
                    });
                } else {
                    throw new Error("Server error");
                }
            })
            .catch(function (error) {
                res.send({
                    "success": false,
                    "errorDescription": error.message
                });
            })
    }
};
