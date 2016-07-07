let Transaction = require("../models/transaction").Transaction;

exports.post = function (req, res) {
    if(req.body.to == req.session.user){
        throw new Error("Disable");
    } else {
        Transaction.action(req.session.user, req.body.to, req.body.amount)
            .then(function (result) {
                if(result){
                    res.send({
                       "success": true,
                        "transaction_id": result[1]._id,
                        "amount": result[0][0].amount
                    });
                } else {
                    throw new Error("Server error");
                }
            })
            .catch(function (error) {
                res.send({
                    "success": false,
                    "errorDescription": error
                });
            })
    }
};
