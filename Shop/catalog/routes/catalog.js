var express = require('express');
var router = express.Router();


var Todo = require('../models/Shop.js');





/* GET /todos listing. */
router.get('/items', function(req, res, next) {
  Todo.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
});

router.get('/items/:id', function(req, res, next) {
  Todo.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.get('/categories', function(req, res, next) {
  Todo.find().distinct('category', function(err, todos) {
    if (err) return next(err);
    res.json(todos);
	});
 });

var params = (function () {
  perPage = Math.abs(4);
  return {
    get_per_page : function() { return perPage}
  }
})();

router.get('/page/:number', function(req, res, next) {
  pageGenerator(req,res,next,params.get_per_page(),Todo,{});
 });


function pageGenerator(req,res,next,perPage,collection,findParams) {
  var page = Math.abs(parseInt(req.params.number)) || 1;
  var per_page = parseInt(perPage);
  var skip = per_page > 0 ? (page-1)*per_page : 0;
  console.log(page + " " + skip + " " + per_page +" "+ perPage);
  collection.find(findParams).skip(skip).limit(per_page).exec(function(err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
}

function pageCountGenerator (res,next,perPage,collection,req) {
  var per_page = parseInt(perPage);
  collection.find(req).count().exec(function(err, count) {
    if (err) return next(err);
    var count_page = count/per_page;
    var pages = count_page < 1 ? 1 : ((Math.floor(count_page) == count_page) ? count_page : (Math.floor(count_page)+1));
    res.json(pages);
  });
}

router.get('/filter/:name/:value/page/:number', function(req,res,next) {
  var property_name = decodeURIComponent(req.params.name);
  var property_value = decodeURIComponent(req.params.value);
  console.log(property_value,property_name);
  pageGenerator(req,res,next,params.get_per_page(),Todo,{ properties: { $elemMatch: { name: property_name, value: property_value} }})

 });

router.get('/filter/:name/:value/pages', function(req,res,next) {
  var property_name = req.params.name;
  var property_value = req.params.value;
  pageCountGenerator (res,next,params.get_per_page(),Todo,{ properties: { $elemMatch: { name: property_name, value: property_value}}});
 });

router.get('/pages', function(req, res, next) {
  pageCountGenerator(res,next,params.get_per_page(),Todo,{});
 });

router.get('/category/:name', function(req, res, next) {
  Todo.find({"category" : req.params.name}, function(err, todos) {
    if (err) return next(err);
    res.json(todos);
});
});



module.exports = router;
