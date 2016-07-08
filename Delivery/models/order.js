/**
 * Created by dmytro on 28.06.16.
 */
var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        from: {
            username: {
                type: String,
                required: true
            },
            lng: {
                type: Number,
                required: true
            },
            lat: {
                type: Number,
                required: true
            }
        },
        to: {
            username: {
                type: String,
                required: true
            },
            lng: {
                type: Number,
                required: true
            },
            lat: {
                type: Number,
                required: true
            }
        },
        deliveryDate: {
            type: Date,
            required: true
        },
        trackingCode: {
            type: String,
            unique: true,
            required: true
        }
    })
    ;

module.exports = mongoose.model('Order', schema);
