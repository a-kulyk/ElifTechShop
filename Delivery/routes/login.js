/**
 * Created by dmytro on 08.08.16.
 */
'use strict';
let responseFactory = require('../common/response-factory');

exports.login = function (passport) {
    return function (req, res, next) {
        passport.authenticate('login',
            function (err, user) {
                return err ? next(err) : user ? req.logIn(user, function (err) {
                    return err ? res.json(responseFactory.failedMessage()) : res.json(responseFactory.successMessage());
                })
                    : res.json(responseFactory.failedMessage());
            }
        )(req, res, next);
    }
} 