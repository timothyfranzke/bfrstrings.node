

bfApp.controller('adminController', function($scope, $mdDialog){
    $scope.openCard = function(){
        $mdDialog.show({
            controller:'cardController',
            templateUrl: 'app/admin/card/card.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(card){
            console.log(card);
        }, function(err)
        {
            console.log(err);
        })
    };

});