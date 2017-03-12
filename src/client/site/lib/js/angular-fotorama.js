/**
 * @author Sufiyan momin
 * @description showing image and videos(sample video, youtube video, vimeo video)
 * for example <div fotorama item="fotoArray" class="fotorama" data-allowfullscreen="true"></div> provide different options refer http://fotorama.io/customize/
 */

angular.module('angular-fotorama', []).directive('fotorama', ['$timeout', '$compile', function ($timeout) {
    return {


        link: function (scope, element, attrs) {
            scope.$watch(attrs.item, function (value) {
                var val = angular.copy(value);
                if (val) {
                    console.log(val)
                    $timeout(function () {
                        var fotoramaKey = [];
                        angular.forEach(val, function (val, key) {
                            var fotoObj = {};

                            if (val.type == 'image') { // it is an image
                                fotoObj.img = val.img;
                                fotoObj.thumb = val.thumb;
                                fotoramaKey.push(fotoObj);
                            } else { // it is  video
                                fotoObj.thumb = val.thumb;
                                fotoObj.caption = val.caption;
                                fotoObj.video = val.url;
                                fotoramaKey.push(fotoObj);
                            }

                        });

                        $(element).fotorama({
                            data:fotoramaKey
                        });
                    });

                }
            }, true);

        }
    };
}]);
