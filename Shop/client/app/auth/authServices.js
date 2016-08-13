angular.module('app').factory('AuthService',
  ['$rootScope', '$q', '$http', 'orderService',
  function ($rootScope, $q, $http, orderService) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
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
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      return $http.get('/user/status')
      // handle success
      .success(function (data) {
        if(data.status){
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
      // handle error
      .error(function (data) {
        user = false;
      });
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    }

    function register(formData) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register', {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          bankAccount: formData.bankAccount,
          address: formData.address
        })
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            console.log(data);
            deferred.reject(data.message);
          }
        });
        
      // return promise object
      return deferred.promise;
    }

    function addBankAccount(account) {
      return $http({
        method: 'PUT',
        url: '/user/addBankAccount',
        data: {bankAccount: account}
      })
    }

    function updateProfile(user) {
      return $http({
        method: 'PUT',
        url: '/user/updateProfile',
        data: user
      })
    }

}]);