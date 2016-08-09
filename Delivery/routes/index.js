/**
 * Created by dmytro on 29.06.16.
 */
"use strict";

module.exports = function (app) {

    app.get('/order/:trackingCode', require('./order').get);

    app.post('/order', require('./order').post);

    app.post('/delivered', require('./delivered').post);

    app.get('/history/:fromUsername/:toUsername', require('./history').get);

    app.post('/login', require('./login').post);

    app.get('/cars', require('./cars').get);
}

