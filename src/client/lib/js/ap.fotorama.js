'use strict';

angular.module('ap.fotorama', [])

    .value('apFotoramaConfig',{
        //width:'100%', Ð¸ Ð¿Ñ€Ð¾Ñ‡. Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ
        //Ð˜Ð¼ÐµÐ½Ð° Ð¿Ð¾Ð»ÐµÐ¹ Ð² Ñ„Ð¾Ñ‚Ð¾Ñ€Ð°Ð¼Ðµ Ð¸ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ð¸
        id:      'id',      //Ð¸Ð¼Ñ Ð¿Ð¾Ð»Ñ Ñ id ÐºÐ°Ñ€Ñ‚Ð¸Ð½ÐºÐ¸
        thumb:   'thumb',   //Ð¸Ð¼Ñ Ð¿Ð¾Ð»Ñ Ñ Ð¼Ð¸Ð½Ð¸Ð°Ñ‚ÑŽÑ€Ð¾Ð¹
        img:     'img',     //Ð¸Ð¼Ñ Ð¿Ð¾Ð»Ñ Ñ Ð¸Ð·Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸ÐµÐ¼
        full:    'full',    //Ð¸Ð¼Ñ Ð¿Ð¾Ð»Ñ Ñ Ð¾Ñ€Ð¸Ð³Ð¸Ð½Ð°Ð»Ð¾Ð¼
        caption: 'caption', //Ð¸Ð¼Ñ Ñ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ¾Ð¼
        active:  'active',  //ÑƒÐºÐ°Ð·Ð°Ñ‚ÐµÐ»ÑŒ Ð°ÐºÑ‚Ð¸Ð²Ð½Ð¾Ð¹ Ñ„Ð¾Ñ‚ÐºÐ¸
        domain:  '',        //'http://tamtakoe.ru/uploader/' //Ð´Ð»Ñ ÐºÑ€Ð¾ÑÑÐ´Ð¾Ð¼ÐµÐ½Ð½Ñ‹Ñ… Ð·Ð°Ð¿Ñ€Ð¾ÑÐ¾Ð²
        //ÐšÐ¾Ð»Ð±ÐµÐºÐ¸ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹
        show:            null,
        showend:         null,
        fullscreenenter: null,
        fullscreenexit:  null,
        loadvideo:       null,
        unloadvideo:     null,
        stagetap:        null,
        ready:           null,
        error:           null,
        load:            null,
        stopautoplay:    null,
        startautoplay:   null
    })
    .directive('apFotorama', ['apFotoramaConfig', function (apFotoramaConfig) {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {

                var opts = {},
                    collection,
                    events = 'show showend fullscreenenter fullscreenexit loadvideo unloadvideo stagetap ready error load stopautoplay startautoplay'.split(' ');

                angular.extend(opts, apFotoramaConfig);

                element.bind('fotorama:showend', function (e, fotorama, extra) {
                    if (collection !== undefined && typeof scope[attrs.ngModel] === 'object') {
                        //Ð—Ð°Ð¿Ð¸ÑÑ‹Ð²Ð°ÐµÐ¼ Ð°ÐºÑ‚Ð¸Ð²Ð½ÑƒÑŽ Ñ„Ð¾Ñ‚ÐºÑƒ Ð² Ð¼Ð¾Ð´ÐµÐ»ÑŒ
                        setActive(collection.activeIndex);

                        scope.$$phase || scope.$apply(); //ÐÐµ Ð²ÑÐµÐ³Ð´Ð° ÑÑ€Ð°Ð±Ð°Ñ‚Ñ‹Ð²Ð°ÐµÑ‚ Ð² Ð¿ÐµÑ€Ð²Ñ‹Ð¹ Ñ€Ð°Ð·, ÐµÑÐ»Ð¸ Ð±Ñ‹ Ð½Ðµ Ð±Ñ‹Ð»Ð¾ Ð½Ð°Ñ‡Ð°Ð»ÑŒÐ½Ð¾Ð³Ð¾ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡ÐµÐ½Ð¸Ñ Ð½Ð° Ñ„Ð¾Ñ‚ÐºÑƒ
                    }
                });

                //ÐŸÑ€ÐµÐ¾Ð±Ñ€Ð°Ð·Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¼Ð°ÑÑÐ¸Ð²Ð¾Ð² Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð² Ð¼Ð°ÑÑÐ¸Ð²Ñ‹, ÑÐºÐ²Ð¸Ð²Ð°Ð»ÐµÐ½Ñ‚Ð½Ñ‹Ðµ Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½ÐµÐ¼Ñƒ Ð¼Ð°ÑÑÐ¸Ð²Ñƒ Ð¤Ð¾Ñ‚Ð¾Ñ€Ð°Ð¼Ñ‹
                function makeFotoramaArray (res, update) {
                    var n = typeof res === 'object' ? res.length : 0,
                        activeIndex;

                    for (var i = 0, nn = n, arr = [], ci; i < nn; i++) {
                        if (res[i].id !== undefined) {
                            ci = arr.push({}) - 1;
                            arr[ci].id       = res[i][opts.id];
                            arr[ci].thumb    = res[i][opts.thumb] !== undefined ? opts.domain + res[i][opts.thumb] : res[i][opts.thumb];
                            arr[ci].img      = res[i][opts.img]   !== undefined ? opts.domain + res[i][opts.img]   : res[i][opts.thumb];
                            arr[ci].full     = res[i][opts.full]  !== undefined ? opts.domain + res[i][opts.full]  : res[i][opts.thumb];
                            arr[ci].html     = res[i][opts.html];
                            arr[ci].caption  = res[i][opts.caption];

                            if (res[ci][opts.active]) activeIndex = ci;

                            if (update && collection.data) collection.splice(i, 1, arr[i]);

                        } else {
                            n--;
                        }
                    }
                    return {arr: arr, arrLength: n, activeIndex: activeIndex}
                }

                function setActive (index) {
                    index = index === undefined && this !== undefined && this.$index !== undefined ? this.$index : index;

                    for (var i = 0, n = scope[attrs.ngModel].length; i < n; i++) {
                        scope[attrs.ngModel][i][opts.active] = index == i ? true : false;
                    }
                }
                scope.setActive = setActive;

                scope.$watch(attrs.ngModel, function (newVal, oldVal) {

                    //Ð•ÑÐ»Ð¸ Ð¼Ð¾Ð´ÐµÐ»ÑŒ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ð»Ð°ÑÑŒ, ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð¸Ñ€ÑƒÐµÐ¼ Ñ Ð½ÐµÐ¹ Ð¤Ð¾Ñ‚Ð¾Ñ€Ð°Ð¼Ñƒ
                    if (oldVal !== newVal) {

                        var oKeys = {}, nKeys = {}, i, oi, temp;

                        var oArr           = collection.data ? collection.data : [];
                        var o              = oArr.length,
                            oldActiveIndex = collection.activeIndex;

                        temp = makeFotoramaArray(newVal);
                        var nArr        = temp.arr,
                            n           = temp.arrLength,
                            activeIndex = temp.activeIndex;

                        if (o) {

                            //ÐÐ»Ð³Ð¾Ñ€Ð¸Ñ‚Ð¼ Ð¿Ñ€ÐµÐ¾Ð±Ñ€Ð°Ð·Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¼Ð°ÑÑÐ¸Ð²Ð° Ñ„Ð¾Ñ‚Ð¾Ð³Ñ€Ð°Ñ„Ð¸Ð¹ Ð² ÑÐ¾Ð¾Ñ‚Ð²ÐµÑ‚ÑÑ‚Ð²Ð¸Ð¸ Ñ Ð¼Ð¾Ð´ÐµÐ»ÑŒÑŽ Ñ Ð¼Ð¸Ð½Ð¸Ð¼Ð°Ð»ÑŒÐ½Ñ‹Ð¼ ÐºÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾Ð¼ Ð¿ÐµÑ€ÐµÑÑ‚Ð°Ð½Ð¾Ð²Ð¾Ðº. http://plnkr.co/edit/clW0aVqzaisUkUo44EOL?p=preview
                            for (i = 0; i < o; i++) {
                                oKeys[oArr[i].id] = i;
                            }
                            for (i = 0; i < n; i++) {
                                nKeys[nArr[i].id] = i;
                            }
                            for (i = 0, oi = 0; i < n; i++, oi++) {

                                if (oArr[oi] === undefined) oArr[oi] = {id: null};

                                if (nArr[i].id !== oArr[oi].id) {

                                    //Ð”Ð¾Ð±Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð½Ð¾Ð²Ð¾Ð³Ð¾ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ð°  
                                    if (oKeys[nArr[i].id] === undefined) {

                                        collection.splice(i, 0, nArr[i]);
                                        oi--;
                                        //console.log('+add')
                                    }

                                    //Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ð°
                                    if (oi >= 0 && nKeys[oArr[oi].id] === undefined) {

                                        if (oldActiveIndex == oi && activeIndex === undefined) activeIndex = i !== n ? i : i-2; //Ð¼ÐµÐ½ÑÐµÐ¼ Ð°ÐºÑ‚Ð¸Ð²Ð½ÑƒÑŽ Ñ„Ð¾Ñ‚ÐºÑƒ, ÐµÑÐ»Ð¸ Ð¾Ð½Ð° Ð±Ñ‹Ð»Ð° ÑƒÐ´Ð°Ð»ÐµÐ½Ð°, Ð½Ð° ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÑƒÑŽ/Ð¿Ñ€ÐµÐ´Ñ‹Ð´ÑƒÑ‰ÑƒÑŽ
                                        collection.splice(i, 1);
                                        i--;
                                        //console.log('-del')
                                    }

                                    //Ð¡Ð¼ÐµÐ½Ð° Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ð¸
                                    if (i >= 0 && oKeys[nArr[i].id] !== undefined && nKeys[oArr[oi].id] !== undefined) {

                                        if ((oKeys[nArr[i].id] - oKeys[oArr[oi].id]) > (nKeys[oArr[oi].id] - nKeys[nArr[i].id])) {

                                            collection.splice(i, 0, nArr[i]);
                                            delete nKeys[nArr[i].id];
                                            oi--;
                                            //console.log('add')
                                        } else {

                                            collection.splice(i, 1);
                                            delete oKeys[oArr[oi].id];
                                            i--;
                                            //console.log('del')
                                        }
                                    }
                                } else if (nArr[i].img !== oArr[oi].img) {

                                    //Ð—Ð°Ð¼ÐµÐ½Ð° ÐºÐ°Ñ€Ñ‚Ð¸Ð½ÐºÐ¸
                                    collection.splice(i, 1, nArr[i]);
                                    //console.log('change')
                                }
                            }

                            //Ð£Ð´Ð°Ð»ÑÐµÐ¼ Ð¾ÑÑ‚Ð°Ð²ÑˆÐ¸ÐµÑÑ Ð² ÐºÐ¾Ð½Ñ†Ðµ ÑÐ»ÐµÐ¼ÐµÐ½Ñ‚Ñ‹ Ð¸ Ð¼ÐµÐ½ÑÐµÐ¼ Ð°ÐºÑ‚Ð¸Ð²Ð½ÑƒÑŽ Ñ„Ð¾Ñ‚ÐºÑƒ, ÐµÑÐ»Ð¸ Ð¾Ð½Ð° Ð±Ñ‹Ð»Ð° ÑƒÐ´Ð°Ð»ÐµÐ½Ð°, Ð½Ð° Ð¿Ñ€ÐµÐ´Ñ‹Ð´ÑƒÑ‰ÑƒÑŽ
                            if (o > oi) collection.splice(n, o-(oi));
                            if (oldActiveIndex >= n && activeIndex === undefined) activeIndex = n-1;

                        } else if (n) {
                            //Ð•ÑÐ»Ð¸ Ñ„Ð¾Ñ‚Ð¾Ðº Ð½Ðµ Ð±Ñ‹Ð»Ð¾, Ñ‚Ð¾ Ð¸Ð½Ð¸Ñ†Ð¸Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐµÐ¼ Ñ„Ð¾Ñ‚Ð¾Ñ€Ð°Ð¼Ñƒ Ð·Ð°Ð½Ð¾Ð²Ð¾ Ð¸ Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸, Ñ‚.Ðº. Ð¾Ð½Ð¸ ÑÐ±Ñ€Ð°ÑÑ‹Ð²Ð°ÑŽÑ‚ÑÑ
                            collection.setOptions(opts).load(nArr).setOptions(scope[attrs.apFotorama]);
                            //console.log('load data')
                        }

                        //ÐŸÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°ÐµÐ¼ÑÑ Ð½Ð° Ð°ÐºÑ‚Ð¸Ð²Ð½ÑƒÑŽ Ñ„Ð¾Ñ‚ÐºÑƒ
                        if (n) activeIndex !== undefined ? collection.show(activeIndex) : collection.show(0);
                    }

                }, true);

                //Ð¡Ð¼Ð¾Ñ‚Ñ€Ð¸Ð¼ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ðµ Ð½Ð°ÑÑ‚Ñ€Ð¾ÐµÐº
                scope.$watch(attrs.apFotorama, function (newVal, oldVal) {
                    angular.extend(opts, apFotoramaConfig, newVal);
                    collection.setOptions(opts)

                    //Ð£ÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÐ¼ ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ñ
                    //TODO: Ð£Ð½Ð¸Ñ‡Ñ‚Ð¾Ð¶ÐµÐ½Ð¸Ðµ ÑÑ‚Ð°Ñ€Ñ‹Ñ… ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹
                    angular.forEach(events, function (event) {
                        if (typeof opts[event] === 'function') {
                            element.bind('fotorama:' + event, function (e, fotorama, extra) {
                                opts[event](e, extra);
                            });
                        }
                    });

                    if (newVal.thumb || newVal.img || newVal.full) {
                        //ÐžÐ±Ð½Ð¾Ð²Ð»ÑÐµÐ¼ Ñ„Ð¾Ñ‚Ð¾Ñ€Ð°Ð¼Ñƒ, ÐµÑÐ»Ð¸ Ð¿Ð¾Ð¼ÐµÐ½ÑÐ»Ð¸ÑÑŒ Ð¸Ð¼ÐµÐ½Ð° ÐºÐ°Ñ€Ñ‚Ð¸Ð½Ð¾Ðº
                        makeFotoramaArray(scope[attrs.ngModel], true);
                    }
                    //collection.setOptions(newVal);
                }, true);

                // Ð¡Ð¾Ð·Ð´Ð°ÐµÐ¼ Ñ„Ð¾Ñ‚Ð¾Ñ€Ð°Ð¼Ñƒ
                collection = element.fotorama(opts).data('fotorama');

                //ÐšÐ¾Ð¿Ð¸Ñ€ÑƒÐµÐ¼ Ð² Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ñ Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ
                scope[attrs.apFotorama] = angular.extend({}, collection.options, scope[attrs.apFotorama]);
            }
        };
    }
    ]);