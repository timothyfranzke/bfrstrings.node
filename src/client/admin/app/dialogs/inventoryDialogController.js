bfAppAdmin.controller('inventoryDialogController', function($sce, $mdDialog, $scope, $q, inventoryItem){
    $scope.inventoryItem = {};
    $scope.inventoryItem._id = -1;
    $scope.inventoryItem.item = {};
    $scope.inventoryItem.images = [];
    $scope.editingDescription = false;
    console.log(inventoryItem);
    if(!!inventoryItem)
    {
        $scope.inventoryItem.item = inventoryItem;
        $scope.descriptionDisplay = $sce.trustAsHtml($scope.inventoryItem.item.description);
    }

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
    $scope.updateRemoveImage =function(index){
        $scope.inventoryItem.item.images.splice(index,1);
    };
    $scope.selectPrimary = function(index, type)
    {
        $scope.primary_image = {};
        $scope.primary_image.type = type;
        var max_id = 1;
        $scope.inventoryItem.item.images.forEach(function(image){
            console.log("image: " + image + " max_id: " + max_id);
            if(image > max_id)
            {
                max_id = image;
            }

        });
        max_id ++;
        console.log(" max_id: " + max_id);
        if(type === 1)
        {
            $scope.inventoryItem.item.primary_image = index;
            $scope.primary_image.image_id = index;

        }
        else{
            console.log(index);
            console.log("index: " + index + " max_id: " + max_id);
            var next_id = max_id + index;
            $scope.primaryimage = next_id;
            $scope.inventoryItem.item.primary_image = next_id;
            console.log($scope.inventoryItem.item.primary_image);
            $scope.primary_image.image = $scope.inventoryItem.images[index];
            console.log($scope.primary_image.image);
        }

        console.log($scope.inventoryItem.item.primary_image);

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
        var i = new Image();
        reader.onload = function(e) {
            // resize the picture
            i.src = e.target.result;


        };
        i.onload = function(){
            var canvas = document.createElement("canvas");
            var thumbCanvas = document.createElement("canvas");

            var MAX_WIDTH = 300;
            var MAX_HEIGHT = 300;
            var width = i.width;
            var height = i.height;

            var THUMB_MAX_WIDTH = 150;
            var THUMB_MAX_HEIGHT = 150;
            var thumbWidth = i.width;
            var thumbHeight = i.height;

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
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(i, 0, 0, width, height);

            thumbCanvas.width = thumbWidth;
            thumbCanvas.height = thumbHeight;
            var thumbCtx = thumbCanvas.getContext("2d");
            thumbCtx.drawImage(i, 0, 0, thumbWidth, thumbHeight);

            images.base64 = {};
            images.base64.full = canvas.toDataURL("image/png");
            images.base64.thumb = thumbCanvas.toDataURL("image/png");

            deferred.resolve(images);
        };
        reader.readAsDataURL(file, "UTF-8");

        return deferred.promise;

    };
   $scope.submit = function(item){
      $mdDialog.hide(item)
   };

   $scope.cancel = function(){
       $mdDialog.cancel();
   };
});