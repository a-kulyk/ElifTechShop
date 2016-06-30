/**
 * Created by dmytro on 29.06.16.
 */
var Order = require('../models/order');

console.log()
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/order/:id', function (req, res) {
        console.log(req.params.id);
        Order.findById(req.params.id, function (err, doc) {
            if (err) {
                res.end('There is no such order');
            } else {
                res.json(doc);
            }
        })
    })

    app.post('/order', function (req, res) {
        //console.log(req.body);
        new Order(req.body).save(function (err, doc) {
            if (err) {
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        });
    });

}