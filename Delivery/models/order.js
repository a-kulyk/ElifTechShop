/**
 * Created by dmytro on 28.06.16.
 */
var mongoose = require('../lib/mongoose');
var orderStates = require('../common/enums/order-states').orderStates;

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
        travelTime: {
            type: Number,
            required: true
        },
        arrivalTime: {
            type: Date,
            required: true
        },
        trackingCode: {
            type: String,
            unique: true,
            required: true
        },
        state: {
            type: Number,
            default: orderStates.SHIPMENT,
            required: true
        },
        created: {
            type: Date,
            required: true
        }
    })
    ;

module.exports = mongoose.model('Order', schema);
