bfApp.factory("instrumentService", function(inventoryModel){
    var inventoryItems = [];
    return {
        inventory:inventoryItems,
        filterInventory : function(type){
            inventoryModel.inventory.forEach(function(item){
                if (item.type === type)
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