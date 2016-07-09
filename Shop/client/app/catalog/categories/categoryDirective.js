angular.module('app')
.directive('categoryItems',[function() {
	return {
		restrict:"E",
		controller: 'CategoriesController',
		controllerAs: 'categories',
		templateUrl: "./app/catalog/categories/categoryView.html"
	}
}])