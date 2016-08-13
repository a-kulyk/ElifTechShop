let signup = require('../../routes/signup').post;
let expect = require('chai').expect;
let sinon = require('sinon');
let User = require('../../models/user').User;

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
    it('POST occupy username', (done) => {
        let userData = {
            username: 'test' + Math.random(),
            password: 'test'
        };
        let user = new User(userData);
        user.save()
            .then((user) => {
                let spy = sinon.spy();
                let req = {
                    body: {
                        username: user.username,
                        password: 'test'
                    },
                    session: {
                        user: null
                    }
                };
                let res = {
                    send: (object) => {
                        spy(object);
                        expect(spy.callCount).to.equal(1);
                        expect(object.success).to.equal(false);
                        expect(object.errorDescription).to.equal('The username is occupy');
                        done();
                    }
                };
                signup(req, res);
            })
            .catch((error) =>{
                throw new Error(error);
            });

    });
});