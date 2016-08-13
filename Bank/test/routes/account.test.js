let account = require('../../routes/account');
let sinon = require('sinon');
let User = require('../../models/user').User;
let Account = require('../../models/account').Account;
let expect = require('chai').expect;
describe('Account route', () => {
    it('POST logined', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let spy = sinon.spy();
                let req = {
                    body: {
                        name: 'test'
                    },
                    session: {
                        user: user._id
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(spy.args[0][0].success).to.equal(true);
                        expect(spy.args[0][0].account.owner.toString()).to.equal(user._id.toString());
                        done();
                    }
                };
                account.post(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
    it('POST not login', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let spy = sinon.spy();
                let req = {
                    body: {
                        name: 'test'
                    },
                    session: {
                        user: null
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(spy.args[0][0].success).to.equal(false);
                        expect(spy.args[0][0].errorDescription.toString()).to.equal('Not login');
                        done();
                    }
                };
                account.post(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
    it('GET', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let userAccount = new Account({
                    owner: user._id,
                    name: 'test'
                });
                return userAccount.save();
            })
            .then((userAccount) => {
                let spy = sinon.spy();
                let req = {
                    session: {
                        user: userAccount.owner
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(true);
                        expect(object.accounts[0]._id.toString()).to.equal(userAccount._id.toString());
                        expect(object.accounts[0].owner.toString()).to.equal(userAccount.owner.toString());
                        done();
                    }
                };
                account.get(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
    it('DELETE', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let userAccount = new Account({
                    owner: user._id,
                    name: 'test'
                });
                return userAccount.save();
            })
            .then((userAccount) => {
                let spy = sinon.spy();
                let req = {
                    session: {
                        user: userAccount.owner
                    },
                    params: {
                        id: userAccount._id
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(true);
                        Account.findOne({_id: userAccount._id})
                            .then((deletedAccount) => {
                                expect(deletedAccount.enabled).to.equal(false);
                                done()
                            })
                            .catch((error) => {
                                throw new Error(error);
                            });
                    }
                };
                account.delete(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
    it('Forbidden DELETE', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let userAccount = new Account({
                    owner: 'someone',
                    name: 'test'
                });
                return Promise.all([userAccount.save(), Promise.resolve(user)]);
            })
            .then((result) => {
                let spy = sinon.spy();
                let req = {
                    session: {
                        user: result[1]._id
                    },
                    params: {
                        id: result[0]._id
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
                account.delete(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
});
