/**
 * Created by dmytro on 29.06.16.
 */
var Order = require('../models/order');
var googleConnector = require('../lib/distance-determiner');

var orderNotFound = {"status": "false"};
var orderAccepted = {"status": "true"};

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/order/:id', function (req, res) {
        Order.findById(req.params.id, function (err, doc) {
            if (err) {
                res.json(orderNotFound);
            } else {
                res.json(doc);
            }
        })
    })

    app.post('/order', function (req, res) {
        new Order(req.body).save(function (err, doc) {
            if (err) {
                res.sendStatus(400);
            } else {
                var distanceEmitter = googleConnector({lat: doc.from.lat, lng: doc.from.lng}, {
                    lat: doc.to.lat,
                    lng: doc.to.lng
                });

                function resFormer(resultJSON) {
                    var estimatedTime = JSON.parse(resultJSON).rows[0].elements[0].duration.text;
                    orderAccepted.estimatedTime = estimatedTime;
                    console.log(orderAccepted);
                    //res.end(JSON.stringify(orderAccepted));
                    res.json(orderAccepted);
                    distanceEmitter.removeListener('resultIsReady', resFormer);
                }

                distanceEmitter.on('resultIsReady', resFormer);
            }
        });
    });

}

