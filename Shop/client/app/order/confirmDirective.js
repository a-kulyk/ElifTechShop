angular.module('app')
.directive('confirmAddress',[function() {
	return {
		restrict:"E",
		controller: 'orderController',
		controllerAs: 'order',
		templateUrl: "./app/order/confirmAddress.html",
		replace: true
		// link: function(scope, element, attrs) {
		// 	$document.find("#")
		// }
	};
}]);