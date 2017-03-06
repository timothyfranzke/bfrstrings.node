bfApp.controller('homeController', function($scope, $http, $sce, $mdMedia, inventoryService, eventService, eventModel){
    $scope.config = {};
    var config = {};
    var pages = [];
    var convertDate = function(date){
        var dateSplit = date.split(' ');
        var day = dateSplit[0].split('-');
        var time = dateSplit[1].split(':');

        return new Date(day[0],day[1] - 1,day[2],time[0],time[1]);
    };
    $scope.$mdMedia = $mdMedia;
    $scope.events = eventModel.events;
    var repairRequest = {
        url: 'configuration/repairShop/repairShopConfig.json',
        method: 'GET'
    };
    $http(repairRequest)
        .then(function (data) {
            data.type = 'repairShop';
            repairPage = data;
        });
    var request = {
        url: 'configuration/home/homeConfig.json',
        method: 'GET'
    };

    $scope.options = {
        loop: true,
        autoplay: true,
        width:'1500'
    };
    $scope.images = [];
    for(var i = 1; i <= 4; i++)
    {
        console.log("images : " + i );

        var img = {
            'thumb':'img/slider/' + i + '.jpg',
            'full':'img/slider/' + i + '.jpg',
            'img':'img/slider/' + i + '.jpg',
            'id':i,
            'active':'1'
        };
        console.log(JSON.stringify(img));

        $scope.images.push(img);
    }

    $http(request)
        .then(function (data) {
            console.log(data);
            console.log('cards length' + data.data.cards.length);
            $scope.cards = new Array(data.data.cards.length);
            var pages = [];
            var eventIndex = 0;
            var orderIndex = 0;
            data.data.order.forEach(function(item, index){
               if(!isNaN(parseInt(item)))
               {
                   var id = parseInt(item);
                   inventoryService.getItemById(id).then(function(itemData)
                   {
                       instrumentPage = {
                           "id":id,
                           "header": "Featured Instrument - " + itemData.name,
                           "type": "instrument",
                           "img": "img/inventory/" + id + "/1.png",
                           "action": "#/inventory/" + id,
                           "description":$sce.trustAsHtml(itemData.description),
                           "price":itemData.price
                       };
                       $scope.cards[index] = instrumentPage;
                   });
               }
               if(item === 'event')
               {
                   var eventCard = {};
                   console.log('events length' + JSON.stringify(eventModel.events));
                   if(eventModel.events.length === 0)
                   {
                       eventService.getEvents().then(function(data){
                           eventModel.events = data;
                           if (eventModel.events[eventIndex]!== undefined)
                           {
                               eventCard = {
                                   "header":"Upcoming Event - " + eventModel.events[eventIndex].name,
                                   "type":"event",
                                   "text":[
                                       eventModel.events[eventIndex].description
                                   ],
                                   "img":eventModel.events[eventIndex].url,
                                   "date":convertDate(eventModel.events[eventIndex].startDate),
                                   "action":"#/events"
                               };
                               $scope.cards[index] = eventCard;
                               eventIndex++;
                           }
                       });
                   }
                   else {
                       if (eventModel.events[eventIndex]!== undefined)
                       {
                           eventCard = {
                               "header":"Upcoming Event - " + eventModel.events[eventIndex].name,
                               "type":"event",
                               "text":[
                                   eventModel.events[eventIndex].description
                               ],
                               "img":eventModel.events[eventIndex].url,
                               "date":convertDate(eventModel.events[eventIndex].startDate),
                               "action":"#/events"
                           };
                           $scope.cards[index] = eventCard;
                           eventIndex++;
                       }
                   }
               }
                data.data.cards.forEach(function(card)
               {
                   if(card.name == item)
                   {
                       card.type = 'card';
                       $scope.cards[index] = card;
                   }
               })
            });
        });
});