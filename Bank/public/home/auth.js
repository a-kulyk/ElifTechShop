//var bank = require("../app");

module.exports =  function(app) {
    app.controller('auth', function ($scope, $http, $location) {
        $scope.logined = false;
        $http.get("/islogin")
            .success(function (data) {
                if(data.success == true){
                    $scope.logined = true;
                    $location.path("/cabinet");
                }
            })
            .error(function (error) {
                console.log(error);
            });
    });
};
