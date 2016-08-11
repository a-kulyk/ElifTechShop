var Transaction = require('../models/transaction').Transaction;
var Account = require('../models/account').Account;
var User = require('../models/user').User;

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
                    }
                ]

            }).sort({date: -1}).exec(), Promise.resolve(result), Promise.resolve(accounts)]);
        })
        .then(function (result) {
            let transactions = result[0];
            let ownAccounts = result[1];
            let ownAccountsId = result[2];
            let accountsFromId = transactions.map(transaction => transaction.from);
            let accountsId = accountsFromId.concat(transactions.map(transaction => transaction.to));
            return Promise.all([
                Account.find({
                    $and: [
                        {
                            _id: {
                                $in: accountsId
                            }
                        },
                        {
                            _id: {
                                $nin: ownAccountsId
                            }
                        }
                    ]
                }).exec(),
                Promise.resolve(ownAccounts),
                Promise.resolve(transactions)
            ]);
        })
        .then(function (result) {
            let accounts = result[0];
            let ownAccounts = result[1];
            let transactions = result[2];
            let usersId = accounts.map(account => account.owner);
            return Promise.all([
               User.find({
                   _id:{
                       $in: usersId
                   }
               }).exec(),
                Promise.resolve(accounts),
                Promise.resolve(ownAccounts),
                Promise.resolve(transactions)
            ]);
        })
        .then(function (result) {
            let users = result[0];
            let accounts = result[1];
            let ownAccounts = result[2];
            let transactions = result[3];
            let history = [];
            let event, from, to;
            for(let item in transactions){
                let transaction = transactions[item];
                if(transaction.from == transaction.to){
                    event = "payment";
                    to = ownAccounts.find(account => account._id.equals(transaction.to)).name;
                } else if(ownAccounts.find(account => account._id.equals(transaction.from))){
                    event = "transfer";
                    from = ownAccounts.find(account => account._id.equals(transaction.from)).name;
                    let receiverAccount = accounts.find(account => account._id.equals(transaction.to));
                    let receiver = users.find(user => user._id.equals(receiverAccount.owner));
                    to = receiver.username + " " + receiverAccount.name;
                } else if(ownAccounts.find(account => account._id.equals(transaction.to))){
                    event = "receive";
                    to = ownAccounts.find(account => account._id.equals(transaction.to)).name;
                    let senderAccount = accounts.find(account => account._id.equals(transaction.from));
                    let sender = users.find(user => user._id.equals(senderAccount.owner));
                    from = sender.username + " " + senderAccount.name;
                }
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
            })
        })
        .catch(function (error) {
            console.log(error);
            res.send({
                "success": false,
                "errorDescription": error.message
            })
        });
};