bfAppAdmin.controller('homeController', function($scope, $http, $sce, $mdMedia, $mdDialog, baseService, inventoryService, cardService){
    $scope.config = {};
    $scope.cards = [];
    $scope.$mdMedia = $mdMedia;
    var request = {
        url: '/api/cards',
        method: 'GET'
    };
    $http(request)
        .then(function (res) {
            res.data.forEach(function(card){
                if(card.description !== undefined)
                {
                    card.description = $sce.trustAsHtml(card.description);
                }
            });
            cardService.cards = res.data;
            $scope.cards = cardService.cards;
        });
    $scope.deleteCard = function(index){
        $mdDialog.show({
            controller:'confirmDialogController',
            templateUrl: 'app/dialogs/confirmDialog.html',
            clickOutsideToClose: true,
            fullscreen : false
        }).then(function() {
            baseService.DELETE(request.url, cardService.cards[index]._id).then(function (res) {
                console.log(cardService.cards.length);
                console.log(index);
                cardService.cards.splice(index, 1);
                console.log(cardService.cards.length);
            })
        });
    }
});