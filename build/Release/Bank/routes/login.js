var User = require('../models/user').User;

exports.post = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    
    User.findOne({username: username})
        .then(function (user) {
            if(user.checkPassword(password)){
                req.session.user = user._id;
                res.send({
                    "success": true,
                    "user": user
                });
            } else {
                throw new Error("Invalid username or password");
            }
        })
        .catch(function (error) {
            res.send({
                "success": false,
                "errorDescription": error.message
            });
        });
};