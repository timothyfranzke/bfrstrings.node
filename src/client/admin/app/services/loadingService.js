bfAppAdmin.factory('loadingService', function(){
   var loader =false;
   var loadObservers = [];
   return {
       setLoader: function(isLoading){
           loader = isLoading;
           loadObservers.forEach(function(callback){
               callback(loader);
           });
       },
       setLoadObserver: function(callback){
           loadObservers.push(callback);
       }
   }
});