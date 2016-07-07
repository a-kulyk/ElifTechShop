/**
 * Created by dmytro on 02.07.16.
 */
var app = angular.module('delivery', []);
app.controller('deliveryCtrl', function ($scope, $http) {
    $scope.showForm = true;
    $scope.submit = function () {
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
        $http.post("/order", requestJSON).success(function (data, status, headers, config) {
            console.log(data);
            // $scope.showForm = false;
            var options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            };
            //  $scope.estimatedTime = new Date(data.estimatedTime).toLocaleString("en-US", options);
            $scope.estimatedTime = data.estimatedTime;
        }).error(function (data, status, header, config) {

        });
    }
});

var options = {types: ["address"]};

var fromAddress = document.getElementById('fromAddress');
var autocompleteFrom = new google.maps.places.Autocomplete(fromAddress, options);

var toAddress = document.getElementById('toAddress');
var autocompleteTo = new google.maps.places.Autocomplete(toAddress, options);

autocompleteFrom.setComponentRestrictions({country: 'ua'});
autocompleteTo.setComponentRestrictions({country: 'ua'});
