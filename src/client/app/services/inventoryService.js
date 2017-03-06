bfApp.factory('inventoryService', function ($http, $q, $sce, inventoryModel) {
    var inventory = [];
    var inquiredItem ={};
    return {
        getInventory : function(){
            var time = new Date();
            var defer = $q.defer();
            var request = {
                url: 'php/InventoryService.php?type=all&ts=' + time.getTime(),
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
                    .success(function (data) {
                        data.forEach(function(item){
                            item.trimmedDescription = "";
                            item.trimmedDescription = $sce.trustAsHtml(item.description);
                        });
                        inventory = data;
                        defer.resolve(inventory);
                    })
                    .error(function (data, status) {
                        defer.reject(data);
                    });
            }
            return defer.promise;
        },
        getItemById: function (id) {
            var time = new Date();
            var defer = $q.defer();
            var item = {};
            var request = {
                url: 'php/InventoryService.php?id=' + id + '&ts=' + time.getTime(),
                method: 'GET'
            };
            $http(request)
                .success(function (data) {
                    if (data[0].active == "1") {
                        data[0].active = true;
                    }
                    else {
                        data[0].active = false;
                    }
                    if (data[0].sold == "1") {
                        data[0].sold = true;
                    }
                    else {
                        data[0].sold = false;
                    }
                    //sdata.trimmedDescription = "";
                    //data.trimmedDescription = $sce.trustAsHtml(data.description);
                    data[0].trusted = $sce.trustAsHtml(data[0].description);
                    console.log("InventoryService: getItemById : Success: " + JSON.stringify(data));
                    defer.resolve(data[0]);
                })
                .error(function (data, status) {
                    defer.resolve(data[0]);
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
                url: 'php/InventoryService.php',
                method: 'POST',
                data: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            $http(request)
                .success(function (data) {
                    if (data.length > 0) {
                        item.id = data;
                        all.push(item);
                    }
                    defer.resolve(data);
                })
                .error(function (data, status) {
                    defer.reject(data);
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
