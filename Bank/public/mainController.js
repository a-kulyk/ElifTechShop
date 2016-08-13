
export default (app) => {
    app.controller('main', function ($scope, $http, $location) {
        $scope.title = "Bank";
        $scope.formData = {};

        $http.get("/user")
            .success(function (data) {
                $scope.username = data.username;
                $scope.id = data.id;
                $scope.amount = data.amount;
            })
            .error(function (error) {
                console.log(error);
            });
    });
};
