'use strict';

const angular = require('../bower_components/angular/angular');

angular.module('service.error', [])
    .service('errorService', function($location){
        var errorObject = {name: '', message: ''};
        this.error = function(error) {
            if(error.type === 'AuthError') {
                $location.path('/login');
                return;
            }
            errorObject = error;
            $location.path('/error');
        };

        this.getError = function() {
            return errorObject;
        };
    });