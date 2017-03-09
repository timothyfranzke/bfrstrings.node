bfApp.controller('repairShopController', function($scope, cardService){
    $scope.cards = [];
    cardService.cards.forEach(function(card)
    {
        if(card.page === 'repairShop')
        {
            $scope.cards.push(card);
        }
    })
});