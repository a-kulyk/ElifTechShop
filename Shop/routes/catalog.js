var express = require('express');
var router = express.Router();

// router.get('/', function(req, res, next) {
//     res.render('admin/index', {title: 'Catalog'});
// });

router.get('/items', function(req, res, next) {
    var db = require("../db");
    db.items.find(function(err, items) {
        if(err) {
            console.error(err);
            //ToDo:
            res.json({ "success": false });//ToDO: fontend
        } else {
            res.json({
                "success": true,
                "items": items
            });//ToDo: fontend
        }
    });

});

router.get('/items/:id', function(req, res, next) {
    var db = require("../db");
    var id = req.params.id;
    db.items.findOne({
        _id: db.ObjectId(id)
    },function(err, item) {
        if(err) {
            console.error(err);
            //ToDo:
            res.json({ "success": false });//ToDO: fontend
        } else {
            res.json({
                "success": true,
                "item": item
            });//ToDo: fontend
        }
    });

});

router.put('/items', function(req, res, next) {
    var db = require("../db");
    var item = req.body;//ToDo: valid
    db.items.save(item, function(err, result) {
        if(err) {
            console.error(err);
            res.json({ "success": false });//ToDO: fontend
        } else {
            res.json({"success": true});//ToDo: fontend
        }
    });
});

router.post('/items/:id', function(req, res, next) {
    var db = require("../db");
    var id = req.params.id;
    var item = req.body;//ToDo: valid
    delete item._id;

    db.items.findAndModify({
        query: { _id: db.ObjectId(id) },
        update: item
    }, function(err, doc, lastErrorObject) {
        if(err) {
            console.error(err);
            res.json({ "success": false });//ToDO: fontend
        } else {
            res.json({"success": true});//ToDo: fontend
        }
    });
});

router.delete('/items/:id', function(req, res, next) {
    var db = require("../db");
    var id = req.params.id;
    db.items.findAndModify({
        query: { _id: db.ObjectId(id) },
        remove: true
    }, function(err, doc, lastErrorObject) {
        if(err) {
            console.error(err);
            res.json({ "success": false });//ToDO: fontend
        } else {
            res.json({"success": true});//ToDo: fontend
        }
    });
});


module.exports = router;
