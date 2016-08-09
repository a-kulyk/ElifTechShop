let islogin = require('../../routes/islogin').get;
let sinon = require('sinon');
let User = require('../../models/user').User;
let expect = require('chai').expect;
describe('IsLogin route', () => {
    it('GET', (done) => {
        let user = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        user.save()
            .then((user) => {
                let spy = sinon.spy();
                let req = {
                    session: {
                        user: user._id
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                    }
                };
                islogin(req, res);
                expect(spy.callCount).to.equal(1);
                expect(spy.args[0].success).to.equal(true);
                req.session.user = null;
                islogin(req, res);
                expect(spy.callCount).to.equal(2);
                expect(spy.args[0].success).to.equal(false);
                done();
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
});
