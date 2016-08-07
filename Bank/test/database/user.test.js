
var User = require('../../models/user').User;

var mocha = require('mocha');
describe('Create user', () => {

    it('New user', (done) => {
        let data = {
            username: 'test' + Math.random(),
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