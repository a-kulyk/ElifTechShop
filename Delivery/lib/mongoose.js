'use strict'

let mongoose = require('mongoose');
let config = require('../config');
let uri = process.env.NODE_ENV == 'production' ? config.get('mongoose:production_uri')
    : config.get('mongoose:development_uri');

mongoose.connect(uri);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('connected to' + ' ' + uri);
});

module.exports = mongoose;
