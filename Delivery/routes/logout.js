/**
 * Created by dmytro on 09.08.16.
 */
'use strict';
exports.post = function (req, res) {
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
}