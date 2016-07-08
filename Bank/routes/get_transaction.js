var Transaction = require('../models/transaction').Transaction;

exports.get = function (req, res) {
    let date = new Date(req.query.date);
    let nextDate = new Date(date.getFullYear(),(date.getMonth()),(date.getDate()+2),-21);
    console.log(date);
    console.log(nextDate);
    Transaction.findOne({
        _id: req.query.id,
        from: req.query.from,
        to: req.query.to,
        amount: req.query.amount,
        date: {
            "$gte": req.query.date,
            "$lt": Date.parse(nextDate)
        }
    })
        .then(function (result) {
            if(result) {
                res.send({
                    "success": true,
                    "exists": true
                });
            } else {
                res.send({
                    "success": true,
                    "exists": false
                });
            }
        })
        .catch(function (error) {
            res.send({
                "success": false,
                "errorDescription": error
            });
        });  
};