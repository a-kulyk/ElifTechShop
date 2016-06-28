var express = require('express');
var bodyParser = require("body-parser");
var config = require('./config');
var orderService = require('./services/order-service')

var app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.listen(config.get('port'), function () {
    console.log('Delivery app listening on port 3000!');
})

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/order', function (req, res) {
    var title = req.body.title;
    var price = req.body.price;
    console.log(title + ' ' + price);
    res.sendStatus(200);
});