let Account = require('../models/account').Account;

exports.post = function (req, res) {
    let user = req.session.user;
    console.log(user);
    if(user) {
        let account = new Account({owner: user, amount: 0});
        account.save()
            .then(function (account) {
                if(account) {
                    return res.send({
                        "success": true,
                        "account": account
                    });
                } else {
                    throw new Error("Failed to create");
                }
            })
            .catch(function (error) {
                return res.send({
                    "success": false,
                    "errorDescription": error.message
                });
            });
    } else {
        return res.send({
            "success": false,
            "errorDescription": "Not login"
        });
    }
};

exports.get = function (req, res) {
    let user = req.session.user;
    if(user) {
        Account.find({owner: user}).exec()
            .then(function (result) {
                if(result) {
                    return res.send({
                        "success": true,
                        "accounts": result
                    });
                }
                throw new Error("Not found");
            })
            .catch(function (error) {
                return res.send({
                    "success": false,
                    "errorDescription": error.message
                })
            });
    }
};

exports.delete = function (req, res) {
  let user = req.session.user;
   // console.log("Account id "+req.params.id);
    Account.findOne({_id: req.params.id})
        .then(function (account) {
           // console.log(account);
            if(account.owner == user){
                console.log("ready");
                return account.remove();
            }
            throw new Error("Forbidden");
        })
        .then(function (account) {
            res.send({
                "success": true
            });
        })
        .catch(function (error) {
            res.send({
                "success": false,
                "errorDescription": error.message
            });
        });
};