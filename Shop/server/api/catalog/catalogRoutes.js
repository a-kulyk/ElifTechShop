var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Products = require("./catalogModel.js")
var Filter = require('./filter.js');
mongoose.Promise = global.Promise;


Products.findParams =  function(result) {
     var ourRes = {};
      for(var i = 0; i< result.length;i++) {
        if(!ourRes.hasOwnProperty(result[i].name)) {
          ourRes[result[i].name] = [result[i].value];
          console.log(ourRes[result[i].name]);
          for (var j = parseInt(i)+1; j < result.length ; j++) {
            if(result[j].name == result[i].name) {
              if(!ourRes[result[i].name].includes(result[j].value)) {
                ourRes[result[i].name].push(result[j].value);
              }
            }
          }  
        }
      }
      return ourRes;
  }




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
        )
    return;
  }
  if(req.params.distinct) {
    Products.distinct('properties',{'category': req.params.distinct })
    .then (result => {
      res.json(Products.findParams(result));
    })
    .catch(error => {
        console.log(error);
      });
    }
  });

router.get('/filter/', function(req,res,next) {
  
  let myFilter = new Filter();
  let pagination = myFilter.setPage();
  for (item in req.query) {
    if (item == "searchField") {
      myFilter.setSearchField(req.query[item]);
      continue;
    }
    if (item == "categories") {
      myFilter.setCategories(req.query[item]);
      continue;
    }
    if(item == "page"){
      pagination = myFilter.setPage(req.query[item]);
      continue;
    } 
    myFilter.setProperties(item,req.query[item]);
  }
  
Promise.all([
    Products.find(myFilter.creatQuery()).sort({}).skip(pagination.skip()).limit(pagination.per_page()),
    Products.find(myFilter.creatQuery()).count()
  ])
  .then(
    result => {
      let promiseResult = new Object();
      promiseResult.items = result[0];
      if(promiseResult.items.length == 0) {
        res.json(promiseResult);
        return;
      }
      let count = result[1];
      let countPage = count/pagination.per_page();
      promiseResult.pages = countPage < 1 ? 1 : ((Math.floor(countPage) == countPage) ? countPage : (Math.floor(countPage)+1));
      res.json(promiseResult);
    },
    error =>  {
      return next(error)
    }
    )
 });




module.exports = router;
