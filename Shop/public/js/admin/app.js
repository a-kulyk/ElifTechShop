var adminCatalog = angular.module('adminCatalog', ['itemController']);

angular.module('itemController', [])
    .controller('mainController', function($scope, $http) {
            $http.get('/admin/items')
                .success(function (data) {
                    $scope.items = data.items;//ToDo: if fail
                }).error(function (data) {
                    console.log(data);
                });
        }
    );