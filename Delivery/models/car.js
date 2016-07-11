/**
 * Created by dmytro on 09.07.16.
 */
var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
        isAvailable: {
            type: Boolean,
            required: true,
            default: true
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: {
                type: Schema.Types.ObjectId,
                ref: 'Order',
                default: null
            }
        }
    })
    ;

module.exports = mongoose.model('Car', schema);