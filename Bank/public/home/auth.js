//var bank = require("../app");

export default (app) => {
    app.controller('auth', function ($scope, $http, $location) {
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
}
