/**
 * Created by dmytro on 29.06.16.
 */
var Order = require('../models/order');
var googleConnector = require('../lib/distance-determiner');
var validationSchema = require('../lib/validation-schema');

var orderAccepted = {"status": "true"};
var failed = {"status": "false"};

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/order/:id', function (req, res) {
        Order.findById(req.params.id, function (err, doc) {
            if (err) {
                res.json(failed);
            } else {
                res.json(doc);
            }
        })
    })

    app.post('/order', function (req, res) {
        req.checkBody(validationSchema);

        var errors = req.validationErrors();
        console.log(errors);
        if (errors) {
            res.sendStatus(400);
        } else {
            var distanceEmitter = googleConnector({lat: req.body.from.lat, lng: req.body.from.lng}, {
                lat: req.body.to.lat,
                lng: req.body.to.lng
            });

            function resFormer(resultJSON) {
                var estimatedTime = JSON.parse(resultJSON).rows[0].elements[0].duration.text;
                orderAccepted.estimatedTime = estimatedTime;
                console.log(orderAccepted);
                new Order(req.body).save(function (err, doc) {
                    if (err) {
                        res.json(failed);
                    } else {
                        res.json(orderAccepted);
                    }
                });
                distanceEmitter.removeListener('resultIsReady', resFormer);
            }

            distanceEmitter.on('resultIsReady', resFormer);

        }
    });
}

