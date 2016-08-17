let chai = require('chai');
let expect = chai.expect;
var Filter = require('../filter.js');

describe('Filter',function () {
    let filter;
    before(function() {
        filter = new Filter;
    });
    it('getSort should have price if i create Filter and value equal 1',function () {
        expect(filter.getSort()).to.eql({price:1})
    });
    it('getSort should have price if setSort() without argumets',function () {
        filter.setSort();
        expect(filter.getSort()).to.eql({price:1})
    });
    it('getSort should have price if setSort() have 1 params equal price',function () {
        filter.setSort('price');
        expect(filter.getSort()).to.eql({price:1})
    })
    it('getSort should have price if setSort() have 1 params equal price',function () {
        filter.setSort('Price');
        expect(filter.getSort()).to.eql({price:1})
    })
    it('getSort should have name if setSort() have 1 params equal name',function () {
        filter.setSort('name');
        expect(filter.getSort()).to.eql({name:1})
    })
    it('getSort should have Name if setSort() have 1 params equal name',function () {
        filter.setSort('Name');
        expect(filter.getSort()).to.eql({name:1})
    })
    it('getSort should have price if setSort() have 1 params not equal price && name',function () {
        filter.setSort('blabla');
        expect(filter.getSort()).to.have.any.keys('price','name');
    })
    it('getSort should have name if setSort() have 2 params not equal price && name but before was set Name',function () {
        filter.setSort('blabla', 1);
        expect(filter.getSort()).to.have.any.keys('price', 'name')
        expect(filter.getSort()).to.have.any.property('name', 1);
    })
    it('getSort should have price if setSort() have 1 params not equal price && name',function () {
        filter.setSort('blabla', -1);
        expect(filter.getSort()).to.have.any.keys('price', 'name')
        expect(filter.getSort()).to.have.any.property('name', 1);
    })
    it('getSort should have price equal 1',function () {
        filter.setSort('price', 1);
        expect(filter.getSort()).to.eql({price:1})
    })
    it('getSort should have price equal -1',function () {
        filter.setSort('price', -1);
        expect(filter.getSort()).to.eql({price:-1})
    })
    it('getSort should have price equal 1',function () {
        filter.setSort('price', 'asda');
        expect(filter.getSort()).to.eql({price:1})
    })
    it('getSort should have price equal 1',function () {
        filter.setSort('price', 56);
        expect(filter.getSort()).to.eql({price:1})
    })
    it('getSort should have name equal 1',function () {
        filter.setSort('name', 1);
        expect(filter.getSort()).to.eql({name:1})
    })
    it('getSort should have name equal -1',function () {
        filter.setSort('name', -1);
        expect(filter.getSort()).to.eql({name:-1})
    })
    it('getSort should have name equal 1',function () {
        filter.setSort('name', 'asda');
        expect(filter.getSort()).to.eql({name:1})
    })
    it('getSort should have name equal 1',function () {
        filter.setSort('name', 56);
        expect(filter.getSort()).to.eql({name:1})
    })
    it('getSort should have price equal 1',function () {
        filter.setSort('price', 1);
        expect(filter.getSort()).to.eql({price:1})
    })
    it('getSort should have price equal -1',function () {
        filter.setSort('price', -1);
        expect(filter.getSort()).to.eql({price:-1})
    })
    it('getSort should have price equal 1',function () {
        filter.setSort('price', 'asda');
        expect(filter.getSort()).to.eql({price:1})
    })
    it('create Query',function () {
        expect(filter.creatQuery()).to.have.property('$and')
    })
    it('set per_page null',function () {
        filter.setPerPage();
        let page = filter.definePage(1);
        expect(page.per_page()).to.equal(1000);
    })
    it('set per_page 20',function () {
        filter.setPerPage(20);
        let page = filter.definePage(1);
        expect(page.per_page()).to.equal(20);
    })
    it('set page null',function () {
        let page = filter.definePage();
        expect(page.skip()).to.equal(0);
    })
    it('set page 1',function () {
        let page = filter.definePage(1);
        expect(page.skip()).to.equal(0);
    })
})