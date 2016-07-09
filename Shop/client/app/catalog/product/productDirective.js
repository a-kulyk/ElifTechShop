angular.module('app')
.directive('productItems',[function() {
	return {
		restrict:"E",
		controller: 'CatalogController',
		controllerAs: 'catalog',
		templateUrl: "./app/catalog/product/productView.html"
	}
}])

