'use strict'

let mongoose = require('mongoose');
let config = require('../config');

mongoose.connect(config.get('mongoose:uri'));

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
 console.log('connected to'+' '+config.get('mongoose:uri'));
 });

module.exports = mongoose;
