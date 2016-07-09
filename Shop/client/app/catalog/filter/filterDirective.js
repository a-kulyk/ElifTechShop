angular.module('app')
.directive('filterItems',[function() {
	return {
		restrict:"E",
		controller: 'FilterItemsController',
		controllerAs: 'items',
		templateUrl: "./app/catalog/product/productView.html"
	}
}])
.directive('pagesFilter',[function() {
	return {
		restrict:"E",
		controller: 'PaginationFilterController',
		controllerAs: 'pagination',
		templateUrl: "./app/catalog/filter/filterPagesView.html"
	}
}])