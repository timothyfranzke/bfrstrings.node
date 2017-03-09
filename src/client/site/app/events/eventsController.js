bfApp.controller('eventsController', function($scope, cardService){
    $scope.cards = [];
    cardService.cards.forEach(function(card)
    {
        if(card.page === 'events')
        {
            $scope.cards.push(card);
        }
    })
});