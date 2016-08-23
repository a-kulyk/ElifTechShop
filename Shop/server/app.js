// dependencies
var express = require('express');
var config = require('./config');
var ping = require('express-ping').ping;

// create instance of express
var app = express();

// mongoose
require('mongoose').connect(config.dbUrl,
  function(err) {
    err ? console.log('connection error', err) : console.log('connection successful');
});

// setup the app middlware
require('./appMiddlware')(app);

// routes
app.use('/user', require('./api/auth/authRoutes'));
app.use('/order', require('./api/order/orderRoutes'));
app.use('/catalog',require('./api/catalog/catalogRoutes'));
app.use(ping());
// error handlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 200);
  console.log({message: err.message});
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }));
});

module.exports = app;
