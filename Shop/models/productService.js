'use strict';

const Product = require('./product');

var productService = {
    getProducts: function(/*start, amount*/) {//ToDO:start, amount
        return new Promise(function(resolve, reject){
            Product.find(function(err, items) {
                if(err) {
                    reject(err);
                } else {
                    resolve(items);
                }
            });
        });
    },

    getProductById: function(id) {
        return new Promise(function(resolve, reject) {
            Product.findOne({
                _id: id //ToDo: is it safe?
            },function(err, item) {
                if(err) {
                    reject(err);
                } else {
                    resolve(item);
                }
            });
        });
    },

    createProduct: function(item) {
        return new Promise(function(resolve, reject){
            Product.create(item, function(err, result)  {
                if(err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },

    removeProduct: function(id) {
        return new Promise(function(resolve, reject) {
            Product.findByIdAndRemove(id, function(err, doc) {//ToDo: is it safe(id)?
                if(err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    },

    updateById: function(id, product) {
        return new Promise(function(resolve, reject){
            Product.findByIdAndUpdate(id, product, {runValidators: true}, function(err, doc) {
                if(err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });

        });
    }
};

module.exports = productService;
