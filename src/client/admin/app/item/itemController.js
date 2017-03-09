bfAppAdmin.controller('itemController', function($stateParams, $mdToast, $scope, $mdMedia, $sce, $state, inventoryService, $cookies, $mdDialog, $http){
        $scope.$mdMedia = $mdMedia;
        var showToast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position("top right")
                    .hideDelay(3000)

            );
        };
        $scope.isLargeScreen = $mdMedia('gt-md');
        $scope.items = [];
        $scope.options = {
            width: '100%',
            height: 400,
            loop: true,
            keyboard: true,
            nav: 'thumbs'
        };
        $scope.item = {};
        $scope.recentlyViewed = [];
        $scope.isSmallScreen = $mdMedia('sm');
        $scope.openInquire = function(item){
            inventoryService.setInquiredInstrument(item);
            console.log(item);
            $mdDialog.show({
                controller: 'contactController',
                templateUrl: 'app/partials/dialog/contact.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: true
            }).then(function(email){
                var request = {
                    url: 'php/Email.php',
                    method: 'POST',
                    data: contact
                };

                $http(request)
                    .success(function (data) {
                        showToast("Your inquiry has been sent.  Thank you!")
                    })
                    .error(function (data, status) {
                    });
            })
        };
        $scope.options = {
            width: '500',
            loop: true,
            keyboard: true,
            nav: 'thumbs',
            allowfullscreen: true
        };
        $scope.goInventory = function(){
            $state.go("inventory");
        };
        inventoryService.getImage($stateParams.id).then(function(data){
            $scope.images = data;
            $scope.images.forEach(function(img){
                img.id = img.itemId;
                img.thumb = 'img/inventory/' + img.folderId + '/' + img.itemId + '.png';
                img.full = 'img/inventory/' + img.folderId + '/' + img.itemId + '.png';
                img.img = 'img/inventory/' + img.folderId + '/' + img.itemId + '.png';
            });
        });
        inventoryService.getItemById($stateParams.id).then(function(data)
        {
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
            $scope.description = $sce.trustAsHtml($scope.item.description);

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