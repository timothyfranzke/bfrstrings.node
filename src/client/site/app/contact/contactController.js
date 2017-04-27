/**
 * Created by Timothy on 8/12/2015.
 */
bfApp.controller('contactController', function($scope, $http, inventoryService, $mdDialog, item) {
        $scope.items = {};
        $scope.itemsHolder = {};
        $scope.contact = {};
        $scope.contact.item = item;
        $scope.item = item;
        $scope.inquiredItem = inventoryService.getInquiredItem();
        $scope.isItemInquiry = false;
        $scope.options = [
            {
                "key": 1,
                "value": "I am interested in an instrument, but have some questions"
            },
            {
                "key": 3,
                "value": "I'd like to buy this item, PLEASE HOLD!!"
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

        $scope.sendEmail = function (contact) {
            $mdDialog.hide(contact);
        };
        $scope.cancel = function(){
            $mdDialog.cancel();
        };
    }
);