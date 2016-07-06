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
    User.findOne({_id: from})
        .then(function (result) {
            return User.findOne({_id: to});
        })
        .then(function (result) {
           console.log(result.all()); 
        });
};
exports.Transaction = mongoose.model('Transaction', schema);