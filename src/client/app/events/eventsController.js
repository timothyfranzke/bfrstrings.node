bfApp.controller('eventsController', function($scope, eventService){
    eventService.getAccessToken().then(function(accessTokenData){
        var token = accessTokenData.split("=");
        eventService.getFacebookevents(token[1]).then(function(data){
            data.data.forEach(function(item){
                var dateString = item.start_time.replace("T", " ");
                var date = new Date(item.start_time.replace("T", " "));
                var current = new Date();
                item.isActive = date.getTime() >= current.getTime();
                item.date = item.start_time;

                eventService.getEventPhoto(token[1], item.id).then(function(data){
                    item.photo = data.data.url;
                });
                console.log("Time: " + date.getTime());
            });
            $scope.events = data.data;
        })
    })

});