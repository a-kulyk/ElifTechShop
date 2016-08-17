/**
 * Created by dmytro on 09.07.16.
 */
var moment = require('moment');

var spinner = new Spinner({color: '#333333', lines: 12, top: '190px', left: '250px', position: 'absolute'});

module.exports = function (app) {
    app.controller('timeOutputCtrl', function ($rootScope, $scope, $routeParams, $http, orderStates) {
        if ($routeParams.trackingCode) {
            $scope.trackingCode = $routeParams.trackingCode;
            $http.get('/order/' + $routeParams.trackingCode).success(function (data, status, headers) {
                if (data.success) {
                    spinner.spin(document.getElementById('map'));
                    $scope.isInfoVisible = true;
                    $scope.arrivalTime = moment(data.arrivalTime).format('DD.MM.YY, HH:mm');
                    var tempTime = moment.duration(data.travelTime, 'seconds');
                    console.log(data.travelTime);
                    $scope.travelTime = tempTime.hours() + ' hours ' + tempTime.minutes() + ' minutes';
                    $scope.state = orderStates.statesArray[data.state];
                    $scope.fromUsername = data.from.username;
                    $scope.toUsername = data.to.username;
                    var coordinates = {};
                    coordinates.from = data.from;
                    coordinates.to = data.to;
                    setTimeout(function () {
                        initMap(coordinates);
                    },1000);
                    
                } else {
                 //   $scope.isInfoVisible = false;
                    $scope.isNotFoundVisible = true;
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
        calculateAndDisplayRoute(directionsService, directionsDisplay, coordinates, spinner);
    }

    function calculateAndDisplayRoute(directionsService, directionsDisplay, coordinates, spinner) {
        var selectedMode = 'DRIVING';
        directionsService.route({
            origin: {lat: coordinates.from.lat, lng: coordinates.from.lng},
            destination: {lat: coordinates.to.lat, lng: coordinates.to.lng},
            travelMode: google.maps.TravelMode[selectedMode]
        }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                spinner.stop();
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}