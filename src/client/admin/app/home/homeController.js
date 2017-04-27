bfAppAdmin.controller('homeController', function($scope, $http, $sce, $mdMedia, $mdDialog, baseService, inventoryService, loadingService, cardService){
    var url = '/api/cards';
    var imageUrl = "http://www.franzkedesigner.com/bfstrings_images/CreateImageService.php";
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
                if(card.videoId !== undefined)
                {
                    var url = "https://www.youtube.com/embed/" + card.videoId;
                    card.url = $sce.trustAsResourceUrl(url);
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
                cardService.cards.splice(index, 1);
            })
        });
    };
    $scope.editCard = function(item, index){
        console.log(index);
        console.log($scope.items);
        if(!!item.expiresOn)
            item.expiresOn = new Date(item.expiresOn);

        $mdDialog.show({
            locals:{cardItem:item},
            controller:'cardDialogController',
            templateUrl: 'app/dialogs/cardDialog.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(data){
            loadingService.setLoader(true);
            if (data.description !== undefined)
            {
                if(typeof data.description !== "string")
                {
                    data.description = "";
                }
            }
            baseService.PUT(url, data.card._id, data.card).then(function(res){
                console.log(res);
                var i = 1;
                data.images.forEach(function(image){
                    var imageData = image.base64;
                    imageData.id = data.card._id;
                    imageData.imageId = i;
                    i++;
                    baseService.POST(imageUrl, imageData).then(function(res){
                        console.log("added: " + res);
                    });
                });
                $scope.cards[index] = res.data.value;
            })
        }, function(err)
        {
            console.log(err);
        }).finally(loadingService.setLoader(false))
    };
});