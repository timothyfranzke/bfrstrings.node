bfAppAdmin.controller('inventoryController', function($scope, inventoryService, instrumentService, loadingService, inventoryModel, baseService,  $stateParams, $timeout, $state, $mdDialog, $mdSidenav, $mdMedia){
    $scope.isHome = true;
    $scope.isSmallScreen = $mdMedia('gt-md');
    $scope.selectedInventory = "";
    $scope.selectedIndex = 0;
    $scope.$mdMedia = $mdMedia;
    $scope.isLoading = false;
    var imageUrl = "http://www.franzkedesigner.com/bfstrings_images/CreateImageService.php";

    var url = '/api/inventory';


        inventoryService.getInventory().then(function(data){
            data.forEach(function(item){
                item.visible = true;
                if(item.name.toLowerCase().indexOf(' sold') > -1){
                    item.sold = true;
                }
                else{
                    item.sold = false;
                }
            });
            inventoryModel.inventory = data;
            $scope.items = inventoryModel.inventory;
        });

    var filterInventory = function(index){
        $scope.items.forEach(function(item){
            if (item.type === index)
            {
                item.visible = true;
            }
            else {
                item.visible = false;
            }
        })

    };

    switch($state.current.name)
    {
        case "banjos":
            $scope.type = "Banjos";
            $scope.state = "banjos";
            $scope.path = "banjos";
            inventoryService.getBanjos().then(function(data){
                $scope.itemsHolder =data;
                $scope.items = data;
            });
            break;
        case "guitars":
            $scope.type = "Guitars";
            $scope.state = "guitars";
            $scope.path = "guitars";
            inventoryService.getGuitars().then(function(data){
                $scope.itemsHolder =data;
                $scope.items = data;
            });
            break;
        case "mandos":
            $scope.type = "Mandolins";
            $scope.state = "mandolins";
            $scope.path = "mandos";
            inventoryService.getMandos().then(function(data){
                $scope.itemsHolder =data;
                $scope.items = data;
            });
            break;
    }


    $scope.editInstrument = function(item, index){
        item.expiresOn = new Date(item.expiresOn);
        $mdDialog.show({
            locals:{inventoryItem:item},
            controller:'inventoryDialogController',
            templateUrl: 'app/dialogs/inventoryDialog.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(data){
            loadingService.setLoader(true);
            var image_array = [];
            var max_image_id = 1;
            data.item.added_images = data.images.length;
            data.item.images.forEach(function(image){
                if(image > max_image_id)
                    max_image_id = image;
            });
            max_image_id ++;
            data.images.forEach(function(image){
                image_array.push(max_image_id);
                max_image_id ++;
            });
            data.item.images = data.item.images.concat(image_array);
                baseService.PUT(url, data.item._id, data.item).then(function(res){
                    var i = image_array[0];
                    data.images.forEach(function(image){
                        var imageData = image.base64;
                        imageData.id = data.item._id;
                        imageData.imageId = i;
                        i++;
                        baseService.POST(imageUrl, imageData).then(function(res){
                            console.log("added: " + res);
                        });
                    }).finally(loadingService.setLoader(false));
                    $scope.items[index] = res.data.value;
                }).finally(loadingService.setLoader(false));
        }, function(err)
        {
            console.log(err);
        }).finally(function(){$scope.isLoading = false;})
    };
    $scope.getNumber = function(num) {
        alert(num);
        return new Array(num);
    };

    $state.goItem = function(id){
        state.go('inventoryItem', { id: id });
    };
    $scope.deleteCard = function(id,index){
        $mdDialog.show({
            controller:'confirmDialogController',
            templateUrl: 'app/dialogs/confirmDialog.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(){
                baseService.DELETE(url,id).then(function(res){
                    inventoryModel.inventory.splice(index,1);
                })
            })
    }

});