var router = require('express').Router();

var Order = require('./orderModel.js');
var Product = require('../catalog/catalogModel');
// var User = require('../auth/userModel');


router.get('/', function(req, res, next) {
		Order.find({userId: req.user._id})
			.then(
				orders => res.json(orders),
				err => next(err)
			);
	});

router.get('/cart', function(req, res, next) {
		Order.find({userId: req.user._id, status: "shoppingCart"})
			.then(
				order => res.json(order),
				err => next(err)
			);
	});

// router.get('/confirmAddress', function(req, res, next) {
// 		// Order.findById(req.params.id)
// 		// .populate('itemSet.productId')
// 		// .exec()
// 		// 	.then(
// 				// order => res.json({order: order, total: order.findTotal()}),
// 				// err => next(err)
// 			// );
// 			res.end();
// 	});

router.get('/:id', function(req, res, next) {
		Order.findById(req.params.id)
		.populate('itemSet.productId')
		.exec()
			.then(
				order => res.json({order: order, total: order.findTotal()}),
				err => next(err)
			);
	});




router.post('/create', function(req, res, next) {
	Order.create({
		userId: req.user._id.toString(),
		itemSet: [{
			productId: req.body._id,
			quantity: 1
		}],
		email: req.user.email,
		status: 'shoppingCart',
		date: {
			created: new Date().toJSON().slice(0,16),
			paid: '',
			completed: ''
		}
	})
		.then(
			result => res.json(result),
    	error => next(error)
    );
});

router.put('/addToCart', function(req, res, next) {
	Order.findByIdAndUpdate(
		req.body.cartId,
		{$push: {"itemSet": req.body.itemSet}},
    {new: true, safe: true, upsert: true}
  )
		.then(
			order => res.json(order),
			err => next(err)
		);
});

router.put('/update', function(req, res, next) {
	Order.findByIdAndUpdate(
		req.body.cartId,
		{"itemSet": req.body.itemSet},
    {new: true, safe: true, upsert: true}
  )
  .populate('itemSet.productId')
  .exec()
		.then(
			order => res.json({order: order, total: order.findTotal()}),
			err => next(err)
		);
});

router.delete('/:id', function(req, res, next) {
		Order.findById(req.params.id)
		.remove()
		.exec()
			.then(
				 () => res.status(200),
				err => next(err)
			);
	});


module.exports = router;