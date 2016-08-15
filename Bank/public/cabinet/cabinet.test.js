describe('Cabinet controller',function (){
    var $httpBackend, $rootScope, shared, createController, isLogin, user, account, logout, $location;
    beforeEach(module('bank'));
    beforeEach(inject( function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        shared = $injector.get('shared');
        isLogin = $httpBackend.when('GET', '/islogin')
            .respond({'success': false});
        user = $httpBackend.when('GET', '/user')
            .respond({username: 'gameiro11k', id: '1488'});
        account = $httpBackend.when('GET', '/account')
            .respond({accounts: {
               account: {
                   _id: '228',
                   name: 'test',
                   owner: 'man'
               }
            }});
        logout = $httpBackend.whenPOST('/logout')
            .respond({'success': true});
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('cabinet', { $scope: $rootScope});
        }
    }));
    it('HTTP GET isLogin', function() {
        $httpBackend.expectGET('/islogin');
        var controller = createController();
        $httpBackend.flush();
        expect($location.$$path).to.equal('/')
    });
    it('HTTP GET user', function(){
       $httpBackend.expectGET('/user');
        var controller = createController();
        $httpBackend.flush();
        expect($rootScope.username).to.equal('gameiro11k');
        expect($rootScope.id).to.equal('1488');
    });
    it('HTTP GET account', function(){
        $httpBackend.expectGET('/account');
        var controller = createController();
        $httpBackend.flush();
        expect($rootScope.accounts[0]._id).to.equal('228');
        expect($rootScope.accounts[0].name).to.equal('test');
        expect($rootScope.accounts[0].owner).to.equal('man');
    });
    it('Moment time function', function(){
        var controller = createController();
        var time = $rootScope.time('01/03/2017');
        expect(time.length).to.be.above(0);
    });
    it('Logout function', function(){
        var controller = createController();
        var time = $rootScope.time('01/03/2017');
        expect(time.length).to.be.above(0);
    });
    it('HTTP POST logout', function() {
        $httpBackend.expect('POST', '/logout');
        var controller = createController();
        $rootScope.logout();
        $httpBackend.flush();
        expect($location.$$path).to.equal('/');
    });
    it('Pay modal function', function(){
        var controller = createController();
        var pay = $rootScope.payModal('228');
        expect(shared.getAccount()).to.equal('228');
    });
    it('Delete account function', function(){
        var controller = createController();
        var time = $rootScope.deleteAccount('228');
        expect(shared.getMessage()).to.equal('Are you sure, that you want to delete this account?');
        expect(shared.getAccount()).to.equal('228');
    });
});