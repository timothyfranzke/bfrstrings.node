/**
 * Created by Timothy on 8/12/2015.
 */
bfApp.controller('contactController', function($scope, $http, inventoryService, $mdDialog) {
        $scope.items = {};
        $scope.itemsHolder = {};
        $scope.contact = {};
        $scope.items = {};
        var getItems = function (id) {
            console.log(id);
            inventoryService.getInventory().then(function (data) {
                $scope.items = data;
            });
        };

        $scope.inquiredItem = inventoryService.getInquiredItem();
        $scope.isItemInquiry = false;
        $scope.options = [
            {
                "key": 1,
                "value": "I am interested in an item"
            },
            {
                "key": 2,
                "value": "I have a question about an item"
            },
            {
                "key": 3,
                "value": "I'd like to buy this item"
            },
            {
                "key": 4,
                "value": "General Question"
            }
        ];
        $scope.instrumentTypes = [
            {
                "key": 1,
                "value": "Banjo"
            },
            {
                "key": 2,
                "value": "Guitar"
            },
            {
                "key": 3,
                "value": "Mandolin"
            }
        ];

        if ($scope.inquiredItem.price !== undefined) {
            //alert(JSON.stringify($scope.inquiredItem));
            $scope.isItemInquiry = true;
            $scope.contact.question = "I have a question in an item";
            $scope.contact.itemType = $scope.inquiredItem.type;
            $scope.contact.itemName = $scope.inquiredItem.name;
            getItems($scope.contact.itemType);
            $scope.contact.type = 2;
        }

        $scope.sendEmail = function (contact) {
            $mdDialog.hide(contact);
        };
        $scope.getItems = function (instrumentType) {
            getItems(instrumentType);
        };
        $scope.cancel = function(){
            $mdDialog.cancel();
        }
    }
);