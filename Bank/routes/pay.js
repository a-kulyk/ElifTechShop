var Transaction = require('../models/transaction').Transaction;

exports.post = function(req, res){
    Transaction.action(req.session.user, req.session.user, req.body.amount)
        .then(function (result) {
            if(result){
                res.send({
                   "success": true,
                    "amount": result[0][1].amount
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
