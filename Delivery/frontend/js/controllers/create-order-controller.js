/**
 * Created by dmytro on 08.07.16.
 */
module.exports = function (app) {
    app.controller('createOrderCtrl', function ($rootScope, $scope, $http, $window) {
        $rootScope.makeOrderActiveClass = 'active';
        $rootScope.trackOrderActiveClass = '';
        $rootScope.historyActiveClass = '';
        $scope.createOrder = function () {
            var requestJSON = {};
            requestJSON.title = $scope.title;
            requestJSON.price = $scope.price;
            requestJSON.from = {};
            requestJSON.to = {};
            requestJSON.from.username = $scope.fromUsername;
            requestJSON.to.username = $scope.toUsername;
            if (autocompleteFrom.getPlace()) {
                console.log(autocompleteFrom.getPlace());
                var fromPlace = autocompleteFrom.getPlace();
                requestJSON.from.lat = fromPlace.geometry.location.lat();
                requestJSON.from.lng = fromPlace.geometry.location.lng();
            }
            if (autocompleteTo.getPlace()) {
                console.log(autocompleteTo.getPlace());
                var toPlace = autocompleteTo.getPlace();
                requestJSON.to.lat = toPlace.geometry.location.lat();
                requestJSON.to.lng = toPlace.geometry.location.lng();
            }
            $http.post("/order", requestJSON).success(function (data, status, headers) {
                console.log(data);
                if (data.success) {
                    $window.location.href = '#/order_info/' + data.trackingCode;
                } else {
                    switch (data.error.name) {
                        case'GoogleResError':
                            alert('The service is currently unavailable, please try again later');
                            break;
                        case 'ValidationError':
                            alert('Some fields doesn`t match the requirements');
                            break;
                    }
                }
            }).error(function (data, status, headers) {
                console.log(status);
            });
        }
        var options = {types: ["address"]};
        var fromAddress = document.getElementById('fromAddress');
        var autocompleteFrom = new google.maps.places.Autocomplete(fromAddress, options);
        var toAddress = document.getElementById('toAddress');
        var autocompleteTo = new google.maps.places.Autocomplete(toAddress, options);
        autocompleteFrom.setComponentRestrictions({country: 'ua'});
        autocompleteTo.setComponentRestrictions({country: 'ua'});
    });
}