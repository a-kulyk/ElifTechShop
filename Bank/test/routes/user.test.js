let user = require('../../routes/user').get;
let expect = require('chai').expect;
let sinon = require('sinon');
let User = require('../../models/user').User;
describe('User route', () => {
    it('POST', (done) => {
        let userData = new User({
            username: 'test' + Math.random(),
            password: 'test'
        });
        userData.save()
            .then((userData) => {
                let spy = sinon.spy();
                let req = {
                    session: {
                        user: userData._id
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(true);
                        expect(object.id.toString()).to.equal(userData._id.toString());
                        expect(object.username.toString()).to.equal(userData.username.toString());
                        done();
                    }
                };
                user(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            });
    });
    it('POST without session', (done) => {
        let spy = sinon.spy();
        let req = {
            session: {
                user: null
            }
        };
        let res = {
            send: (object) => {
                spy(object);
                expect(spy.callCount).to.equal(1);
                expect(object.success).to.equal(false);
                expect(object.errorDescription).to.equal('Not login');
                done();
            }
        };
        user(req, res);
    });
});