var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var config = require('./config');

// define middleware
module.exports = function(app) {
	app.use(express.static(path.join(__dirname, '../client')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(require('express-session')(config.secrets));
	app.use(passport.initialize());
	app.use(passport.session());
};