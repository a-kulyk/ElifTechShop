
let Account = require('../../models/account').Account;
let expect = require('chai').expect;
var User = require('../../models/user').User;

describe('Creating account', () => {
   it('New account', (done) => {
       let userData = {
           username: 'test' + Math.random(),
           password: 'test'
       };
       let user = new User(userData);
       user.save()
           .then((result) => {
               return Promise.resolve(result);
           })
           .then((result) => {
               let accountData =  {
                   owner: result.username,
                   name: 'testing'
               };
               let account = new Account(accountData);
               return account.save()
           })
           .then((result) => {
               expect(result.amount).to.equal(0);
               expect(result.enabled).to.equal(true);
               done();
           })
           .catch((error) => {
               throw new Error(error);
           });
   })
});