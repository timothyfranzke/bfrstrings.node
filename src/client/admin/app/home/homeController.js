bfAppAdmin.controller('homeController', function($scope, $http, $sce, $mdMedia, baseService, inventoryService, cardService){
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
        baseService.DELETE(request.url,cardService.cards[index]._id).then(function(res){
            cardService.cards.splice(index,1);
        })
    }
});