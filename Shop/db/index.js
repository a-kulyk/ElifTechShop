var dbConfig = require('../config/database');
var mongojs = require('mongojs');
var db = mongojs(dbConfig.url, ['items']);


module.exports = db;