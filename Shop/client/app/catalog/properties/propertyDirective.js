angular.module('app')
.directive('propertyItems',[function() {
	return {
		restrict:"E",
		controller: 'PropertyController',
		controllerAs: 'properties',
		templateUrl: "./app/catalog/properties/propertyView.html"
	};
}]);