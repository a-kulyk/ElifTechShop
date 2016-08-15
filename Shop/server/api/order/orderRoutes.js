"use-strict";
var router = require('express').Router();
var querystring = require('querystring');
var bodyParser = require('body-parser');
var http = require('http');
var config = require('../../config');

var Order = require('./orderModel.js');

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
        port: 5000,
        path: '/order/' + req.params.track,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var httpreq = http.request(options, (response) => {
        let bodyChunks = [];
        response.on('data', (chunk) => {
            bodyChunks.push(chunk);
        });
        response.on('end', () => {
            let body = Buffer.concat(bodyChunks).toString();
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
        res.json({ warning: "No bankAccount" })
        res.end();
    } else {
        Order.findOne({ userId: req.user._id, status: "shoppingCart" })
            .populate({ path: 'itemSet.productId', select: 'price' })
            .exec()
            .then(order => {
                let total = order.findTotal();
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
                    port: 4000,
                    path: '/api/transaction/',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(post_data)
                    }
                };

                var httpreq = http.request(options, (response) => {
                    let bodyChunks = [];
                    response.setEncoding('utf8');
                    response.on('data', (chunk) => {
                        bodyChunks.push(chunk);
                    });
                    response.on('end', () => {
                        let body = Buffer.concat(bodyChunks).toString();
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
    }
});

router.put('/addToCart', function(req, res, next) {
    Order.findOne({ userId: req.user._id, status: "shoppingCart" })
        .then(order => {
            var arr = order.itemSet;
            var item = arr.find(function(i) {
                return i.productId.toString() === req.body.itemId;
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
            var item = order.itemSet.find(function(i) {
                return i.productId.toString() === req.body.itemId;
            });
            item.quantity = req.body.quantity;
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
            var index = arr.find(function(i) {
                return i.productId.toString() === req.body.itemId;
            });
            arr.splice(index, 1);
            return order.save();
        })
        .then(order => {
            if (order.itemSet.length) {
                return Order.populate(order, { path: 'itemSet.productId', select: 'category name price images' });
            } else { res.json({ order: order }) }
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
                    port: 5000,
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
