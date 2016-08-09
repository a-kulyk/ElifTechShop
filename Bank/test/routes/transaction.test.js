let transaction = require('../../routes/transaction');
let expect = require('chai').expect;
let sinon = require('sinon');
let User = require('../../models/user').User;
let Account = require('../../models/account').Account;
let config = require('../../config');

describe('Transaction route', () => {
    it('POST', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let firstAccount = new Account({
                    owner: user._id,
                    name: 'test',
                    amount: 1
                });
                let secondAccount = new Account({
                    owner: user._id,
                    name: 'test'
                });
                return Promise.all([firstAccount.save(), secondAccount.save()]);
            })
            .then((accounts) => {
                let spy = sinon.spy();
                let req = {
                    body: {
                        from: accounts[0]._id,
                        to: accounts[1]._id,
                        amount: 1,
                        API_KEY: config.get('key')
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(true);
                        expect(object).to.have.property(transactionId);
                        done()
                    }
                };
                transaction.post(req, res);
            })
            .catch((error) => {
                throw new Error(error)
            });
    })
});