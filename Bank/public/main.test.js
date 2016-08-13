////var angular = requie('angular');
//var main = require('./mainController');
//var expect = require('chai').expect;
describe('Main controller',function (){
    var $httpBackend, $rootScope, createController, authRequestHandler;
    beforeEach(angular.module('bank'));
    beforeEach(inject( function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        authRequestHandler = $httpBackend.when('GET', '/user')
            .respond({username: 'gameiro9k', id: '1488', amount: 228});
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('main', { $scope: $rootScope});
        }
    }));
    it('HTTP GET user', function() {
        $httpBackend.expectGET('/user');
        var controller = createController();
        $httpBackend.flush();
        expect($rootScope.username).to.equal('gameiro9k');
        expect($rootScope.id).to.equal('1488');
        expect($rootScope.amount).to.equal(228);
    })
});