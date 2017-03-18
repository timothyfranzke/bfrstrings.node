bfAppAdmin.controller('bfAdminController', function($scope, $mdMedia, $mdSidenav, $state, inventoryService, inventoryModel, loadingService, eventModel){
    $scope.$mdMedia = $mdMedia;
    $scope.isLoading = loadingService.loading;
    $scope.$watch('loading', function(newVal){
       console.log("loading changed: " + newVal);
    });
    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            window.scrollTo(0,0);
            if(toState.name === "home"){
                $scope.isHome = true;
            }
            else{
                console.log("isNotHome");
                $scope.isHome = false;
            }
            console.log( $scope.isHome );
        }
    );
    $scope.isHome = true;
    $scope.loading = true;
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
        console.log(inventoryModel);
        $scope.loading = false;
    });
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

});