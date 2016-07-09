var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Order = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    itemSet: [{
    	itemId: String,
    	quantity: Number
    }],
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: String,
    total: Number,
    date: {
    	created: Date,
    	paid: Date,
    	completed: Date
    }
});


module.exports = mongoose.model('orders', Order);