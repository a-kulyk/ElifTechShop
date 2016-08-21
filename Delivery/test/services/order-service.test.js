/**
 * Created by dmytro on 21.08.16.
 */
'use strict';
let orderService = require('../../services/order-service');
let chai = require('chai');
let should = chai.should();

describe('Test order service', ()=> {
    describe('createOrder', ()=> {
        it('it should create order', (done)=> {
            let order = {
                "title": "TestingCreateOrder",
                "price": 777,
                "from": {
                    "username": "test@gmail.com",
                    "lat": 49.80292559999999,
                    "lng": 23.994827299999997
                },
                "to": {
                    "username": "test@gmail.com",
                    "lat": 49.84269599999999,
                    "lng": 24.032024999999976
                }
            }
            orderService.createOrder(order).then((order)=> {
                should.exist(order);
                order.should.have.property('_id');
                order.should.have.property('travelTime');
                order.should.have.property('arrivalTime');
                done();
            }).catch(err=> {
                done(err);
            })
        })
    })
})
