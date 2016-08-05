/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	
	    __webpack_require__(1);
	    __webpack_require__(2);
	    __webpack_require__(3);
	    __webpack_require__(4);
	    __webpack_require__(5);
	    __webpack_require__(6);
	    __webpack_require__(7);
	    __webpack_require__(8);
	    __webpack_require__(9);
	    __webpack_require__(10);
	    __webpack_require__(11);
	    __webpack_require__(12);
	    __webpack_require__(13);
	    __webpack_require__(14);
	    __webpack_require__(15);
	    __webpack_require__(16);
	    __webpack_require__(17);
	    __webpack_require__(18);
	    __webpack_require__(19);
	    __webpack_require__(20);
	    


/***/ },
/* 1 */
/***/ function(module, exports) {

	var myApp = angular.module('app', ['ngRoute','ui-rangeSlider', 'ngAnimate', 'ui.bootstrap']);


	myApp.config(function($routeProvider) {
	    $routeProvider
	        .when('/', {
	            templateUrl: '/main.html',
	            access: { restricted: true }
	        })
	        .when('/login', {
	            templateUrl: './app/auth/login.html',
	            controller: 'loginController',
	            access: { restricted: false }
	        })
	        .when('/logout', {
	            controller: 'logoutController',
	            access: { restricted: true }
	        })
	        .when('/register', {
	            templateUrl: './app/auth/register.html',
	            controller: 'registerController',
	            access: { restricted: false }
	        })
	        .when('/product/:id', {
	            templateUrl: './app/catalog/product/productShowView.html',
	            controller: 'ProductShowController',
	            controllerAs: 'product',
	            access: { restricted: true }
	        })
	        .when('/category/:name', {
	            templateUrl: './app/catalog/categories/categoryShowView.html',
	            controller: 'CategoryShowController',
	            controllerAs: 'categories',
	            access: {restricted: true}
	        })
	        .when('/filter/', {
	            templateUrl: './app/catalog/filter/filterView.html',
	            controller: 'FilterItemsController',
	            controllerAs: 'product',
	            access: {restricted: true}
	        })
	        .when('/order/cart', {
	            templateUrl: './app/order/shoppingCart.html',
	            controller: 'OrderController',
	            controllerAs: 'order',
	            access: { restricted: true }
	        })
	        .when('/confirmAddress', {
	            templateUrl: './app/order/confirmAddress.html',
	            controller: 'ConfirmCtrl',
	            controllerAs: 'confirm',
	            access: {restricted: true}
	        })
	        .when('/order/all', {
	            templateUrl: './app/order/history.html',
	            controller: 'HistoryCtrl',
	            controllerAs: 'history',
	            access: { restricted: true }
	        })
	        .when('/order/:id', {
	            templateUrl: './app/order/orderDetail.html',
	            controller: 'OrderDetailController',
	            controllerAs: 'detail',
	            access: { restricted: true }
	        })
	        .otherwise({
	            redirectTo: '/'
	        });
	    })
	    .run(function($rootScope, $location, $route, AuthService) {
	        $rootScope.$on('$routeChangeStart',
	            function(event, next, current) {
	                AuthService.getUserStatus()
	                    .then(function() {
	                        if (next.access !== undefined && next.access.restricted && !AuthService.isLoggedIn()) {
	                            $location.path('/login');
	                            $route.reload();
	                        }
	                    });
	            });
	    });


/***/ },
/* 2 */
/***/ function(module, exports) {

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
	      register: register
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

	}]);

