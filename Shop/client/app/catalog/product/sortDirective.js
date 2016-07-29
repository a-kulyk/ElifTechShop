angular.module('app')
.directive('sortItems',[function() {
	return {
		restrict:"E",
		controller: 'CatalogController',
		controllerAs: 'product',
		templateUrl: "./app/catalog/product/sortView.html"
	};
}]);