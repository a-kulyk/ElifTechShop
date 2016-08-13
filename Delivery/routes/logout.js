/**
 * Created by dmytro on 09.08.16.
 */
'use strict';
exports.post = function (req, res) {
    req.session.destroy();
    res.end();
}