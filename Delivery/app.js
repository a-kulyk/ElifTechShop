
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var config = require('config');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(validator());

//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.get('port'), function () {
    console.log('Delivery app listening on port' + ' ' + config.get('port'));
});

require('controllers')(app);