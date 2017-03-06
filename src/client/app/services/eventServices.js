bfApp.factory('eventService', function($http, $q, baseService){
    return {
        getEvents: function(){
            var url = 'php/Events.php';
            var query = "?";
            return baseService.GET(url, query);
        },
        getAccessToken: function(){
            var url = oath + accessTokenRequest;
            return baseService.GETTOKEN(oath, accessTokenRequest);
        },
        getEventPhoto: function(accessToken, eventId){
            var url = eventId +"/picture";
            var query = "?access_token=" + accessToken + "&redirect=false&type=large";
            return baseService.GET(url, query);
        }
    }
})