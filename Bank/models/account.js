var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;
var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true
    }
});
exports.Account = mongoose.model('Account', schema);