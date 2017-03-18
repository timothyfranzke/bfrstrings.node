bfAppAdmin.controller('confirmDialogController', function($scope, $mdDialog){
   $scope.yes = function(){
       $mdDialog.hide();
   };
   $scope.no = function(){
       $mdDialog.cancel();
    };
});