/**
 * Created by dmytro on 11.08.16.
 */
"use strict";

exports.get = function (req, res) {
    let successMsg = {"success": true, "role": "admin"};
    let failedMsg = {"success": false, "role": "guest"};
    if (req.session.user == 'admin') {
        res.json(successMsg);
    } else {
        failedMsg.message = 'AccessDenied';
        res.json(failedMsg);
    }
}