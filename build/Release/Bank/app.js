var express = require('express');
var path = require('path');
var http = require('http');
var config = require('./config');
var mongoose = require('./libs/mongoose');
 var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.set('port', config.get('port'));
app.use(express.static('public'));
var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    resave: config.get('session:resave'),
    saveUninitialized: config.get('session:saveUninitialized'),
    cookie: config.get('session:cookie'),
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

http.createServer(app).listen(app.get('port'),function () {
    console.log('Listening on port '+app.get('port'));
});

console.log(process.env.NODE_ENV ? process.env.NODE_ENV : 'develop');

require('./routes')(app);
