var bfApp = angular.module('bfApp', ['ui.router', 'ngMaterial', 'ngCookies', 'ap.fotorama', 'ngWig', 'ngMessages']);
bfApp.config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('bfstringsYellow', {
        '50': '#F5BA42',
        '100': 'F5BA42',
        '200': 'F5BA42',
        '300': 'F5BA42',
        '400': 'F5BA42',
        '500': 'F5BA42',
        '600': 'F5BA42',
        '700': 'F5BA42',
        '800': 'F5BA42',
        '900': 'F5BA42',
        'A100': 'F5BA42',
        'A200': 'F5BA42',
        'A400': 'F5BA42',
        'A700': 'F5BA42',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                            // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('bfstringsYellow')
        // If you specify less than all of the keys, it will inherit from the
        // default shades
        .accentPalette('bfstringsYellow', {
            'default': '600' // use shade 200 for default, and keep all other shades the same
        });
});
bfApp.config(function ($provide) {
    $provide.decorator('$uiViewScroll', function ($delegate) {
        return function (uiViewElement) {
            // var top = uiViewElement.getBoundingClientRect().top;
            // window.scrollTo(0, (top - 30));
            // Or some other custom behaviour...
        };
    });
});