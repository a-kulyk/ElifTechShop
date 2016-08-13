let transaction = require('../../routes/transaction');
let expect = require('chai').expect;
let sinon = require('sinon');
let User = require('../../models/user').User;
let Account = require('../../models/account').Account;
let Transaction = require('../../models/transaction').Transaction;
let config = require('../../config');

describe('Transaction route', () => {
    it('POST', function (done) {
        this.timeout(3000);
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
                        //expect(object).to.have.property(transaction_id);
                        done();
                    }
                };
                transaction.post(req, res);
            })
            .catch((error) => {
                throw new Error(error)
            });
    });
    it('POST invalid API_KEY', (done) => {
        let spy = sinon.spy();
        let req = {
            body: {
                from: 'one',
                to: 'another',
                amount: 1,
                API_KEY: 'nothing'
            }
        };
        let res = {
            send: (object) => {
                spy(object);
                expect(spy.callCount).to.equal(1);
                expect(object.success).to.equal(false);
                expect(object.errorDescription).to.equal('Invalid key');
                done();
            }
        };
        transaction.post(req, res);
    });
    it('GET exists', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let firstAccount = new Account({
                    owner: user._id,
                    name: 'first',
                    amount: 1
                });
                let secondAccount = new Account({
                    owner: user._id,
                    name: 'second'
                });
                return Promise.all([firstAccount.save(), secondAccount.save()]);
            })
            .then((accounts) => {
                return Transaction.action(accounts[0]._id, accounts[1]._id, 1);
            })
            .then((result) => {
                let date = new Date();
                let spy = sinon.spy();
                let req = {
                    query: {
                        id: result.transactionId,
                        from: result.from._id,
                        to: result.to._id,
                        amount: result.amount,
                        date_day: date.getDate(),
                        date_month: +date.getMonth() + 1,
                        date_year: date.getFullYear()
                    }
                };
                let res = {
                    send: (object) => {
                        //console.log(object);
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(true);
                        expect(object.exists).to.equal(true);
                        done();
                    }
                };
                transaction.get(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            });
    });
    it('GET not exists', (done) => {
        let account = new Account({
            owner: 'someone',
            name: 'test'
        });
        account.save()
            .then((account) => {
                let spy = sinon.spy();
                let req = {
                    query: {
                        id: account._id,
                        from: 'someone',
                        to: 'another',
                        amount: 1,
                        date_day: '01',
                        date_month: '01',
                        date_year: '2034'
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(true);
                        expect(object.exists).to.equal(false);
                        done();
                    }
                };
                transaction.get(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            });

    });
});