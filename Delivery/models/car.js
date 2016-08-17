/**
 * Created by dmytro on 09.07.16.
 */
'use strict';
let mongoose = require('../lib/mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
        isAvailable: {
            type: Boolean,
            required: true,
            default: true
        },
        _order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: {
                type: Schema.Types.ObjectId,
                ref: 'Order',
                required: true,
                default: null
            }
        },
        arrivalTime: {
            type: Date,
            default: null
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        }
    })
    ;

module.exports = mongoose.model('Car', schema);