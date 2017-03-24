bfAppAdmin.controller('homeController', function($scope, $http, $sce, $mdMedia, $mdDialog, baseService, inventoryService, cardService){
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
    };
    $scope.editCard = function(item, index){
        item.expiresOn = new Date(item.expiresOn);
        $mdDialog.show({
            locals:{cardItem:item},
            controller:'cardDialogController',
            templateUrl: 'app/dialogs/cardDialog.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(data){
            $scope.isLoading = true;
            baseService.PUT(url, data.item._id, data.item).then(function(res){
                data.images.forEach(function(image){
                    var imageData = image.base64;
                    imageData.id = data.item._id;
                    imageData.imageId = i;
                    i++;
                    baseService.POST(imageUrl, imageData).then(function(res){
                        console.log("added: " + res);
                    });
                });
                $scope.items[index] = res.data.value;
            })
        }, function(err)
        {
            console.log(err);
        }).finally(function(){$scope.isLoading = false;})
    };
});