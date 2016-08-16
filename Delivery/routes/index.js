/**
 * Created by dmytro on 29.06.16.
 */
"use strict";
let isAuthenticated = require('../lib/passport/authentication-check');

module.exports = function (app, passport) {

    app.get('/order/:trackingCode', require('./order').get);

    app.get('/order/id/:id', require('./order').getById);

    app.post('/order', require('./order').post);

    app.post('/delivered', require('./delivered').post);

    app.get('/history/:fromUsername/:toUsername', isAuthenticated, require('./history').get);

    app.post('/login', require('./login').login(passport));

    app.post('/logout', require('./logout').post);

    app.get('/cars', isAuthenticated, require('./cars').get);

    app.post('/deactivate_car', isAuthenticated, require('./cars').deactivateCar);

    app.post('/activate_car', isAuthenticated, require('./cars').activateCar);

    app.get('/status', isAuthenticated, require('./status').get);
}

