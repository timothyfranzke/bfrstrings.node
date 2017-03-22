bfAppAdmin.controller('navigationController', function($scope, $state, $mdSidenav, $timeout, $mdDialog, $sce,baseService, cardService, loadingService, inventoryService, instrumentService, inventoryModel){
    var url = '/api/cards';
    var inventoryUrl = '/api/inventory';
    var imageUrl = "http://www.franzkedesigner.com/bfstrings_images/CreateImageService.php";
    $scope.isLoading = false;
    $scope.showInventory = true;
    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }
    function buildDelayedToggler(navID) {
        return debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {

                });
        }, 200);
    }
    function buildToggler(navID) {
        return function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }
    }
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildDelayedToggler('right');
    $scope.goEvents = function(){
        $state.go("events");
    };
    $scope.goHome = function(){
        $state.go("home");
    };
    $scope.navInventory = function(){
        instrumentService.clearFilter();
        $state.go("inventory");
    };
    $scope.resetInventory = function(){
        inventoryModel.inventory.forEach(function(item){

        })
    };

    var sortByPrice = function(){
        inventoryModel.inventory.sort(function(a, b) {
            return parseFloat(a.price) - parseFloat(b.price);
        });
    };
    var sortByPriceDesc = function(){
        $scope.items.sort(function(a, b) {
            return parseFloat(b.price) - parseFloat(a.price);
        });

    };
    var sortByAZDesc = function(){

        inventoryModel.inventory.sort(function(a, b) {

            var i = 0;
            while ((b.name.charCodeAt(i) - a.name.charCodeAt(i)) === 0)
            {
                i ++;
            }
            return b.name.charCodeAt(i) - a.name.charCodeAt(i);
        });
    };
    var sortByAZAsec = function(){
        inventoryModel.inventory.sort(function(a, b) {

            var i = 0;
            while ((a.name.charCodeAt(i) - b.name.charCodeAt(i)) === 0)
            {
                i ++;
            }
            return a.name.charCodeAt(i) - b.name.charCodeAt(i);
        });
    };
    var recentlyAdded = function(){
        inventoryModel.inventory.sort(function(a, b) {
            return b.id - a.id;
        });
    };

    $scope.filterBanjo = function()
    {
        $scope.$parent.loading = true;
        instrumentService.filterInventory('1');
        $scope.$parent.loading = false;
        $state.go("inventory");
    };
    $scope.filterMando = function()
    {
        $scope.selectedInventory = "Mandolins";
        $scope.selectedIndex = 3;
        instrumentService.filterInventory('3');
        $state.go("inventory");
    };
    $scope.filterGuitar = function()
    {
        $scope.selectedInventory = "Guitars";
        $scope.selectedIndex = 2;
        instrumentService.filterInventory('2');
        $state.go("inventory");
    };
    $scope.filterOther = function()
    {
        $scope.selectedInventory = "Other Instruments";
        $scope.selectedIndex = 4;
        instrumentService.filterInventory('4');
        $state.go("inventory");
    };
    $scope.search = function(value){
        if ($state.current.name != 'inventory')
        {
            $state.go("inventory");
        }

        inventoryModel.inventory.forEach(function(item){
            item.visible = false;
        });
        inventoryModel.inventory.forEach(function(item)
        {
            var name = item.name.toLowerCase();
            value = value.toLowerCase();
            if (name.indexOf(value) > -1)
            {
                item.visible = true;
            }
        });
    };
    $scope.runFilter = function(filter) {
        switch (filter) {
            case "PriceDesc":
                sortByPriceDesc();
                break;
            case "PriceAsec":
                sortByPrice();
                break;
            case "AZ":
                sortByAZAsec();
                break;
            case "ZA":
                sortByAZDesc();
                break;
            case "added":
                recentlyAdded();
                break;
        }
    };
    $scope.goRepairShop = function(){
        $state.go("repairShop");
    };
    $scope.goRepairShop = function(){
        $state.go("ourBrand");
    };
    $scope.addCard = function(type){
        $mdDialog.show({
            controller:'cardDialogController',
            templateUrl: 'app/dialogs/cardDialog.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(data){

            $scope.isLoading = true;
            data.active = true;
            var numberOfImages = data.images.length;
            data.card.images = [];
            for(var i = 1; i <= numberOfImages; i++)
            {
                data.card.images.push(i);
            }
            baseService.POST(url, data.card).then(function(res){
                    var resultId = res.data.ops[0]._id;
                    var cardItem = res.data.ops[0];
                    var id = 1;
                    cardItem.description = $sce.trustAsHtml(res.data.ops[0].description);
                    if (data.images.length > 0)
                    {
                        data.images.forEach(function(image){
                            var imageData = image.base64;
                            imageData.id = resultId;
                            imageData.imageId = id;
                            id++;
                            baseService.POST(imageUrl, imageData).then(function(res){
                                i++;
                                if(i==numberOfImages){
                                    $scope.isLoading = false;
                                }
                            });
                        });
                    }
                    $scope.isLoading = false;
            },
            function(err){
                $scope.isLoading = false;
                console.log(err);
            });
        }, function(err)
        {
            $scope.isLoading = false;
            console.log(err);
        })
    };
    $scope.addInstrument = function(type){
        $mdDialog.show({
            locals:{inventoryItem:{}},
            controller:'inventoryDialogController',
            templateUrl: 'app/dialogs/inventoryDialog.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(data){
            $scope.isLoading = true;
            var numberOfImages = data.images.length;
            data.item.number_of_images = numberOfImages;
            baseService.POST(inventoryUrl, data.item).then(function(res){
                var resultId = res.data.ops[0]._id;
                if(res.data.ops[0].inventory_id !== undefined)
                {
                    resultId = res.data.ops[0].inventory_id;
                }

                res.data.ops[0].description = $sce.trustAsHtml(res.data.ops[0].description);
                var inventoryItem = res.data.ops[0];
                inventoryItem.images = [];

                var i = 1;
                var id = 1;
                data.images.forEach(function(image){
                    var imageData = image.base64;
                    imageData.id = resultId;
                    imageData.imageId = id;
                    id++;
                    baseService.POST(imageUrl, imageData).then(function(res){
                        i++;
                       if(i==numberOfImages){
                           $scope.isLoading = false;
                       }
                    });
                });
                inventoryModel.inventory.push(inventoryItem);
            })
        }, function(err)
        {
            $scope.isLoading = false;
            console.log(err);
        })
    };

});