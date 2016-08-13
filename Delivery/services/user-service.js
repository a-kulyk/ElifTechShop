/**
 * Created by dmytro on 09.08.16.
 */
"use strict";
let User = require('../models/user');

exports.authorize = function (username, password) {
    return new Promise((resolve, reject)=> {
        findByUsername(username)
            .then((user)=> {
                if (!user) {
                    resolve(false);
                }
                resolve(user.checkPassword(password));
            });
    }).catch((err)=> {
        reject(err);
    })
}

function findByUsername(username) {
    return new Promise((resolve, reject)=> {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                reject(err)
            }
            resolve(user)
        })
    })
}

