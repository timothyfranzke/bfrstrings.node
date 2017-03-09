bfApp.controller('cardController', function($scope, $mdDialog){
    $scope.pages = [
        {
            "name":"Events",
            "page":"events"
        },
        {
            "name":"Home",
            "page":"home"
        },
        {
            "name":"Our Brand",
            "page":"ourBrand"
        },
        {
            "name":"Repair Shop",
            "page":"repairShop"
        }
    ];
    $scope.featureInstrument = false;
    $scope.card = {};
    $scope.card.page = $scope.pages[1];
    $scope.card.lines = [];
    $scope.addText = function(text){
        $scope.card.lines.push(text);
        $scope.text = "";
    };
    $scope.removeText = function(index){
        $scope.card.lines.splice(index,1);
    };

    $scope.submit = function(card){
        $mdDialog.confirm(card);
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});