// dependencies
var express = require('express');
var config = require('./config');
// var api = require('./api/api');

// create instance of express
var app = express();
// var router = app.Router();

// mongoose
require('mongoose').connect(config.dbUrl,
  function(err) {
    err ? console.log('connection error', err) : console.log('connection successful');
});

// setup the app middlware
require('./appMiddlware')(app);

// routes
// app.use('/', api);
app.use('/user', require('./api/auth/authRoutes'));
app.use('/order', require('./api/order/orderRoutes'));
app.use('/catalog',require('./api/catalog/catalogRoutes'));

// error handlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log({message: err.message});
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
