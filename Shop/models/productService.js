'use strict';

const Product = require('./product');

var productService = {};

productService.createQueryFilter = function(filterString) {
    let result = {};

    if(!filterString) {
        return result;
    }

    let filter = JSON.parse(filterString);
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
            "properties.name": property.name,
            "properties.value": {$in: property.value}
        });
    }

    result.$and.push(propertiesResult);

    return result;
};

productService.getProducts = function(filter/*, start, amount*/) {//ToDO:start, amount


    return new Promise(function(resolve, reject){
        Product.find(productService.createQueryFilter(filter), function(err, items) {
            if(err) {
                reject(err);
            } else {
                resolve(items);
            }
        });
    });
};

productService.getProductById = function(id) {
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
};

productService.createProduct = function(item) {
    let self = this;
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
};

productService.removeProduct = function(id) {
    let self = this;
    return new Promise(function(resolve, reject) {
        Product.findByIdAndRemove(id, function(err, doc) {//ToDo: is it safe(id)?
            if(err) {
                reject(err);
            } else {
                self.updateFilter();
                resolve(doc);
            }
        });
    });
};

productService.updateById = function(id, product) {
    let self = this;
    return new Promise(function(resolve, reject){
        Product.findByIdAndUpdate(id, product, {runValidators: true}, function(err, doc) {
            if(err) {
                reject(err);
            } else {
                self.updateFilter();
                resolve(doc);
            }
        });

    });
};

productService.updateFilter = function() {
    Product.aggregate([
            { "$project": { _id: 0, category: 1, properties: 1  } },
            { "$unwind": "$properties" },
            { "$group": {
                "_id": {
                    category: "$category",
                    name: "$properties.name",
                    value: "$properties.value"
                }
            }},
            { "$group": {
                "_id": {
                    category: "$_id.category",
                    name:"$_id.name"
                },
                value: {"$push": "$_id.value"}
            }},
            { "$group": {
                "_id": "$_id.category",
                properties: {"$push": {name: "$_id.name", value: "$value"}}
            }},
            { "$out": "filters"}
        ],
        function(err){
            if(err) {
                console.error(err);//ToDo; what to do? Product.aggregate?
            }
        }

    );

    /*
     db.products.aggregate([
     {"$project": { _id: 0, category: 1, properties: 1  } },
     {"$unwind": "$properties" },
     {"$group": {"_id": {category:"$category", name:"$properties.name", value:"$properties.value"}}},
     {"$group": {"_id": {category:"$_id.category", name:"$_id.name"}, value:{"$push": "$_id.value"}}},
     {"$group": {"_id": "$_id.category", properties:{"$push": {name:"$_id.name", value:"$value"}}}},
     {"$out": "filter"}
     ])
    */
};


module.exports = productService;
