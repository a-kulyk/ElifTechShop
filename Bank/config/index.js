var nconf = require('nconf');
var path = require('path');
if(!process.env.NODE_ENV){
  nconf.argv().env().file({file: path.join(__dirname,'config.develop.json')});
} else {
  nconf.argv().env().file({file: path.join(__dirname,'config.' + process.env.NODE_ENV + '.json')});
}
module.exports = nconf;
