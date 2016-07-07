var Transaction = require('../models/transaction').Transaction;

exports.get = function (req, res) {
    var user = req.session.user;
    Transaction.find({
            $or: [
                { from: user },
                { to: user }
            ]
        }).exec()
        .then(function (result) {
                res.send({
                    "success": true,
                    "transactions": result
                })
        })
        .catch(function (error) {
            res.send({
                "success": false,
                "errorDescription": error
            })
        });
};