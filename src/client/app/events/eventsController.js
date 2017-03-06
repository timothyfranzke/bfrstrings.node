bfApp.controller('eventsController', function($scope, eventModel){
    $scope.events = eventModel.events;
});