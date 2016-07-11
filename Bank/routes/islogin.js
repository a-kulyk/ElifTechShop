exports.get = function (req, res) {
    if (req.session.user) {
        console.log(req.session.user);
        return res.send({
            "success": true
        });
    } else {
        return res.send({
            "success": false
        });
    }
};