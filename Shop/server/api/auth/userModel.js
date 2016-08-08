// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        str: String,
        lat: String,
        lng: String
    },
    bankAccount: String,
    password: String

});

User.plugin(passportLocalMongoose);


module.exports = mongoose.model('users', User);
