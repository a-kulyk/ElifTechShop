
// import expect from 'chai';
var mongoose = require('../../libs/mongoose');
//import mongoose from '../libs/mongoose';
var User = require('../../models/user').User;
//import User from '../modules/user';
var mocha = require('mocha');
//import mocha from 'mocha';
describe('Database connection', () => {
    it('Connect to db', function(done) {
        this.timeout(4000);
        let Test = mongoose.model('Test',{
            name: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        });
        let test = new Test({name: "Yo!"});
        test.save()
            .then((result) => {
                done();
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
});

