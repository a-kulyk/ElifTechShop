let expect = require('chai').expect;
let config = require('../../config');

describe('Configuration', () => {
   it('Config properties', () =>{
       expect(config.get('port')).to.not.equal(null);
       expect(config.get('key')).to.not.equal(null);
       expect(config.get('mongoose')).to.not.equal(null);
       expect(config.get('mongoose')).to.have.property('uri');
       expect(config.get('session')).to.not.equal(null);
       expect(config.get('session')).to.have.property('secret');
       expect(config.get('session')).to.have.property('key');
       expect(config.get('session')).to.have.property('cookie');
       expect(config.get('session:cookie')).to.have.property('path');
   });
});