angular.module('app')
.directive('googleplace', function() {
    return {
        require: 'ngModel',
        scope: {
            ngModel: '=',
            lat: '=?',
            lng: '=?'
        },
        link: function(scope, element, attrs, model) {
            var options = {
                types: ["address"],
                componentRestrictions: {country: 'ua'}
            };    

            var autocomplete = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                scope.$apply(function() {
                    scope.lat = autocomplete.getPlace().geometry.location.lat();
                    scope.lng = autocomplete.getPlace().geometry.location.lng();

                    model.$setViewValue(element.val());   
                });
            });
        }
    };
});