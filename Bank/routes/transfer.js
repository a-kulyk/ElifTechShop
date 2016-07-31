let Transaction = require("../models/transaction").Transaction;
let Account = require("../models/account").Account;

exports.post = function (req, res) {
    if(req.body.to == req.session.user){
        throw new Error("Disable");
    } else {
        Account.findOne({_id: req.body.from})
            .then(function (account) {
               if(account.owner != req.session.user){
                   throw new Error("Forbidden");
               } 
                return Transaction.action(req.body.from, req.body.to, req.body.amount);
            })
            .then(function (result) {
                if(result){
                    console.log(result);
                    res.send({
                        "success": true,
                        "id": result.transactionId,
                        "sender": result.from._id,
                        "transactionId": result.to._id,
                        "amount": result.amount,
                        "senderAmount": result.from.amount,
                        "receiverAmount": result.to.amount,
                        "receiver": result.to._id
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
