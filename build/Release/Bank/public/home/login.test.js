describe('Login controller',function (){
    var $httpBackend, $rootScope, createController, authRequestHandler, $location;
    beforeEach(module('bank'));
    beforeEach(inject( function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        authRequestHandler = $httpBackend.whenPOST('/login')
            .respond({'success': true});
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('login', { $scope: $rootScope});
        }
    }));
    it('HTTP POST login', function() {
        $httpBackend.expect('POST', '/login');
        var controller = createController();
        $rootScope.login();
        $httpBackend.flush();
        expect($location.$$path).to.equal('/cabinet');
    })
});