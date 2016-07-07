'use strict';

angular.module('service.error', [])
    .service('errorService', function($location){
    var errorObject = {name: '', message: ''};
    this.error = function(error) {
        errorObject = error;
        $location.path('/error');
    };

    this.getError = function() {
        return errorObject;
    };
});