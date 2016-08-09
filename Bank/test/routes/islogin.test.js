let islogin = require('../../routes/islogin').get;
let sinon = require('sinon');
let User = require('../../models/user').User;
let expect = require('chai').expect;
describe('IsLogin route', () => {
    it('GET true', (done) => {
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
                            expect(spy.callCount).to.equal(1);
                            expect(spy.args[0][0].success).to.equal(true);
                            done();
                    }
                };
                islogin(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
    it('GET false', (done) => {
        let spy = sinon.spy();
        let req = {
            session: {}
        };
        let res = {
            send: (object) => {
                spy(object);
                expect(spy.callCount).to.equal(1);
                expect(spy.args[0][0].success).to.equal(false);
                done();
            }
        };
        islogin(req, res);
    });
});
