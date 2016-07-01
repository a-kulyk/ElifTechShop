angular.module('app')
.directive('categoryItems',[function() {
	return {
		restrict:"E",
		controller: 'CategoriesController',
		controllerAs: 'categories',
		templateUrl: "templates/directives/category-items.html"
	}
}])