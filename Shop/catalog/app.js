var express = require('express');
var path= require('path');
var app = express();
var mongoose = require('mongoose');
var shop = require('./routes/shop.js');
var categories = require('./routes/categories.js');
var routes = require('./routes/index');
mongoose.connect('mongodb://localhost/first_app', function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(express.static(__dirname + '/public'));
app.use('/shop',shop);
app.use('/', routes);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

