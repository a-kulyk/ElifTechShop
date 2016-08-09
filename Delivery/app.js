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

app.use(session({
    secret: config.get('session:secret'),
    cookie: config.get('session:cookie'),
    store: new MongoStore({
        url: 'mongodb://localhost:27017/delivery'
    })
}));

app.use(validator());

app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.get('port'), function () {
    console.log('Delivery app listening on port' + ' ' + config.get('port'));
});

require('./routes')(app);