(function () {
	var app = angular.module('product',[]);

	app.directive('productInfo', function() {
		return {
			restrict: "E",
			templateUrl: "product-info.html",
			controller: function([$http, function($http){
				var store = this;
    			store.products = [];
    			$http.get('/shops').success(function(data) {
      			store.products = data;
      			});
			}]) {
				controllerAs: "todos"
				
			}
		}
	})
})();