bfAppAdmin.controller('inventoryDialogController', function($sce, $mdDialog, $scope, $q){
    $scope.inventoryItem = {};
    $scope.inventoryItem._id = -1;
    $scope.inventoryItem.item = {};
    $scope.inventoryItem.images = [];
    $scope.editingDescription = false;
    $scope.showEditDesciption = function(){
        $scope.editDescription = true;
    };

    $scope.types = ['guitar', 'banjo', 'mando', 'other'];
/*    if(inventoryItem !== undefined)
    {
        $scope.inventoryItem = inventoryItem;
    }*/
    $scope.editDescription = function(){
        $scope.editingDescription = true;
    };
    $scope.saveDescription = function(descrip){
        $scope.editingDescription = false;
        $scope.inventoryItem.item.description = descrip;
        $scope.descriptionDisplay = $sce.trustAsHtml(descrip);
    };
    $scope.removeImage = function(index){
        $scope.inventoryItem.images.splice(index,1);
    };

    $scope.$watch('uploadedImages', function(newVal){
        if(newVal !== undefined){
            if($scope.inventoryItem.images.length > 0)
                $scope.inventoryItem.images.concat(newVal);
            else
                $scope.inventoryItem.images = newVal;

            console.log( $scope.inventoryItem.images);
        }
    });

    $scope.resizeImage = function ( file ) {

        var images = {};

        var deferred = $q.defer();

        var img = document.createElement("img");
        var reader = new FileReader();
        reader.onload = function(e) {
            // resize the picture
            img.src = e.target.result;

            var canvas = document.createElement("canvas");
            var thumbCanvas = document.createElement("canvas");

            var MAX_WIDTH = 300;
            var MAX_HEIGHT = 300;
            var width = img.width;
            var height = img.height;

            var THUMB_MAX_WIDTH = 150;
            var THUMB_MAX_HEIGHT = 150;
            var thumbWidth = img.width;
            var thumbHeight = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
            if (thumbWidth > thumbHeight) {
                if (thumbWidth > THUMB_MAX_WIDTH) {
                    thumbHeight *= THUMB_MAX_WIDTH / thumbWidth;
                    thumbWidth = THUMB_MAX_WIDTH;
                }
            } else {
                if (thumbHeight > THUMB_MAX_HEIGHT) {
                    thumbWidth *= THUMB_MAX_HEIGHT / thumbHeight;
                    thumbHeight = THUMB_MAX_HEIGHT;
                }
            }
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);

            thumbCanvas.width = thumbWidth;
            thumbCanvas.height = thumbHeight;
            var thumbCtx = thumbCanvas.getContext("2d");
            thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

            images.base64 = {};
            images.base64.full = canvas.toDataURL("image/png");
            images.base64.thumb = thumbCanvas.toDataURL("image/png");

            deferred.resolve(images);
        };
        reader.readAsDataURL(file, "UTF-8");

        return deferred.promise;

    }
   $scope.submit = function(item){
      $mdDialog.hide(item)
   };

   $scope.cancel = function(){
       $mdDialog.cancel();
   };
});