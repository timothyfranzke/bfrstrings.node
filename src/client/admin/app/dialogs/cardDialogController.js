bfAppAdmin.controller('cardDialogController', function($scope, $mdDialog, $sce, $q){
    $scope.holder = {};
    $scope.holder.card = {};
    $scope.holder.image = {};
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
    $scope.featureInstrument = false;
    $scope.$watch('uploadedImage', function(newVal){
        console.log(newVal);
        if(newVal !== undefined){
            $scope.holder.image=newVal;
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

            var MAX_WIDTH = 500;
            var MAX_HEIGHT = 500;
            var width = img.width;
            var height = img.height;

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
            ctx.drawImage(img, 0, 0, width, height);

            images.base64 = {};
            images.base64.full = canvas.toDataURL("image/png");

            deferred.resolve(images);
        };
        reader.readAsDataURL(file, "UTF-8");

        return deferred.promise;

    };

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