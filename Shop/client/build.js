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

	"use strict";

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(21);
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

	'use strict';

	var myApp = angular.module('app', ['ngRoute', 'ui-rangeSlider', 'ngAnimate', 'ui.bootstrap', 'ui.select2']);

	myApp.config(function ($routeProvider) {
	    $routeProvider.when('/', {
	        templateUrl: '/main.html',
	        access: { restricted: true }
	    }).when('/login', {
	        templateUrl: './app/auth/login.html',
	        controller: 'loginController',
	        access: { restricted: false }
	    }).when('/logout', {
	        controller: 'logoutController',
	        access: { restricted: true }
	    }).when('/register', {
	        templateUrl: './app/auth/register.html',
	        controller: 'registerController',
	        access: { restricted: false }
	    }).when('/product/:id', {
	        templateUrl: './app/catalog/product/productShowView.html',
	        controller: 'ProductShowController',
	        controllerAs: 'product',
	        access: { restricted: true }
	    }).when('/order/cart', {
	        templateUrl: './app/order/shoppingCart.html',
	        controller: 'OrderController',
	        controllerAs: 'order',
	        access: { restricted: true }
	    }).when('/confirmAddress', {
	        templateUrl: './app/order/confirmAddress.html',
	        controller: 'ConfirmCtrl',
	        controllerAs: 'confirm',
	        access: { restricted: true }
	    }).when('/order/all', {
	        templateUrl: './app/order/history.html',
	        controller: 'HistoryCtrl',
	        controllerAs: 'history',
	        access: { restricted: true }
	    }).when('/order/:id', {
	        templateUrl: './app/order/orderDetail.html',
	        controller: 'OrderDetailController',
	        controllerAs: 'detail',
	        access: { restricted: true }
	    }).when('/user/cabinet', {
	        templateUrl: './app/main/cabinet.html',
	        controller: 'CabinetCtrl',
	        controllerAs: 'cabinet',
	        access: { restricted: true }
	    }).otherwise({
	        redirectTo: '/'
	    });
	}).run(function ($rootScope, $location, $route, AuthService) {
	    $rootScope.$on('$routeChangeStart', function (event, next, current) {
	        AuthService.getUserStatus().then(function () {
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

	'use strict';

	angular.module('app').factory('AuthService', ['$rootScope', '$q', '$http', 'orderService', function ($rootScope, $q, $http, orderService) {

	  // create user variable
	  var user = null;

	  // return available functions for use in the controllers
	  return {
	    isLoggedIn: isLoggedIn,
	    getUserStatus: getUserStatus,
	    login: login,
	    logout: logout,
	    register: register,
	    addBankAccount: addBankAccount,
	    updateProfile: updateProfile
	  };

	  function isLoggedIn() {
	    if (user) {
	      return true;
	    } else {
	      return false;
	    }
	  }

	  function getUserStatus() {
	    return $http.get('/user/status')
	    // handle success
	    .success(function (data) {
	      if (data.status) {
	        user = true;
	        $rootScope.currentUser = data.user;
	        orderService.getCart().then(function (resp) {
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
	    $http.post('/user/login', { username: username, password: password })
	    // handle success
	    .success(function (data, status) {
	      if (status === 200 && data.status) {
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
	      if (status === 200 && data.status) {
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
	}]);

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').controller('loginController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

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

	angular.module('app').controller('logoutController', ['$rootScope', '$scope', '$location', 'AuthService', function ($rootScope, $scope, $location, AuthService) {

	  $scope.logout = function () {

	    // call logout from service
	    AuthService.logout().then(function () {
	      $rootScope.currentUser = null;
	      $location.path('/login');
	    });
	  };
	}]);

	angular.module('app').controller('registerController', ['$scope', '$location', 'AuthService', function ($scope, $location, AuthService) {

	  $scope.register = function () {

	    // initial values
	    $scope.error = false;
	    $scope.disabled = true;

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

	  $scope.login = function () {
	    $location.path('/login');
	  };
	}]);

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').directive('googleplace', function () {
	    return {
	        require: 'ngModel',
	        scope: {
	            ngModel: '=',
	            lat: '=?',
	            lng: '=?'
	        },
	        link: function link(scope, element, attrs, model) {
	            var options = {
	                types: ["address"],
	                componentRestrictions: { country: 'ua' }
	            };

	            var autocomplete = new google.maps.places.Autocomplete(element[0], options);

	            google.maps.event.addListener(autocomplete, 'place_changed', function () {
	                scope.$apply(function () {
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

	'use strict';

	angular.module('app').controller('mainController', ['$rootScope', '$location', 'AuthService', '$uibModal', function ($rootScope, $location, AuthService, $uibModal) {
	    var main = this;
	    $rootScope.complete = {};
	    $rootScope.data = {};
	    $rootScope.complete.property = false;
	    $rootScope.complete.product = false;

	    main.logout = function () {
	        // call logout from service
	        AuthService.logout().then(function () {
	            $rootScope.currentUser = null;
	            $rootScope.shoppingCart = null;
	            $location.path('/login');
	        });
	    };

	    main.addToCart = function (_item) {
	        $uibModal.open({
	            templateUrl: './app/order/modals/modalView.html',
	            controller: 'ModalCtrl',
	            controllerAs: 'modal',
	            resolve: {
	                item: function item() {
	                    return _item;
	                }
	            }
	        });
	    };
	}]);

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').directive('navbar', [function () {
		return {
			restrict: "E",
			controller: 'mainController',
			controllerAs: 'main',
			templateUrl: "./app/main/navbar.html",
			replace: true
		};
	}]);

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').controller('ModalCtrl', ['$scope', '$rootScope', '$uibModalInstance', 'item', 'orderService', function ($scope, $rootScope, $uibModalInstance, item, orderService) {
	    var modal = this;

	    modal.item = item;
	    modal.quantity = 1;

	    modal.total = function () {
	        return modal.item.price * modal.quantity;
	    };

	    modal.ok = function (cart) {
	        if (!$rootScope.shoppingCart) {
	            orderService.createCart(cart).then(function (response) {
	                console.log("create response :  ", response.data);
	                $rootScope.shoppingCart = response.data;
	            });
	        } else {
	            orderService.addToCart(cart).then(function (response) {
	                console.log("addItem response :  ", response.data);
	                $rootScope.shoppingCart = response.data;
	            });
	        }
	        $uibModalInstance.close();
	    };

	    modal.cancel = function () {
	        $uibModalInstance.dismiss('cancel');
	    };
	}]);

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').factory('orderService', ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {
	    return {
	        getCart: function getCart() {
	            return $http({
	                method: 'GET',
	                url: "/order/cart"
	            });
	        },
	        createCart: function createCart(cart) {
	            return $http({
	                method: 'POST',
	                url: '/order/create',
	                data: cart
	            });
	        },
	        addToCart: function addToCart(cart) {
	            return $http({
	                method: 'PUT',
	                url: '/order/addToCart',
	                data: cart
	            });
	        },
	        updQuantity: function updQuantity(itemId, quantity) {
	            return $http({
	                method: 'PUT',
	                url: '/order/updateQuantity',
	                data: { itemId: itemId, quantity: quantity }
	            });
	        },
	        removeItem: function removeItem(itemId) {
	            return $http({
	                method: 'PUT',
	                url: '/order/removeItem',
	                data: { itemId: itemId }
	            });
	        },
	        pay: function pay() {
	            return $http({
	                method: 'GET',
	                url: '/order/pay'
	            });
	        },
	        saveOrderDetails: function saveOrderDetails(cart) {
	            return $http({
	                method: 'PUT',
	                url: '/order/saveOrderDetails'
	            });
	        },
	        setAddress: function setAddress(addr) {
	            return $http({
	                method: 'PUT',
	                url: '/order/setAddress',
	                data: addr
	            });
	        },
	        all: function all() {
	            return $http({
	                method: 'GET',
	                url: "/order/all/"
	            });
	        },
	        getOne: function getOne(id) {
	            return $http({
	                method: 'GET',
	                url: "/order/" + id
	            });
	        },
	        delete: function _delete() {
	            return $http({
	                method: 'DELETE',
	                url: "/order/remove"
	            });
	        }
	    };
	}]);

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').filter('moment', function () {
	    return function (dateString) {
	        return moment(dateString).format("D MMMM YYYY, HH:mm");
	    };
	}).controller('OrderController', ['$rootScope', '$scope', '$location', '$timeout', '$uibModal', 'orderService', function ($rootScope, $scope, $location, $timeout, $uibModal, orderService) {
	    var order = this;

	    orderService.getCart().then(function (response) {
	        $rootScope.shoppingCart = response.data;
	    });

	    order.updQuantity = _.debounce(function (id, quan) {
	        orderService.updQuantity(id, quan).then(function (response) {
	            $rootScope.shoppingCart = response.data;
	        });
	    }, 1000);

	    order.increment = function (id, quan) {
	        order.updQuantity(id, ++quan);
	    };

	    order.decrement = function (id, quan) {
	        --quan;
	        if (quan === 0) {
	            order.removeItem(id);
	            return;
	        }
	        order.updQuantity(id, quan);
	    };

	    order.removeItem = function (id) {
	        orderService.removeItem(id).then(function (response) {
	            console.log(response.data);
	            $rootScope.shoppingCart = response.data;
	            if ($rootScope.shoppingCart.order.itemSet.length === 0) {
	                orderService.delete();
	                $rootScope.shoppingCart = null;
	                $location.path("/");
	            }
	        });
	    };

	    order.doTheBack = function () {
	        window.history.back();
	    };

	    order.pay = function () {
	        orderService.pay().then(function (bank_resp) {
	            console.log("bank_resp : ", bank_resp.data);
	            if (bank_resp.data.success === true) {
	                saveOrder();
	            } else if (bank_resp.data.success === false) {
	                console.log("Insufficient funds on Your bank account");
	                $uibModal.open({
	                    templateUrl: './app/order/modals/paymentFail.html'
	                });
	            } else if (bank_resp.data.error) {
	                $uibModal.open({
	                    templateUrl: './app/order/modals/connectionErr.html'
	                });
	                console.log('Could not connect to Your bank');
	            } else if (bank_resp.data.warning === "No bankAccount") {
	                $uibModal.open({
	                    templateUrl: './app/order/modals/inputBankAcc.html',
	                    controller: function controller($uibModalInstance, $scope, AuthService) {
	                        $scope.next = function (account) {
	                            AuthService.addBankAccount(account).then(function (resp) {
	                                console.log('addBankAccount.resp', resp);
	                                $uibModalInstance.close();
	                            });
	                        };
	                    }
	                });
	            }
	        });
	    };

	    function saveOrder() {
	        orderService.saveOrderDetails().then(function (resp) {
	            console.log("resp : ", resp);
	            $uibModal.open({
	                templateUrl: './app/order/modals/paymentDone.html',
	                backdrop: 'static',
	                keyboard: false,
	                controller: function controller($uibModalInstance, $scope) {
	                    $scope.next = function () {
	                        $uibModalInstance.close();
	                        $location.path('/confirmAddress');
	                    };
	                }
	            });
	        });
	    }
	}]).controller('HistoryCtrl', ['$scope', 'orderService', function ($scope, orderService) {
	    var history = this;
	    history.propertyName = 'date.created';
	    history.sortReverse = false;

	    history.sortBy = function (propertyName) {
	        history.sortReverse = history.propertyName === propertyName ? !history.sortReverse : true;
	        history.propertyName = propertyName;
	    };

	    orderService.all().then(function (resp) {
	        history.allOrders = resp.data;
	    });
	}]).controller('OrderDetailController', ['$route', 'orderService', function ($route, orderService) {
	    var detail = this;

	    orderService.getOne($route.current.params.id).then(function (resp) {
	        detail.order = resp.data;
	        console.log('resp: ', resp);
	    });
	}]);

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').controller('ConfirmCtrl', ['$scope', '$rootScope', '$location', 'orderService', '$uibModal', function ($scope, $rootScope, $location, orderService, $uibModal) {
	    var confirm = this;
	    var user = $rootScope.currentUser;

	    confirm.address = user.address.str;

	    confirm.ok = function () {
	        var lat, lng;
	        if (confirm.mylat) {
	            lat = confirm.mylat;
	            lng = confirm.mylng;
	        } else {
	            lat = user.address.lat;
	            lng = user.address.lng;
	        }

	        orderService.setAddress({ str: confirm.address, lat: lat, lng: lng }).then(function (resp) {
	            console.log(resp.data);
	            $rootScope.shoppingCart = null;
	            $uibModal.open({
	                templateUrl: './app/order/modals/finalPage.html',
	                controller: function controller($uibModalInstance, $scope) {
	                    $scope.close = function () {
	                        $location.path('/');
	                        $uibModalInstance.close();
	                    };
	                    $scope.$on('modal.closing', function () {
	                        $location.path('/');
	                    });
	                }
	            });
	        });
	    };
	}]);

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').controller('CatalogController', ['Items', '$route', '$routeParams', '$httpParamSerializer', '$rootScope', '$location', '$scope', '$timeout', function (Items, $route, $routeParams, $httpParamSerializer, $rootScope, $location, $scope, $timeout) {

	    var that = this;
	    $scope.complete = false;
	    if (!$route.current.params.categories) {
	        for (var property in $rootScope.data.properties) {
	            for (var i in $rootScope.data.properties[property].value) {
	                $rootScope.data.properties[property].value.state = false;
	            }
	        }
	    }

	    that.currentSort = $routeParams.sort || '';
	    that.sort = ['cheap', 'expensive'];

	    that.sortThis = function () {
	        $routeParams.sort = that.sorted || 'cheap';
	        $location.url('?' + $httpParamSerializer($routeParams));
	    };
	    Items.all($route.current.params).then(function (response) {

	        response.data.items.forEach(function (element) {
	            element.smallDescription = element.description.slice(0, 105) + "...";
	        });
	        for (var product in response.data.items) {
	            response.data.items[product].smallDescription = response.data.items[product].description.slice(0, 105) + "...";
	        }

	        $scope.items = response.data.items;
	        console.log($scope.items);
	        if ($scope.items.length === 0) {
	            $scope.complete = true;
	            $scope.items.notMatch = true;
	            return;
	        }
	        var pages = response.data.pages || 0;
	        $scope.pages = [];
	        for (var i = 1; i <= pages; i++) {
	            var params = $route.current.params;
	            params.page = i;
	            var page = { number: i, url: $httpParamSerializer(params) };
	            $scope.pages.push(page);
	        }
	        $scope.complete = true;
	        setTimeout(function () {
	            //do this after view has loaded :)\
	            makeVisualEffects();
	        }, 0);
	    }, function (error) {
	        console.log(error);
	        that.items = [];
	        that.items.error = true;
	        $scope.complete = true;
	    });
	}]).controller('ProductShowController', ['$scope', '$rootScope', 'Items', '$route', 'orderService', function ($scope, $rootScope, Items, $route, orderService) {
	    Items.item($route.current.params.id).success(function (data) {
	        $scope.product = data;

	        $scope.addToCart = function (cart) {
	            if (!$rootScope.shoppingCart) {
	                orderService.createCart(cart).then(function (response) {
	                    console.log("create response :  ", response.data);
	                    $rootScope.shoppingCart = response.data;
	                });
	            } else {
	                orderService.addToCart(cart).then(function (response) {
	                    console.log("addItem response :  ", response.data);
	                    $rootScope.shoppingCart = response.data;
	                });
	            }
	        };

	        $scope.doTheBack = function () {
	            window.history.back();
	        };
	    });
	}]);

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').controller('CategoriesController', ['$scope', 'Parameters', '$routeParams', '$httpParamSerializer', function ($scope, Parameters, $routeParams, $httpParamSerializer) {
	  var that = this;
	  Parameters.all().success(function (data) {
	    that.data = [];
	    for (var i in data) {
	      var url = {};
	      url.categories = data[i];
	      var categoryInfo = { name: data[i], url: $httpParamSerializer(url) };
	      that.data.push(categoryInfo);
	    }
	  }).error(function (data, status) {
	    console.log(data, status);
	    that.categories = [];
	  });
	}]);

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').controller('PropertyController', ['Parameters', '$route', '$scope', '$rootScope', '$httpParamSerializer', '$location', function (Parameters, $route, $scope, $rootScope, $httpParamSerializer, $location) {
	    var that = this;
	    $scope.displayCount = false;
	    $scope.complete = false;
	    var currentCategory = $route.current.params.categories;
	    $scope.isCat = typeof currentCategory == "undefined";
	    if ($rootScope.data.price) {
	        $scope.price = JSON.parse(JSON.stringify($rootScope.data.price));
	    }

	    var defineProperty = function defineProperty() {
	        if (!$rootScope.data.properties) return;
	        var currentUrl = JSON.parse(JSON.stringify($route.current.params));
	        if (currentUrl.searchField) $rootScope.data.searchField = currentUrl.searchField;

	        var _loop = function _loop(item) {
	            $rootScope.data.properties.forEach(function (property) {
	                if (property.name == item) {
	                    property.value.forEach(function (value) {
	                        if (Array.isArray(currentUrl[item])) {
	                            if (item.includes(value.respond)) {
	                                value.state = true;
	                            }
	                        } else {
	                            if (currentUrl[item] == value.respond) {
	                                value.state = true;
	                            }
	                        }
	                    });
	                }
	            });
	        };

	        for (var item in currentUrl) {
	            _loop(item);
	        }
	    };

	    $scope.createPropertyScreen = function (data) {
	        var propertyScreen = {};
	        propertyScreen.categories = $route.current.params.categories;

	        if ($rootScope.data.searchField) {

	            var additionalSearchQuery = {
	                searchField: $rootScope.data.searchField || ''
	            };
	            Object.assign(propertyScreen, additionalSearchQuery);
	        }
	        if ($route.current.params.sort) {
	            var additionalSortQuery = {
	                sort: $route.current.params.sort || 'cheap'
	            };
	            Object.assign(propertyScreen, additionalSortQuery);
	        }

	        if (typeof data == 'undefined') return propertyScreen;
	        if (data.hasOwnProperty('properties')) {
	            data.properties.forEach(function (item) {
	                if (item.hasOwnProperty('value')) {
	                    item.value.forEach(function (val) {
	                        if (val.state) {
	                            if (!propertyScreen[item.name]) {
	                                propertyScreen[item.name] = [];
	                            }
	                            propertyScreen[item.name].push(val.respond);
	                        }
	                    });
	                }
	            });
	        }
	        return propertyScreen;
	    };

	    $scope.clickToProperty = function () {
	        var urlObj = $scope.createFilterParams();
	        $location.url("?" + $httpParamSerializer(urlObj));
	    };

	    $scope.createFilterParams = function () {
	        var urlObj = $scope.createPropertyScreen($rootScope.data) || {};
	        if ($rootScope.data.price && $route.current.params.categories) {
	            var additionalPriceQuery = {
	                minprice: $rootScope.data.price.min || 0,
	                maxprice: $rootScope.data.price.max || Math.pow(10, 6)
	            };
	            Object.assign(urlObj, additionalPriceQuery);
	        }
	        return urlObj;
	    };

	    if ($rootScope.category != currentCategory) {
	        Parameters.paramsOfCat(currentCategory).then(function (result) {
	            if (result.data.price) $scope.price = JSON.parse(JSON.stringify(result.data.price));
	            $rootScope.category = currentCategory;
	            var newResult = JSON.parse(JSON.stringify(result.data));
	            if (newResult.hasOwnProperty('properties')) {
	                newResult.properties.forEach(function (item) {
	                    if (item.hasOwnProperty('value')) {
	                        for (var i = 0; i < item.value.length; i++) {
	                            var newValue = {
	                                respond: item.value[i],
	                                state: false,
	                                count: null
	                            };
	                            item.value[i] = newValue;
	                        }
	                    }
	                });
	            }

	            $rootScope.data = newResult || [];

	            defineProperty();
	            $scope.complete = true;
	        }, function (error) {
	            console.log(error);
	            $scope.categories = [];
	            $scope.complete = true;
	        });
	    }
	    var params = Object.assign({}, $route.current.params);
	    delete params.per_page;
	    delete params.page;
	    Parameters.countOfCat(currentCategory, params).then(function (result) {
	        $rootScope.data = result.data;
	        $scope.displayCount = true;
	        defineProperty();
	    }, function (error) {
	        console.log(error);
	    });
	    defineProperty();
	}]);

