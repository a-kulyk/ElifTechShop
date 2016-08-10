/**
 * Created by dmytro on 08.08.16.
 */
'use strict';
let userService = require('../services/user-service');

exports.post = function (req, res) {
    let successMsg = {"success": true};
    let failedMsg = {"success": false};

    let username = req.body.username;
    let password = req.body.password;

    userService.authorize(username, password)
        .then((isSuccessful)=> {
            if (isSuccessful) {
                req.session.user = 'admin';
                res.json(successMsg);
            } else {
                failedMsg.message = 'AccessDenied'
                res.json(failedMsg);
            }
        }).catch(err=> {
        failedMsg.message = err.message;
        res.json(failedMsg);
    });
}