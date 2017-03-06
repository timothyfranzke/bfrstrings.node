bfApp.controller('ourBrandController', function($scope, $http){
    var request = {
        url: 'configuration/ourBrand/ourBrandConfig.json',
        method: 'GET'
    };
    $http(request)
        .success(function (data) {
            $scope.config = data;
        });
});