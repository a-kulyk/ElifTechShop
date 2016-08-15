describe('Signup controller',function (){
    var $httpBackend, $rootScope, createController, authRequestHandler, $location;
    beforeEach(module('bank'));
    beforeEach(inject( function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        authRequestHandler = $httpBackend.whenPOST('/signup')
            .respond({'success': true});
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('signup', { $scope: $rootScope});
        }
    }));
    it('HTTP POST login', function() {
        $rootScope.password = 'dick';
        $rootScope.repeat = 'dick';
        $httpBackend.expect('POST', '/signup');
        var controller = createController();
        $rootScope.signup();
        $httpBackend.flush();
        expect($location.$$path).to.equal('/cabinet');
    });
    it('HTTP POST login password repeat error', function() {
        $rootScope.password = 'dick';
        $rootScope.repeat = 'pussy';
        var controller = createController();
        $rootScope.signup();
        expect($rootScope.signupError).to.equal('Passwords must be the same');
    });
});