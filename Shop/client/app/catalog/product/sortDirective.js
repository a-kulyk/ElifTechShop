angular.module('app')
.directive('sortItems',[function() {
	return {
		restrict:"E",
		templateUrl: "./app/catalog/product/sortView.html"
	};
}]);