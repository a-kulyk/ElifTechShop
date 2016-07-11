"use strict";

const express = require('express');
const Product = require('../models/product');
const productService = require('../models/productService');
var router = express.Router();

// router.get('/', function(req, res, next) {
//     res.render('admin/index', {title: 'Catalog'});
// });

router.get('/items', function(req, res, next) {
    productService.getProducts()
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

router.get('/items/:id', function(req, res, next) {
    var id = req.params.id;//ToDO: valid?

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

router.put('/items', function(req, res, next) {
    var item = req.body;

    productService.createProduct(item)
    .then(function(result) {
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
    .catch(function(err) {
        res.json({
            success: false,
            error: {name: 'database error', message: 'database error'}
        });
    });
});

router.post('/items/:id', function(req, res, next) {
    let id = req.params.id;
    let product = req.body;//ToDo: valid
    delete product._id;

    productService.updateById(id, product)
    .then(function(doc) {
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
    .catch(function(err) {
        res.json({
            success: false,
            error: {name: 'database error', message: 'database error'}
        });
    });
});

router.delete('/items/:id', function(req, res, next) {
    var id = req.params.id;//ToDo: valid?

    productService.removeProduct(id)
    .then(function(doc) {
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
