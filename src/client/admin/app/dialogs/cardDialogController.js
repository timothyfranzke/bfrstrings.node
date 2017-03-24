bfAppAdmin.controller('cardDialogController', function(cardItem, $scope, $mdDialog, $sce, $q){
    $scope.holder = {};

    $scope.holder.card = {};
    if(cardItem != undefined)
    {
        $scope.holder.card = cardItem;
    }
    $scope.holder.image = {};
    $scope.is = {};
    $scope.is.featuredInstrument = false;
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
    $scope.editingDescription = false;
    $scope.isFeaturedInstrument = false;
    $scope.$watch('uploadedImages', function(newVal){
        if(newVal !== undefined){
            if($scope.holder.images.length > 0)
            {
                console.log("images is geting added!");
                $scope.holder.images.concat(newVal);
            }
            else
            {

                $scope.holder.images = newVal;
            }
            console.log( newVal);
        }
        else{
            $scope.holder.images = [];
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
            console.log(img);
            var canvas = document.createElement("canvas");

            var MAX_WIDTH = 500;
            var MAX_HEIGHT = 500;
            var width = i.width;
            var height = i.height;

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

            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(i, 0, 0, width, height);

            console.log("width" + width + " " + "height" + height);
            console.log(canvas);
            images.base64 = {};
            images.base64.full = i.src;

            deferred.resolve(images);
        };
        reader.readAsDataURL(file, "UTF-8");

        return deferred.promise;

    };
    $scope.$watch('holder.card.date', function(newVal)
    {

    });

    $scope.holder.card.includeOnHome = false;
    $scope.holder.card.page = $scope.pages[1];
    $scope.toggleFeatureInstrument = function(){
        $scope.featureInstrument = !$scope.featureInstrument;
    };
    $scope.editDescription = function(){
        $scope.editingDescription = true;
    };
    $scope.saveDescription = function(descrip){
        $scope.holder.card.description = descrip;
        $scope.descriptionDisplay = $sce.trustAsHtml(descrip);
        $scope.editingDescription = false;
    };

    $scope.submit = function(holder){
        $mdDialog.hide(holder);
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});