bfAppAdmin.controller('cardDialogController', function(cardItem, $scope, $mdDialog, $sce, $q){
    console.log(cardItem);
    var pages = [
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
    $scope.holder = {};

    $scope.holder.card = {};
    if(!!cardItem._id)
    {
        $scope.holder.card = cardItem;
        if(!!$scope.holder.card.date)
            $scope.holder.card.date = new Date(cardItem.date);
        if(!!$scope.holder.card.expiresOn)
            $scope.holder.card.expiresOn = new Date(cardItem.expiresOn);
        if(cardItem.description === undefined)
            cardItem.description = "";
        else
        {
            $scope.descriptionDisplay = cardItem.description.toString();
            $scope.descrip = cardItem.description.toString();
            cardItem.description = cardItem.description.toString();
        }

    }
    $scope.holder.image = {};
    $scope.is = {};
    $scope.is.featuredInstrument = false;
    $scope.pages = pages;
    $scope.editingDescription = false;
    $scope.isFeaturedInstrument = false;
    $scope.$watch('uploadedImages', function(newVal){
        if(newVal !== undefined){
            if($scope.holder.images.length > 0)
            {
                $scope.holder.images.concat(newVal);
            }
            else
            {
                $scope.holder.images = newVal;
            }
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
            i.src = e.target.result;

        };
        i.onload = function(){
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
            images.base64 = {};
            images.base64.full = i.src;

            deferred.resolve(images);
        };
        reader.readAsDataURL(file, "UTF-8");

        return deferred.promise;

    };

    $scope.holder.card.includeOnHome = false;
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
        console.log(holder);
        $mdDialog.hide(holder);
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});