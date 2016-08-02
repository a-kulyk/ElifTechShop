var router = require('express').Router();
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;

var User = require('./userModel.js');

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


router.post('/register', function(req, res) {
  console.log(req.body);
  User.register(new User({ 
    username: req.body.username,
    email: req.body.email,
    address:  req.body.address
   }), req.body.password, function(err, account) {
    if (err) {
      console.log(err.message);
      return res.status(200).json({
        message: err.message
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(200).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true,
    user: req.user
  });
});

module.exports = router;
