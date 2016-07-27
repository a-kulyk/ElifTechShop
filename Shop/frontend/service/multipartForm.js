const angular = require('../bower_components/angular/angular');

angular.module('service.multipartForm', []).service('multipartForm', ['$http', function($http){
    var multipartForm = this;
    this.objectToFormData = function(obj, form, namespace) {
        var fd = form || new FormData();
        var formKey;

        for(var property in obj) {
            if(obj.hasOwnProperty(property)) {
                if(namespace) {
                    formKey = namespace + '[' + property + ']';
                } else {
                    formKey = property;
                }

                if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
                    multipartForm.objectToFormData(obj[property], fd, formKey);
                } else {
                    fd.append(formKey, obj[property]);
                }

            }
        }

        return fd;

    };

    this.put = function(uploadUrl, data){
        var fd = multipartForm.objectToFormData(data);
        return $http.put(uploadUrl, fd, {
            transformRequest: angular.indentity,
            headers: { 'Content-Type': undefined }
        });
    };

    this.post = function(uploadUrl, data){
        var fd = multipartForm.objectToFormData(data);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.indentity,
            headers: { 'Content-Type': undefined }
        });
    };

}]);