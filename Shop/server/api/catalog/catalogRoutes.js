var express = require('express');
var router = express.Router();
var Products = require('./catalogModel.js');
var mongoose = require('mongoose');
var Filter = require('./filter.js');
//let filter = require('../models/modules/filter.js').filter;
mongoose.Promise = global.Promise;

class Parameters {
  constructor() {
    this.params = [];
  }

  distinct(value) {
    let own_res = []
      for (var i=0; i<value.length;i++) {
        if(!own_res.includes(value[i].properties[0].value)) own_res.push(value[i].properties[0].value);
      }
     return own_res;
  }


}





router.get('/product/:id', function(req, res, next) {
  Products.findById(req.params.id)
  .then(
    result => res.json(result),
    error => next(error)
    )
});

router.get('/parameters/:name', function(req,res,next){
let uniqValue = new Parameters();
Products.find({"properties.name": req.params.name},"properties.value.$")
    .then(
    result => res.json(uniqValue.distinct(result)),
      error =>  next(error)
    )  
})

router.get('/categories', function(req, res, next) {
  Products.find().distinct('category')
  .then(
    result => res.json(result),
    error =>  next(error)
    )
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
      let count = result[1];
      let countPage = count/pagination.per_page();
      promiseResult.pages = countPage < 1 ? 1 : ((Math.floor(countPage) == countPage) ? countPage : (Math.floor(countPage)+1));
      res.json(promiseResult);
    },
    error =>  next(error)
    )
 });




module.exports = router;
