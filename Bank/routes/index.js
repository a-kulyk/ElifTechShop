var User = require('../models').User;
module.exports = function(app){
  app.post('/signup', function(req, res) {
      var username = req.body.username;
      var password = req.body.password;
      User.findOne({username: username}, function (err, user) {
          if(err){
              res.send({
                  "success": false,
                  "errorDescription": "Server error"
              });
          }
          if(user){
              res.send({
                  "success": false,
                  "errorDescription": "This username is occupy"
              })
          }
      });
      var user = new User({username: username, password: password});
      user.save(function (err) {
          if(err){
              res.send(err);
          }
      })
  });
};