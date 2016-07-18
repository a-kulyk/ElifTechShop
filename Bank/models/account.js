var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;
var schema = new Schema({
    owner: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});
exports.Account = mongoose.model('Account', schema);