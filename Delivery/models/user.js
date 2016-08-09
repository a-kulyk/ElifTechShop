/**
 * Created by dmytro on 08.08.16.
 */
'use strict'
var mongoose = require('../lib/mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password)
    }).get(function () {
    return this.plainPassword;
});

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
}

module.exports = mongoose.model('User', schema);