/***/ },
/* 14 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').factory('Items', ['$http', function ProductFactory($http) {
	  return {
	    all: function all(object) {
	      if (!object.per_page) {
	        object.per_page = 9;
	      }
	      return $http({
	        withCredentials: false,
	        method: 'GET',
	        url: "/catalog/filter/",
	        params: object
	      });
	    },
	    item: function item(id) {
	      return $http({
	        method: 'GET',
	        url: "/catalog/product/" + id
	      });
	    }
	  };
	}]);

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').factory('Parameters', ['$http', function ($http) {
	  return {

	    all: function all() {
	      return $http({
	        method: 'GET',
	        url: "/catalog/find/all"
	      });
	    },
	    countOfCat: function countOfCat(cat, object) {
	      return $http({
	        withCredentials: false,
	        method: 'GET',
	        url: "/catalog/filtration/" + cat,
	        params: object,
	        headers: { 'Content-Type': 'application/json' }
	      });
	    },
	    paramsOfCat: function paramsOfCat(cat) {
	      return $http({
	        method: 'GET',
	        url: "/catalog/find/" + cat
	      });
	    }

	  };
	}]);

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').directive('productItems', [function () {
		return {
			restrict: "E",
			controller: 'CatalogController',
			controllerAs: 'catalog',
			templateUrl: "./app/catalog/product/productView.html"
		};
	}]);

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').directive('sortItems', [function () {
		return {
			restrict: "E",
			templateUrl: "./app/catalog/product/sortView.html"
		};
	}]);

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').directive('categoryItems', [function () {
		return {
			restrict: "A",
			controller: 'CategoriesController',
			controllerAs: 'categories',
			templateUrl: "./app/catalog/categories/categoryView.html"
		};
	}]);

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').directive('propertyItems', [function () {
		return {
			restrict: "E",
			controller: 'PropertyController',
			controllerAs: 'properties',
			templateUrl: "./app/catalog/properties/propertyView.html"
		};
	}]);

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	angular.module('app').controller('CabinetCtrl', ['$scope', '$rootScope', '$location', 'AuthService', '$uibModal', function ($scope, $rootScope, $location, AuthService, $uibModal) {
	    var cabinet = this;
	    cabinet.user = $rootScope.currentUser;

	    cabinet.edit = false;

	    cabinet.update = function (user) {
	        AuthService.updateProfile(user).then(function (resp) {
	            $rootScope.currentUser = resp.data;
	            cabinet.edit = !cabinet.edit;
	        });
	    };
	}]);

/***/ }
/******/ ]);