bfApp.controller('ourBrandController', function($scope, cardService){
    $scope.cards = [];
    console.log("our brand");
    console.log(cardService);
    cardService.cards.forEach(function(card)
    {
        if(card.page === 'ourBrand')
        {
            $scope.cards.push(card);
        }
    })
});