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
  Todo.find().distinct('categories', function(err, todos) {
    if (err) return next(err);
    res.json(todos);
	});
 });

var params = (function () {
  perPage = Math.abs(10);
  return {
    get_per_page : function() { return perPage}
  }
})();

router.get('/page/:number', function(req, res, next) {
  var page = Math.abs(parseInt(req.params.number)) || 1;
  var per_page = params.get_per_page();
  var skip = per_page > 0 ? (page-1)*per_page : 0;
  Todo.find().skip(skip).limit(per_page).exec(function(err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
 });


router.get('/pages', function(req, res, next) {
  var per_page = params.get_per_page();
  Todo.find().count().exec(function(err, count) {
    if (err) return next(err);
    var count_page = count/per_page;
    var pages = (parseInt(count_page.toFixed(0)) == count_page) ? count_page : (parseInt(count_page.toFixed(0))+1);
    res.json(pages);
  });
 });

router.get('/categories/:name', function(req, res, next) {
  Todo.find({"categories" : req.params.name}, function(err, todos) {
    if (err) return next(err);
    res.json(todos);
});
});



module.exports = router;
