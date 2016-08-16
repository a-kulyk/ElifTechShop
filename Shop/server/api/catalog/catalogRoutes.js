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


router.get('/filtration/:category', function(req,res,next) {
    delete req.query.categories;

    if(req.params.category == "_all") {
        Products.find().distinct('category')
            .then(
                result => res.json(result),
                error =>  next(error)
            );
        return;
    }

    let myFilter = new Filter();
    let filterQuery = JSON.parse(JSON.stringify(req.query));

    if(req.params.category) {
        myFilter.setCategories(req.params.category);
    }

    if(filterQuery.sort) {
        delete filterQuery.sort
    }

    if(filterQuery.searchField) {
        myFilter.setSearchField(filterQuery.searchField);
        delete filterQuery.searchField
    }

    if (filterQuery.minprice || filterQuery.maxprice) {
        myFilter.setPrice(filterQuery.minprice,filterQuery.maxprice);
        delete filterQuery.minprice;
        delete filterQuery.maxprice;

    }

    if(filterQuery.company) {
        delete filterQuery.company;
    }

    for (var item in filterQuery) {
        myFilter.setProperties(item,filterQuery[item]);
    }


    Filters.find({'_id' : req.params.category})
        .then (result => {
            if(result.length === 0) return res.json([]);
            let newResult = JSON.parse(JSON.stringify(result[0]))
            let properties = newResult.properties;
            let companies = newResult.company;

            forCompany(0);
            function forCompany(index) {
                if(index == companies.length) return forProperties(0)
                let newCompany = {
                    name :  companies[index],
                    count : null
                }
                let query = myFilter.creatQuery();
                query.company = companies[index];
                Products.count(query)
                .then(
                    countOfCompany => {
                        newCompany.count = countOfCompany;
                        companies[index] = newCompany;
                        console.log(companies[index]);
                        forCompany(index+1);
                    },
                    error => console.log (error)
                )
            }

            function forProperties(index) {
                if(index == properties.length) return res.json(newResult);
                if(req.query.company) {
                    myFilter.setCompany(req.query.company);
                }


                forValue(0);
                function forValue(valueIndex) {
                    if(valueIndex == properties[index].value.length)  return forProperties(index+1)
                    function getCount(index,valueIndex) {
                        let willWeCallCount = false;
                        let newValue = {
                            respond : properties[index].value[valueIndex],
                            count : null,
                            state : false
                        }

                        let newQuery = Object.assign({},myFilter.creatQuery());
                        let query = [{
                            'properties.name' : properties[index].name,
                            'properties.value' : properties[index].value[valueIndex],
                        }]
                        newQuery['$and'][1]['$and'] = query

                        let currentQuery = JSON.parse(JSON.stringify(myFilter.creatQuery()));
                        currentQuery['$and'][2] = newQuery['$and'][2];
                        currentQuery['$and'][1]['$and'].forEach(function (property) {
                            if(property['properties.name'] == properties[index].name) {
                                if(property['$or'] ) {
                                    property['$or'].push({'properties.value':properties[index].value[valueIndex]})
                                } else {
                                        let values =  []
                                        values.push({'properties.value': property['properties.value']})
                                        values.push({'properties.value': properties[index].value[valueIndex]})
                                        property['$or'] = values;
                                        delete property['properties.value'];
                                }
                                newQuery = currentQuery;

                                willWeCallCount = true

                            }
                        })


                        if(willWeCallCount) {
                            willWeCallCount = !willWeCallCount;
                            Promise.all([
                                Products.count(myFilter.creatQuery()),
                                Products.count(newQuery)
                            ])
                            .then (
                                countOfProperty => {
                                    console.log(countOfProperty);
                                    result = countOfProperty[1] - countOfProperty[0]
                                    if(result > 0) {
                                        newValue.count = '+' + result;
                                    }
                                    properties[index].value[valueIndex] = newValue;
                                    forValue(valueIndex+1);
                                },
                                error => console.log (error)
                            )
                        } else {
                            Products.count(newQuery)
                            .then(
                                countOfProperty => {

                                    if(countOfProperty > 0) newValue.count = countOfProperty;
                                    properties[index].value[valueIndex] = newValue;
                                    forValue(valueIndex+1);
                                },
                                error => console.log (error)
                            )
                        }



                    }
                    getCount(index,valueIndex);
                }
            }
    })
    .catch(error => {
        console.log(error);
        next(error);
    });
})


router.get('/filter/', function(req,res,next) {

    let pagination, myFilter = new Filter();
    let filterQuery = JSON.parse(JSON.stringify(req.query));

    if(filterQuery.categories) {
        myFilter.setCategories(filterQuery.categories);
        delete filterQuery.categories
    }

    if(filterQuery.per_page) {
        myFilter.setPerPage(filterQuery.per_page);
        delete filterQuery.per_page
    }

    pagination = myFilter.definePage();

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

    if (filterQuery.minprice || filterQuery.maxprice) {
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
