angular.module('app')
.directive('pages',[function() {
	return {
		restrict:"E",
		controller: 'PaginationController',
		controllerAs: 'pagination',
		templateUrl: "templates/directives/pages.html"
	}
}])