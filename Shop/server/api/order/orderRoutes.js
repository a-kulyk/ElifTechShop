var router = require('express').Router();
var moment = require('moment');

var Order = require('./orderModel.js');

router.get('/all', function(req, res, next) {
    Order.find({userId: req.user._id})
      .then(
        orders => res.json(orders),
        err => next(err)
      );
  });

router.get('/cart', function(req, res, next) {
    Order.findOne({userId: req.user._id, status: "shoppingCart"})
      .populate({path: 'itemSet.productId', select: 'category name price images'})
      .exec()
      .then(
        order => res.json({order: order, total: order.findTotal()}),
        err => next(err)
      );
  });

router.get('/:id', function(req, res, next) {
    Order.findById(req.params.id)
      // .populate({path: 'itemSet.productId', select: 'category name price images'})
      // .exec()
      .then(
        order => res.json(order),
        err => next(err)
      );
  });

router.post('/create', function(req, res, next) {
  Order.create({
    userId: req.user._id.toString(),
    itemSet: [{
      productId: req.body.itemId,
      quantity: req.body.quantity
    }],
    email: req.user.email,
    status: 'shoppingCart',
    date: {
      created: moment().format("D MMMM YYYY, HH:mm"),
      paid: '',
      completed: ''
    }
  })
  .then(order => Order.populate(order, {path: 'itemSet.productId', select: 'category name price images'} ))
  .then(
    order => res.json({order: order, total: order.findTotal()}),
    error => next(error)
  );
});

router.put('/addToCart', function(req, res, next) {
  console.log("req : ", req.body.itemId, "quan : ", req.body.quantity);
  Order.findOne({userId: req.user._id, status: "shoppingCart"})
    .then(order => {
      var arr = order.itemSet;
      var item = arr.find(function(i){
        return i.productId.toString() === req.body.itemId;
      });
      if (item){
        item.quantity += req.body.quantity;
      } else  {
        arr.push({productId: req.body.itemId, quantity: req.body.quantity});
      }  
      return order.save();        
    })
    .then(order => Order.populate(order, {path: 'itemSet.productId', select: 'category name price images'} ))
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
        return Order.populate(order, {path: 'itemSet.productId', select: 'category name price images'});
      } else { res.json({order: order}) }
    })
    .then(
      order => res.json( {order: order, total: order.findTotal()} ),
      err => next(err)
    );
});

router.put('/saveOrderDetails', function(req, res, next) {
  Order.findOne({userId: req.user._id, status: "shoppingCart"})
    .then(order => Order.populate(order, {path: 'itemSet.productId', select: 'category name price images'} ))
    .then(order => {
      order.total = order.findTotal();
      return order.save();
    })
    .then(order => {
      order.itemSet.forEach(function(obj){
        obj.name = obj.productId.name;
        obj.category = obj.productId.category;
        obj.price = obj.productId.price;
        obj.images = obj.productId.images;
        return obj;
      });
      order.date.paid = new Date();      
      return order.save();
    })    
    .then(order => res.json(order),
      err => next(err));
 });

router.put('/setAddress', function(req, res, next) {
  Order.findOne({userId: req.user._id, status: "shoppingCart"})
    .then(order => {
        console.log('req.body.address : ', req.body);
        order.shippingAddress = {str: req.body.str, lat: req.body.lat, lng: req.body.lng};
        order.status = "proccessing";
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