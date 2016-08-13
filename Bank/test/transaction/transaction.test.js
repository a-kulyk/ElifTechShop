let User = require('../../models/user').User;
let Account = require('../../models/account').Account;
let Transaction = require('../../models/transaction').Transaction;
let expect = require('chai').expect;

describe('Transaction', () => {
   it('Action transfer', (done) => {
      let user = new User({
          username: 'test' + Math.random(),
          password: 'test'
      });
       user.save()
           .then((user) => {
               let account1 = new Account({
                   owner: user.username,
                   name: 'test1',
                   amount: 1
               });
               let account2 = new Account({
                   owner: user.username,
                   name: 'test2'
               });
               return Promise.all([account1.save(), account2.save()]);
           })
           .then((accounts) => {
               return Promise.all([
                   Promise.resolve(accounts[0].amount),
                   Transaction.action(accounts[0]._id, accounts[1]._id, accounts[0].amount)
               ]);
           })
           .then((result) => {
               expect(result[1].from.amount).to.equal(0);
               expect(result[1].to.amount).to.equal(result[0]);
               expect(result[1].amount).to.equal(result[0]);
               done();
           })
           .catch((error) => {
               throw new Error(error);
           });
   });
    it('Action payment', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let account = new Account({
                    owner: user.username,
                    name: 'test1',
                });
                return account.save();
            })
            .then((account) => {
                return Transaction.action(account._id, account._id, 1);
            })
            .then((result) => {
                console.log(result);
                expect(result.to.amount).to.equal(1);
                expect(result.amount).to.equal(1);
                done();
            })
            .catch((error) => {
                throw new Error(error);
            });
    });
});
