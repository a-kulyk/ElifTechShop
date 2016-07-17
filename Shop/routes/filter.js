'use strict';

const express = require('express');
const filterService = require('../models/filterService');
var router = express.Router();

router.get('/categories', function(req, res/*, next*/) {
    filterService.getAllCategories()
        .then(function(categories){
            res.json({
                success: true,
                categories: categories
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

router.get('/:category', function(req, res/*, next*/) {
    let category = req.params.category;//ToDO: valid?

    filterService.getPropertiesByCategory(category)
        .then(function(properties) {
            res.json({
                success: true,
                properties: properties
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



module.exports = router;