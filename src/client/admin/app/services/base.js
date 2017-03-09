/**
 * Created by Timothy on 11/22/2015.
 */
bfAppAdmin.factory('baseService', function($http, $q){
    var MakeRequest = function (request) {
        var defer = $q.defer();
        $http(request)
            .then(function (data) {
                defer.resolve(data);
            }, function(response){
                defer.reject(response);
            });
        return defer.promise;
    };
    return {
        GET: function(url, query){
            var request = {
                url: url + query,
                method: 'GET'
            };
            return MakeRequest(request);
        },
        POST: function(url, bodyData){
            var request = {
                url: url,
                method: 'POST',
                data: bodyData
            };
            return MakeRequest(request);
        },
        PUT: function(url, id, bodyData){
            var request = {
                url: url + "/" + id,
                method: 'PUT',
                data: bodyData
            };
            return MakeRequest(request);
        },
        DELETE: function(url, id){
            var request = {
                url: url + "/" + id,
                method: 'DELETE'
            };
            return MakeRequest(request);
        }
    }
});