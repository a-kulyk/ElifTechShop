'use strict';

const fs = require('fs');
const Product = require('./product');
const imageService = require('../service/cloudinaryImageService');

var productService = {};

productService.createQueryFilter = function(filterString) {
    let result = {};

    if(!filterString) {
        return result;
    }

    let filter = JSON.parse(filterString);//ToDO: move to middleware?
    if(!filter.category) {
        return result;
    }

    result.$and = [];

    result.$and.push({category: filter.category});

    if(!filter.properties || filter.properties.length === 0) {
        return result;
    }

    let propertiesResult = {};
    propertiesResult.$and = [];
    for(var propertyId in filter.properties) {
        if( !filter.properties.hasOwnProperty(propertyId) ) {
            continue;
        }
        let property = filter.properties[propertyId];

        propertiesResult.$and.push({
            'properties.name': property.name,
            'properties.value': {$in: property.value}
        });
    }

    result.$and.push(propertiesResult);

    return result;
};

productService.getProducts = function(filter/*, start, amount*/) {//ToDO:start, amount
    return Product.find(productService.createQueryFilter(filter)).exec();
};

productService.getProductById = function(id) {
    return Product.findOne({
        _id: id //ToDo: is it safe?
    }).exec();
};

productService.createProduct = function(item, files) {
    let self = this;

    item.images = [];

    let uploadImagesPromise = [];
    for(var i = 0; i < files.length; i++) {
        uploadImagesPromise.push(imageService.upload(files[i].path));
        //item.images.push('uploads/' +files[i].filename);
    }

    return Promise.all(uploadImagesPromise).then(values => {
        for(var i = 0; i < values.length; i++) {
            item.images.push(values[i].url);
        }

        return new Promise(function(resolve, reject){
            Product.create(item, function(err, result)  {
                if(err) {
                    reject(err);
                } else {
                    self.updateFilter();
                    resolve(result);
                }
            });
        });
    });


};

productService.removeProduct = function(id) {
    let self = this;
    return new Promise(function(resolve, reject) {
        Product.findByIdAndRemove(id, function(err, doc) {//ToDo: is it safe(id)?
            if(err) {
                reject(err);
            } else {
                let images = doc.images;

                imageService.deleteByUrls(images);//ToDO: error handler

                // for(var i = 0; i < images.length; i++) {
                //     fs.unlink(__dirname +'/../public/' +images[i], function(err, date){//ToDO: replace literal on const
                //         if(err) {
                //             console.error(err);
                //         }
                //     });//ToDo: too deep and calback
                // }

                self.updateFilter();
                resolve(doc);
            }
        });
    });
};

productService.updateById = function(id, product, files) {
    let self = this;

    if(!product.images) {
        product.images = [];
    }

    return this.getProductById(id)
    .then(function(oldProduct) {
        let oldImagesSet = new Set(oldProduct.images);
        let imagesSet = new Set(product.images);
        product.images = product.images.filter(x => oldImagesSet.has(x));
        //let removedImages = oldProduct.images.filter(x => imagesSet.has(x));
        return oldProduct.images.filter(x => !imagesSet.has(x));

    }).then(function(removedImages) {
        imageService.deleteByUrls(removedImages);
        return null;
    }).then(function() {
        let uploadImagesPromise = [];
        for(var i = 0; i < files.length; i++) {
            uploadImagesPromise.push(imageService.upload(files[i].path));
            //item.images.push('uploads/' +files[i].filename);
        }

        return Promise.all(uploadImagesPromise);
    }).then(values => {
        for (var i = 0; i < values.length; i++) {
            product.images.push(values[i].url);
        }
        return null;
    }).then(()=> {
        return Product.findByIdAndUpdate(id, product, {runValidators: true}).exec();
    }).then((doc) => {
        self.updateFilter();
        return doc;
    });
    //ToDO:delete file

    // let uploadImagesPromise = [];
    // for(var i = 0; i < files.length; i++) {
    //     uploadImagesPromise.push(imageService.upload(files[i].path));
    //     //item.images.push('uploads/' +files[i].filename);
    // }
    //
    // return Promise.all(uploadImagesPromise).then(values => {
    //     for (var i = 0; i < values.length; i++) {
    //         item.images.push(values[i].url);
    //     }
    //
    //     return new Promise(function (resolve, reject) {
    //         Product.findByIdAndUpdate(id, product, {runValidators: true}, function (err, doc) {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 self.updateFilter();
    //                 resolve(doc);
    //             }
    //         });
    //
    //     });
    // });
};

productService.updateFilter = function() {
    Product.aggregate([
        { '$project': { _id: 0, category: 1, properties: 1, price: 1, company: 1  } },
        { '$unwind': '$properties' },
        {'$group': {
            '_id': {category:'$category'},
            properties:{'$push': '$properties'  },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            company: { $addToSet: "$company" }
        }},
        {'$unwind': '$properties' },
        { '$project': { _id: 1, properties: 1, price: { min: '$minPrice', max: '$maxPrice'}, company: 1  } },
        { '$group': {
            '_id': {
                category: '$_id.category',
                name: '$properties.name',
                value: '$properties.value'
            },
            price: {$first: '$price'},
            company: {$first: '$company'}
        }},
        { '$group': {
            '_id': {
                category: '$_id.category',
                name:'$_id.name'
            },
            value: {'$push': '$_id.value'},
            price: {$first: '$price'},
            company: {$first: '$company'}
        }},
        { '$group': {
            '_id': '$_id.category',
            properties: {'$push': {name: '$_id.name', value: '$value'}},
            price: {$first: '$price'},
            company: {$first: '$company'}
        }},
        { '$out': 'filters'}
    ], function(err){
        if(err) {
            console.error(err);//ToDo; what to do? Product.aggregate?
        }
    });

    // db.products.aggregate([
    //
    // ]).pretty()

};


module.exports = productService;
