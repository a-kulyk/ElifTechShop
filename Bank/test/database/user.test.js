import expect from 'chai';
import User from '../modules/user';
describe('Create user', () => {

    it('New user', (done) => {
        var Account = {
            save: sinon.spy()
        }
        // Mock
        // import

        functionUseAccount();
        expect(Account.save.calledNum).to.be.eq(2);
        let data = {
            name: 'test' + Math.random(),
            password: 'test'
        };
        let user = new User(data);
        user.save()
            .then((result) => {
                done();
            })
            .catch((error) => {
                throw new Error(error);
            })
    });
});