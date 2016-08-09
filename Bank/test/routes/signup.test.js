let signup = require('../../routes/signup').post;
let expect = require('chai').expect;
let sinon = require('sinon');

describe('Signup route', () => {
    it('POST', (done) => {
        let userData = {
            username: 'test' + Math.random(),
            password: 'test'
        };
        let spy = sinon.spy();
        let req = {
            body: userData,
            session: {
                user: null
            }
        };
        let res = {
            send: (object) => {
                spy(object);
                expect(spy.callCount).to.equal(1);
                expect(object.success).to.equal(true);
                expect(object.user.username.toString()).to.equal(userData.username.toString());
                done()
            }
        };
        signup(req, res);
    });
});