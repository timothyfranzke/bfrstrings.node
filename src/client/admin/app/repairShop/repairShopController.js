bfAppAdmin.controller('repairShopController', function($scope, $http){
    var request = {
        url: 'configuration/repairShop/repairShopConfig.json',
        method: 'GET'
    };
    $http(request)
        .success(function (data) {
            $scope.config = data;
        });
});