/***/ },
/* 3 */
/***/ function(module, exports) {

	angular.module('app').controller('loginController',
	  ['$scope', '$location', 'AuthService',
	  function ($scope, $location, AuthService) {

	    $scope.login = function () {

	      // initial values
	      $scope.error = false;
	      $scope.disabled = true;

	      
	      // call login from service
	      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
	        // handle success
	        .then(function (data) {
	          $scope.disabled = false;
	          $scope.loginForm = {};
	          $location.path('/');
	        })
	        // handle error
	        .catch(function () {
	          $scope.error = true;
	          $scope.errorMessage = "Invalid username and/or password";
	          $scope.disabled = false;
	          $scope.loginForm = {};
	        });
	    };    

	}]);

	angular.module('app').controller('logoutController',
	  ['$rootScope', '$scope', '$location', 'AuthService',
	  function ($rootScope, $scope, $location, AuthService) {

	    $scope.logout = function () {

	      // call logout from service
	      AuthService.logout()
	        .then(function () {
	          $rootScope.currentUser = null;
	          $location.path('/login');
	        });
	    };

	}]);

	angular.module('app').controller('registerController',
	  ['$scope', '$location', 'AuthService',
	  function ($scope, $location, AuthService) {


	    $scope.register = function () {

	      console.log("lat : ", $scope.mylat);
	      console.log("lng : ", $scope.mylng);

	      // initial values
	      $scope.error = false;
	      $scope.disabled = true;

	      $scope.registerForm.address.lat = $scope.mylat;
	      $scope.registerForm.address.lng = $scope.mylng;

	      console.log("$scope.registerForm: ", $scope.registerForm);

	      // call register from service
	      AuthService.register($scope.registerForm)
	        // handle success
	        .then(function () {
	          $location.path('/login');
	          $scope.disabled = false;
	          $scope.registerForm = {};
	        })
	        // handle error
	        .catch(function () {
	          $scope.error = true;
	          $scope.errorMessage = "Something went wrong!";
	          $scope.disabled = false;
	          $scope.registerForm = {};
	        });
	    };

	    $scope.login = function() {
	      $location.path('/login');
	    };
	}]);

/***/ },
/* 4 */
/***/ function(module, exports) {

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

/***/ },
/* 5 */
/***/ function(module, exports) {

	angular.module('app').controller('mainController',
	  ['$rootScope', '$location', 'AuthService', '$uibModal',
	  function ( $rootScope, $location, AuthService, $uibModal) {
	    var main = this;
	    $rootScope.complete = {};
	    $rootScope.data = {};
	    $rootScope.complete.property = false;
	    $rootScope.complete.product = false;
	     
	    main.logout = function () {
	      // call logout from service
	      AuthService.logout()
	        .then(function () {
	          $rootScope.currentUser = null;
	          $rootScope.shoppingCart = null;
	          $location.path('/login');          
	        });
	    };

	    main.addToCart = function(item) {
	            $uibModal.open({
	                templateUrl: './app/main/modalView.html',
	                controller: 'ModalCtrl',
	                controllerAs: 'modal',
	                // size: 'sm',
	                resolve: {
	                    item: function() {
	                        return item;
	                    }
	                }
	            });
	        };
	    
	}]);

/***/ },
/* 6 */
/***/ function(module, exports) {

	angular.module('app')
	.directive('navbar',[function() {
		return {
			restrict:"E",
			controller: 'mainController',
			controllerAs: 'main',
			templateUrl: "./app/main/navbar.html",
			replace: true
		};
	}]);

/***/ },
/* 7 */
/***/ function(module, exports) {

	angular.module('app').controller('ModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', 'item', 'orderService',
	    function($scope, $rootScope, $uibModalInstance, item, orderService) {
	        var modal = this;

	        modal.item = item;
	        modal.quantity = 1;

	        modal.total = function() {
	            return modal.item.price * modal.quantity;
	        };

	        modal.ok = function(cart) {
	            if (!$rootScope.shoppingCart) {
	                orderService.createCart(cart)
	                    .then(function(response) {
	                        console.log("create response :  ", response.data);
	                        $rootScope.shoppingCart = response.data;
	                    });
	            } else {
	                orderService.addToCart(cart)
	                    .then(function(response) {
	                        console.log("addItem response :  ", response.data);
	                        $rootScope.shoppingCart = response.data;
	                    });
	            }
	            $uibModalInstance.close();
	        };

	        modal.cancel = function() {
	            $uibModalInstance.dismiss('cancel');
	        };
	    }
	]);


