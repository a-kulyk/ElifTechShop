let login = require('../../routes/login').post;
let sinon = require('sinon');
let User = require('../../models/user').User;
let expect = require('chai').expect;
describe('Account route', () => {
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
                    }
                };
                login(req, res);
                expect(spy.callCount).to.equal(1);
                expect(spy.args[0].success).to.equal(true);
                expect(spy.args[0].user.username).to.equal(result[0].username);
                expect(req.session.user).to.equal(result[0]._id);
                done();
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
});
