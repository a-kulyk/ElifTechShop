/**
 * Created by dmytro on 09.08.16.
 */
'use strict';
let responseFactory = require('../common/response-factory');

exports.post = function (req, res) {
     req.session.destroy(function () {
         res.clearCookie('connect.sid');
         res.status(200).json(responseFactory.successMessage());
     });
}