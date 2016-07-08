let User = require("./user").User;
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
    Transaction = this;
    let fromUser = User.findOne({_id: from});
    let toUser = User.findOne({_id: to});
    let usersAmount = Promise.all([fromUser, toUser])
        .then(function (result) {
            if(result[0]._id != result[1]._id){
                if(result[0].amount < amount){
                    throw new Error("Insufficient funds");
                }
                result[0].amount -= amount;
                result[1].amount += amount;
            } else {
                result[1].amount += amount;
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

    return Promise.all([usersAmount, transaction.save()]);
};
exports.Transaction = mongoose.model('Transaction', schema);