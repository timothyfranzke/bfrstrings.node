bfApp.controller('ourBrandController', function($scope, cardService){
    $scope.cards = [];
    cardService.cards.forEach(function(card)
    {
        if(card.page === 'ourBrand')
        {
            $scope.cards.push(card);
        }
    })
});