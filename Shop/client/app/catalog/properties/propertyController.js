
angular.module('app')
  .controller('PropertyController', ['Parameters','$route','$scope','$rootScope','$httpParamSerializer' ,'$location','$routeParams',function (Parameters,$route,$scope,$rootScope,$httpParamSerializer,$location,$routeParams) {
      let that = this;
      let defineProperty = function() {
          let currentUrl = JSON.parse(JSON.stringify($route.current.params));
          for(let item in currentUrl) {
            for(let i in $rootScope.data.properties) {
                if($rootScope.data.properties[i].name == item) {
                    console.log( $rootScope.data.properties[i].value);
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

      }


      that.createPropertyScreen = function (data) {
        var propertyScreen = {};
        propertyScreen.categories = $route.current.params.categories;
          if($rootScope.data.searchField) {
              let additionalSearchQuery = {
                  searchField : $rootScope.data.searchField || ''
              }
              Object.assign(propertyScreen,additionalSearchQuery);
          }
          if($route.current.params.sort) {
              let additionalSortQuery = {
                  sort : $route.current.params.sort || 'cheap'
              }
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
      }





      that.clickToProperty = function () {
          let urlObj = that.createPropertyScreen($rootScope.data) || {};

          if($rootScope.data.price) {
              let additionalPriceQuery = {
                  minprice: $rootScope.data.price.min || 0,
                  maxprice: $rootScope.data.price.max || Math.pow(10, 6)
              }
              Object.assign(urlObj,additionalPriceQuery);
          }

          $location.url("?" + $httpParamSerializer(urlObj));
      }

      that.clickToFilterButton = function () {
          let urlObj = that.createPropertyScreen($rootScope.data) || {};
          if($rootScope.data.searchField) {
              let additionalSearchQuery = {
                  searchField : $rootScope.data.searchField || ''
              }
              Object.assign(urlObj,additionalSearchQuery);

          }
          if($rootScope.data.price) {
              let additionalPriceQuery = {
                  minprice: $rootScope.data.price.min || 0,
                  maxprice: $rootScope.data.price.max || Math.pow(10, 6)
                }
              Object.assign(urlObj,additionalPriceQuery);
          }

          $location.url("?" + $httpParamSerializer(urlObj));
      }
      


      function addCount () {

        if(typeof $rootScope.data == 'undefined') return
        propScr = that.createPropertyScreen($rootScope.data);
        data = $rootScope.data;
        for (var property in data.properties) {
          for (var i in data.properties[property].value) {
            let params = JSON.parse(JSON.stringify(propScr));
            if (params[data.properties[property].name]) {
              params[data.properties[property].name].push(data.properties[property].value[i].name)
            } else {
              params[data.properties[property].name] = []
              params[data.properties[property].name].push(data.properties[property].value[i].name)
            }
            function setCount(property,i) {

              if(typeof params == 'undefined') return null;
                let srcCount = 0;
                Parameters.count(propScr)
                .then(

                    result => {
                        console.log(result);
                        srcCount = result.data;
                        return Parameters.count(params)
                    }
                )
                .then(
                    result => {
                        if(srcCount < result.data) {
                            $rootScope.data.properties[property].value[i].count = "+" + (result.data - srcCount);
                        } else {
                            $rootScope.data.properties[property].value[i].count = null;
                        }
                    }
                )
                .catch(function(error) {
                    $rootScope.data.properties[property].value[i].count = null;
                })

            }
            setCount(property,i);
          }
        }
          
      }



     var currentCategory = $route.current.params.categories;
      that.isCat = typeof currentCategory == "undefined";
      if($rootScope.category != currentCategory) {
        Parameters.paramsOfCat(currentCategory)
            .success(function (result) {

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
                this.propScr = that.createPropertyScreen($rootScope.data);
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




/*setUrl : function () {
                if(this.state) {
                  self = this;
                  let url = $route.current.params
                  delete url.page
                  if(!Array.isArray(url[this.item])) {
                    if(url[this.item]) {
                    url[this.item] = [url[this.item]]; 
                    } else {
                      url[this.item] = []
                    }
                  }  
                  if(!url[this.item].includes(this.value)) url[this.item].push(this.value);
                  url.minprice = $rootScope.data.prices.minprice;
                  url.maxprice = $rootScope.data.prices.maxprice;
                  let count = {
                    categories : url.categories,
                  }
                  count[this.item] = this.value;
                  Parameters.count(count)
                  .then(function(respone) {
                    self.count = respone.data.count;
                    console.log(respone.data.count)
                  })
                  var out = $httpParamSerializer(url)
                  $location.url('?'+out); 
                } else {
                  this.count = null;
                  let url = $route.current.params
                  if(Array.isArray(url[this.item])) {
                    let index = url[this.item].indexOf(this.value);
                    delete url[this.item][index]
                  } else {
                    delete url[this.item]
                  }
                  delete url.page
                  var out = $httpParamSerializer(url)
                  $location.url('?'+out); 
                }
              }*/
