var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Products = require("./catalogModel.js");
var Filters = require("./filterModel.js");
var Filter = require('./filter.js');
mongoose.Promise = global.Promise;


router.get('/product/:id', function(req, res, next) {
  Products.findById(req.params.id)
  .then(
    result => res.json(result),
    error => next(error)
    )
});



router.get('/find/:distinct', function(req, res, next) {
  if(req.params.distinct == "all") {
    Products.find().distinct('category')
        .then(
          result => res.json(result),
          error =>  next(error)
        );
    return;
  }
  if(req.params.distinct) {
      Filters.find({'_id' : req.params.distinct})
      .then (result => {
        res.json(result[0]);
      })
      .catch(error => {
          console.log(error);
          next(error);
        });
      }
    
  });

router.get('/filter/count/', function(req,res,next) {

    let myFilter = new Filter();
    let filterQuery = JSON.parse(JSON.stringify(req.query));

    if(filterQuery.categories) {
        myFilter.setCategories(filterQuery.categories);
        delete filterQuery.categories
    }

    if(filterQuery.company) {
        myFilter.setCompany(filterQuery.company);
        delete filterQuery.company
    }

    if(filterQuery.sort) {
        delete filterQuery.sort
    }

    if(filterQuery.searchField) {
        myFilter.setSearchField(filterQuery.searchField);
        delete filterQuery.searchField
    }

    if (filterQuery.minprice && filterQuery.maxprice) {
        myFilter.setPrice(filterQuery.minprice,filterQuery.maxprice);
        delete filterQuery.minprice;
        delete filterQuery.maxprice;
    }

    for (var item in filterQuery) {
        myFilter.setProperties(item,filterQuery[item]);
    }
    Products.find(myFilter.creatQuery()).count()
        .then(
            result => {
                res.json(result);
                console.log(result);
            },
                    error => next(error)

        )
})



router.get('/filter/', function(req,res,next) {
  
    let myFilter = new Filter();
    let pagination = myFilter.definePage();
    let filterQuery = JSON.parse(JSON.stringify(req.query));

    if(filterQuery.categories) {
        myFilter.setCategories(filterQuery.categories);
        delete filterQuery.categories
    }

    if(filterQuery.company) {
        myFilter.setCompany(filterQuery.company);
        delete filterQuery.company
    }

    if(filterQuery.sort) {
        myFilter.setSort(filterQuery.sort);
        delete filterQuery.sort
    }

    if(filterQuery.page){
        pagination = myFilter.definePage(filterQuery.page);
        delete filterQuery.page;
    }

    if(filterQuery.searchField) {
        myFilter.setSearchField(filterQuery.searchField);
        delete filterQuery.searchField
    }

    if (filterQuery.minprice && filterQuery.maxprice) {
        myFilter.setPrice(filterQuery.minprice,filterQuery.maxprice);
        delete filterQuery.minprice;
        delete filterQuery.maxprice;
    }


    for (let item in filterQuery) {
        myFilter.setProperties(item,req.query[item]);
    }
  
    let sort = myFilter.getSort();




        let countActiveItems,count,activeResult;

        Promise.all([
            Products.count(myFilter.creatQuery()),
            Products.count(myFilter.creatQuery({quantity : {$gt : 0}}))
        ])
            .then (
                data => {
                    count = data[0];
                    countActiveItems = data[1];
                    return Products.aggregate(
                        [
                            { $match : myFilter.creatQuery() },
                            { $sort : sort },
                            { $match : {quantity : {$gt: 0}}},
                            { $skip : pagination.skip()},
                            { $limit: pagination.per_page() }
                        ]
                    )
                }
            )
            .then (
            data => {
                activeResult = data;
                let skip = 0;
                if (data.length === pagination.per_page())
                    return Promise.resolve([])
                if(data.length === 0) {
                    skip = pagination.skip()  - countActiveItems
                }
                return Products.aggregate(
                    [
                        { $match : myFilter.creatQuery() },
                        { $sort : sort },
                        { $match : {quantity : 0}},
                        { $skip : skip},
                        { $limit: pagination.per_page() - data.length }
                    ]
                )
            }
        )
        .then(
        data => {
        let result = activeResult.concat(data);
          let promiseResult = {};
          promiseResult.items = result;
          if(promiseResult.items.length == 0) {
            return res.json(promiseResult);
          }
          let countPage = count/pagination.per_page();
          promiseResult.pages = countPage < 1 ? 1 : ((Math.floor(countPage) == countPage) ? countPage : (Math.floor(countPage)+1));
          return res.json(promiseResult);
        },
        error =>  {
          next(error);
        }
        )
 });

module.exports = router;
