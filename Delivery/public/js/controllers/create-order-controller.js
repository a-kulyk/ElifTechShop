/**
 * Created by dmytro on 08.07.16.
 */
app.controller('createOrderCtrl', function ($rootScope, $scope, $http) {
    $rootScope.makeOrderActiveClass = 'active';
    $rootScope.trackOrderActiveClass = '';
    $rootScope.panelTitle = 'New order';
    $scope.showForm = true;
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
        $http.post("/order", requestJSON).success(function (data, status, headers, config) {
            console.log(data);
            var options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            };

            $scope.estimatedTime = Math.floor(data.estimatedTime / 60) + 'minutes';
            $scope.deliveryDate = new Date(Date.now() + data.estimatedTime * 1000).toLocaleString("en-US", options);
            $scope.trackingCode = data.trackingCode;
            $scope.showForm = false;
            $scope.timeOutput = true;
        }).error(function (data, status, header, config) {
            console.log(status);
        });
    }
    $scope.resetForm = function () {
        $scope.title = '';
        $scope.price = '';
        $scope.fromUsername = '';
        $scope.toUsername = '';
        document.getElementById('fromAddress').value = '';
        document.getElementById('toAddress').value = '';
        $scope.showForm = true;
        $scope.timeOutput = false;
    }
    var options = {types: ["address"]};
    var fromAddress = document.getElementById('fromAddress');
    var autocompleteFrom = new google.maps.places.Autocomplete(fromAddress, options);
    var toAddress = document.getElementById('toAddress');
    var autocompleteTo = new google.maps.places.Autocomplete(toAddress, options);
    autocompleteFrom.setComponentRestrictions({country: 'ua'});
    autocompleteTo.setComponentRestrictions({country: 'ua'});
});