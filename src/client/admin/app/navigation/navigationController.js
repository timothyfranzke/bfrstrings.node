bfAppAdmin.controller('navigationController', function($scope, $state, $mdSidenav, $timeout, $mdDialog, $sce,baseService, cardService, inventoryService, instrumentService, inventoryModel){
    var url = '/api/cards';
    var inventoryUrl = '/api/inventory';

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
            templateUrl: 'admin/app/dialogs/cardDialog.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(data){
            data.active = true;
            baseService.POST(url, data.card).then(function(res){
                var cardItem = res.data.ops[0];
                    cardItem.description = $sce.trustAsHtml(res.data.ops[0].description);
                    var imageUrl = url +"/" + res.data.ops[0]._id + "/image";
                    baseService.POST(imageUrl, data.image).then(function(res){
                        cardItem.image = res.data.ops[0]._id;
                        cardService.cards.push(cardItem);
                    });
            },
            function(err){
                console.log(err);
            });
        }, function(err)
        {
            console.log(err);
        })
    };
    $scope.addInstrument = function(type){
        $mdDialog.show({
            controller:'inventoryDialogController',
            templateUrl: 'admin/app/dialogs/inventoryDialog.html',
            clickOutsideToClose: true,
            fullscreen : true
        }).then(function(data){
            baseService.POST(inventoryUrl, data.item).then(function(res){
                var imageUrl = inventoryUrl +"/" + res.data.ops[0]._id + "/image";
                res.data.ops[0].description = $sce.trustAsHtml(res.data.ops[0].description);
                var inventoryItem = res.data.ops[0];
                inventoryItem.images = [];
                data.images.forEach(function(image){
                    baseService.POST(imageUrl, image).then(function(res){
                       inventoryItem.images.push(res.data.ops[0]._id);
                    });
                });
                inventoryModel.inventory.push(inventoryItem);
            })
        }, function(err)
        {
            console.log(err);
        })
    };
});