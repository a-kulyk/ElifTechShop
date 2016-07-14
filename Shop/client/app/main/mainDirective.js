angular.module('app')
.directive('navbar',[function() {
	return {
		restrict:"E",
		controller: 'mainController',
		controllerAs: 'main',
		templateUrl: "./app/main/navbar.html",
		replace: true
	};
}]);