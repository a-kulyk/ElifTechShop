angular.module('app').controller('loginController', ['$scope', '$location', 'AuthService',
    function($scope, $location, AuthService) {

        $scope.login = function() {

            $scope.error = false;
            $scope.disabled = true;

            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                .then(function(data) {
                    $scope.disabled = false;
                    $scope.loginForm = {};
                    $location.path('/');
                })
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });
        };
    }
]);

angular.module('app').controller('logoutController', ['$rootScope', '$scope', '$location', 'AuthService',
    function($rootScope, $scope, $location, AuthService) {

        $scope.logout = function() {

            AuthService.logout()
                .then(function() {
                    $rootScope.currentUser = null;
                    $location.path('/login');
                });
        };
    }
]);

angular.module('app').controller('registerController', ['$scope', '$location', 'AuthService',
    function($scope, $location, AuthService) {

        $scope.register = function() {

            $scope.error = false;
            $scope.disabled = true;

            AuthService.register($scope.registerForm)
                .then(function(resp) {
                    if (resp.status === 200 && resp.data.status) {
                        $location.path('/');
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    } else {
                        $scope.error = true;
                        $scope.errorMessage = "Something went wrong!";
                        $scope.disabled = false;
                        $scope.registerForm = {};
                    }
                });
        };

        $scope.login = function() {
            $location.path('/login');
        };
    }
]);
