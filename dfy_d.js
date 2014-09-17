// JS library
// by @psyonline ( http://www.psyonline.kr/, majorartist@gmail.com )
var D = (function() {

    'use strict';

    var

    //for create element & test
    div = document.createElement('div'),

        //regular expressions
        expint = /^-?[0-9\.]+$/,
        expiscolor = /color/i,
        expisbody = /body/i,
        exprgb = /rgba?\(/,
        expgetrgb = /rgba?\(([0-9]+), *([0-9]+), *([0-9]+)/,
        exptags = /<[^<]+>/ig,
        exptrimspace = /(^ +| +$)/g,
        expqueries = /([^=&]+)=?([^=&]*)/g,

        iselement = function(target) {
            return target && target.nodeType !== undefined && target.nodeType == 1;
        },

        //create element
        create = function(tagname, option, addto) {
            var attribute, tag;
            if (iselement(option)) {
                addto = option;
                option = '';
            }
            if ((/^</).test(tagname)) {
                div.innerHTML = tagname;
                tag = div.children[0].cloneNode(true);
            } else {
                tag = document.createElement(tagname);
            }
            for (attribute in option) {
                tag.setAttribute(attribute, option[attribute]);
            }
            (iselement(addto)) && addto.appendChild(tag);
            return tag;
        },

        //Sizzle js
        find = function(selector, context) {
            var elements, queryselect, i, max;
            if (iselement(selector)) {
                return [selector];
            } else if ((/^</).test(selector)) {
                return [create(selector, context)];
            } else if (typeof(selector) == 'string') {
                return Sizzle(selector, context);
                /*
// querySelector를 이용하면 '>' 로 시작하는 셀렉터를 쓸 수가 없음..
elements = [];
if ( (/^ *\>/).test(selector) ) {
selector = ':scope '+selector;
}
console.log(context, (context || document).querySelectorAll, selector, elements);
queryselect = (context || document).querySelectorAll(selector);
for ( i = 0, max = queryselect.length; i < max; i++ ) {
elements.push(queryselect[i]);
}
return elements;
*/
            } else if (selector.bind && selector.each && selector.length) {
                elements = [];
                selector.each(function() {
                    elements.push(this);
                });
                return elements;
            }
            return false;
        },

        //get timestamp
        gettime = function() {
            return new Date().getTime();
        },

        //browser & support
        browser = function() {

            var
            ua = navigator.userAgent,
                ie = ua.match(/(?:msie ([0-9]+)|rv:([0-9\.]+)\) like gecko)/i),

                prefix = ['Webkit', 'Moz', 'O', 'ms'],
                transition = 'transition',
                transform = 'transform',
                requestanimationframe = 'requestAnimationFrame',
                cancelanimationframe = 'CancelAnimationFrame',

                transforms = {
                    translate3d: 'translate3d(0px, 0px, 0px)',
                    translate: 'translate(0px, 0px)',
                    scale3d: 'scale3d(1, 1, 1)',
                    scale: 'scale(1, 1)'
                },

                video = document.createElement('video'),

                b, i, version, support;

            div.style.opacity = '.1';

            b = {
                firefox: (/firefox/i).test(ua),
                webkit: (/applewebkit/i).test(ua),
                chrome: (/chrome/i).test(ua),
                opera: (/opera/i).test(ua),
                ios: (/ip(ad|hone|od)/i).test(ua),
                android: (/android/i).test(ua)
            };
            b.safari = b.webkit && !b.chrome;
            // b.mobile = document.hasOwnProperty && document.hasOwnProperty('ontouchstart') && ( b.ios || b.android );
            b.mobile = document.ontouchstart !== undefined && (b.ios || b.android);

            b.os = (navigator.appVersion).match(/(mac|win|linux)/i);
            b.os = (b.os) ? b.os[1].toLowerCase() : '';

            support = {
                storage: window.localStorage !== undefined,
                svgimage: true,
                backgroundsize: true,
                columnlayout: true,
                mediaquery: typeof(window.matchMedia) == 'function',
                mouseenterleave: false, // 'mouseenter' in div,
                opacity: (/^0/).test(div.style.opacity),
                placeholder: 'placeholder' in document.createElement('input'),
                pushstate: (history.pushState) ? true : false,
                requestanimationframe: false,
                canvas: (document.createElement('canvas').getContext) ? true : false,
                video: (video.canPlayType) ? true : false
            };

            if (support.video) {
                // console.log('h264', video.canPlayType('video/mp4; codecs="avc1.42E01E"'))
                // console.log('ogg', video.canPlayType('video/ogg; codecs="theora"'))
                // console.log('webm', video.canPlayType('video/webm; codecs="vp8, vorbis"'))
            }

            if (b.ios || b.android) {
                version = ua.match(/applewebkit\/([0-9.]+)/i);
                if (version && version.length > 1) {
                    b.webkitversion = version[1];
                }
                if (b.ios) {
                    version = ua.match(/version\/([0-9.]+)/i);
                    if (version && version.length > 1) {
                        b.ios = version[1];
                    }
                } else if (b.android) {
                    version = ua.match(/android ([0-9.]+)/i);
                    if (version && version.length > 1) {
                        b.android = version = version[1];
                        if (3 > parseInt(version)) {
                            support.svgimage = false;
                        }
                    }
                }
            } else if (ie) {
                b.ie = parseInt(ie[1] || ie[2]);
                support.mouseenterleave = true;
                if (9 > b.ie) {
                    support.svgimage = false;
                    support.backgroundsize = false;
                }
                if (10 > b.ie) {
                    support.columnlayout = false;
                }
            }

            // check support transform
            if (div.style[transform]) {
                support.transform = transform;
            } else {
                transform = 'Transform';
                for (i = 0; i < 4; i++) {
                    if (div.style[prefix[i] + transform] !== undefined) {
                        support.transform = prefix[i] + transform;
                        break;
                    }
                }
            }
            if (support.transform) {
                transform = support.transform;
                for (i in transforms) {
                    div.style[transform] = '';
                    div.style[transform] = transforms[i];
                    support[i] = div.style[transform];
                }
                if (b.ie && 10 > b.ie) {
                    support.scale3d = support.scale = false;
                }
            }

            // check support transition
            if (div.style[transition]) {
                support.transition = transition;
            } else {
                transition = 'Transition';
                for (i = 0; i < 4; i++) {
                    if (div.style[prefix[i] + transition] !== undefined) {
                        support.transition = prefix[i] + transition;
                        break;
                    }
                }
            }

            // check support request animation frame
            if (window[requestanimationframe]) {
                support.requestanimationframe = true;
            } else {
                requestanimationframe = 'RequestAnimationFrame';
                for (i = 0; i < 4; i++) {
                    if (window[prefix[i] + requestanimationframe] !== undefined) {
                        window.requestAnimationFrame = window[prefix[i] + requestanimationframe];
                        window.cancelAnimationFrame = window[prefix[i] + cancelanimationframe];
                        support.requestanimationframe = true;
                        break;
                    }
                }
            }
            //referrence - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
            if (!support.requestanimationframe) {
                window.requestAnimationFrame = (function() {
                    var lasttime = 0;
                    return function(callback) {
                        var currenttime = gettime();
                        var timetocall = Math.max(0, 16 - (currenttime - lasttime));
                        lasttime = currenttime + timetocall;
                        return setTimeout(function() {
                            callback(currenttime + timetocall);
                        }, timetocall);
                    }
                })();
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                }
            }

            b.support = support;

            return b;

        }(),

        //css class add, remove, has
        classname = (function() {

            var i, max;

            function set(flag, target, name) {
                var base = (' ' + target.className + ' ').replace(new RegExp(' ' + name + ' ', 'g'), ' ');
                target.className = D.trim(((flag == 'add') ? base + ' ' + name : base).replace(/ +/g, ' '));
            }

            return {
                add: function(target) {
                    for (i = 1, max = arguments.length; i < max; i++) {
                        set('add', target, arguments[i]);
                    }
                },
                remove: function(target) {
                    for (i = 1, max = arguments.length; i < max; i++) {
                        set('remove', target, arguments[i]);
                    }
                },
                has: function(target, name) {
                    return (' ' + target.className + ' ').indexOf(' ' + name + ' ') != -1;
                },
                decide: function(target, name, _boolean) {
                    this[(_boolean) ? 'add' : 'remove'](target, name);
                }
            };

        })(),

        //style get, set
        style = (function() {

            var support = browser.support,
                supporttransform = support.transform,
                transforms = ['translate3d', 'translate', 'scale3d', 'scale', 'rotate', 'rotateX', 'rotateY', 'rotateZ'],
                nex = '[e0-9\-\.]+',
                pxex = '(?:px)?',
                vex = '(?:(?:px|deg))?',
                xyzex = /(X|Y|Z)$/,
                //[ get, set x, set y, set z ]
                expressions = {
                    isxyztarget: /^(scale|scale3d|translate|translate3d)$/,
                    nopx: /(zIndex)/
                },
                is3dtransform = /3d/,
                istranslate = /^translate/,
                isscale = /^scale/,
                isrotate = /^rotate/,
                isx = /X$/,
                isy = /Y$/,
                isstupidbrowser = browser.ie == 9,
                i = 0,
                max = transforms.length;

            for (; i < max; i++) {
                expressions[transforms[i]] = [
                    new RegExp(transforms[i] + '\\((' + nex + ')' + vex + '(?:, (' + nex + ')' + vex + '(?:, (' + nex + ')' + vex + ')?)?'),
                    new RegExp('(' + transforms[i] + '\\()' + nex + vex)
                ];
                if (!isrotate.test(transforms[i])) {
                    expressions[transforms[i]][2] = new RegExp('(' + transforms[i] + '\\(' + nex + vex + ', )' + nex + vex),
                    expressions[transforms[i]][3] = new RegExp('(' + transforms[i] + '\\(' + nex + vex + ', ' + nex + vex + ', )' + nex + vex);
                }
            }

            function istransform(property) {
                property = css3(property);
                if ((/^(matrix|translate|scale|rotate|skew|perspective)/).test(property)) {
                    return true;
                }
                return false;
            }

            function isxyztarget(property) {
                var check = property.match(expressions.isxyztarget);
                return (check) ? check[1] : false;
            }

            function css3(property) {
                if (istranslate.test(property)) {
                    if (!support.translate) {
                        return (/X$/).test(property) ? 'left' : 'top';
                    } else if (is3dtransform.test(property) && !support.translate3d) {
                        return property.replace('3d', '');
                    }
                } else if (isscale.test(property)) {
                    if (is3dtransform.test(property) && !support.scale3d) {
                        return property.replace('3d', '');
                    }
                }
                return property;
            }

            function ie9scale(target, property, value) {
                var temp = target.style[supporttransform].match(expressions.scale[0]),
                    x, y;
                if (!temp) { //get only
                    return 1;
                } else {
                    x = parseFloat(temp[1]);
                    y = (temp[2] !== undefined) ? parseFloat(temp[2]) : x;
                    if (value !== undefined) { //set
                        if (isx.test(property)) {
                            x = value;
                        } else {
                            y = value;
                        }
                        target.style[supporttransform] = target.style[supporttransform].replace(expressions.scale[0], 'scale(' + x + ', ' + y);
                    } else { //get
                        return (isx.test(property)) ? x : y;
                    }
                }
            }

            function get(target, property) {
                var rv, transform, xyz;
                property = css3(property);
                if (istransform(property)) {
                    xyz = isxyztarget(property);
                    if (xyz) {
                        return get(target, xyz + 'X');
                    }
                    transform = property;
                    property = supporttransform;
                }
                if (property == 'opacity' && !support.opacity) {
                    property = 'filter';
                } else if (property == 'scrollTop') {
                    return target.scrollTop;
                }
                rv = (target) ? (!target.style) ? target[property] :
                    (target.style[property]) ? target.style[property] :
                    (target.currentStyle) ? target.currentStyle[property] :
                    document.defaultView.getComputedStyle(target, null)[property] : 0;
                if (transform && supporttransform) {
                    xyz = transform.match(xyzex);
                    xyz = (xyz) ? xyz[0] : '';
                    if (isrotate.test(transform)) {
                        rv = rv.match(expressions[transform][0]);
                        return (!rv) ? 0 : parseFloat(rv[1]);
                    } else if (isstupidbrowser && isscale.test(transform)) {
                        return ie9scale(target, transform);
                    } else {
                        rv = rv.match(expressions[transform.replace(xyzex, '')][0]);
                        return (!rv) ? (isscale.test(transform)) ? 1 : 0 : parseFloat(rv[(xyz == 'X') ? 1 : (xyz == 'Y') ? 2 : 3]);
                    }
                }
                if (property == 'opacity') {
                    return parseFloat(rv);
                }
                if (property == 'filter') {
                    rv = rv.match(/alpha *\( *opacity *[=:] *([0-9\.]+) *\)/i);
                    rv = (rv) ? parseFloat(rv[1]) : 1;
                    return (rv || rv === 0) ? rv / 100 : 1;
                }
                return (rv == 'auto') ? 0 : ((/(pt|px)$/).test(rv)) ? parseInt(rv) : rv;
            }

            function set(target, property, value) {
                var i, transform, xyz;
                if (typeof(property) == 'object') {
                    for (i in property) {
                        style.set(target, i, property[i]);
                    }
                    return;
                }
                if (value !== undefined) {
                    if (!target.style) {
                        target[property] = value;
                    } else {
                        property = css3(property);
                        if (istransform(property) && supporttransform) {
                            xyz = isxyztarget(property);
                            if (xyz) {
                                set(target, xyz + 'X', value);
                                set(target, xyz + 'Y', value);
                                set(target, xyz + 'Z', value);
                                return;
                            }
                            if (isrotate.test(property)) {
                                if (!expressions[property][0].test(target.style[supporttransform])) {
                                    target.style[supporttransform] += property + '(0)';
                                }
                                target.style[supporttransform] = target.style[supporttransform].replace(expressions[property][1], '$1' + value + 'deg');
                            } else {
                                transform = property.replace(xyzex, '');
                                if (!expressions[transform][0].test(target.style[supporttransform])) {
                                    target.style[supporttransform] += support[transform];
                                }
                                if (isstupidbrowser && isscale.test(property)) {
                                    ie9scale(target, property, value);
                                } else {
                                    target.style[supporttransform] = target.style[supporttransform].replace(
                                        expressions[transform][isx.test(property) ? 1 : isy.test(property) ? 2 : 3],
                                        '$1' + value + (isscale.test(transform) ? '' : 'px')
                                    );
                                }
                            }
                        } else if (property == 'opacity') {
                            if (!support.opacity) {
                                target.style.filter = (value === '') ? '' : 'alpha(opacity=' + (value * 100) + ')';
                            } else {
                                target.style.opacity = value;
                            }
                        } else if (property == 'scrollTop') {
                            target.scrollTop = value;
                        } else {
                            try {
                                target.style[property] = (value && !isNaN(value) && !expressions.nopx.test(property)) ? value + 'px' : value;
                            } catch (e) {
                                console.log(e.message + '(' + target + ' : id="' + target.id + '", class="' + target.className + '", property="' + property + '", value : "' + value + '")');
                            }

                        }
                    }
                }
            }

            return {
                get: get,
                set: set,
                istransform: istransform
            };

        })(),

        //browser scroll target for get scroll values
        scrolltarget = (browser.webkit) ? document.body : document.documentElement,

        event = (function() {

            var addedevents = [],
                supportmouseenterleave = browser.support.mouseenterleave,
                typeinmobile = {
                    mouseenter: 'touchstart',
                    mouseover: 'touchstart',
                    mousedown: 'touchstart',
                    mouseleave: 'touchend',
                    mouseout: 'touchend',
                    mouseup: 'touchend',
                    mousemove: 'touchmove'
                };

            function localtype(type) {
                if (browser.mobile && typeinmobile[type]) {
                    return typeinmobile[type];
                } else if (browser.firefox && type == 'mousewheel') {
                    return 'DOMMouseScroll';
                }
                return type;
            }

            function add(target, type, callback, id) {
                var _type, _callback;
                if (typeof(type) != 'string') {
                    for (_type in type) {
                        add(target, _type, type[_type], callback); // callback = id
                    }
                    return;
                }
                _callback = callback;
                id = id || '';
                if ((type == 'mouseenter' || type == 'mouseleave') && !supportmouseenterleave) {
                    type = (type == 'mouseenter') ? 'mouseover' : 'mouseout';
                    callback = enterleave(callback);
                }
                type = localtype(type);
                if (target.addEventListener) {
                    target.addEventListener(type, callback, false);
                } else {
                    target[type + id + callback] = function() {
                        callback.call(target, window.event);
                    }
                    target.attachEvent('on' + type, target[type + id + callback]);
                }
                // 140916 remove save added target&events and D.event.has function for problem with memory leak :(
                // addedevents[addedevents.length] = { target:target, type:type, callback:callback, id:id, _cb:_callback };
            }

            function enterleave(callback) {
                return function(e) {
                    var i, newevent, rtarget = e.relatedTarget;
                    if (this !== rtarget) {
                        while (rtarget && this !== rtarget) {
                            rtarget = rtarget.parentNode;
                        }
                        if (this !== rtarget) {
                            newevent = {
                                type: (e.type == 'mouseover') ? 'mouseenter' : 'mouseleave'
                            };
                            for (i in e) {
                                if (i != 'type' && i != 'returnValue') {
                                    newevent[i] = e[i];
                                }
                            }
                            if (callback) {
                                callback.call(this, newevent);
                            }
                        }
                    }
                };
            }

            function has(target, type, callback, id) {
                if ((type == 'mouseenter' || type == 'mouseleave') && !supportmouseenterleave) {
                    type = (type == 'mouseenter') ? 'mouseover' : 'mouseout';
                }
                return check(target, type, callback, id || '');
            }

            function remove(target, type, callback, id) {
                var _type, _callback;
                if (typeof(type) != 'string') {
                    for (_type in type) {
                        remove(target, _type, type[_type], callback); // callback = id
                    }
                    return;
                }
                if ((type == 'mouseenter' || type == 'mouseleave') && !supportmouseenterleave) {
                    type = (type == 'mouseenter') ? 'mouseover' : 'mouseout';
                    callback = getoriginalcallback(callback);
                }
                id = id || '';
                type = localtype(type);
                if (target.removeEventListener) {
                    target.removeEventListener(type, callback, false);
                } else {
                    if (target[type + id + callback]) {
                        target.detachEvent('on' + type, target[type + id + callback]);
                        target[type + id + callback] = null;
                    }
                }
                check(target, type, callback, id, true);
            }

            //get original callback function for remove mouseenter/leave event

            function getoriginalcallback(callback) {
                var i = 0,
                    max = addedevents.length;
                for (; i < max; i++) {
                    if (addedevents[i]._cb == callback) {
                        return addedevents[i].callback;
                    }
                }
            }

            function check(target, type, callback, id, _remove) {
                var i = 0,
                    max = addedevents.length;
                type = localtype(type);
                for (; i < max; i++) {
                    if (
                        target == addedevents[i].target &&
                        type == addedevents[i].type &&
                        callback == addedevents[i]._cb &&
                        id == addedevents[i].id
                    ) {
                        if (_remove) {
                            addedevents.splice(i, 1);
                            max--;
                            i--;
                        } else {
                            return true;
                        }
                    }
                }
                return false;
            }

            function cancel(e) {
                if (e && typeof(e) == 'object') {
                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }
                }
                return false;
            }

            function getpoint(e) {
                return (browser.mobile) ? [
                    (e.touches[0]) ? e.touches[0].pageX : e.changedTouches[0].pageX, (e.touches[0]) ? e.touches[0].pageY : e.changedTouches[0].pageY
                ] : [e.clientX, e.clientY];
            }

            return {
                add: add,
                has: has,
                remove: remove,
                cancel: cancel,
                getpoint: getpoint
            };

        })(),


        each = function(target, callback) {

            var i = 0,
                max = target.length;

            if (!max && max !== 0) {
                return;
            }

            for (; i < max; i++) {
                callback.call(target[i]);
            }

        },


        fill = function(target, boxwidth, boxheight, targetwidth, targetheight) {

            var rate, newwidth, newheight;

            rate = (targetwidth > targetheight) ? boxheight / targetheight : boxwidth / targetwidth;
            rate = (boxheight > Math.round(targetheight * rate)) ? boxheight / targetheight : (boxwidth > targetwidth * rate) ? boxwidth / targetwidth : rate;

            newwidth = Math.max(boxwidth, Math.round(targetwidth * rate));
            newheight = Math.max(boxheight, Math.round(targetheight * rate));

            style.set(target, {
                width: newwidth,
                height: newheight,
                marginLeft: (boxwidth - newwidth) / 2,
                marginTop: (boxheight - newheight) / 2
            });

        },


        //image
        image = (function() {

            function load(src, callback) {

                var image = new Image();
                image.src = (src.nodeType == 1) ? src.src : src;

                if (image.complete) {
                    callback.call(image);
                } else {
                    event.add(image, 'load', function() {
                        callback.call(this);
                    });
                }

            }

            function fillimage(image, width, height, imgwidth, imgheight) {

                var rate, newwidth, newheight;

                if (!imgwidth || !imgheight) {
                    load(image.src, function() {
                        fill(image, width, height, this.width, this.height);
                    });
                    return;
                }

                fill(image, width, height, imgwidth, imgheight);

            }

            return {
                load: load,
                fill: fillimage
            };

        })(),

        color = {

            getcode: function(target, property) {
                return this.tohex.apply(null, this.torgb(target, property, style.get(target, property)));
            },

            torgb: function(target, property, v) {

                var temp;

                if (v == 'transparent' || v == 'rgba(0, 0, 0, 0)') {
                    while (!expisbody.test(target.nodeName)) {
                        target = target.parentNode;
                        temp = style.get(target, property);
                        if (temp != 'transparent' && temp != 'rgba(0, 0, 0, 0)') {
                            return this.torgb(target, property, temp);
                        }
                    }
                    return [255, 255, 255];
                } else if (v.match(exprgb)) {
                    v = v.match(expgetrgb);
                    return [parseInt(v[1]), parseInt(v[2]), parseInt(v[3])];
                } else {
                    //#cccccc
                    if (v.length > 5) {
                        v = [v.substr(1, 2), v.substr(3, 2), v.substr(5, 2)];
                        //#ccc
                    } else {
                        v = [v.substr(1, 1), v.substr(2, 1), v.substr(3, 1)];
                        v = [v[0] + v[0], v[1] + v[1], v[2] + v[2]];
                    }
                    return [
                        parseInt((eval('0x' + v[0])).toString(10)),
                        parseInt((eval('0x' + v[1])).toString(10)),
                        parseInt((eval('0x' + v[2])).toString(10))
                    ];
                }

            },

            tohex: function() {
                var temp, i = 0,
                    rv = '';
                for (; i < 3; i++) {
                    temp = Math.max(Math.min(255, arguments[i]), 0).toString(16);
                    rv += (2 > temp.length) ? '0' + temp : temp;
                }
                return '#' + rv;
            }

        },

        //Convert to JS from "Robert Penner's Easing Equations".
        //http://robertpenner.com/easing/
        easings = {
            linear: function(t, b, c, d) {
                return c * t / d + b;
            },
            easeInQuad: function(t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOutQuad: function(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOutQuad: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },
            easeOutInQuad: function(t, b, c, d) {
                if (t < d / 2) return easings.easeOutQuad(t * 2, b, c / 2, d);
                return easings.easeInQuad((t * 2) - d, b + c / 2, c / 2, d);
            },
            easeInCubic: function(t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOutCubic: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOutCubic: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            },
            easeOutInCubic: function(t, b, c, d) {
                if (t < d / 2) return easings.easeOutCubic(t * 2, b, c / 2, d);
                return easings.easeInCubic((t * 2) - d, b + c / 2, c / 2, d);
            },
            easeInQuart: function(t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOutQuart: function(t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOutQuart: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },
            easeOutInQuart: function(t, b, c, d) {
                if (t < d / 2) return easings.easeOutQuart(t * 2, b, c / 2, d);
                return easings.easeInQuart((t * 2) - d, b + c / 2, c / 2, d);
            },
            easeInQuint: function(t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOutQuint: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOutQuint: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            },
            easeOutInQuint: function(t, b, c, d) {
                if (t < d / 2) return easings.easeOutQuint(t * 2, b, c / 2, d);
                return easings.easeInQuint((t * 2) - d, b + c / 2, c / 2, d);
            },
            easeInSine: function(t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOutSine: function(t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOutSine: function(t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            },
            easeOutInSine: function(t, b, c, d) {
                if (t < d / 2) return easings.easeOutSine(t * 2, b, c / 2, d);
                return easings.easeInSine((t * 2) - d, b + c / 2, c / 2, d);
            },
            easeInExpo: function(t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
            },
            easeOutExpo: function(t, b, c, d) {
                return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOutExpo: function(t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
                return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeOutInExpo: function(t, b, c, d) {
                if (t < d / 2) return easings.easeOutExpo(t * 2, b, c / 2, d);
                return easings.easeInExpo((t * 2) - d, b + c / 2, c / 2, d);
            },
            easeInCirc: function(t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOutCirc: function(t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOutCirc: function(t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            },
            easeOutInCirc: function(t, b, c, d) {
                if (t < d / 2) return easings.easeOutCirc(t * 2, b, c / 2, d);
                return easings.easeInCirc((t * 2) - d, b + c / 2, c / 2, d);
            },
            easeInElastic: function(t, b, c, d, a, p) {
                if (!t) return b;
                if ((t /= d) == 1) return b + c;
                var s, p = (!p || typeof(p) != 'number') ? d * .3 : p,
                    a = (!a || typeof(a) != 'number') ? 0 : a;
                if (!a || a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOutElastic: function(t, b, c, d, a, p) {
                if (!t) return b;
                if ((t /= d) == 1) return b + c;
                var s, p = (!p || typeof(p) != 'number') ? d * .3 : p,
                    a = (!a || typeof(a) != 'number') ? 0 : a;
                if (!a || a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOutElastic: function(t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                var s, p = d * (.3 * 1.5),
                    a = 0;
                var s, p = (!p || typeof(p) != 'number') ? d * (.3 * 1.5) : p,
                    a = (!a || typeof(a) != 'number') ? 0 : a;
                if (!a || a < Math.abs(c)) {
                    a = c;
                    s = p / 4;
                } else s = p / (2 * Math.PI) * Math.asin(c / a); if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            },
            easeOutInElastic: function(t, b, c, d, a, p) {
                if (t < d / 2) return easings.easeOutElastic(t * 2, b, c / 2, d, a, p);
                return easings.easeInElastic((t * 2) - d, b + c / 2, c / 2, d, a, p);
            },
            easeInBack: function(t, b, c, d, s) {
                var s = (!s || typeof(s) != 'number') ? 1.70158 : s;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOutBack: function(t, b, c, d, s) {
                var s = (!s || typeof(s) != 'number') ? 1.70158 : s;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOutBack: function(t, b, c, d, s) {
                var s = (!s || typeof(s) != 'number') ? 1.70158 : s;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },
            easeOutInBack: function(t, b, c, d, s) {
                if (t < d / 2) return easings.easeOutBack(t * 2, b, c / 2, d, s);
                return easings.easeInBack((t * 2) - d, b + c / 2, c / 2, d, s);
            },
            easeInBounce: function(t, b, c, d) {
                return c - easings.easeOutBounce(d - t, 0, c, d) + b;
            },
            easeOutBounce: function(t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
                else if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                else if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            },
            easeInOutBounce: function(t, b, c, d) {
                if (t < d / 2) return easings.easeInBounce(t * 2, 0, c, d) * .5 + b;
                else return easings.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            },
            easeOutInBounce: function(t, b, c, d) {
                if (t < d / 2) return easings.easeOutBounce(t * 2, b, c / 2, d);
                return easings.easeInBounce((t * 2) - d, b + c / 2, c / 2, d);
            }
        },

        //animation
        ani = (function() {

            var tweens = [],

                _fps = 60,
                _time = 1,
                _easing = 'easeOutCubic', // _easing = 'easeInExpo',

                nowframe = 0,
                totalframes = 0,
                starttime = 0,
                playing = false,

                getstyle = style.get,
                setstyle = style.set,

                torgb = color.torgb,
                tocolorcode = color.tohex,

                istransform = style.istransform,
                issplitxyztarget = style.issplitxyztarget,

                timer = null,
                timerdelay = 1000 / _fps,

                isemptytween,

                i, max;


            function set(target, property, _option) {

                if (!target) {
                    return;
                }

                if (target.constructor == Array) {
                    for (i = 0, max = target.length; i < max; i++) {
                        set(target[i], property, _option);
                    }
                    return;
                }

                var tween,
                    option = _option || {},
                    time = option.time || _time,
                    frames = Math.round(_fps * time),
                    delay = Math.round(_fps * (option.delay || 0)),
                    easing = option.easing || _easing,
                    p, rounding, fromcolor, tocolor, rgb, i, temp,
                    values = {};

                for (p in property) {
                    rounding = (option.rounding === false || p == 'opacity') ? false : !istransform(p);
                    if (property[p].constructor == Array) { //for preseted values
                        values[p] = property[p];
                        frames = Math.round(_fps * values[p].length / _fps);
                    } else if (expiscolor.test(p)) {
                        fromcolor = torgb(target, p, getstyle(target, p));
                        tocolor = torgb(target, p, property[p]);
                        rgb = [];
                        for (i = 0; i < 3; i++) {
                            rgb[i] = getvalues(p, fromcolor[i], tocolor[i], frames, easing, true);
                        }
                        values[p] = [];
                        for (i = 0; i < frames; i++) {
                            values[p][i] = tocolorcode(rgb[0][i], rgb[1][i], rgb[2][i]);
                        }
                    } else {
                        values[p] = getvalues(p, getstyle(target, p), property[p], frames, easing, rounding);
                    }
                }


                //check exist. delete same properties. remove empty tween.
                stop(target, property);

                tweens.push({
                    el: target,
                    vs: values,
                    sf: nowframe + delay,
                    tf: frames,
                    es: option.onstart,
                    eu: option.onupdate,
                    ee: option.onend,
                    lp: option.loop
                });

                totalframes = Math.max(totalframes, nowframe + delay + frames + _fps);

                if (!playing) {
                    starttime = gettime();
                    timer = window.requestAnimationFrame(action);
                    playing = true;
                }

            }

            function stop(target, property) {

                var i = 0,
                    max = tweens.length,
                    tween, p, properties;

                if (property) {
                    if (typeof(property) != 'string') {
                        properties = [];
                        for (p in property) {
                            properties.push(p);
                        }
                        properties = properties.join(' ') + ' ';
                    } else {
                        properties = property + ' ';
                    }
                }

                isemptytween = true;
                for (; i < max; i++) {
                    tween = tweens[i];
                    if (tween && tween.el == target) {
                        if (property) {
                            for (p in tween.vs) {
                                if (properties.indexOf(p + ' ') != -1) {
                                    delete tween.vs[p];
                                } else {
                                    isemptytween = false;
                                }
                            }
                        }
                        if (isemptytween) {
                            tweens[i] = null;
                        }
                    }
                    if (tweens[i] && tweens[i].el.id == 'asdfasdf') {
                        console.log('asdf');
                    }
                }

            }

            //not complete
            //todo: option as ani.set's option

            function sprite(target, framewidth, totalframe, property, time, loop) {
                var currentframe, temp = {};
                totalframe--;

                function onupdate(e) {
                    var frame = Math.round(totalframe * e.v);
                    if (currentframe != frame) {
                        style.set(target, property, -framewidth * frame);
                        currentframe = frame;
                    }
                }

                function play() {
                    stop();
                    animate(temp, {
                        v: 1
                    }, {
                        time: time,
                        loop: loop,
                        rounding: false,
                        easing: 'linear',
                        onupdate: onupdate
                    });
                }

                function stop() {
                    stopanimate(temp);
                    currentframe = -1;
                    temp.v = 0;
                }
                return {
                    play: play,
                    stop: stop
                }
            }

            function action() {

                nowframe = Math.floor((gettime() - starttime) / timerdelay);
                // nowframe++;

                if (totalframes > nowframe) {
                    setproperties(nowframe);
                    timer = window.requestAnimationFrame(action);
                } else {
                    window.cancelAnimationFrame(timer);
                    setproperties(totalframes);
                    nowframe = totalframes = 0;
                    tweens = [];
                    playing = false;
                }

            }

            function setproperties(step) {

                var tween, mystep, myframes,
                    p, i = 0,
                    max = tweens.length;

                for (; i < max; i++) {

                    tween = tweens[i];

                    if (tween && step >= tween.sf) {

                        myframes = tween.tf - 1;
                        mystep = Math.min(myframes, step - tween.sf);

                        //start event call
                        if (tween.es) {
                            tween.es.call(tween.el, geteventvalue(tween, 'start', 0, myframes));
                            delete tween.es;
                        }

                        //set properties
                        for (p in tween.vs) {
                            setstyle(tween.el, p, tween.vs[p][mystep]);
                        }

                        //update event call
                        tween.eu && tween.eu.call(tween.el, geteventvalue(tween, 'update', mystep, myframes));

                        //end. remove tween, end event call
                        if (mystep == myframes) {
                            tween.ee && tween.ee.call(tween.el, geteventvalue(tween, 'end', mystep, myframes));
                            if (tween.lp) {
                                tweens[i].sf = nowframe;
                                totalframes += tweens[i].tf + _fps;
                                if (tween.lp == 'yoyo') {
                                    for (p in tween.vs) {
                                        tween.vs[p].reverse();
                                    }
                                }
                            } else {
                                tweens[i] = null;
                            }
                        }

                    }
                }

            }

            function geteventvalue(tween, type, step, totalstep) {

                var values = tween.vs,
                    eventvalue = {
                        type: type,
                        percent: step / totalstep
                    },
                    p;

                for (p in values) {
                    eventvalue[p] = values[p][step];
                }

                return eventvalue;

            }

            function getvalues(property, from, to, totalframe, easing, rounding) {

                var nv, rv = [],
                    gap = to - from,
                    i = 0;

                totalframe--;
                for (; i <= totalframe; i++) {
                    nv = easings[easing](i, from, gap, totalframe);
                    //rv.push( ( property == 'opacity' )? parseInt(nv*1000)/1000 : ( rounding )? Math.round(nv) : nv );
                    rv.push((rounding) ? Math.round(nv) : nv);
                }

                return rv;

            }

            return {
                set: set,
                stop: stop,
                sprite: sprite
            };

        })(),

        load = {

            jsonp: function(url, callback) {

                var newscript = url.split('?')[0],
                    savecallbackname, tempcallbackname;

                url = query.parse(url);
                if (url.callback) {
                    savecallbackname = url.callback;
                }

                tempcallbackname = 'tempcallback' + Math.round(Math.random() * 100000) + gettime();
                url.callback = tempcallbackname;
                window[tempcallbackname] = function(data) {
                    if (window[savecallbackname]) {
                        window[savecallbackname](data);
                    } else if (callback) {
                        callback(data);
                    }
                    window[tempcallbackname] = null;
                    find('head')[0].removeChild(newscript);
                }

                newscript = create('script', {
                    src: newscript + '?' + query.make(url)
                });

                find('head')[0].appendChild(newscript);

            },

            script: function(url, callback, error) {

                var newscript = create('script', {
                    src: url
                });

                if ('onreadystatechange' in newscript) {
                    newscript.onreadystatechange = function() {
                        if (this.readyState == 'complete' || this.readyState == 'loaded') {
                            callback && callback();
                            this.onreadystatechange = null;
                        }
                    }
                } else {
                    newscript.onload = function() {
                        callback && callback();
                    }
                }

                find('head')[0].appendChild(newscript);

            }

        },

        //parse/assemble queries
        query = {
            parse: (function() {

                var matches, i, max;

                function resetdata(v) {
                    if (v) {
                        v = decodeURIComponent(v).replace(/\+/g, ' ');
                        if (v.indexOf(',') != -1) {
                            v = v.split(',');
                            for (i = 0, max = v.length; i < max; i++) {
                                v[i] = resetdata(v[i]);
                            }
                        } else if (expint.test(v)) {
                            v = parseFloat(v);
                        }
                    }
                    return v;
                }

                return function(query) {

                    var rv = {};

                    query = ((/^#/).test(query)) ? query.substring(query.lastIndexOf('#') + 1) : (!query || (/\?/).test(query)) ? (query || location.href).split('?')[1] : query;

                    if (query) {
                        query = query.split('#')[0];
                        while (matches = expqueries.exec(query)) {
                            rv[matches[1]] = resetdata(matches[2]);
                        }
                        return rv;
                    } else {
                        return false;
                    }

                }

            })(),
            make: function(data) {
                var key, newdata, datatype = typeof(data);
                if (datatype == 'string') {
                    return data;
                } else if (datatype == 'object') {
                    newdata = [];
                    for (key in data) {
                        newdata.push(key + '=' + encodeURIComponent(data[key]));
                    }
                    return newdata.join('&');
                }
            }
        },

        ajax = (function() {

            function getreadystatechange(xmlhttp, type, callback, error) {
                return function() {
                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {
                            if (type == 'json') {
                                if (window.JSON && window.JSON.parse) {
                                    callback && callback(window.JSON.parse(xmlhttp.responseText));
                                } else {
                                    callback && callback(eval("(" + xmlhttp.responseText + ")"));
                                }
                                return;
                            }
                            callback && callback(xmlhttp.responseXML || xmlhttp.responseText);
                        } else {
                            error && error();
                        }
                    }
                }
            }

            return function(option) {

                if (!option || !option.url || (!option.callback && !option.success)) {
                    return false;
                }

                var method = option.method || 'get',
                    data = option.data || '',
                    url = option.url,
                    onsuccess = option.callback || option.success,
                    xmlhttp, readystatechange;

                if (option.datatype == 'jsonp') {
                    load.jsonp(url, onsuccess, option.error);
                    return;
                }

                xmlhttp = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
                readystatechange = getreadystatechange(xmlhttp, option.datatype || 'text', onsuccess, option.error);

                if (method.toLowerCase() == 'get') {
                    xmlhttp.open('GET', url + '?' + query.make(data), true);
                    xmlhttp.onreadystatechange = readystatechange;
                    xmlhttp.send(null);
                } else {
                    xmlhttp.open('POST', url, true);
                    xmlhttp.onreadystatechange = readystatechange;
                    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
                    xmlhttp.send(query.make(data));
                }

                return;

            }

        })(),


        cookie = {

            set: function(name, value, term, path, domain) {
                var cookieset = name + '=' + value + ';',
                    expdate;
                if (term) {
                    expdate = new Date();
                    expdate.setTime(expdate.getTime() + (term * 1000) * (60 * 60)); //term 1 is a day
                    cookieset += 'expires=' + expdate.toGMTString() + ';';
                }
                if (path) {
                    cookieset += 'path=' + path + ';';
                }
                if (domain) {
                    cookieset += 'domain=' + domain + ';';
                }
                document.cookie = cookieset;
            },

            get: function(name) {
                var match = (document.cookie || ' ').match(new RegExp(name + ' *= *([^;]+)'));
                return (match) ? match[1] : null;
            }

        },

        //publish & subscribe
        pubsub = (function() {

            var
            targets = [],
                events = [],
                i, max;

            function getindex(target) {
                for (i = 0, max = targets.length; i < max; i++) {
                    if (targets[i] == target) {
                        return i;
                    }
                }
                return targets.length;
            }

            function subscribe(target, eventtype, callback) {

                var target = find(target)[0],
                    index = getindex(target),
                    myevent = events[index],
                    exist = false;

                if (!target) {
                    return false;
                }

                if (!myevent) {
                    targets[index] = target;
                    events[index] = {};
                }

                myevent = events[index][eventtype];
                if (!myevent) {
                    myevent = events[index][eventtype] = [];
                }

                for (i = 0, max = myevent.length; i < max; i++) {
                    if (myevent[i] === callback) {
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    myevent.push(callback);
                }

            }

            function publish(target, eventtype, eventvars) {

                var target = find(target)[0],
                    index = getindex(target),
                    myevent = events[index];

                if (!target || !myevent || !myevent[eventtype]) {
                    return false;
                }

                for (myevent = myevent[eventtype],
                    i = 0, max = myevent.length; i < max; i++) {
                    myevent[i].call(target, eventvars);
                }

            }

            function unsubscribe(target, eventtype, callback) {

                var target = find(target)[0],
                    index = getindex(target),
                    myevent = events[index],
                    type;

                if (!target || !myevent) {
                    return false;
                }

                //D.unsubscribe(target, eventtype, callback)
                if (typeof(eventtype) == 'string' && callback) {
                    unsubscribing(myevent, eventtype, callback);
                    //D.unsubscribe(target, callback)
                } else if (typeof(eventtype) == 'function') {
                    unsubscribing(myevent, '', eventtype);
                    //D.unsubscribe(target)
                    //remove all subscribes
                } else if (eventtype === undefined && callback === undefined) {
                    unsubscribing(myevent, false);
                }

            }

            function unsubscribing(eventgroup, eventtype, callback) {
                var type;
                for (type in eventgroup) {
                    if (!eventtype || type == eventtype) {
                        for (i = 0, max = eventgroup[type].length; i < max; i++) {
                            if (eventtype === false || (eventtype && !callback) || callback == eventgroup[type][i]) {
                                eventgroup[type].splice(i, 1);
                                max--;
                                i--;
                            }
                        }
                    }
                }
            }

            function clear() {
                targets = [];
                events = [];
            }

            return {
                subscribe: subscribe,
                unsubscribe: unsubscribe,
                publish: publish,
                clear: clear
            };

        })();

    return {

        //get elements by class name
        getElementsByClassName: function(classname, from) {
            if (!from) {
                from = document;
            }
            if (from.getElementsByClassName) {
                return from.getElementsByClassName(classname);
            }
            var els = from.getElementsByTagName('*'),
                i = 0,
                j = 0,
                max = els.length,
                exp = new RegExp(' ' + classname + ' '),
                rv = {};
            for (; i < max; i++) {
                if (exp.test(' ' + els[i].className + ' ')) {
                    rv[j] = els[i];
                    j++;
                }
            }
            rv.length = j;
            return rv;
        },

        //get offset
        offset: function(target, from) {

            var offsets, offsetparent;

            if (from && iselement(from) && from != document.body) {
                offsets = {
                    left: 0,
                    top: 0,
                    width: target.offsetWidth,
                    height: target.offsetHeight
                };
                while (target != from) {
                    offsets.left += target.offsetLeft;
                    offsets.top += target.offsetTop;
                    target = target.offsetParent;
                }
            } else {
                offsets = target.getBoundingClientRect();
                offsets = {
                    left: offsets.left + scrolltarget.scrollLeft,
                    top: offsets.top + scrolltarget.scrollTop,
                    width: offsets.width || target.offsetWidth,
                    height: offsets.height || target.offsetHeight
                }
            }
            return offsets;

        },

        //strip tags
        striptags: (function() {
            return function(value) {
                return value.replace(exptags, '');
            }
        })(),

        //trim
        trim: (function() {
            return function(value) {
                return value.replace(exptrimspace, '');
            }
        })(),

        //data get, set
        data: (function() {

            var supportstorage = browser.support.storage;

            return {

                get: function(target, name) {
                    var data;
                    if (iselement(target)) {
                        data = target.getAttribute('data-' + name);
                    } else if (supportstorage) {
                        data = localStorage.getItem(target);
                    } else {
                        data = cookie.get(target);
                    }
                    return (expint.test(data)) ? parseFloat(data) : (data === 'true') ? true : (data === 'false') ? false : data;
                },

                set: function(target, name, value) {
                    var n;
                    if (typeof(name) != 'string') {
                        for (n in name) {
                            this.set(target, n, name[n]);
                        }
                        return;
                    }
                    if (iselement(target)) {
                        target.setAttribute('data-' + name, value);
                    } else if (supportstorage) {
                        localStorage.setItem(target, name);
                    } else {
                        cookie.set(target, name);
                    }
                },

                remove: function(target, name) {
                    if (iselement(target)) {
                        target.removeAttribute('data-' + name);
                    } else if (supportstorage) {
                        localStorage.removeItem(target);
                    } else {
                        cookie.set(target, value, -1);
                    }
                }
            }

        })(),

        time: gettime,

        each: each,
        find: find,
        create: create,
        event: event,
        browser: browser,
        classname: classname,
        style: style,
        color: color,
        image: image,
        fill: fill,
        ani: ani,
        easings: easings,
        ajax: ajax,
        load: load,
        query: query,
        subscribe: pubsub.subscribe,
        unsubscribe: pubsub.unsubscribe,
        publish: pubsub.publish

    };

})();


//avoid browser has no console error
if (!window.console) {
    window.console = {};
    window.console.log = window.console.clear = window.console.error = window.console.table = function() {};
}

//local storage
if (!'localStorage' in window || window['localStorage'] === null) {
    window.localStorage = {};
    window.localStorage.setItem = window.localStorage.getItem = window.localStorage.removeItem = function() {};
}


var tracer = {

    box: null,
    number: 1,

    tostring: function(v) {
        var rv, i, max;
        if (v === null) {
            return 'null';
        } else if (v === undefined) {
            return 'undefined';
        } else if (v == window) {
            return '[object Window]';
        } else if (v == document) {
            return '[object HTMLDocument]';
        } else if (v === true || v === false || typeof(v) == 'number' || typeof(v) == 'function') {
            return v;
        } else if (typeof(v) == 'object') {
            if (v.constructor == Array) {
                rv = [];
                for (i = 0, max = v.length; i < max; i++) {
                    rv.push(tracer.tostring(v[i]));
                }
                return '[' + rv.join(',') + ']';
            } else if (v.constructor == String) {
                return '"' + v.replace(/\</g, '<') + '"';
            } else if (v.constructor == Boolean || v.constructor === Number || v.constructor == RegExp) {
                return v;
            } else if (v.constructor == Date) {
                return 'Date(' + v.getTime() + ', ' + v + ')';
            } else if (v.each && v.bind) {
                rv = [];
                for (i = 0, max = v.length; i < max; i++) {
                    rv.push(i + ':' + tracer.tostring(v[i]));
                }
                rv.push('length:' + max);
                return '${' + rv.join(',') + '}';
            } else if (v.nodeType) {
                return '[object ' + v.nodeName.toUpperCase() + ' Element]';
            } else {
                rv = [];
                for (i in v) {
                    rv.push('\'' + i + '\':' + tracer.tostring(v[i]));
                }
                return '{' + rv.join(',') + '}';
            }
        } else {
            return '"' + ((v.replace) ? v.replace(/\</g, '<') : v) + '"';
        }
    },

    create: function() {
        if (!tracer.box) {
            tracer.box = document.createElement('ol');
            tracer.box.style.cssText = 'position:absolute;left:5px;top:5px;max-width:75%;font-family:verdana;font-size:9px;color:#000;line-height:1.35em;margin:0;padding:3px 3px 2px 38px;border:1px solid #000;background:#fff;display:none;z-index:10000;opacity:0.75;filter:alpha(opacity=75);';
            tracer.box.onclick = tracer.clear;

            function addbox() {
                if (document.body) {
                    document.body.appendChild(tracer.box);
                } else {
                    setTimeout(addbox, 10);
                }
            }
            addbox();
        }
    },

    action: function() {
        var i, max, v = [],
            li = document.createElement('li');
        for (i = 0, max = arguments.length; i < max; i++) {
            v.push(tracer.tostring(arguments[i]));
        }
        li.style.cssText = 'list-style:decimal;margin-bottom:1px;padding:2px 3px 3px;background:' + ((tracer.number % 2) ? '#eee;' : '#ddd;');
        li.innerHTML = v.join(', ');
        tracer.create();
        tracer.box.appendChild(li);
        tracer.box.style.display = 'block';
        tracer.number++;
        return trace;
    },

    fixed: function(flag) {
        tracer.create();
        tracer.box.style.position = (flag === false) ? 'absolute' : 'fixed';
        return trace;
    },

    clear: function() {
        if (tracer.box) {
            tracer.box.innerHTML = '';
            tracer.box.style.display = 'none';
            tracer.number = 1;
        }
        return trace;
    }

}
window.trace = tracer.action;
window.trace.fixed = tracer.fixed;
window.trace.clear = tracer.clear;

/*! Sizzle v1.10.5-pre | (c) 2013 jQuery Foundation, Inc. | jquery.org/license
 */
! function(a) {
    function b(a, b, c, d) {
        var e, f, g, h, i, j, k, n, o, p;
        if ((b ? b.ownerDocument || b : N) !== F && E(b), b = b || F, c = c || [], !a || "string" != typeof a) return c;
        if (1 !== (h = b.nodeType) && 9 !== h) return [];
        if (H && !d) {
            if (e = rb.exec(a))
                if (g = e[1]) {
                    if (9 === h) {
                        if (f = b.getElementById(g), !f || !f.parentNode) return c;
                        if (f.id === g) return c.push(f), c
                    } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && L(b, f) && f.id === g) return c.push(f), c
                } else {
                    if (e[2]) return _.apply(c, b.getElementsByTagName(a)), c;
                    if ((g = e[3]) && w.getElementsByClassName && b.getElementsByClassName) return _.apply(c, b.getElementsByClassName(g)), c
                }
            if (w.qsa && (!I || !I.test(a))) {
                if (n = k = M, o = b, p = 9 === h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                    for (j = l(a), (k = b.getAttribute("id")) ? n = k.replace(ub, "\\$&") : b.setAttribute("id", n), n = "[id='" + n + "'] ", i = j.length; i--;) j[i] = n + m(j[i]);
                    o = lb.test(a) && b.parentNode || b, p = j.join(",")
                }
                if (p) try {
                    return _.apply(c, o.querySelectorAll(p)), c
                } catch (q) {} finally {
                    k || b.removeAttribute("id")
                }
            }
        }
        return u(a.replace(ib, "$1"), b, c, d)
    }

    function c() {
        function a(c, d) {
            return b.push(c += " ") > y.cacheLength && delete a[b.shift()], a[c] = d
        }
        var b = [];
        return a
    }

    function d(a) {
        return a[M] = !0, a
    }

    function e(a) {
        var b = F.createElement("div");
        try {
            return !!a(b)
        } catch (c) {
            return !1
        } finally {
            b.parentNode && b.parentNode.removeChild(b), b = null
        }
    }

    function f(a, b) {
        for (var c = a.split("|"), d = a.length; d--;) y.attrHandle[c[d]] = b
    }

    function g(a, b) {
        var c = b && a,
            d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || W) - (~a.sourceIndex || W);
        if (d) return d;
        if (c)
            for (; c = c.nextSibling;)
                if (c === b) return -1;
        return a ? 1 : -1
    }

    function h(a) {
        return function(b) {
            var c = b.nodeName.toLowerCase();
            return "input" === c && b.type === a
        }
    }

    function i(a) {
        return function(b) {
            var c = b.nodeName.toLowerCase();
            return ("input" === c || "button" === c) && b.type === a
        }
    }

    function j(a) {
        return d(function(b) {
            return b = +b, d(function(c, d) {
                for (var e, f = a([], c.length, b), g = f.length; g--;) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
            })
        })
    }

    function k() {}

    function l(a, c) {
        var d, e, f, g, h, i, j, k = R[a + " "];
        if (k) return c ? 0 : k.slice(0);
        for (h = a, i = [], j = y.preFilter; h;) {
            (!d || (e = jb.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = kb.exec(h)) && (d = e.shift(), f.push({
                value: d,
                type: e[0].replace(ib, " ")
            }), h = h.slice(d.length));
            for (g in y.filter)!(e = pb[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({
                value: d,
                type: g,
                matches: e
            }), h = h.slice(d.length));
            if (!d) break
        }
        return c ? h.length : h ? b.error(a) : R(a, i).slice(0)
    }

    function m(a) {
        for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
        return d
    }

    function n(a, b, c) {
        var d = b.dir,
            e = c && "parentNode" === d,
            f = P++;
        return b.first ? function(b, c, f) {
            for (; b = b[d];)
                if (1 === b.nodeType || e) return a(b, c, f)
        } : function(b, c, g) {
            var h, i, j, k = O + " " + f;
            if (g) {
                for (; b = b[d];)
                    if ((1 === b.nodeType || e) && a(b, c, g)) return !0
            } else
                for (; b = b[d];)
                    if (1 === b.nodeType || e)
                        if (j = b[M] || (b[M] = {}), (i = j[d]) && i[0] === k) {
                            if ((h = i[1]) === !0 || h === x) return h === !0
                        } else if (i = j[d] = [k], i[1] = a(b, c, g) || x, i[1] === !0) return !0
        }
    }

    function o(a) {
        return a.length > 1 ? function(b, c, d) {
            for (var e = a.length; e--;)
                if (!a[e](b, c, d)) return !1;
            return !0
        } : a[0]
    }

    function p(a, b, c, d, e) {
        for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
        return g
    }

    function q(a, b, c, e, f, g) {
        return e && !e[M] && (e = q(e)), f && !f[M] && (f = q(f, g)), d(function(d, g, h, i) {
            var j, k, l, m = [],
                n = [],
                o = g.length,
                q = d || t(b || "*", h.nodeType ? [h] : h, []),
                r = !a || !d && b ? q : p(q, m, a, h, i),
                s = c ? f || (d ? a : o || e) ? [] : g : r;
            if (c && c(r, s, h, i), e)
                for (j = p(s, n), e(j, [], h, i), k = j.length; k--;)(l = j[k]) && (s[n[k]] = !(r[n[k]] = l));
            if (d) {
                if (f || a) {
                    if (f) {
                        for (j = [], k = s.length; k--;)(l = s[k]) && j.push(r[k] = l);
                        f(null, s = [], j, i)
                    }
                    for (k = s.length; k--;)(l = s[k]) && (j = f ? bb.call(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                }
            } else s = p(s === g ? s.splice(o, s.length) : s), f ? f(null, g, s, i) : _.apply(g, s)
        })
    }

    function r(a) {
        for (var b, c, d, e = a.length, f = y.relative[a[0].type], g = f || y.relative[" "], h = f ? 1 : 0, i = n(function(a) {
                return a === b
            }, g, !0), j = n(function(a) {
                return bb.call(b, a) > -1
            }, g, !0), k = [
                function(a, c, d) {
                    return !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d))
                }
            ]; e > h; h++)
            if (c = y.relative[a[h].type]) k = [n(o(k), c)];
            else {
                if (c = y.filter[a[h].type].apply(null, a[h].matches), c[M]) {
                    for (d = ++h; e > d && !y.relative[a[d].type]; d++);
                    return q(h > 1 && o(k), h > 1 && m(a.slice(0, h - 1).concat({
                        value: " " === a[h - 2].type ? "*" : ""
                    })).replace(ib, "$1"), c, d > h && r(a.slice(h, d)), e > d && r(a = a.slice(d)), e > d && m(a))
                }
                k.push(c)
            }
        return o(k)
    }

    function s(a, c) {
        var e = 0,
            f = c.length > 0,
            g = a.length > 0,
            h = function(d, h, i, j, k) {
                var l, m, n, o = [],
                    q = 0,
                    r = "0",
                    s = d && [],
                    t = null != k,
                    u = C,
                    v = d || g && y.find.TAG("*", k && h.parentNode || h),
                    w = O += null == u ? 1 : Math.random() || .1;
                for (t && (C = h !== F && h, x = e); null != (l = v[r]); r++) {
                    if (g && l) {
                        for (m = 0; n = a[m++];)
                            if (n(l, h, i)) {
                                j.push(l);
                                break
                            }
                        t && (O = w, x = ++e)
                    }
                    f && ((l = !n && l) && q--, d && s.push(l))
                }
                if (q += r, f && r !== q) {
                    for (m = 0; n = c[m++];) n(s, o, h, i);
                    if (d) {
                        if (q > 0)
                            for (; r--;) s[r] || o[r] || (o[r] = Z.call(j));
                        o = p(o)
                    }
                    _.apply(j, o), t && !d && o.length > 0 && q + c.length > 1 && b.uniqueSort(j)
                }
                return t && (O = w, C = u), s
            };
        return f ? d(h) : h
    }

    function t(a, c, d) {
        for (var e = 0, f = c.length; f > e; e++) b(a, c[e], d);
        return d
    }

    function u(a, b, c, d) {
        var e, f, g, h, i, j = l(a);
        if (!d && 1 === j.length) {
            if (f = j[0] = j[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && w.getById && 9 === b.nodeType && H && y.relative[f[1].type]) {
                if (b = (y.find.ID(g.matches[0].replace(vb, wb), b) || [])[0], !b) return c;
                a = a.slice(f.shift().value.length)
            }
            for (e = pb.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !y.relative[h = g.type]);)
                if ((i = y.find[h]) && (d = i(g.matches[0].replace(vb, wb), lb.test(f[0].type) && b.parentNode || b))) {
                    if (f.splice(e, 1), a = d.length && m(f), !a) return _.apply(c, d), c;
                    break
                }
        }
        return B(a, j)(d, b, !H, c, lb.test(a)), c
    }
    var v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M = "sizzle" + -new Date,
        N = a.document,
        O = 0,
        P = 0,
        Q = c(),
        R = c(),
        S = c(),
        T = !1,
        U = function(a, b) {
            return a === b ? (T = !0, 0) : 0
        }, V = typeof void 0,
        W = 1 << 31,
        X = {}.hasOwnProperty,
        Y = [],
        Z = Y.pop,
        $ = Y.push,
        _ = Y.push,
        ab = Y.slice,
        bb = Y.indexOf || function(a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (this[b] === a) return b;
            return -1
        }, cb = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        db = "[\\x20\\t\\r\\n\\f]",
        eb = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        fb = eb.replace("w", "w#"),
        gb = "\\[" + db + "*(" + eb + ")" + db + "*(?:([*^$|!~]?=)" + db + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + fb + ")|)|)" + db + "*\\]",
        hb = ":(" + eb + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + gb.replace(3, 8) + ")*)|.*)\\)|)",
        ib = new RegExp("^" + db + "+|((?:^|[^\\\\])(?:\\\\.)*)" + db + "+$", "g"),
        jb = new RegExp("^" + db + "*," + db + "*"),
        kb = new RegExp("^" + db + "*([>+~]|" + db + ")" + db + "*"),
        lb = new RegExp(db + "*[+~]"),
        mb = new RegExp("=" + db + "*([^\\]'\"]*)" + db + "*\\]", "g"),
        nb = new RegExp(hb),
        ob = new RegExp("^" + fb + "$"),
        pb = {
            ID: new RegExp("^#(" + eb + ")"),
            CLASS: new RegExp("^\\.(" + eb + ")"),
            TAG: new RegExp("^(" + eb.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + gb),
            PSEUDO: new RegExp("^" + hb),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + db + "*(even|odd|(([+-]|)(\\d*)n|)" + db + "*(?:([+-]|)" + db + "*(\\d+)|))" + db + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + cb + ")$", "i"),
            needsContext: new RegExp("^" + db + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + db + "*((?:-\\d)?\\d*)" + db + "*\\)|)(?=[^-]|$)", "i")
        }, qb = /^[^{]+\{\s*\[native \w/,
        rb = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        sb = /^(?:input|select|textarea|button)$/i,
        tb = /^h\d$/i,
        ub = /'|\\/g,
        vb = new RegExp("\\\\([\\da-f]{1,6}" + db + "?|(" + db + ")|.)", "ig"),
        wb = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(55296 | d >> 10, 56320 | 1023 & d)
        };
    try {
        _.apply(Y = ab.call(N.childNodes), N.childNodes), Y[N.childNodes.length].nodeType
    } catch (xb) {
        _ = {
            apply: Y.length ? function(a, b) {
                $.apply(a, ab.call(b))
            } : function(a, b) {
                for (var c = a.length, d = 0; a[c++] = b[d++];);
                a.length = c - 1
            }
        }
    }
    A = b.isXML = function(a) {
        var b = a && (a.ownerDocument || a).documentElement;
        return b ? "HTML" !== b.nodeName : !1
    }, w = b.support = {}, E = b.setDocument = function(a) {
        var b = a ? a.ownerDocument || a : N,
            c = b.defaultView;
        return b !== F && 9 === b.nodeType && b.documentElement ? (F = b, G = b.documentElement, H = !A(b), c && c.attachEvent && c !== c.top && c.attachEvent("onbeforeunload", function() {
            E()
        }), w.attributes = e(function(a) {
            return a.className = "i", !a.getAttribute("className")
        }), w.getElementsByTagName = e(function(a) {
            return a.appendChild(b.createComment("")), !a.getElementsByTagName("*").length
        }), w.getElementsByClassName = e(function(a) {
            return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
        }), w.getById = e(function(a) {
            return G.appendChild(a).id = M, !b.getElementsByName || !b.getElementsByName(M).length
        }), w.getById ? (y.find.ID = function(a, b) {
            if (typeof b.getElementById !== V && H) {
                var c = b.getElementById(a);
                return c && c.parentNode ? [c] : []
            }
        }, y.filter.ID = function(a) {
            var b = a.replace(vb, wb);
            return function(a) {
                return a.getAttribute("id") === b
            }
        }) : (delete y.find.ID, y.filter.ID = function(a) {
            var b = a.replace(vb, wb);
            return function(a) {
                var c = typeof a.getAttributeNode !== V && a.getAttributeNode("id");
                return c && c.value === b
            }
        }), y.find.TAG = w.getElementsByTagName ? function(a, b) {
            return typeof b.getElementsByTagName !== V ? b.getElementsByTagName(a) : void 0
        } : function(a, b) {
            var c, d = [],
                e = 0,
                f = b.getElementsByTagName(a);
            if ("*" === a) {
                for (; c = f[e++];) 1 === c.nodeType && d.push(c);
                return d
            }
            return f
        }, y.find.CLASS = w.getElementsByClassName && function(a, b) {
            return typeof b.getElementsByClassName !== V && H ? b.getElementsByClassName(a) : void 0
        }, J = [], I = [], (w.qsa = qb.test(b.querySelectorAll)) && (e(function(a) {
            a.innerHTML = "<select><option selected=''></option></select>", a.querySelectorAll("[selected]").length || I.push("\\[" + db + "*(?:value|" + cb + ")"), a.querySelectorAll(":checked").length || I.push(":checked")
        }), e(function(a) {
            var c = b.createElement("input");
            c.setAttribute("type", "hidden"), a.appendChild(c).setAttribute("t", ""), a.querySelectorAll("[t^='']").length && I.push("[*^$]=" + db + "*(?:''|\"\")"), a.querySelectorAll(":enabled").length || I.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), I.push(",.*:")
        })), (w.matchesSelector = qb.test(K = G.webkitMatchesSelector || G.mozMatchesSelector || G.oMatchesSelector || G.msMatchesSelector)) && e(function(a) {
            w.disconnectedMatch = K.call(a, "div"), K.call(a, "[s!='']:x"), J.push("!=", hb)
        }), I = I.length && new RegExp(I.join("|")), J = J.length && new RegExp(J.join("|")), L = qb.test(G.contains) || G.compareDocumentPosition ? function(a, b) {
            var c = 9 === a.nodeType ? a.documentElement : a,
                d = b && b.parentNode;
            return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
        } : function(a, b) {
            if (b)
                for (; b = b.parentNode;)
                    if (b === a) return !0;
            return !1
        }, U = G.compareDocumentPosition ? function(a, c) {
            if (a === c) return T = !0, 0;
            var d = c.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(c);
            return d ? 1 & d || !w.sortDetached && c.compareDocumentPosition(a) === d ? a === b || L(N, a) ? -1 : c === b || L(N, c) ? 1 : D ? bb.call(D, a) - bb.call(D, c) : 0 : 4 & d ? -1 : 1 : a.compareDocumentPosition ? -1 : 1
        } : function(a, c) {
            var d, e = 0,
                f = a.parentNode,
                h = c.parentNode,
                i = [a],
                j = [c];
            if (a === c) return T = !0, 0;
            if (!f || !h) return a === b ? -1 : c === b ? 1 : f ? -1 : h ? 1 : D ? bb.call(D, a) - bb.call(D, c) : 0;
            if (f === h) return g(a, c);
            for (d = a; d = d.parentNode;) i.unshift(d);
            for (d = c; d = d.parentNode;) j.unshift(d);
            for (; i[e] === j[e];) e++;
            return e ? g(i[e], j[e]) : i[e] === N ? -1 : j[e] === N ? 1 : 0
        }, b) : F
    }, b.matches = function(a, c) {
        return b(a, null, null, c)
    }, b.matchesSelector = function(a, c) {
        if ((a.ownerDocument || a) !== F && E(a), c = c.replace(mb, "='$1']"), !(!w.matchesSelector || !H || J && J.test(c) || I && I.test(c))) try {
            var d = K.call(a, c);
            if (d || w.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
        } catch (e) {}
        return b(c, F, null, [a]).length > 0
    }, b.contains = function(a, b) {
        return (a.ownerDocument || a) !== F && E(a), L(a, b)
    }, b.attr = function(a, b) {
        (a.ownerDocument || a) !== F && E(a);
        var c = y.attrHandle[b.toLowerCase()],
            d = c && X.call(y.attrHandle, b.toLowerCase()) ? c(a, b, !H) : void 0;
        return void 0 === d ? w.attributes || !H ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null : d
    }, b.error = function(a) {
        throw new Error("Syntax error, unrecognized expression: " + a)
    }, b.uniqueSort = function(a) {
        var b, c = [],
            d = 0,
            e = 0;
        if (T = !w.detectDuplicates, D = !w.sortStable && a.slice(0), a.sort(U), T) {
            for (; b = a[e++];) b === a[e] && (d = c.push(e));
            for (; d--;) a.splice(c[d], 1)
        }
        return a
    }, z = b.getText = function(a) {
        var b, c = "",
            d = 0,
            e = a.nodeType;
        if (e) {
            if (1 === e || 9 === e || 11 === e) {
                if ("string" == typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) c += z(a)
            } else if (3 === e || 4 === e) return a.nodeValue
        } else
            for (; b = a[d]; d++) c += z(b);
        return c
    }, y = b.selectors = {
        cacheLength: 50,
        createPseudo: d,
        match: pb,
        attrHandle: {},
        find: {},
        relative: {
            ">": {
                dir: "parentNode",
                first: !0
            },
            " ": {
                dir: "parentNode"
            },
            "+": {
                dir: "previousSibling",
                first: !0
            },
            "~": {
                dir: "previousSibling"
            }
        },
        preFilter: {
            ATTR: function(a) {
                return a[1] = a[1].replace(vb, wb), a[3] = (a[4] || a[5] || "").replace(vb, wb), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
            },
            CHILD: function(a) {
                return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
            },
            PSEUDO: function(a) {
                var b, c = !a[5] && a[2];
                return pb.CHILD.test(a[0]) ? null : (a[3] && void 0 !== a[4] ? a[2] = a[4] : c && nb.test(c) && (b = l(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
            }
        },
        filter: {
            TAG: function(a) {
                var b = a.replace(vb, wb).toLowerCase();
                return "*" === a ? function() {
                    return !0
                } : function(a) {
                    return a.nodeName && a.nodeName.toLowerCase() === b
                }
            },
            CLASS: function(a) {
                var b = Q[a + " "];
                return b || (b = new RegExp("(^|" + db + ")" + a + "(" + db + "|$)")) && Q(a, function(a) {
                    return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== V && a.getAttribute("class") || "")
                })
            },
            ATTR: function(a, c, d) {
                return function(e) {
                    var f = b.attr(e, a);
                    return null == f ? "!=" === c : c ? (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f + " ").indexOf(d) > -1 : "|=" === c ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0
                }
            },
            CHILD: function(a, b, c, d, e) {
                var f = "nth" !== a.slice(0, 3),
                    g = "last" !== a.slice(-4),
                    h = "of-type" === b;
                return 1 === d && 0 === e ? function(a) {
                    return !!a.parentNode
                } : function(b, c, i) {
                    var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                        q = b.parentNode,
                        r = h && b.nodeName.toLowerCase(),
                        s = !i && !h;
                    if (q) {
                        if (f) {
                            for (; p;) {
                                for (l = b; l = l[p];)
                                    if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                o = p = "only" === a && !o && "nextSibling"
                            }
                            return !0
                        }
                        if (o = [g ? q.firstChild : q.lastChild], g && s) {
                            for (k = q[M] || (q[M] = {}), j = k[a] || [], n = j[0] === O && j[1], m = j[0] === O && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop();)
                                if (1 === l.nodeType && ++m && l === b) {
                                    k[a] = [O, n, m];
                                    break
                                }
                        } else if (s && (j = (b[M] || (b[M] = {}))[a]) && j[0] === O) m = j[1];
                        else
                            for (;
                                (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[M] || (l[M] = {}))[a] = [O, m]), l !== b)););
                        return m -= e, m === d || 0 === m % d && m / d >= 0
                    }
                }
            },
            PSEUDO: function(a, c) {
                var e, f = y.pseudos[a] || y.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                return f[M] ? f(c) : f.length > 1 ? (e = [a, a, "", c], y.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                    for (var d, e = f(a, c), g = e.length; g--;) d = bb.call(a, e[g]), a[d] = !(b[d] = e[g])
                }) : function(a) {
                    return f(a, 0, e)
                }) : f
            }
        },
        pseudos: {
            not: d(function(a) {
                var b = [],
                    c = [],
                    e = B(a.replace(ib, "$1"));
                return e[M] ? d(function(a, b, c, d) {
                    for (var f, g = e(a, null, d, []), h = a.length; h--;)(f = g[h]) && (a[h] = !(b[h] = f))
                }) : function(a, d, f) {
                    return b[0] = a, e(b, null, f, c), !c.pop()
                }
            }),
            has: d(function(a) {
                return function(c) {
                    return b(a, c).length > 0
                }
            }),
            contains: d(function(a) {
                return function(b) {
                    return (b.textContent || b.innerText || z(b)).indexOf(a) > -1
                }
            }),
            lang: d(function(a) {
                return ob.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(vb, wb).toLowerCase(),
                function(b) {
                    var c;
                    do
                        if (c = H ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                    return !1
                }
            }),
            target: function(b) {
                var c = a.location && a.location.hash;
                return c && c.slice(1) === b.id
            },
            root: function(a) {
                return a === G
            },
            focus: function(a) {
                return a === F.activeElement && (!F.hasFocus || F.hasFocus()) && !! (a.type || a.href || ~a.tabIndex)
            },
            enabled: function(a) {
                return a.disabled === !1
            },
            disabled: function(a) {
                return a.disabled === !0
            },
            checked: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && !! a.checked || "option" === b && !! a.selected
            },
            selected: function(a) {
                return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
            },
            empty: function(a) {
                for (a = a.firstChild; a; a = a.nextSibling)
                    if (a.nodeName > "@" || 3 === a.nodeType || 4 === a.nodeType) return !1;
                return !0
            },
            parent: function(a) {
                return !y.pseudos.empty(a)
            },
            header: function(a) {
                return tb.test(a.nodeName)
            },
            input: function(a) {
                return sb.test(a.nodeName)
            },
            button: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && "button" === a.type || "button" === b
            },
            text: function(a) {
                var b;
                return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || b.toLowerCase() === a.type)
            },
            first: j(function() {
                return [0]
            }),
            last: j(function(a, b) {
                return [b - 1]
            }),
            eq: j(function(a, b, c) {
                return [0 > c ? c + b : c]
            }),
            even: j(function(a, b) {
                for (var c = 0; b > c; c += 2) a.push(c);
                return a
            }),
            odd: j(function(a, b) {
                for (var c = 1; b > c; c += 2) a.push(c);
                return a
            }),
            lt: j(function(a, b, c) {
                for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                return a
            }),
            gt: j(function(a, b, c) {
                for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d);
                return a
            })
        }
    }, y.pseudos.nth = y.pseudos.eq;
    for (v in {
        radio: !0,
        checkbox: !0,
        file: !0,
        password: !0,
        image: !0
    }) y.pseudos[v] = h(v);
    for (v in {
        submit: !0,
        reset: !0
    }) y.pseudos[v] = i(v);
    k.prototype = y.filters = y.pseudos, y.setFilters = new k, B = b.compile = function(a, b) {
        var c, d = [],
            e = [],
            f = S[a + " "];
        if (!f) {
            for (b || (b = l(a)), c = b.length; c--;) f = r(b[c]), f[M] ? d.push(f) : e.push(f);
            f = S(a, s(e, d))
        }
        return f
    }, w.sortStable = M.split("").sort(U).join("") === M, w.detectDuplicates = T, E(), w.sortDetached = e(function(a) {
        return 1 & a.compareDocumentPosition(F.createElement("div"))
    }), e(function(a) {
        return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
    }) || f("type|href|height|width", function(a, b, c) {
        return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
    }), w.attributes && e(function(a) {
        return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
    }) || f("value", function(a, b, c) {
        return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
    }), e(function(a) {
        return null == a.getAttribute("disabled")
    }) || f(cb, function(a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && d.specified ? d.value : a[b] === !0 ? b.toLowerCase() : null
    }), "function" == typeof define && define.amd ? define(function() {
        return b
    }) : a.Sizzle = b
}(window);
