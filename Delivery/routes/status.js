/**
 * Created by dmytro on 11.08.16.
 */
"use strict";

exports.get = function (req, res) {
    res.json(
        {
            "success": true,
            "role": "admin"
        });
}