angular.module('app')
.directive('pages',[function() {
	return {
		restrict:"E",
		controller: 'PaginationController',
		controllerAs: 'pagination',
		templateUrl: "templates/directives/pages.html"
	}
}])
.directive('pagesFilter',[function() {
	return {
		restrict:"E",
		controller: 'PaginationFilterController',
		controllerAs: 'pagination',
		templateUrl: "templates/directives/pages-filter.html"
	}
}])