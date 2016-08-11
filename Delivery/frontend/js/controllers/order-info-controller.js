/**
 * Created by dmytro on 09.07.16.
 */
var moment = require('moment');

module.exports = function (app) {
    app.controller('timeOutputCtrl', function ($rootScope, $scope, $routeParams, $http, orderStates) {
        var target = document.getElementById('map');
        var spinner = new Spinner({color: '#333333', lines: 12, position: 'absolute'});
        spinner.spin(target);
        $rootScope.makeOrderActiveClass = '';
        $rootScope.trackOrderActiveClass = '';
        $rootScope.historyActiveClass = '';
        if ($routeParams.trackingCode) {
            $scope.trackingCode = $routeParams.trackingCode;
            $http.get('/order/' + $routeParams.trackingCode).success(function (data, status, headers) {
                if (data.success) {
                    spinner.stop();
                    $scope.arrivalTime = moment(data.arrivalTime).format('DD.MM.YY, HH:mm');
                    var tempTime = moment.duration(data.travelTime, 'seconds');
                    console.log(data.travelTime);
                    $scope.travelTime = tempTime.hours() + ' hours ' + tempTime.minutes()+' minutes';
                    $scope.state = orderStates.statesArray[data.state];
                    $scope.fromUsername = data.from.username;
                    $scope.toUsername = data.from.username;
                    var coordinates = {};
                    coordinates.from = data.from;
                    coordinates.to = data.to;
                    initMap(coordinates);
                }
                console.log(data);
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
}