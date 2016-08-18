/**
 * Created by dmytro on 18.08.16.
 */
'use strict';

let app = require('../app');
let Order = require('../models/order');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('/POST order', ()=> {
    it('it should POST order', (done)=> {
        let order = {
            "title": "TestingPost",
            "price": 777,
            "from": {
                "username": "example10@gmail.com",
                "lat": 49.80292559999999,
                "lng": 23.994827299999997
            },
            "to": {
                "username": "test10@gmail.com",
                "lat": 49.84269599999999,
                "lng": 24.032024999999976
            }
        }
        chai.request(app).post('/order')
            .send(order)
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('success').eql(true);
                res.body.should.have.property('trackingCode');
                done();
            })
    })
})

describe('/GET order by tracking code', ()=> {
    it('it should GET order by tracking code', (done)=> {
        Order.find({}).limit(1).exec((err, docs)=> {
            let trackingCode = docs[0].trackingCode;
            chai.request(app)
                .get('/order/' + trackingCode)
                .end((err, res)=> {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('arrivalTime');
                    res.body.should.have.property('travelTime');
                    res.body.should.have.property('state');
                    res.body.should.have.property('from');
                    res.body.should.have.property('to');
                    done();
                })
        })
    })
})

describe('/GET order by id', ()=> {
    it('it should GET order by id', (done)=> {
        Order.find({}).limit(1).exec((err, docs)=> {
            let id = docs[0]._id;
            chai.request(app)
                .get('/order/id/' + id)
                .end((err, res)=> {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('trackingCode');
                    done();
                })
        })
    })
})