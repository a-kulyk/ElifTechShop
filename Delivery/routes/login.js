/**
 * Created by dmytro on 08.08.16.
 */
'use strict';

exports.login = function (passport) {
    return function (req, res, next) {
        passport.authenticate('login',
            function (err, user) {
                return err ? next(err) : user ? req.logIn(user, function (err) {
                    return err ? res.json({"success": false}) : res.json({"success": true});
                })
                    : res.json({"success": false});
            }
        )(req, res, next);
    }
} 