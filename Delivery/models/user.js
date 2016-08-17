/**
 * Created by dmytro on 08.08.16.
 */
'use strict'
let mongoose = require('../lib/mongoose');

module.exports = mongoose.model('User', {
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

