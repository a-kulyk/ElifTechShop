var router = require('express').Router();
var querystring = require('querystring');
var bodyParser = require('body-parser');
var http = require('http');
var _ = require('underscore');
var config = require('../../config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Order = require('./orderModel.js');
var Product = require('../catalog/catalogModel');

router.get('/all', function(req, res, next) {
    Order.find({ userId: req.user._id })
        .then(
            orders => res.json(orders),
            err => next(err)
        );
});

router.get('/cart', function(req, res, next) {
    Order.findOne({ userId: req.user._id, status: "shoppingCart" })
        .populate({ path: 'itemSet.productId', select: 'category name price images' })
        .exec()
        .then(
            order => res.json({ order: order, total: order.findTotal() }),
            err => next(err)
        );
});

router.get('/:id', function(req, res, next) {
    Order.findById(req.params.id)
        .then(
            order => res.json(order),
            err => next(err)
        );
});

router.get('/info/:track', function(req, res, next) {

    let options = {
        host: 'localhost',
        port: 9000,
        path: '/order/' + req.params.track,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var httpreq = http.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => {
            body += chunk;
        });
        response.on('end', () => {
            res.send(body);
        });
    });

    httpreq.on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
    httpreq.end();
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
        .then(order => Order.populate(order, { path: 'itemSet.productId', select: 'category name price images' }))
        .then(
            order => res.json({ order: order, total: order.findTotal() }),
            error => next(error)
        );
});

router.post('/pay', function(req, res, next) {
    if (!req.user.bankAccount) {
        res.json({ warning: "No bankAccount" });
        res.end();
    } else {
        Order.findOne({ userId: req.user._id, status: "shoppingCart" })
            .populate({ path: 'itemSet.productId', select: 'price' })
            .exec()
            .then(order => {                
                let outOfStock = [];

                let promises = order.itemSet.map(function(item) {
                    return new Promise(function(resolve, reject) {
                        Product.findById(item.productId._id)
                            .then(inStock => {
                                if (inStock.quantity < item.quantity)
                                outOfStock.push( _.pick(inStock, '_id', 'name', 'quantity'));
                            })
                            .then(() => resolve());
                    });
                });

                return Promise.all(promises)
                    .then(() => {
                        if (outOfStock.length) {
                            res.send({outOfStock});
                            return;
                        } else {
                            order.itemSet.forEach(function(item) {
                                Product.findById(item.productId._id)
                                    .then(inStock => {
                                        inStock.quantity -= item.quantity;
                                        inStock.save();
                                    });
                            });
                            return order;
                        }
                    });
            })
            .then(order => {
                let total = order.findTotal();
                console.log("...TOTAL...", total);
                return total;
            })
            .then(total => {
                let post_data = querystring.stringify({
                    from: req.user.bankAccount,
                    to: config.shopBankAccount,
                    amount: total,
                    API_KEY: config.API_KEY
                });

                let options = {
                    host: 'localhost',
                    port: 3000,
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
                        res.send(body);
                    });
                });
                httpreq.write(post_data);
                httpreq.on('error', function(e) {
                    console.log(e.message);
                    next(e);
                });
                httpreq.end();
            });
    }
});

router.put('/addToCart', function(req, res, next) {
    Order.findOne({ userId: req.user._id, status: "shoppingCart" })
        .then(order => {
            var arr = order.itemSet;
            var item = arr.find(function(elem) {
                return elem.productId.toString() === req.body.itemId;
            });
            if (item) {
                item.quantity += req.body.quantity;
            } else {
                arr.push({ productId: req.body.itemId, quantity: req.body.quantity });
            }
            return order.save();
        })
        .then(order => Order.populate(order, { path: 'itemSet.productId', select: 'category name price images' }))
        .then(
            order => res.json({ order: order, total: order.findTotal() }),
            err => next(err)
        );
});

router.put('/updateQuantity', function(req, res, next) {
    Order.findOne({ userId: req.user._id, status: "shoppingCart" })
        .then(order => {
            var item = order.itemSet.find(function(elem) {
                return elem.productId.toString() === req.body.itemId;
            });
            item.quantity += req.body.quantity;
            return order.save();
        })
        .then(order => Order.populate(order, { path: 'itemSet.productId', select: 'category name price images' }))
        .then(
            order => res.json({ order: order, total: order.findTotal() }),
            err => next(err)
        );    
});

router.put('/removeItem', function(req, res, next) {
    Order.findOne({ userId: req.user._id, status: "shoppingCart" })
        .then(order => {
            var arr = order.itemSet;
            var index = arr.findIndex(function(elem) {
                return elem.productId.toString() === req.body.itemId;
            });
            arr.splice(index, 1);
            return order.save();
        })
        .then(order => {
            if (order.itemSet.length) {
                return Order.populate(order, { path: 'itemSet.productId', select: 'category name price images' });
            } else { res.json({ order: order }); }
        })
        .then(
            order => res.json({ order: order, total: order.findTotal() }),
            err => next(err)
        );
});


router.put('/saveOrderDetails', function(req, res, next) {
    Order.findOne({ userId: req.user._id, status: "shoppingCart" })
        .then(order => Order.populate(order, { path: 'itemSet.productId', select: 'category name price images' }))
        .then(order => {
            order.total = order.findTotal();
            return order.save();
        })
        .then(order => {
            order.itemSet.forEach(function(obj) {
                _.extend(obj, _.pick(obj.productId, 'name', 'category', 'price', 'images'));
            });
            order.date.paid = new Date();
            return order.save();
        })
        .then(order => res.json(order),
            err => next(err));
});

router.put('/setAddress', function(req, res, next) {
    Order.findOne({ userId: req.user._id, status: "shoppingCart" })
        .then(order => {
            order.shippingAddress = { str: req.body.str, lat: req.body.lat, lng: req.body.lng };
            order.status = "proccessing";
            return order.save();
        })
        .then(order => {
                let post_data = JSON.stringify({
                    title: order._id,
                    price: order.total,
                    from: {
                        username: config.shopEmail,
                        lat: +config.shopAddress.lat,
                        lng: +config.shopAddress.lng
                    },
                    to: {
                        username: req.user.email,
                        lat: +order.shippingAddress.lat,
                        lng: +order.shippingAddress.lng
                    }
                });

                let options = {
                    host: 'localhost',
                    port: 9000,
                    path: '/order/',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
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
                        let body_parsed = JSON.parse(body);
                        if (body_parsed.success) {
                            order.trackingCode = body_parsed.trackingCode;
                            order.save();
                            res.json({ trackingCode: body_parsed.trackingCode })
                        } else {
                            console.log('Something went wrong!!!')
                        }
                    });
                });

                httpreq.write(post_data);
                httpreq.on('error', function(e) {
                    console.log('ERROR: ' + e.message);
                });
                httpreq.end();
            },
            err => next(err));
});

router.put('/delivered', function(req, res, next) {
    Order.findOne({ trackingCode: req.body.trackingCode })
        .then(order => {
            order.status = "completed";
            order.date.completed = new Date();
            return order.save();
        })
        .then(order => res.json(order),
            err => next(err));
});

router.delete('/remove', function(req, res, next) {
    Order.findOneAndRemove({ userId: req.user._id, status: "shoppingCart" })
        .then(
            () => res.status(200),
            err => next(err)
        );
});

module.exports = router;
