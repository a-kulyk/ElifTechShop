/**
 * Created by dmytro on 28.06.16.
 */
var nconf = require('nconf');
var path = require('path');
nconf.argv()
    .env()
    .file({file: path.join(__dirname, 'config.json')});
module.exports = nconf;