var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      access: {restricted: true}
    })
    .when('/login', {
      templateUrl: './app/components/auth/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .when('/logout', {
      controller: 'logoutController',
      access: {restricted: true}
    })
    .when('/register', {
      templateUrl: './app/components/auth/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })
    .otherwise({
      redirectTo: '/'
    });
})
.run(function ($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
        AuthService.getUserStatus()
        .then(function(){
          if (next.access !== undefined && next.access.restricted && !AuthService.isLoggedIn()){
            $location.path('/login');
            $route.reload();
          }
        });
  });
});