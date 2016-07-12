angular.module('app').controller('mainController',
  ['$rootScope', '$location', 'AuthService', 'orderService',
  function ( $rootScope, $location, AuthService, orderService) {
    var main = this;

    AuthService.getUser()
      .then(function(data) {
        $rootScope.currentUser = data;
      });

    main.logout = function () {
      // call logout from service
      AuthService.logout()
        .then(function () {
          $rootScope.currentUser = null;
          $location.path('/login');          
        });
    };

    main.addToCart = function(item) {
      if (!main.shoppingCart) {
        orderService.createCart(item)
          .then(function(response) {
            
            main.shoppingCart = response.data;
            console.log('main.shoppingCart = ', main.shoppingCart);
          });
      } else {
        orderService.updateCart(main.shoppingCart._id, item)
          .then(function(response) {
            main.shoppingCart = response.data;
            console.log('main.shoppingCart = ', main.shoppingCart);
          });
      }
    };
}]);