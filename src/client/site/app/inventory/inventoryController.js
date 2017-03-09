bfApp.controller('inventoryController', function($scope, inventoryService, instrumentService, inventoryModel, $stateParams, $timeout, $state, $mdSidenav, $mdMedia){
    $scope.isHome = true;
    $scope.isSmallScreen = $mdMedia('gt-md');
    $scope.selectedInventory = "";
    $scope.selectedIndex = 0;
    $scope.$mdMedia = $mdMedia;
    $scope.items = inventoryModel.inventory;

    console.log($scope.items);
    if (inventoryModel.length == 0)
    {
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
        });
    }

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






    //alert(JSON.stringify($state.current));
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



    $scope.getNumber = function(num) {
        alert(num);
        return new Array(num);
    };

    $state.goItem = function(id){
        state.go('inventoryItem', { id: id });
    };


});