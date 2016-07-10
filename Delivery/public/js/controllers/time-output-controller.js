/**
 * Created by dmytro on 09.07.16.
 */
app.controller('timeOutputCtrl', function ($rootScope, $scope, $routeParams, $http) {
    $rootScope.panelTitle = 'Order info';
    if ($routeParams.trackingCode) {
        $scope.trackingCode = $routeParams.trackingCode;
        $http.get('/order/' + $routeParams.trackingCode).success(function (data, status, headers) {
            $scope.deliveryDate = data.deliveryDate;
            var coordinates = {};
            coordinates.from = data.from;
            coordinates.to = data.to;
            initMap(coordinates);
            console.log(data)
        }).error(function (data, status, headers) {
            console.log('error');
        })
    }
});
function initMap(coordinates) {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {});
    directionsDisplay.setMap(map);

    calculateAndDisplayRoute(directionsService, directionsDisplay, coordinates);
}
function calculateAndDisplayRoute(directionsService, directionsDisplay, coordinates) {
    var selectedMode = 'DRIVING';
    directionsService.route({
        origin: {lat: coordinates.from.lat, lng: coordinates.from.lng},
        destination: {lat: coordinates.to.lat, lng: coordinates.to.lng},
        travelMode: google.maps.TravelMode[selectedMode]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}