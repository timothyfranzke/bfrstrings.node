bfApp.controller('itemController', function($stateParams, $mdToast, $scope, $mdMedia, $sce, $state, inventoryService, $cookies, $mdDialog, $http){
        $scope.$mdMedia = $mdMedia;
        var showToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position("bottom right")
                    .hideDelay(3000)

            );
        };
        $scope.isLargeScreen = $mdMedia('gt-md');
        $scope.items = [];
        $scope.item = {};
        $scope.recentlyViewed = [];
        $scope.isSmallScreen = $mdMedia('sm');
        $scope.openInquire = function(item){
            inventoryService.setInquiredInstrument(item);
            console.log(item);
            $mdDialog.show({
                locals:{item:item},
                controller: 'contactController',
                templateUrl: 'app/contact/contact.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: true
            }).then(function(contact){
                var request = {
                    url: 'api/contact',
                    method: 'POST',
                    data: contact
                };

                $http(request)
                    .then(function (data) {
                        showToast("Your inquiry has been sent.  Thank you!")
                    })
            })
        };
        $scope.options = {
            width: '500',
            loop: false,
            keyboard: true,
            nav: 'thumbs',
            allowfullscreen: true
        };
        $scope.goInventory = function(){
            $state.go("inventory");
        };
        var img = {};
        img.id = '58c222a0bfe1483098ba07dd';
        img.thumb = 'images/58c222a0bfe1483098ba07dd/thumbs/58c222a0bfe1483098ba07de.png';
        img.full = 'images/58c222a0bfe1483098ba07dd/58c222a0bfe1483098ba07de.png';
        img.img = 'images/58c222a0bfe1483098ba07dd/58c222a0bfe1483098ba07de.png';

/*        inventoryService.getImage($stateParams.id).then(function(data){
            $scope.images = data;
            $scope.images.forEach(function(img){
                img.id = img.itemId;
                img.thumb = 'img/inventory/' + img.folderId + '/' + img.itemId + '.png';
                img.full = 'img/inventory/' + img.folderId + '/' + img.itemId + '.png';
                img.img = 'img/inventory/' + img.folderId + '/' + img.itemId + '.png';
            });
        });*/
        inventoryService.getItemById($stateParams.id).then(function(data)
        {
            console.log(data);
            switch(data.type)
            {
                case '1':
                    $scope.type = {
                        name:"Banjos",
                        type:'1'
                    };
                    break;
                case '2':
                    $scope.type = {
                        name:"Guitars",
                        type:'2'
                    };
                    break;
                case '3':
                    $scope.type = {
                        name:"Mandolins",
                        type:'3'
                    };
                    break;
                case '4':
                    $scope.type = {
                        name:"Other Instruments",
                        type:'4'
                    };
                    break;

            }
            $scope.item = data;
            $scope.images = [];
            data.images.forEach(function(imageId){
                var img ={};
                img.id = imageId;
                img.type = 'image';
                img.thumb = 'http://franzkedesigner.com/img/inventory/' + data._id + '/thumbs/' + imageId + '.png';
                img.full = 'http://franzkedesigner.com/img/inventory/' + data._id + '/' + imageId + '.png';
                img.url = 'http://franzkedesigner.com/img/inventory/' + data._id + '/' + imageId + '.png';
                $scope.images.push(img);
            });
            $scope.description = $sce.trustAsHtml($scope.item.description);
            if($scope.item.videoId !== undefined)
            {
                var url = "https://www.youtube.com/embed/" + $scope.item.videoId;
                $scope.item.videoUrl = $sce.trustAsResourceUrl(url);
            }

            //$scope.item.type ="Banjo";
            if ($cookies.get("itemTwo") !== undefined)
            {
                $cookies.putObject("itemThree", $cookies.getObject("itemTwo"));
                $scope.recentlyViewed.push($cookies.getObject("itemThree"));
            }
            if ($cookies.get("itemOne") !== undefined)
            {
                $cookies.putObject("itemTwo", $cookies.getObject("itemOne"));
                $scope.recentlyViewed.push($cookies.getObject("itemTwo"));
            }
            if ($cookies.get("current") !== undefined)
            {
                $cookies.putObject("itemOne", $cookies.getObject("current"));
                $scope.recentlyViewed.push($cookies.getObject("itemOne"));
            }
            $cookies.putObject("current", $scope.item);
            console.log($scope.recentlyViewed);
            //$('.fotorama').fotorama();
        });

        $scope.contact = function(item)
        {
            inventoryService.setInquiredInstrument(item);
            $state.go("contact");
        };
        // alert(JSON.stringify($cookies.getObject("itemTwo")));

        console.log(($scope.recentlyViewed));
    }
)