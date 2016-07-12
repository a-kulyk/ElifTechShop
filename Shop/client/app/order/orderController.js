angular.module('app').controller('orderController',
  ['$scope', '$location', '$routeParams', 'orderService',
  function ($scope, $location,  $routeParams, orderService) {
    var order = this;

    orderService.order($routeParams.id)
    	.success(function(data) {
    	     order.current = data;
	         order.getTotal = function(){
	     		    var total = 0;
	     		    for(var i = 0; i < order.current.itemSet.length; i++){
	     		        var product = order.current.itemSet[i].productId;
	     		        total += (product.price * order.current.itemSet[i].quantity);
	     		    }
	     		    return total;
	     		};
    	  });

    

}]);