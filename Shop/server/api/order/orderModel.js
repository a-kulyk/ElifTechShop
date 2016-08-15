var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Product = require('../catalog/catalogModel');

var Order = new Schema({
    userId: String,
    itemSet: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        category: String,
        name: String,
        price: Number,
        images: [String],
        quantity: Number
    }],
    email: String,
    status: String,
    total: Number,
    date: {
        created: Date,
        paid: Date,
        completed: Date
    },
    shippingAddress: {
        str: String,
        lat: String,
        lng: String
    },
    trackingCode: String

});

Order.methods.findTotal = function total() {
    return this.itemSet
        .map(function(item) {
            return item.productId.price * item.quantity;
        })
        .reduce(function(prev, curr) {
            return prev + curr;
        });
};


module.exports = mongoose.model('orders', Order);
