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

router.get('/categories/:name', function(req, res, next) {
  Todo.find({"categories" : req.params.name}, function(err, todos) {
    if (err) return next(err);
    res.json(todos);
});
});



module.exports = router;
