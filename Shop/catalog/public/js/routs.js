
angular.module('app').config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
		templateUrl: 'templates/pages/index.html'
	})
	.when('/items/:id', {
      templateUrl: 'templates/pages/product/show.html',
    	controller: 'ProductShowController',
    	controllerAs: 'product'
    })
    .when('/category/:name', {
      templateUrl: 'templates/pages/category/show.html',
    	controller: 'CategoryShowController',
    	controllerAs: 'categories'
    })
    .otherwise({redirectTo: '/'});
}]);

