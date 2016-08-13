var Transaction = require('../models/transaction').Transaction;
var config = require('../config');
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
                "errorDescription": error.message
            });
        });

};

exports.get = function (req, res) {
  // console.log(req.query);
    let date = new Date(req.query.date_year, req.query.date_month - 1, req.query.date_day);
    date = new Date(date.getFullYear(),(date.getMonth()),(date.getDate()+1),-21);
    let nextDate = new Date(date.getFullYear(),(date.getMonth()),(date.getDate()+2),-21);
    //console.log(date);
    //console.log(nextDate);
    Transaction.findOne({
        _id: req.query.id,
        from: req.query.from,
        to: req.query.to,
        amount: req.query.amount,
        //date: {
        //    "$gte": date,
        //    "$lt": Date.parse(nextDate)
        //}
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
                "errorDescription": error.message
            });
        });
};