let User = require("../models/user").User;

exports.post = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    
    User.findOne({username: username})
        .then(function (result) {
            if(!result){
                let newUser = new User({username: username, password: password});
                return newUser.save();
            } else {
                throw new Error("The username is occupy");
            }
        })
        .then(function (result) {
            req.session.user = result._id;
            res.send({
                "success": true,
                "user": result
            });
        })
        .catch(function (error) {
            res.send({
                "success": false,
                "errorDescription": error.message
            });
        });
};