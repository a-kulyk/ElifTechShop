"use strict";
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const validator = require('express-validator');
const config = require('./config');
const MongoStore = require('connect-mongo')(session);
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./lib/passport/init');
initPassport(passport);

app.use(validator());

app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.get('port'), function () {
    console.log('Delivery app listening on port' + ' ' + config.get('port'));
});

require('./routes')(app, passport);