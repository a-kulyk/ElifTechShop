var dbConfig = require('../config/database');
// var mongojs = require('mongojs');
// var db = mongojs(dbConfig.url, ['items']);
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we're connected to Mongo");
});

module.exports = mongoose;