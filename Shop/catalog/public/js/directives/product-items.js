angular.module('app')
.directive('productItems',[function() {
	return {
		restrict:"E",
		controller: 'ProductItemsController',
		controllerAs: 'items',
		templateUrl: "templates/directives/product-items.html"
	}
}])
.directive('filterItems',[function() {
	return {
		restrict:"E",
		controller: 'FilterItemsController',
		controllerAs: 'items',
		templateUrl: "templates/directives/product-items.html"
	}
}])