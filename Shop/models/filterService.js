'use strict';

const Product = require('./product');
const Filter = require('./filter');

var filterService = {};

filterService.getPropertiesByCategory = function(category) {
    return new Promise(function(resolve, reject) {
        Filter.findOne({
            _id: category //ToDo: is it safe?
        },function(err, filter) {
            if(err) {
                reject(err);
            } else if(filter) {
                resolve(filter.properties);
            } else {
                resolve();
            }
        });
    });
};

filterService.getAllCategories = function() {
    return new Promise(function(resolve, reject) {
        Product.distinct('category', function (err, categories) {
            if(err) {
                reject(err);
            } else {
                resolve(categories);
            }
        });
    });
};

module.exports = filterService;