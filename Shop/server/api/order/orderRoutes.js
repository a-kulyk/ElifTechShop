var router = require('express').Router();
var auth = require('../auth/')


// var checkUser =

var Order = require('./orderModel.js');

router.route('/')
	.get(function(req, res, next) {
		Order.find({userId: req.user._id})
			.then(function(orders) {
				res.json(orders);
			}, function(err) {
				next(err);
			})
	})
	.post(function(req, res, next) {
		var newOrder = new Order({
			userId: req.user._id,
			itemSet: [{
				itemId:req.body.item_id,
				quantity: 1
			}],
			email: req.user.email,
			status: 'shoppingCart',
			// total: ???
			date: {
				created: new Date();
			}
		});
		newOrder.save()
			.then(function(order) {
				res.json(order);
			}, function(err) {
				next(err);
			});
	});



module.exports = router;