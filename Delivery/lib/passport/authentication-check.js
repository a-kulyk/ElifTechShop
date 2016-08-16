/**
 * Created by dmytro on 16.08.16.
 */
'use strict';

module.exports = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.json({
        "success": false,
        "role": 'guest'
    });
}