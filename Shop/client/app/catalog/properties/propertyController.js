
angular.module('app')
  .controller('PropertyController', ['Parameters','$route','$scope','$rootScope','$httpParamSerializer' ,'$location','$routeParams',function (Parameters,$route,$scope,$rootScope,$httpParamSerializer,$location,$routeParams) {
      var that = this;
      that.createPropertyScreen = function (data) {
        var propertyScreen = {};
        propertyScreen.categories = $route.current.params.categories;
        if (typeof data == 'undefined') return propertyScreen;
          if(data.hasOwnProperty('properties')) {
              data.properties.forEach(function (item) {
                  if (item.hasOwnProperty('value')) {
                      console.log(item.value);
                      item.value.forEach(function (val) {
                          if (val.state) {
                              console.log(val);
                              if (propertyScreen[item.name]) {
                                  propertyScreen[item.name].push(val.name)
                              } else {
                                  propertyScreen[item.name] = []
                                  propertyScreen[item.name].push(val.name)
                              }
                          }
                      })
                  }

              })
          }
        return propertyScreen;
      }

      let propScr = that.createPropertyScreen($rootScope.data);



      that.clickToProperty = function () {
          let urlObj = that.createPropertyScreen($rootScope.data);
          $location.url("?" + $httpParamSerializer(urlObj));
      }

      function addCount () {
        if(typeof $rootScope.data == 'undefined') return
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
                srcCount = 0;
                Parameters.count(propScr)
                .then(
                    result => {
                        srcCount = result.data;
                        return Parameters.count(params)
                    }
                )
                .then(
                    result => {
                        console.log(srcCount,result.data);
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




        /*
        data.properties.forEach(function (item) {
          let params = that.propertyScreen.slice(0);
          if (item.hasOwnProperty('value')) {
            for (var i in item.value) {
                for(var j = 0 ; j < params.length; j++) {
                  if (params[j][item.name]) {
                    params[j][item.name].push(item.value[i].name)
                  } else {
                    params[j][item.name] = []
                    params[j][item.name].push(item.value[i].name)
                  }
                }
            }
          }
          console.log(params);
         });
        */


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
              $rootScope.complete.property = true;
              addCount();

        })
        .error(function(data, status){
          console.log(data, status);
          that.categories = [];
          $rootScope.complete.property = true;
        });
    } else {
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
