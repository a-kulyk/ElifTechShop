angular.module('app').controller('mainController',
  ['$rootScope', '$location', 'AuthService', 'orderService',
  function ( $rootScope, $location, AuthService, orderService) {
    var main = this;

    main.logout = function () {
      // call logout from service
      AuthService.logout()
        .then(function () {
          $rootScope.currentUser = null;
          $rootScope.shoppingCart = null;
          $location.path('/login');          
        });
    };

    main.addToCart = function(itemId) {
      if (!$rootScope.shoppingCart) {
        orderService.createCart(itemId)
          .then(function(response) {
            console.log("create response :  ", response.data);
            $rootScope.shoppingCart = response.data;
          });
      } else {
        orderService.addToCart(itemId)
          .then(function(response) {
            console.log("addItem response :  ", response.data);
            $rootScope.shoppingCart = response.data;
          });
      }
    };

    main.openCabinet = function() {
      orderService.all()
        .then(function(resp) {
          main.allOrders = resp.data;
          $location.path('/order/all');
        });
    };
    
}]);