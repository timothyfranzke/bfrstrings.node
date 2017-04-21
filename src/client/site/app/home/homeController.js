bfApp.controller('homeController', function($scope, $http, $sce, $mdMedia, baseService, inventoryService, cardService){
    $scope.config = {};
    var config = {};
    var pages = [];
    $scope.cards = [];
    $scope.today = new Date();
    var convertDate = function(date){
        var dateSplit = date.split(' ');
        var day = dateSplit[0].split('-');
        var time = dateSplit[1].split(':');

        return new Date(day[0],day[1] - 1,day[2],time[0],time[1]);
    };
    $scope.$mdMedia = $mdMedia;
    var request = {
        url: '/api/cards',
        method: 'GET'
    };
    $http(request)
        .then(function (res) {
            res.data.forEach(function(card){
                if(card.description !== undefined && typeof card.description === 'string')
                {
                    card.description = $sce.trustAsHtml(card.description);
                }
                if(card.videoId !== undefined)
                {
                    var url = "https://www.youtube.com/embed/" + card.videoId;
                    card.video_url = $sce.trustAsResourceUrl(url);
                }
            });
            cardService.cards = res.data;
            $scope.cards = cardService.cards;
        });
});