let login = require('../../routes/login').post;
let sinon = require('sinon');
let User = require('../../models/user').User;
let expect = require('chai').expect;
describe('Login route', () => {
    it('POST', (done) => {
        let userData = {
            username: 'test' + Math.random(),
            password: 'test'
        };
        let user = new User(userData);
        Promise.all([ user.save(), Promise.resolve(userData)])
            .then((result) => {
                let spy = sinon.spy();
                let req = {
                    body: result[1],
                    session: {
                        user: null
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(spy.args[0][0].success).to.equal(true);
                        expect(spy.args[0][0].user.username.toString()).to.equal(result[0].username.toString());
                        expect(req.session.user.toString()).to.equal(result[0]._id.toString());
                        done();
                    }
                };
                login(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
    it('POST invalid password', (done) => {
        let userData = {
            username: 'test' + Math.random(),
            password: 'test'
        };
        let user = new User(userData);
        Promise.all([ user.save(), Promise.resolve(userData)])
            .then((result) => {
                let spy = sinon.spy();
                let req = {
                    body: {
                        username: result[0].username,
                        password: '1'
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
                        expect(spy.args[0][0].errorDescription.toString()).to.equal('Invalid username or password');
                        done();
                    }
                };
                login(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
});
