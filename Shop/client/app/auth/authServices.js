angular.module('app').factory('AuthService', ['$rootScope', '$q', '$http', 'orderService',
    function($rootScope, $q, $http, orderService) {

        var user = null;

        return ({
            isLoggedIn: isLoggedIn,
            getUserStatus: getUserStatus,
            login: login,
            logout: logout,
            register: register,
            addBankAccount: addBankAccount,
            updateProfile: updateProfile
        });

        function isLoggedIn() {
            if (user) {
                return true;
            } else {
                return false;
            }
        }

        function getUserStatus() {
            return $http.get('/user/status')
                .success(function(data) {
                    if (data.status) {
                        user = true;
                        $rootScope.currentUser = data.user;
                        orderService.getCart()
                            .then(function(resp) {
                                $rootScope.shoppingCart = resp.data;
                            });
                    } else {
                        user = false;
                    }
                })
                .error(function(data) {
                    user = false;
                });
        }

        function login(username, password) {

            return $http.post('/user/login', { username: username, password: password })
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        user = true;
                    } else {
                        user = false;
                    }
                })
                .error(function(data) {
                    user = false;
                });
        }

        function logout() {

            return $http.get('/user/logout')
                .success(function(data) {
                    user = false;
                })
                .error(function(data) {
                    user = false;
                });
        }

        function register(formData) {

            return $http.post('/user/register', {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                bankAccount: formData.bankAccount,
                address: formData.address
            });
        }

        function addBankAccount(account) {
            return $http({
                method: 'PUT',
                url: '/user/addBankAccount',
                data: { bankAccount: account }
            });
        }

        function updateProfile(user) {
            return $http({
                method: 'PUT',
                url: '/user/updateProfile',
                data: user
            });
        }

    }
]);
