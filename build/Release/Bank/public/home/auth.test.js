describe('Auth controller',function (){
    var $httpBackend, $rootScope, createController, authRequestHandler, $location;
    beforeEach(module('bank'));
    beforeEach(inject( function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        authRequestHandler = $httpBackend.when('GET', '/islogin')
            .respond({'success': true});
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('auth', { $scope: $rootScope});
        }
    }));
    it('HTTP GET auth', function() {
        $httpBackend.expectGET('/islogin');
        var controller = createController();
        $httpBackend.flush();
        expect($rootScope.logined).to.equal(true);
        expect($location.$$path).to.equal('/cabinet')
    })
});