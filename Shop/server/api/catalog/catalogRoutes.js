var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Products = require("./catalogModel.js")
var Filters = require("./filterModel.js")
var Filter = require('./filter.js');
mongoose.Promise = global.Promise;


router.get('/product/:id', function(req, res, next) {
  Products.findById(req.params.id)
  .then(
    result => {res.json(result);next();},
    error => next(error)
    )
});



router.get('/find/:distinct', function(req, res, next) {
  if(req.params.distinct == "all") {
    Products.find().distinct('category')
        .then(
          result => res.json(result),
          error =>  next(error)
        )
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
    for (var item in req.query) {
        if (item == "categories") {
            myFilter.setCategories(req.query[item]);
            continue;
        }
        if (item == "minprice") {
            myFilter.setMinPrice(req.query[item]);
            continue;
        }
        if (item == "maxprice") {
            myFilter.setMaxPrice(req.query[item]);
            continue;
        }
        myFilter.setProperties(item,req.query[item]);
    }
    Products.find(myFilter.creatQuery()).count()
        .then(
            result => {
                return res.json(result);
            },
            error =>  {
                next(error);
            }
        )
})




router.get('/filter/', function(req,res,next) {
  
  let myFilter = new Filter();
  let pagination = myFilter.setPage();
  for (item in req.query) {
    if(item == "sort") {
      myFilter.setSort(req.query[item]);
      continue;
    }
    if (item == "searchField") {
      myFilter.setSearchField(req.query[item]);
      continue;
    }
    if (item == "categories") {
      myFilter.setCategories(req.query[item]);
      continue;
    }
    if (item == "minprice") {
      myFilter.setMinPrice(req.query[item]);
      continue;
    }
    if (item == "maxprice") {
      myFilter.setMaxPrice(req.query[item]);
      continue;
    }
    if(item == "page"){
      pagination = myFilter.setPage(req.query[item]);
      continue;
    } 
    myFilter.setProperties(item,req.query[item]);
  }
  
  let sort = myFilter.getSort();

Promise.all([
    Products.find(myFilter.creatQuery()).sort( myFilter.getSort() ).skip(pagination.skip()).limit(pagination.per_page()),
    Products.find(myFilter.creatQuery()).count(),
    
  ])
  .then(
    result => {
      let promiseResult = new Object();
      promiseResult.items = result[0];
      if(promiseResult.items.length == 0) {
        return res.json(promiseResult);
      }
      let count = result[1];
        promiseResult.count = count;
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
