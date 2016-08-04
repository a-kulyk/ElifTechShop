/**
 * Created by dmytro on 31.07.16.
 */
module.exports = function (app) {
    app.service('orderStates', function () {
        this.statesArray = ['Shipment', 'Transportation', 'Delivered'];
    });
}