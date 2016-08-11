var router = require('express').Router();
var querystring = require('querystring');
var http = require('http');
// var moment = require('moment');
var config = require('../../config');

var Order = require('./orderModel.js');
// var User = require('../auth/userModer.js')

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

router.get('/pay', function(req, res, next) {
  Order.findOne({userId: req.user._id, status: "shoppingCart"})
  .populate({path: 'itemSet.productId', select: 'price'})
  .exec()
  .then(order => {
    let total = order.findTotal();
    return total;
  })
  .then(total => {
    console.log("TOTAL",typeof(total));
    let post_data = querystring.stringify({
        from: req.user.bankAccount,
        to: config.shopBankAccount,
        amount: total,
        API_KEY: config.API_KEY
      });

    let options = {
      host: 'localhost',
      port: 4000,
      path: '/api/transaction/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(post_data)
      }
    };

    var httpreq = http.request(options, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        console.log("END OF RESP: " + body);
        res.send(body);
      });
    });
    httpreq.write(post_data);
    httpreq.on('error', function(e) {
        console.log("Got error: " + e.message);
        next(e);
      });
    httpreq.end();
  });
});

router.get('/:id', function(req, res, next) {
    Order.findById(req.params.id)
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
      created: new Date(),
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

router.put('/updateQuantity', function(req, res, next) {
  console.log("req : ", req.body.itemId, "quan : ", req.body.quantity);
  Order.findOne({userId: req.user._id, status: "shoppingCart"})
    .then(order => {
      var item = order.itemSet.find(function(i){
        return i.productId.toString() === req.body.itemId;
      });
      item.quantity = req.body.quantity;
      return order.save();        
    })
    .then(order => Order.populate(order, {path: 'itemSet.productId', select: 'category name price images'} ))
    .then(
      order => res.json( {order: order, total: order.findTotal()} ),
      err => next(err)
    );
});

router.put('/removeItem', function(req, res, next) {
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