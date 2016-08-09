let history = require('../../routes/history').get;
let sinon = require('sinon');
let User = require('../../models/user').User;
let Account = require('../../models/account').Account;
let expect = require('chai').expect;

describe('History route', () => {
   it('GET', (done) => {
       let user = new User({
           username: 'test' + Math.random(),
           password: 'test'
       });
       user.save()
           .then((user) => {
               let account = new Account({
                   owner: user._id,
                   name: 'test'
               });
               return account.save();
           })
           .then((account) => {
               let spy = sinon.spy();
               let req = {
                   session: {
                       user: account.owner
                   }
               };
               let res = {
                   send: (object) => {
                       spy(object);
                   }
               };
               history(req, res);
               expect(spy.callCount).to.equal(1);
               expect(spy.args[0].success).to.equal(true);
               done();
           })
           .catch((error) => {
               throw new Error(error);
           })
   });
});