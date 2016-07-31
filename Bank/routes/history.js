var Transaction = require('../models/transaction').Transaction;
var Account = require('../models/account').Account;
var User = require('../models/user').User;

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
    Account.find({owner: user}).exec()
        .then(function (result) {
            let accounts = result.map(account => account._id);
            return Promise.all([Transaction.find({
                $or: [
                    {
                    from: {
                        $in: accounts
                    }
                },
                    {
                        to: {
                            $in: accounts
                        }
                    },
                ],

            }).sort({date: -1}).exec(), Promise.resolve(accounts)]);
        })
        .then(function (result) {
            let transactions = result[0];
            let accounts = result[1];
            let history = [];
            for(let item in transactions){
                let transaction = transactions[item];
                var event = "";
                var from = "";
                var to = "";
                if(transaction.from == transaction.to){
                    Account.findOne({_id: transaction.from})
                        .then(function (result) {
                            console.log(result.name);
                            to = result.name;
                        })
                        .catch(function (error) {
                            throw new Error(error);
                        });
                    event = "payment";
                } else if(accounts.indexOf(transaction.from) != -1){
                    Account.findOne({_id: transaction.to})
                        .then(function (result) {
                            return Promise.all([User.findOne({_id: result.owner}), Promise.resolve(result)]);
                        })
                        .then(function (result) {
                            from = result[0].name + " " + result[1].name;
                            return Account.findOne({_id: transaction.from});
                        })
                        .then(function (result) {
                            to = result.name;
                        })
                        .catch(function (error) {
                            throw new Error(error);
                        });
                    event = "transfer";
                } else if(accounts.indexOf(transaction.to) != -1){
                    Account.findOne({_id: transaction.from})
                        .then(function (result) {
                            return Promise.all([User.findOne({_id: result.owner}), Promise.resolve(result)]);
                        })
                        .then(function (result) {
                            from = result[0].name + " " + result[1].name;
                            return Account.findOne({_id: transaction.to});
                        })
                        .then(function (result) {
                            to = result.name;
                        })
                        .catch(function (error) {
                            throw new Error(error);
                        });
                    event = "receive";
                }
                console.log(to);
                history.push({
                    "id": transaction._id,
                    "sender": from,
                    "receiver": to,
                    "event": event,
                    "amount": transaction.amount,
                    "date": transaction.date
                });
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


    // Promise.all([Transaction.find().sort({date: -1}).exec(), Account.find({owner: user}).exec()])
    //     .then(function (result) {
    //         let history = [];
    //         for (let item in result[0]) {
    //             let transaction = result[0][item];
    //             //   let event = event(transaction.from, transaction.to, result[1]);
    //             let event = false;
    //
    //             for (let item in result[1]) {
    //                 let account = result[1][item];
    //                 if (account.owner == user) {
    //                     if (account._id  == transaction.from && account._id == transaction.to) {
    //                         event = "payment";
    //                     } else if (account._id  == transaction.from) {
    //                         event = "transfer";
    //                     } else if (account._id  == transaction.to) {
    //                         event = "receive";
    //                     }
    //                 }
    //             }
    //             if (event) {
    //                 history.push({
    //                     "id": transaction._id,
    //                     "sender": transaction.from,
    //                     "receiver": transaction.to,
    //                     "event": event,
    //                     "amount": transaction.amount,
    //                     "date": transaction.date
    //                 });
    //             }
    //         }
    //         res.send({
    //             "success": true,
    //             "history": history
    //         });
    //     })
    //     .catch(function (error) {
    //         res.send({
    //             "success": false,
    //             "errorDescription": error.message
    //         })
    //     });
};