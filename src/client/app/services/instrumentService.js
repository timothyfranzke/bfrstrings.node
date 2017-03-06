bfApp.factory("instrumentService", function(inventoryModel){
    var inventoryItems = [];
    return {
        inventory:inventoryItems,
        filterInventory : function(index){
            inventoryModel.inventory.forEach(function(item){
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