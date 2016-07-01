var express = require('express');
var router = express.Router();


var Todo = require('../models/Shop.js');


/* GET /todos listing. */


router.get('/:name', function(req, res, next) {
  Todo.find({'categories': "Phones"}, function(err, todos) {
    if (err) return next(err);
    res.json(todos);
});
});




module.exports = router;