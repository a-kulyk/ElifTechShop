/**
 * Created by dmytro on 28.06.16.
 */
'use strict'
let nconf = require('nconf');
let path = require('path');
nconf.argv()
    .env()
    .file({file: path.join(__dirname, 'config.json')});
module.exports = nconf;