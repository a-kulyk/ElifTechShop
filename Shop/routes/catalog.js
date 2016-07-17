'use strict';

const express = require('express');
const productService = require('../models/productService');
var router = express.Router();

// router.get('/', function(req, res, next) {
//     res.render('admin/index', {title: 'Catalog'});
// });

router.get('/', function(req, res/*, next*/) {
    var filter = req.query.filter;
    productService.getProducts(filter)
    .then(function(items){
        res.json({
            success: true,
            items: items
        });
    })
    .catch(function(err){
        console.error(err);
        res.json({
            success: false,
            error: {name: 'database error', message: 'database error'}
        });
    });
});

router.get('/:id', function(req, res/*, next*/) {
    let id = req.params.id;//ToDO: valid?

    productService.getProductById(id)
    .then(function(item) {
        res.json({
            success: true,
            item: item
        });
    })
    .catch(function(err){
        console.error(err);
        res.json({
            success: false,
            error: {name: 'database error', message: 'database error'}
        });
    });
});

router.put('/', function(req, res/*, next*/) {
    let item = req.body;

    productService.createProduct(item)
    .then(function() {
        res.json({ success: true});
    })
    .catch(function(err) {
        if(err.name !== 'ValidationError') {
            throw err;//ToDO: is it ok?
        }

        res.json({
            success: false,
            error: {
                name: 'validation error',
                message: 'validation error',
                type: 'ValidationError',
                errors: err.errors
            }
        });
    })
    .catch(function() {
        res.json({
            success: false,
            error: {name: 'database error', message: 'database error'}
        });
    });
});

router.post('/:id', function(req, res/*, next*/) {
    let id = req.params.id;
    let product = req.body;//ToDo: valid
    delete product._id;

    productService.updateById(id, product)
    .then(function() {
        res.json({success: true});
    })
    .catch(function(err) {
        if(err.name !== 'ValidationError') {
            throw err;//ToDO: is it ok?
        }

        res.json({
            success: false,
            error: {
                name: 'validation error',
                message: 'validation error',
                type: 'ValidationError',
                errors: err.errors
            }
        });
    })
    .catch(function() {
        res.json({
            success: false,
            error: {name: 'database error', message: 'database error'}
        });
    });
});

router.delete('/:id', function(req, res/*, next*/) {
    let id = req.params.id;//ToDo: valid?

    productService.removeProduct(id)
    .then(function() {
        res.json({success: true});
    })
    .catch(function(err) {
        console.error(err);
        res.json({
            success: false,
            error: {name: 'database error', message: 'database error'}
        });
    });
    
});


module.exports = router;
