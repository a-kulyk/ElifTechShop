describe('Modal controller',function (){
    var $httpBackend, $rootScope, createController, pay, transfer, newAcccount, $location, close, data, ModalService;
    beforeEach(module('bank'));
    beforeEach(inject( function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        close = function(object){
            data = object;
        };
        ModalService = {
            close: function(){

            }
        };
        pay = $httpBackend.whenPOST('/pay')
            .respond({
                'success': true,
                'id': 1,
                'accountAmount': 1,
                'accountId': 1,
                'accountName': 'pes',
                'amount': 1
            });
        transfer = $httpBackend.whenPOST('/transfer')
            .respond({
                'success': true,
                "id": 1,
                "senderAmount": 1,
                "amount": 1,
                "senderName": 'Can',
                "receiverName": 'Bill',
                receiverAccountName: 'Nickole',
                "receiverAmount": 1
            });
        newAcccount = $httpBackend.whenPOST('/account')
            .respond({
                'success': true,
                'account': 'Ready'
            });
        $rootScope = $injector.get('$rootScope');
        $rootScope.focusAccount = '1';
        $rootScope.amount = 23;
        $rootScope.from = 'Can';
        $rootScope.to = 'Bill';
        $rootScope.name = 'Elamen';
        var $controller = $injector.get('$controller');
        createController = function() {
            return $controller('modal', { $scope: $rootScope, close: close, ModalService: ModalService});
        }
    }));
    it('HTTP POST pay', function() {
        $httpBackend.expect('POST', '/pay');
        var controller = createController();
        $rootScope.pay();
        $httpBackend.flush();
        expect(data.id).to.equal(1);
        expect(data.accountAmount).to.equal(1);
        expect(data.accountId).to.equal(1);
        expect(data.accountName).to.equal('pes');
        expect(data.amount).to.equal(1);
    });
    it('Confirm function', function() {
        var controller = createController();
        $rootScope.confirm('smegma');
        expect(data.result).to.equal('smegma');
    });
    it('HTTP POST transfer', function() {
        $httpBackend.expect('POST', '/transfer');
        var controller = createController();
        $rootScope.transfer();
        $httpBackend.flush();
        expect(data.id).to.equal(1);
        expect(data.senderAmount).to.equal(1);
        expect(data.receiverAmount).to.equal(1);
        expect(data.amount).to.equal(1);
        expect(data.sender).to.equal('Can');
        expect(data.receiver).to.equal('Bill Nickole');
    });
    it('HTTP POST newAccount', function() {
        $httpBackend.expect('POST', '/account');
        var controller = createController();
        $rootScope.newAccount();
        $httpBackend.flush();
        expect(data.account).to.equal('Ready');
    });
});