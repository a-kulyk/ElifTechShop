var Transaction = require('../models/transaction').Transaction;
var Account = require('../models/account').Account;

function event(from, to, accounts) {
    for (let item in accounts) {
        let account = accounts[item];
        if (account.owner == from && account.owner == to) {
            return "payment";
        } else if (account.owner == from) {
            return "transfer";
        } else if (account.owner == to) {
            return "receive";
        }
    }
    return false;
}

exports.get = function (req, res) {
    let user = req.session.user;
    Promise.all([Transaction.find().sort({date: 1}).exec(), Account.find({owner: user}).exec()])
        .then(function (result) {
            let history = [];
            for (let item in result[0]) {
                let transaction = result[0][item];
                //   let event = event(transaction.from, transaction.to, result[1]);
                let event = false;

                for (let item in result[1]) {
                    let account = result[1][item];
                    if (account.owner == user) {
                        if (account._id  == transaction.from && account._id == transaction.to) {
                            event = "payment";
                        } else if (account._id  == transaction.from) {
                            event = "transfer";
                        } else if (account._id  == transaction.to) {
                            event = "receive";
                        }
                    }
                }
                if (event) {
                    history.push({
                        "id": transaction._id,
                        "sender": transaction.from,
                        "receiver": transaction.to,
                        "event": event,
                        "amount": transaction.amount,
                        "date": transaction.date
                    });
                }
            }
            res.send({
                "success": true,
                "history": history
            });
        })
        .catch(function (error) {
            res.send({
                "success": false,
                "errorDescription": error.message
            })
        });
};