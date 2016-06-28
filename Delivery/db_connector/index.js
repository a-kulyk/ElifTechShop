/**
 * Created by dmytro on 28.06.16.
 */
var mongojs = require('mongojs')
var config = require('../config');

var dbProterties = config.get('db');
var db = mongojs(dbProterties.url, dbProterties.collections);
var dbConnector = new Object;
dbConnector.db = db;
dbConnector.mongojs = mongojs;

db.on('connect', function () {
    console.log('database connected')
});

module.exports = dbConnector;