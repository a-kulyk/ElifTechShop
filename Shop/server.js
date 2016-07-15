var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var catalog = require('./routes/catalog');
var login = require('./routes/login');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var authData = require('./config/auth_dev');

passport.use(new LocalStrategy(
    function(username, password, done) {
        if(authData.name !== username || authData.password !== password) {
            return done(null, false);
        }

        return done(null, {username: authData.name, password: authData.password});
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'ToDO:',    //ToDO:
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
//app.use(methodOverride());

var auth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        res.json({
            success: false,
            error: {
                name: 'authentication error',
                message: 'authentication error',
                type: 'AuthError'
            }
        });
    } else {
        next();
    }
};
app.use('/items', auth, catalog);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res/*, next*/) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res/*, next*/) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
