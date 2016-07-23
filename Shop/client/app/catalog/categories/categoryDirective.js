angular.module('app')
.directive('categoryItems',[function() {
	return {
		restrict:"A",
		controller: 'CategoriesController',
		controllerAs: 'categories',
		templateUrl: "./app/catalog/categories/categoryView.html"
	};
}]);