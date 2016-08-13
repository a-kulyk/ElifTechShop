var User = require('../models/user').User;

exports.get = function (req, res) {
    if(req.session.user) {
        User.findOne({_id: req.session.user})
            .then(function (result) {
                res.send({
                    "success": true,
                    "id": result._id,
                    "username": result.username
                });
            })
            .catch(function (error) {
                console.log(error);
                res.send({
                    "success": false,
                    "errorDescription": error
                });
            });
    } else {
        return res.send({
            success: false,
            errorDescription: 'Not login'
        });
    }
};