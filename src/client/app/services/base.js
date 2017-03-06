/**
 * Created by Timothy on 11/22/2015.
 */
bfApp.factory('baseService', function($http, $q){
    var base = 'https://graph.facebook.com';
    var ext = '/v2.5/';
    var MakeRequest = function (request) {
        var defer = $q.defer();
        $http(request)
            .success(function (data) {
                defer.resolve(data);
            })
            .error(function (data, status) {
                defer.reject(data);
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
                url: base + ext + url,
                method: 'POST',
                data: bodyData
            };
            return MakeRequest(request);
        },
        PUT: function(url, id, bodyData){
            var request = {
                url: base + ext + url,
                method: 'PUT',
                data: bodyData
            };
            return MakeRequest(request);
        },
        DELETE: function(url, query){
            var request = {
                url: base + ext + url + query,
                method: 'DELETE'
            };
            return MakeRequest(request);
        },
        GETTOKEN: function(url, query){
            var request = {
                url: base + url + query,
                method: 'GET'
            };
            return MakeRequest(request);
        }
    }
});