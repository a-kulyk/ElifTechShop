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
               expect(spy.callCount).to.equal(2);
               expect(object.success).to.equal(true);
           }
       };
       logout(req, res);
   });
});