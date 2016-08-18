"use strict";
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let validator = require('express-validator');
let config = require('./config');
let app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());

let passport = require('passport');
let expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

let initPassport = require('./lib/passport/init');
initPassport(passport);

app.use(validator());

app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.get('port'), function () {
    console.log('Delivery app listening on port' + ' ' + config.get('port'));
});

require('./routes')(app, passport);

module.exports = app;