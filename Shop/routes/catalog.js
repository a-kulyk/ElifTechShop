const express = require('express');
const Product = require("../models/product");
var router = express.Router();

// router.get('/', function(req, res, next) {
//     res.render('admin/index', {title: 'Catalog'});
// });

router.get('/items', function(req, res, next) {

    Product.find(function(err, items) {
        if(err) {
            console.error(err);
            res.json({ success: false, error: {name: 'database error', message: err}});
        } else {
            res.json({
                "success": true,
                "items": items
            });
        }
    });

});

router.get('/items/:id', function(req, res, next) {
    var id = req.params.id;
    Product.findOne({
        _id: id //ToDo: is it safe?
    },function(err, item) {
        if(err) {
            console.error(err);
            res.json({ "success": false, error: {name: 'database error', message: err} });
        } else {
            res.json({
                "success": true,
                "item": item
            });
        }
    });

});

router.put('/items', function(req, res, next) {
    var item = req.body;//ToDo: valid
    Product.create(item, function(err, result) {
        if(err) {
            console.error(err);
            res.json({ "success": false, error: {name: 'database error', message: err}  });
        } else {
            res.json({"success": true});
        }
    });
});

router.post('/items/:id', function(req, res, next) {
    let id = req.params.id;
    let item = req.body;//ToDo: valid
    delete item._id;

    Product.findByIdAndUpdate(id, item, function(err, doc) {
        if(err) {
            console.error(err);
            res.json({ "success": false, error: {name: 'database error', message: err} });
        } else {
            res.json({"success": true});
        }
    });
});

router.delete('/items/:id', function(req, res, next) {
    var id = req.params.id;
    Product.findByIdAndRemove(id, function(err, doc) {
        if(err) {
            console.error(err);
            res.json({ "success": false, error: {name: 'database error', message: err}  });
        } else {
            res.json({"success": true});
        }
    });
});


module.exports = router;
