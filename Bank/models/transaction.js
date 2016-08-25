let Account = require("./account").Account;
var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;
var schema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

schema.statics.action = function (from, to, amount) {
    let Transaction = this;
    amount = parseInt(amount, 10);
    let fromUser = Account.findOne({_id: from, enabled: true});
    let toUser = Account.findOne({_id: to, enabled: true});
    let usersAmount = Promise.all([fromUser, toUser])
        .then(function (result) {
            if(from != to){
                if(result[0].amount < amount){
                    throw new Error("Insufficient funds");
                }
                result[0].amount -= amount;
                result[1].amount += +amount;
            } else {
                result[1].amount += +amount;
            }
            return Promise.all([result[0].save(), result[1].save()]);
        })
        .catch(function (error) {
           return Promise.reject(error);
        });
    let transaction = new Transaction({
        from: from,
        to: to,
        amount: amount
    });

    return Promise.all([usersAmount, transaction.save()])
        .then(function (data) {
          //  console.log(data);
            let result = {};
                result.from = data[0][0];
                result.to = data[0][1];
                result.transactionId = data[1]._id;
                result.amount = data[1].amount;
            return Promise.resolve(result);
        })
        .catch(function (error) {
            console.log(error);
            return Promise.reject(error);
        });
};
exports.Transaction = mongoose.model('Transaction', schema);