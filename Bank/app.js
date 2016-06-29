// var express = require('express');
// var path = require('path');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var http = require('http');
// var config = require('./config');
// var routes = require('./routes/index');
// var mongoose = require('./libs/mongoose');
// var session = require('express-session');
// var User = require('./models/user').User;
// //var HttpError = require('./error').HttpError;
// var app = express();
//
//
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
//
// app.set('port', config.get('port'));
//
// //app.use(logger('dev'));
//
// //app.use(cookieParser());
// //
// //app.use(app.router);
//
// //require('./routes')(app);
//
// app.use(express.static(path.join(__dirname, 'public')));
//
// // var mongoStore = require('connect-mongo')(session);
// //
// // app.use(session({
// //     secret: config.get('session:secret'),
// //     key: config.get('session:key'),
// //     cookie: config.get('session:cookie'),
// //     store: new mongoStore({
// //         mongooseConnection: mongoose.connection
// //     })
// // }));
//
// // app.use(function (req, res, next) {
// //    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
// //     res.send("Visits: " + req.session.numberOfVisits);
// // });
// http.createServer(app).listen(app.get('port'), function () {
//     console.log('Listening on port ' + app.get('port'));
//
// });
// app.get('/', function (req, res) {
//    res.end("Hello");
// });
//


var express = require('express');
var path = require('path');
var http = require('http');
var config = require('./config');
var mongoose = require('./libs/mongoose');
 var session = require('express-session');
//var Hello = require("./models/hello").Hello;
var bodyParser = require('body-parser');

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
 // app.use(express.json());       // to support JSON-encoded bodies
 // app.use(express.urlencoded());

app.set('port', config.get('port'));
app.use(express.static('public'));
var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
// app.use(function (req, res, next) {
//
// });

http.createServer(app).listen(app.get('port'),function () {
    console.log('Listening on port '+app.get('port'));
});



require('./routes')(app);

