
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
  .when('/page/:number', {
      templateUrl: 'templates/pages/index.html',
      controller: 'ProductItemsController',
      controllerAs: 'product'
    })
    .when('/category/:name', {
      templateUrl: 'templates/pages/category/show.html',
    	controller: 'CategoryShowController',
    	controllerAs: 'categories'
    })
    .when('/filter/:name/:value/page/:number', {
      templateUrl: 'templates/pages/product/filter.html',
      controller: 'FilterItemsController',
      controllerAs: 'product'
    })
    .when('/filter/:name/:value', {
      redirectTo: "/filter/:name/:value/page/1"
    })
    .otherwise({redirectTo: '/'});
}]);

