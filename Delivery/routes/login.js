/**
 * Created by dmytro on 08.08.16.
 */
'use strict';
let User = require('../models/user');

exports.post = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({username: username}, function (err, user) {
        if (err) {
            console.log(err);
            return;
        }

        if (user) {
            if (user.checkPassword(password)) {
                console.log('welcome');
                req.session.user = 'admin';
                res.json({"success": true});
            } else {
                //403
                console.log('incorrect login or password')
            }
        }
    });
}