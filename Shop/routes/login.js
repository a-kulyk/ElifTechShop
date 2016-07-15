'use strict';

var express = require('express');
var router = express.Router();
var passport = require('passport');

router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user/*, info*/) {
        if (err) {
            return next(err);
        }

        if (user === false) {
            res.json({
                success: false,
                error: {
                    name: 'authentication error',
                    message: 'authentication error',
                    type: 'AuthError'
                }
            });
            return;
        }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.json({success: true});
        });



    })(req, res, next);
});

module.exports = router;
