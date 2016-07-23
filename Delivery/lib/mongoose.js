var mongoose = require('mongoose');
var config = require('../config');

//mongoose.connect(config.get('mongoose:uri'));

mongoose.connect("localhost:27017/delivery");
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

/*db.once('open', function () {
 console.log('connected to'+' '+config.get('mongoose:uri'));
 });*/

db.once('open', function () {
    console.log('connected to localhost');
});

module.exports = mongoose;