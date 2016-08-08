let account = require('../../routes/account').post;
let sinon = require('sinon');
let User = require('../../models/user').User;
let expect = require('chai').expect;
describe('Account route', () => {
    it('POST', (done) => {
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
                        console.log(spy.callCount);
                        console.log(spy.args[0]);
                        expect(spy.callCount).to.equal(1);
                        expect(spy.args[0].success).to.equal(true);
                        expect(spy.args[0].account.owner).to.equal(user._id);
                        done();
                    }
                };
                account(req, res);
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
});
