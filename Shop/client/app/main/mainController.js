angular.module('app').controller('mainController',
  ['$rootScope', '$location', 'AuthService', '$uibModal',
  function ( $rootScope, $location, AuthService, $uibModal) {
    var main = this;
    $rootScope.complete = {};
    $rootScope.data = {};
    $rootScope.complete.property = false;
    $rootScope.complete.product = false;
     
    main.logout = function () {
      // call logout from service
      AuthService.logout()
        .then(function () {
          $rootScope.currentUser = null;
          $rootScope.shoppingCart = null;
          $location.path('/login');          
        });
    };

    main.addToCart = function(item) {
            $uibModal.open({
                templateUrl: './app/main/modalView.html',
                controller: 'ModalCtrl',
                controllerAs: 'modal',
                resolve: {
                    item: function() {
                        return item;
                    }
                }
            });
        };
    
}]);