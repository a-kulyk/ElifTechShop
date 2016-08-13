let transfer = require('../../routes/transfer').post;
let expect = require('chai').expect;
let sinon = require('sinon');
let User = require('../../models/user').User;
let Account = require('../../models/account').Account;

describe('Transfer route', () => {
    it('POST', (done) => {
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
                let spy = sinon.spy();
                let req = {
                    body: {
                        from: accounts[0]._id,
                        to: accounts[1]._id,
                        amount: 1
                    },
                    session: {
                        user: accounts[0].owner
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(true);
                        expect(object.sender.toString()).to.equal(accounts[0]._id.toString());
                        expect(object.senderName.toString()).to.equal(accounts[0].name.toString());
                        expect(object.amount).to.equal(1);
                        expect(object.senderAmount).to.equal(0);
                        expect(object.receiverAmount).to.equal(1);
                        expect(object.receiver.toString()).to.equal(accounts[1]._id.toString());
                        expect(object.receiverAccountName.toString()).to.equal(accounts[1].name.toString());
                        done();
                    }
                };
                transfer(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            });
    });
    it('POST disable', (done) =>{
       let spy = sinon.spy();
        let req = {
            body: {
                from: 'someone',
                to: 'someone',
                amount: 1
            },
            session: {
                user: 'owner'
            }
        };
        let res = {
            send: (object) => {
                spy(object);
                expect(spy.callCount).to.equal(1);
                expect(object.success).to.equal(false);
                expect(object.errorDescription).to.equal('Disable');
                done();
            }
        };
        transfer(req, res);
    });
    it('POST forbidden', (done) => {
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
                    body: {
                        from: account._id,
                        to: 'someone',
                        amount: 1
                    },
                    session: {
                        user: 'murder'
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(false);
                        expect(object.errorDescription).to.equal('Forbidden');
                        done();
                    }
                };
                transfer(req, res);
            });
    });
});