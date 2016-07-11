var Transaction = require("../models/transaction").Transaction;

exports.post = function (req, res) {
    if (req.body.API_KEY != config.get("key")) {
        return res.send({
            "success": false,
            "errorDescription": "Invalid key"
        });
    }
    Transaction.action(req.body.from, req.body.to, req.body.amount)
        .then(function (result) {
            res.send({
                "success": true,
                "transaction_id": result.transactionId
            });
        })
        .catch(function (error) {
            res.send({
                "success": false,
                "errorDescription": error
            });
        });

};