var bank = require("../app");

bank.controller('auth', function ($scope, $http, $location) {
    $http.get("/islogin")
        .success(function (data) {
            if(data.success == true){
                $location.path("/cabinet");
            }
        })
        .error(function (error) {
            console.log(error);
        });
});