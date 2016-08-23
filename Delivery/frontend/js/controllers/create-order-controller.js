/**
 * Created by dmytro on 08.07.16.
 */
module.exports = function (app) {
    app.controller('createOrderCtrl', function ($rootScope, $scope, $http, $window) {
        $scope.fromPlace = null;
        $scope.toPlace = null;
        $scope.autocompleteOptions = {
            componentRestrictions: {country: 'ua'},
            types: ['address']
        };
        $scope.validFromAddress = true;
        $scope.validToAddress = true;
        $scope.placesAreUnique = true;
        $scope.loader = '';
        
        $scope.createOrder = function () {
            $scope.showContent = false;
            $scope.loader = 'loader';
            var requestJSON = {};
            requestJSON.title = $scope.title;
            requestJSON.price = $scope.price;
            requestJSON.from = {};
            requestJSON.to = {};
            requestJSON.from.username = $scope.fromUsername;
            requestJSON.to.username = $scope.toUsername;
            requestJSON.from.lat = $scope.fromPlace.geometry.location.lat();
            requestJSON.from.lng = $scope.fromPlace.geometry.location.lng();
            requestJSON.to.lat = $scope.toPlace.geometry.location.lat();
            requestJSON.to.lng = $scope.toPlace.geometry.location.lng();

            $scope.validFromAddress = $scope.validateAddress($scope.fromPlace)
            $scope.validToAddress = $scope.validateAddress($scope.toPlace)

            $http.post("/order", requestJSON).success(function (data, status, headers) {
                if (data.success) {
                    $window.location.href = '#/order_info/' + data.trackingCode;
                } else {
                    $scope.showContent=true;
                    $scope.loader = '';
                    switch (data.error.name) {
                        case'GoogleResError':
                            alert('The service is currently unavailable, please try again later');
                            break;
                        case 'ValidationError':
                            alert('Some fields doesn`t match the requirements');
                            break;
                    }
                }
            }).error(function (data, status) {
                console.log(status);
            });
        }
        $scope.validateAddress = function (place) {
            var streetNumberPresent = false;
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (addressType == 'street_number') {
                    streetNumberPresent = true;
                }
            }
            return streetNumberPresent;
        }
        $scope.placesUnique = function () {
            if ($scope.fromPlace.geometry.location.lat() === $scope.toPlace.geometry.location.lat() &&
                $scope.fromPlace.geometry.location.lng() === $scope.fromPlace.geometry.location.lng()) {
                $scope.placesAreUnique = false;
                return false;
            }
            $scope.placesAreUnique = true;
            return true;
        }
    });
}