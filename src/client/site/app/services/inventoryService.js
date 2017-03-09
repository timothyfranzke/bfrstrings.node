bfApp.factory('inventoryService', function ($http, $q, $sce, inventoryModel) {
    var inventory = [];
    var inquiredItem ={};
    return {
        getInventory : function(){
            var time = new Date();
            var defer = $q.defer();
            var request = {
                url: 'api/inventory',
                //url: 'inventory/banjos.json',
                method: 'GET'
            };
            if (inventory.length > 0) {
                console.log("returning inventory cache");
                defer.resolve(inventory);
            }
            else {
                console.log("http inventory");
                $http(request)
                    .then(function (res) {
                        res.data.forEach(function(item){
                            item.trimmedDescription = "";
                            item.trimmedDescription = $sce.trustAsHtml(item.description);
                        });
                        inventory = res.data;
                        defer.resolve(inventory);
                    }, function(response){
                        defer.reject(response);
                    })
            }
            return defer.promise;
        },
        getItemById: function (id) {
            var time = new Date();
            var defer = $q.defer();
            var item = {};
            var request = {
                url: 'api/inventory/' + id,
                method: 'GET'
            };
            $http(request)
                .then(function (res) {
                    res.data.trusted = $sce.trustAsHtml(res.data.description);
                    defer.resolve(res.data);
                }, function(response){
                    defer.reject(response);
                });
            return defer.promise;
        },

        setInquiredInstrument: function (item) {
            inquiredItem = item;
        },
        getInquiredItem: function () {
            return inquiredItem;
        },

        modifyInventory: function (item) {
            var defer = $q.defer();
            //var item = {};
            var request = {
                url: 'api/inventory',
                method: 'PUT',
                data: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(request)
                .then(function (data) {
                    if (data.length > 0) {
                        item.id = data;
                        all.push(item);
                    }
                    defer.resolve(data);
                }, function(response){
                    defer.reject(response);
                });
            return defer.promise;
        },
        createImage: function (image) {
            console.log(JSON.stringify(image));
            var defer = $q.defer();
            //var item = {};
            var request = {
                url: 'php/CreateImageService.php',
                method: 'POST',
                data: JSON.stringify(image),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(request)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(data);
                });
            return defer.promise;
        },
        getImage: function (id) {
            var time = new Date();
            var defer = $q.defer();
            var request = {
                url: 'php/GetImageService.php?id=' + id + '&ts=' + time.getTime(),
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(request)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(data);
                });
            return defer.promise;
        },
        getAdminImage: function (id) {
            var time = new Date();
            var defer = $q.defer();
            //var item = {};
            var request = {
                url: 'php/GetImageService.php?admin=true&id=' + id + '&ts=' + time.getTime(),
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(request)
                .success(function (data) {
                    data.forEach(function(item){
                        if (item.active == "1") {
                            item.active = true;
                        }
                        else {
                            item.active = false;
                        }
                    });
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(data);
                });
            return defer.promise;
        },
        updateImage: function (images) {
            var defer = $q.defer();
            //var item = {};
            var request = {
                url: 'php/UpdateImageService.php',
                method: 'POST',
                data: JSON.stringify(images),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(request)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(data);
                });
            return defer.promise;
        },
        filterInventory : function(index){
            inventoryItems.forEach(function(item){
                if (item.type == index)
                {
                    console.log("equals index");
                    console.log(JSON.stringify(item));
                    item.visible = true;
                }
                else {
                    console.log("does not equal index");
                    console.log(JSON.stringify(item));
                    item.visible = false;
                }
            })
        }
    }
});
