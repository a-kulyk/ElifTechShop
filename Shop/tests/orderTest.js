let expect = require('chai').expect;
let mongoose = require('mongoose');

let Order = require('../server/api/order/orderModel.js');


describe('Order', function() {
    it('should be invalid if userId is empty', function(done) {
        var order = new Order();
 
        order.validate(function(err) {
            expect(err.errors.userId).to.exist;
            done();
        });
    });
    it('should be invalid if email is empty', function(done) {
        var order = new Order();
 
        order.validate(function(err) {
            expect(err.errors.email).to.exist;
            done();
        });
    });
});