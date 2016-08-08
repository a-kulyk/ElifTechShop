let logout = require('../../routes/logout').post;
let sinon = require('sinon');
let expect = require('chai').expect;

describe('Logout route', () => {
   it('POST', () => {
       let spy = sinon.spy();
       let req = {
           session: {
               destroy: () => {
                   spy();
               }
           }
       };
       let res = {
           send: (object) => {
               spy(object);
           }
       };
       logout(req, res);
       expect(spy.callCount).to.equal(2);
       expect(spy.args[0].success).to.equal(true);
   });
});