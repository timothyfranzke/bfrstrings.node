bfApp.config(function($urlRouterProvider, $stateProvider, $locationProvider){
    //$locationProvider.html5Mode({
    //    enabled: true
    //});
    $stateProvider
        .state('test',{
            url:'/test',
            templateUrl:'app/partials/test.html',
            controller:'testController'
        })
        .state('home', {
            url: '/',
            templateUrl: 'app/pages/home/home.html',
            controller:'homeController'
        })
        .state('about', {
            url:'/about',
            templateUrl:'app/pages/about/about.html'
        })
        .state('contact', {
            url:'/contact',
            templateUrl:'app/pages/contact/contact.html',
            controller:'contactController'
        })
        .state('events', {
            url: '/events',
            templateUrl: 'app/pages/events/events.html',
            controller: 'eventsController'
        })
        .state('repairShop', {
            url: '/repairShop',
            templateUrl: 'app/pages/repairShop/repairShop.html',
            controller: 'repairShopController'
        })
        .state('ourBrand', {
            url: '/ourBrand',
            templateUrl: 'app/pages/ourBrand/ourBrand.html',
            controller: 'ourBrandController'
        })
        .state('inventory', {
            url: '/inventory',
            templateUrl: 'app/pages/inventory/inventory.html',
            controller: 'inventoryController'
        })
        .state('inventoryItem', {
            url: '/inventory/:id',
            templateUrl: 'app/pages/item/item.html',
            controller: 'itemController'
        })
        .state('admin', {
            url: '/admin',
            templateUrl:"app/partials/admin/admin.html",
            controller:'adminController'
        })
        .state('admin.inventory', {
            url:'/inventory',
            templateUrl:'app/partials/admin/inventory.html',
            controller:'adminController'
        })
        .state('admintItem',{
            url: '/admin/inventory/:id',
            templateUrl: 'app/partials/admin/item.html',
            controller: 'adminItemController'
        })
        .state('admin.image', {
            url:'/image',
            templateUrl: 'app/partials/admin/image.html',
            controller:'imageTestController'
        })
        .state('admin.description', {
            url:'/description',
            templateUrl: 'app/partials/admin/description.html',
            controller:'itemDescriptionController'
        })
        .state('policy', {
            url:'/policy',
            templateUrl: 'app/partials/policy.html'
        });
    $urlRouterProvider.otherwise('/');

});