/**
 * Created by dmytro on 28.06.16.
 */
var dbConnector = require('../db_connector');

function OrderService() {
    this.createOrder = function (order) {
        dbConnector.db.orders.save(order, function (id, orderInserted) {
            console.log(orderInserted);
        });
    }
    this.getOrderById = function (id) {
        dbConnector.db.orders.find({
            _id: dbConnector.mongojs.ObjectId(id)
        }, function (err, doc) {
            console.log(doc);
        });
    }
}

module.exports = OrderService;