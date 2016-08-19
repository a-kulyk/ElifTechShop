
  var app = require('./server/app');
  var config = require('./server/config');

  var server = app.listen(config.port, function () {
    console.log('listening on port ' + config.port);
  });

