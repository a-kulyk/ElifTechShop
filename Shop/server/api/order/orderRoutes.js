var router = require('express').Router();

var Order = require('./orderModel.js');
var Product = require('../catalog/catalogModel');

router.get('/all', function(req, res, next) {
		Order.find({userId: req.user._id})
			.then(
				orders => res.json(orders),
				err => next(err)
			);
	});

router.get('/cart', function(req, res, next) {
		Order.findOne({userId: req.user._id, status: "shoppingCart"})
			.populate({path: 'itemSet.productId', select: 'category name price'})
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
			productId: req.body.itemId,
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
	.then(order => Order.populate(order, {path: 'itemSet.productId', select: 'category name price'} ))
	.then(
		order => res.json({order: order, total: order.findTotal()}),
  	error => next(error)
  );
});

router.put('/addToCart', function(req, res, next) {
	Order.findOne({userId: req.user._id, status: "shoppingCart"})
  	.then(order => {
  		var arr = order.itemSet;
  		var item = arr.find(function(i){
  			return i.productId.toString() === req.body.itemId;
  		});
  		if (item){
  			item.quantity += 1;
  		} else	{
  			arr.push({productId: req.body.itemId, quantity: 1});
  		}  
      return order.save();      	
    })
    .then(order => Order.populate(order, {path: 'itemSet.productId', select: 'category name price'} ))
    .then(
    	order => res.json( {order: order, total: order.findTotal()} ),
    	err => next(err)
    );
});

router.put('/update', function(req, res, next) {
	Order.findOne({userId: req.user._id, status: "shoppingCart"})
  	.then(order => {
  		var arr = order.itemSet;
  		var index = arr.find(function(i){
  			return i.productId.toString() === req.body.itemId;
  		});
  		arr.splice(index, 1);
      return order.save();
    })
    .then(order => {
    	if (order.itemSet.length) {
    		return Order.populate(order, {path: 'itemSet.productId', select: 'category name price'});
    	} else { res.json({order: order}) }
    })
    .then(
    	order => res.json( {order: order, total: order.findTotal()} ),
    	err => next(err)
    );
});

router.put('/setAddress', function(req, res, next) {
  Order.findOne({userId: req.user._id, status: "shoppingCart"})
    .then(order => {
        let addr = req.body;
        order.shipAddress = {country: addr.country, city: addr.city, street: addr.street};
        order.status = "proccessing";
        return order.save();
      })
    .then(order => Order.populate(order, {path: 'itemSet.productId', select: 'category name price'} ))
    .then(order => {
      order.total = order.findTotal();
      return order.save();
    })
    .then(order => res.json(order),
      err => next(err))
 });

router.delete('/remove', function(req, res, next) {
		Order.findOneAndRemove({userId: req.user._id, status: "shoppingCart"})
		.then(
			() => res.status(200),
			err => next(err)
		);
});

module.exports = router;