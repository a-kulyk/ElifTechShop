var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin/index', {title: 'Catalog'});
});

router.get('/items', function(req, res, next) {
    var db = require("../../db");
    db.items.find(function(err, items) {
        if(err) {
            console.error(err);
            //ToDo:
            res.json({ });
        } else {
            res.json({ "items": items});
        }
    });

});

router.put('/items', function(req, res, next) {
    //ToDo:
    res.json({ });
});

router.post('/items/:item_id', function(req, res, next) {
    //ToDo:
    res.json({ });
});

router.delete('/items/:item_id', function(req, res, next) {
    //ToDo:
    res.json({ });
});


module.exports = router;