/***/ },
/* 8 */
/***/ function(module, exports) {

	angular.module('app').factory('orderService', ['$q', '$http', '$rootScope',
	    function($q, $http, $rootScope) {
	        return {
	            getCart: function() {
	                return $http({
	                    method: 'GET',
	                    url: "/order/cart"
	                });
	            },
	            createCart: function(cart) {
	                return $http({
	                    method: 'POST',
	                    url: '/order/create',
	                    data: cart
	                });
	            },
	            addToCart: function(cart) {
	                return $http({
	                    method: 'PUT',
	                    url: '/order/addToCart',
	                    data: cart
	                });
	            },
	            updateCart: function(itemId) {
	                return $http({
	                    method: 'PUT',
	                    url: '/order/update',
	                    data: { itemId: itemId }
	                });
	            },
	            saveOrderDetails: function(cart) {
	                return $http({
	                    method: 'PUT',
	                    url: '/order/saveOrderDetails'
	                });
	            },
	            setAddress: function(addr) {
	                return $http({
	                    method: 'PUT',
	                    url: '/order/setAddress',
	                    data: addr
	                });
	            },
	            all: function() {
	                return $http({
	                    method: 'GET',
	                    url: "/order/all/"
	                });
	            },
	            getOne: function(id) {
	                return $http({
	                    method: 'GET',
	                    url: "/order/" + id
	                });
	            },
	            delete: function() {
	                return $http({
	                    method: 'DELETE',
	                    url: "/order/remove"
	                });
	            },
	            pay: function(obj) {
	                return $http({
	                    method: 'POST',
	                    url: 'http://localhost:3001/transaction',
	                    data: obj,
	                    dataType:JSON
	                });
	            }
	        };
	    }
	]);

/***/ },
/* 9 */
/***/ function(module, exports) {

	angular.module('app')
	    .filter('moment', function() {
	        return function(dateString) {
	            return moment(dateString).format("D MMMM YYYY, HH:mm");
	        };
	    })
	    .controller('OrderController', ['$rootScope', '$location', '$timeout', 'orderService',
	        function($rootScope, $location, $timeout, orderService) {
	            var order = this;

	            orderService.getCart()
	                .then(function(response) {
	                    $rootScope.shoppingCart = response.data;
	                    // order.timeCreated = moment($rootScope.shoppingCart.order.created).format("D MMMM YYYY, HH:mm");
	                });

	            order.removeItem = function(id) {
	                orderService.updateCart(id)
	                    .then(function(response) {
	                        $rootScope.shoppingCart = response.data;
	                        if ($rootScope.shoppingCart.order.itemSet.length === 0) {
	                            orderService.delete();
	                            $rootScope.shoppingCart = null;
	                            $location.path("/");
	                        }
	                    });
	            };

	            order.doTheBack = function() {
	                window.history.back();
	            };
	            // var transaction = {
	            //     from: '5793b140faa67ed10cf2bb4e',
	            //     to: '5794fcc5c5421ff81b0b8c5e',
	            //     amount: $rootScope.shoppingCart.total
	            // };

	            order.pay = function(transaction) {
	                // orderService.pay(transaction)
	                // .then(function(bank_resp) {
	                //     console.log("bank_resp : ", bank_resp);
	                // });
	                orderService.saveOrderDetails()
	                    .then(function(resp) {
	                        console.log("resp : ", resp);
	                        order.SuccessPayment = true;
	                        $timeout(function() {
	                            $location.path('/confirmAddress');
	                        }, 1000);
	                         
	                    });
	            };

	        }
	    ])
	    .controller('HistoryCtrl',['orderService', function(orderService) {
	        var history = this;
	        orderService.all()
	            .then(function(resp) {
	                history.allOrders = resp.data;

	            });
	        }
	    ])
	    .controller('OrderDetailController',[ '$route', 'orderService',
	        function($route, orderService) {
	            var detail = this;

	            orderService.getOne($route.current.params.id)
	                .then(function(resp) {
	                    detail.order = resp.data;
	                    console.log('resp: ', resp);
	                });
	    }]);


/***/ },
/* 10 */
/***/ function(module, exports) {

	angular.module('app').controller('ConfirmCtrl', ['$scope', '$rootScope', '$location', 'orderService',
	    function($scope, $rootScope, $location, orderService) {
	        var confirm = this;
	        var user = $rootScope.currentUser;

	        confirm.address = user.address.str;

	        confirm.ok = function() {
	            var lat,lng;
	            if (confirm.mylat) {
	                lat = confirm.mylat;
	                lng = confirm.mylng;
	            } else {
	                lat = user.address.lat;
	                lng = user.address.lng;
	            }
	            orderService.setAddress({str: confirm.address, lat: lat, lng: lng})
	                .then(function(resp) {
	                    console.log(resp.data);
	                    
	                });
	        };

	        // confirm.doTheBack = function() {
	        //   window.history.back();
	        // };
	    }
	]);


/***/ },
/* 11 */
/***/ function(module, exports) {

	angular.module('app')
	    .controller('CatalogController', ['Items', '$route','$routeParams' ,'$httpParamSerializer','$rootScope','$location','$scope','$timeout' ,function (Items, $route,$routeParams,$httpParamSerializer,$rootScope,$location,$scope,$timeout) {
	        var that = this;
	        if(!$route.current.params.categories) {

	            for(var property in $rootScope.data.properties) {
	                for(var i in $rootScope.data.properties[property].value) {
	                    $rootScope.data.properties[property].value.state = false;
	                }
	            }
	        }

	        that.currentSort = $routeParams.sort || '';
	        that.sort = ['cheap','expensive'];

	        that.sortThis = function() {
	            $routeParams.sort = that.sorted || 'cheap';
	            $location.url('?'+$httpParamSerializer($routeParams));
	        }
	        Items.all($route.current.params)
	            .success(function(data){

	                $rootScope.complete.product = false;
	                that.items = data.items;
	                if(that.items.length === 0) {
	                    $rootScope.complete.product = true;
	                    that.items.notMatch = true;
	                    return;
	                }

	                for (var product in that.items) {
	                    that.items[product].smallDescription = that.items[product].description.slice(0,105) + "...";
	                }
	                var pages = data.pages || 0;
	                that.pages = [];
	                for (var i = 1; i <= pages;i++){
	                    var params = $route.current.params;

	                    params.page = i;
	                    var page = {number: i, url: $httpParamSerializer(params)};
	                    that.pages.push(page);
	                }
	                for(var property in that.items.properties) {
	                    property.url = $httpParamSerializer(property);
	                }
	                $rootScope.complete.product = true;
	                setTimeout(function(){
	                    //do this after view has loaded :)\
	                    makeVisualEffects();
	                }, 0);


	            }).error(function(data, status){
	            console.log(data, status);
	            that.items  = [];
	            that.items.error = true;
	            $rootScope.complete.product = true;
	        });

	    }])
	    .controller('ProductShowController',['$scope', '$rootScope', 'Items', '$route', 'orderService', function ($scope, $rootScope, Items, $route, orderService) {
	        Items.item($route.current.params.id).success(function(data) {
	            $scope.product = data;

	            $scope.addToCart = function(cart) {
	                if (!$rootScope.shoppingCart) {
	                    orderService.createCart(cart)
	                        .then(function(response) {
	                            console.log("create response :  ", response.data);
	                            $rootScope.shoppingCart = response.data;
	                        });
	                } else {
	                    orderService.addToCart(cart)
	                        .then(function(response) {
	                            console.log("addItem response :  ", response.data);
	                            $rootScope.shoppingCart = response.data;
	                        });
	                }
	            };
	            
	            $scope.doTheBack = function() {
	                window.history.back();
	            };

	        });
	    }]);
	    
	    
	    
	    
	 	


/***/ },
/* 12 */
/***/ function(module, exports) {

	angular.module('app')
	  .controller('CategoriesController', ['$scope', 'Parameters','$routeParams', '$httpParamSerializer', function ($scope, Parameters,$routeParams,$httpParamSerializer) {
	      var that = this;
	      Parameters.all().success(function(data){
	        that.data = [];
	        for(var i in data) {
	          var url = {};
	          url.categories = data[i];
	          var categoryInfo = {name : data[i], url : $httpParamSerializer(url)};
	          that.data.push(categoryInfo);
	          
	        }
	        
	      }).error(function(data, status){
	        console.log(data, status);
	        that.categories = [];
	      });
	     }]);

	    
	 	


/***/ },
/* 13 */
/***/ function(module, exports) {

	angular.module('app')
	    .controller('PropertyController', ['Parameters','$route','$scope','$rootScope','$httpParamSerializer' ,'$location',function (Parameters,$route,$scope,$rootScope,$httpParamSerializer,$location) {
	        let that = this;
	        if($rootScope.data.price) {
	            that.price = JSON.parse(JSON.stringify($rootScope.data.price));
	        }

	        let defineProperty = function() {
	            let currentUrl = JSON.parse(JSON.stringify($route.current.params));
	            for(let item in currentUrl) {
	                for(let i in $rootScope.data.properties) {
	                    if($rootScope.data.properties[i].name == item) {

	                        $rootScope.data.properties[i].value.forEach(function (value) {
	                            if(Array.isArray(currentUrl[item])) {
	                                if(currentUrl[item].includes(value.name)) {
	                                    value.state = true;
	                                }
	                            } else {
	                                if (currentUrl[item] == value.name) {
	                                    value.state = true;
	                                }
	                            }
	                        })
	                    }
	                }

	            }

	        };


	        that.createPropertyScreen = function (data) {
	            var propertyScreen = {};
	            propertyScreen.categories = $route.current.params.categories;
	            if($rootScope.data.searchField) {
	                let additionalSearchQuery = {
	                    searchField : $rootScope.data.searchField || ''
	                };
	                Object.assign(propertyScreen,additionalSearchQuery);
	            }
	            if($route.current.params.sort) {
	                let additionalSortQuery = {
	                    sort : $route.current.params.sort || 'cheap'
	                };
	                Object.assign(propertyScreen,additionalSortQuery);
	            }

	            if (typeof data == 'undefined') return propertyScreen;
	            if(data.hasOwnProperty('properties')) {
	                data.properties.forEach(function (item) {
	                    if (item.hasOwnProperty('value')) {
	                        item.value.forEach(function (val) {
	                            if (val.state) {
	                                if (!propertyScreen[item.name]) {
	                                    propertyScreen[item.name] = []
	                                }
	                                propertyScreen[item.name].push(val.name)
	                            }
	                        })
	                    }

	                })
	            }
	            return propertyScreen;
	        };

	        that.clickToProperty = function () {
	            let urlObj = that.createPropertyScreen($rootScope.data) || {};

	            if($rootScope.data.price && $route.current.params.categories) {
	                let additionalPriceQuery = {
	                    minprice: $rootScope.data.price.min || 0,
	                    maxprice: $rootScope.data.price.max || Math.pow(10, 6)
	                };
	                Object.assign(urlObj,additionalPriceQuery);
	            }

	            $location.url("?" + $httpParamSerializer(urlObj));
	        };

	        function creatCountObject (data) {
	            let object = {};
	            object.categories = $route.current.params.categories;
	            if($route.current.params.searchField) object.searchField = $route.current.params.searchField;
	            object[data.item] = data.name;

	            return object;
	        }


	        function addCount () {


	            if(typeof $rootScope.data == 'undefined') return;
	            let propScr = that.createPropertyScreen($rootScope.data);
	            let data = $rootScope.data;
	            for (let property in data.properties) {
	                for (var i in data.properties[property].value) {
	                    let params = JSON.parse(JSON.stringify(propScr));

	                    if (params[data.properties[property].name]) {
	                        params[data.properties[property].name].push(data.properties[property].value[i].name)
	                        //setAdditionalCount(property,i);
	                    }


	                    function setAdditionalCount(property,i) {

	                        if(typeof params == 'undefined') return null;
	                        let srcCount = 0;
	                        Parameters.count(propScr)
	                            .then(
	                                result => {
	                            srcCount = result.data;
	                        return Parameters.count(params)
	                    }
	                    )
	                    .then(
	                            result => {
	                            if(srcCount < result.data) {
	                            $rootScope.data.properties[property].value[i].count = "+" + (result.data - srcCount);
	                        } else {
	                            var countQuery = creatCountObject(data.properties[property].value[i]);

	                            function setCount (property,i) {
	                                Parameters.count(countQuery)
	                                    .then(
	                                        result => {

	                                    $rootScope.data.properties[property].value[i].count = result.data;
	                                if($rootScope.data.properties[property].value[i].state) {
	                                    $rootScope.data.properties[property].value[i].count = null;
	                                }
	                            }
	                            )
	                            }
	                            setCount(property,i);
	                        }
	                    }
	                    )
	                    .catch(function(error) {
	                            $rootScope.data.properties[property].value[i].count = null;
	                        })

	                    }
	                    setAdditionalCount(property,i);
	                }
	            }

	        }



	        var currentCategory = $route.current.params.categories;
	        that.isCat = typeof currentCategory == "undefined";
	        if($rootScope.category != currentCategory) {
	            Parameters.paramsOfCat(currentCategory)
	                .success(function (result) {
	                    if(result.price) that.price= JSON.parse(JSON.stringify(result.price));
	                    $rootScope.complete.property = false;
	                    $rootScope.category = currentCategory;
	                    $rootScope.data = result || [];

	                    if($rootScope.data.hasOwnProperty('properties')) {
	                        $rootScope.data.properties.forEach(function (item) {
	                            if (item.hasOwnProperty('value')) {
	                                for (var i in item.value) {
	                                    var newValue = {
	                                        name: item.value[i],
	                                        item: item.name,
	                                        state: false,
	                                        count: null
	                                    };
	                                    item.value[i] = newValue;

	                                }
	                            }
	                        });
	                    }

	                    defineProperty();
	                    let propScr = that.createPropertyScreen($rootScope.data);
	                    addCount();
	                    $rootScope.complete.property = true;

	                })
	                .error(function(data, status){
	                    console.log(data, status);
	                    that.categories = [];
	                    $rootScope.complete.property = true;
	                });
	        } else {
	            defineProperty();
	            addCount();
	        }

	    }]);

/***/ },
/* 14 */
/***/ function(module, exports) {

	

/***/ },
/* 15 */
/***/ function(module, exports) {

	angular.module('app').factory('Items', ['$http', function ProductFactory($http){
	  return {
	        all: function(object) {
	           return $http({
	           withCredentials: false,
	           method: 'GET',
	           url: "/catalog/filter/",
	           params: object,
	           headers : {'Content-Type': 'application/json'}
	         });
	      },
	       item : function(id) {
	         return $http({
	           method: 'GET',
	           url : "/catalog/product/"+id
	         });
	       }
	  };
	 }]);

	    

	 

/***/ },
/* 16 */
/***/ function(module, exports) {

	angular.module('app').factory('Parameters',['$http', function($http) {
	      return {
	        
	        all: function() {
	            return $http({
	              method: 'GET', 
	              url: "/catalog/find/all"
	            });
	        },
	        count: function(object) {
	              return $http({
	              withCredentials: false,
	              method: 'GET',
	              url: "/catalog/filter/count/",
	              params: object,
	              headers : {'Content-Type': 'application/json'}
	            });
	          },
	        paramsOfCat: function(cat) {
	          return $http({
	            method: 'GET',
	            url: "/catalog/find/" + cat,
	          });
	        }

	    }
	    }])


/***/ },
/* 17 */
/***/ function(module, exports) {

	angular.module('app')
	.directive('productItems',[function() {
		return {
			restrict:"E",
			controller: 'CatalogController',
			controllerAs: 'catalog',
			templateUrl: "./app/catalog/product/productView.html"
		};
	}]);



/***/ },
/* 18 */
/***/ function(module, exports) {

	angular.module('app')
	.directive('sortItems',[function() {
		return {
			restrict:"E",
			controller: 'CatalogController',
			controllerAs: 'product',
			templateUrl: "./app/catalog/product/sortView.html"
		};
	}]);

/***/ },
/* 19 */
/***/ function(module, exports) {

	angular.module('app')
	.directive('categoryItems',[function() {
		return {
			restrict:"A",
			controller: 'CategoriesController',
			controllerAs: 'categories',
			templateUrl: "./app/catalog/categories/categoryView.html"
		};
	}]);

/***/ },
/* 20 */
/***/ function(module, exports) {

	angular.module('app')
	.directive('propertyItems',[function() {
		return {
			restrict:"E",
			controller: 'PropertyController',
			controllerAs: 'properties',
			templateUrl: "./app/catalog/properties/propertyView.html"
		};
	}]);

/***/ }
/******/ ]);