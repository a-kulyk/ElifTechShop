let pay = require('../../routes/pay').post;
let sinon = require('sinon');
let expect = require('chai').expect;
let User = require('../../models/user').User;
let Account = require('../../models/account').Account;

describe('Pay route', () => {
    it('POST', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let account = new Account({
                    owner: user._id,
                    name: 'first'
                });
                return account.save();
            })
            .then((account) => {
                let spy = sinon.spy();
                let req = {
                    body: {
                        account: account._id,
                        amount: 1
                    },
                    session: {
                        user: account.owner
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(spy.args[0][0].success).to.equal(true);
                        expect(spy.args[0][0].accountAmount).to.equal(1);
                        expect(spy.args[0][0].amount).to.equal(1);
                        expect(spy.args[0][0].accountId.toString()).to.equal(account._id.toString());
                        done();
                    }
                };
                pay(req, res);
            });
    });
    it('Forbidden POST', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let account = new Account({
                    owner: 'someone',
                    name: 'first'
                });
                return Promise.all([account.save(), Promise.resolve(user)]);
            })
            .then((result) => {
                let account = result[0];
                let user = result[1];
                let spy = sinon.spy();
                let req = {
                    body: {
                        account: account._id,
                        amount: 1
                    },
                    session: {
                        user: user._id
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(spy.args[0][0].success).to.equal(false);
                        expect(spy.args[0][0].errorDescription).to.equal('Forbidden');
                        done();
                    }
                };
                pay(req, res);
            });
    });
});