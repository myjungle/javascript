/*!
 * ParallaxScene
 * 
 * @author 김승일
 * @version 1.0(2013-03-11) 최초 생성
 */
(function ($) {
    "use strict";

    jQuery.extend( jQuery.easing,
        {
            def: 'easeOutQuad',
            swing: function (x, t, b, c, d) {
                //alert(jQuery.easing.default);
                return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
            },
            easeInQuad: function (x, t, b, c, d) {
                return c*(t/=d)*t + b;
            },
            easeOutQuad: function (x, t, b, c, d) {
                return -c *(t/=d)*(t-2) + b;
            },
            easeInOutQuad: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
            },
            easeInCubic: function (x, t, b, c, d) {
                return c*(t/=d)*t*t + b;
            },
            easeOutCubic: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t + 1) + b;
            },
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
            },
            easeInQuart: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t + b;
            },
            easeOutQuart: function (x, t, b, c, d) {
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
            },
            easeInOutQuart: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                return -c/2 * ((t-=2)*t*t*t - 2) + b;
            },
            easeInQuint: function (x, t, b, c, d) {
                return c*(t/=d)*t*t*t*t + b;
            },
            easeOutQuint: function (x, t, b, c, d) {
                return c*((t=t/d-1)*t*t*t*t + 1) + b;
            },
            easeInOutQuint: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                return c/2*((t-=2)*t*t*t*t + 2) + b;
            },
            easeInSine: function (x, t, b, c, d) {
                return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
            },
            easeOutSine: function (x, t, b, c, d) {
                return c * Math.sin(t/d * (Math.PI/2)) + b;
            },
            easeInOutSine: function (x, t, b, c, d) {
                return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
            },
            easeInExpo: function (x, t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
            },
            easeOutExpo: function (x, t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
            },
            easeInOutExpo: function (x, t, b, c, d) {
                if (t==0) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
            easeInCirc: function (x, t, b, c, d) {
                return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
            },
            easeOutCirc: function (x, t, b, c, d) {
                return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
            },
            easeInOutCirc: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
            },
            easeInElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            },
            easeOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
            },
            easeInOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
            },
            easeInBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*(t/=d)*t*((s+1)*t - s) + b;
            },
            easeOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            },
            easeInOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
            },
            easeInBounce: function (x, t, b, c, d) {
                return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
            },
            easeOutBounce: function (x, t, b, c, d) {
                if ((t/=d) < (1/2.75)) {
                    return c*(7.5625*t*t) + b;
                } else if (t < (2/2.75)) {
                    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                } else if (t < (2.5/2.75)) {
                    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                } else {
                    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                }
            },
            easeInOutBounce: function (x, t, b, c, d) {
                if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
                return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
            }
        });

    // ======================================== //
    // 익명함수내 전역 변수						//
    // ======================================== //
    var $WINDOW = $(window),
        REGEXP_FRAME = /\b[^{]+\s*{.*?}/gi, // 각 프레임
        REGEXP_PARTS = /([0-9%px\s,]+)\s*\{(.*?)\}/, // 프레임에서 key frame, easing, style 분리
        REGEXP_STYLE = /\s*([a-z\-]+)\s*:\s*([^;|\}]+?)([px|%]*)\s*(?:;|$)/gi,// style 파싱
        REGEXP_STYLE_VALUE = /\b([a-z]+)\(([^\)]+)\)/gi;

    window.console || (window.console = {log:function(){}});

    // ======================================== //
    // 유틸 메서드								//
    // ======================================== //
    /**
     * <pre>
     * 반복처리 함수
     * </pre>
     *
     * @function
     * @param obj {Array, JSON} 배열 혹은 JSON객체
     * @param fn {Function} 콜백함수
     */
    function each(obj, fn) {
        var hasProp = Object.prototype.hasOwnProperty;

        if (obj.push) {
            for (var i = 0, ln = obj.length; i < ln; i++) {
                if (fn.call(obj, obj[i], i) === false) return false;
            }
        } else {
            for (var k in obj) {
                if (hasProp.call(obj, k)) {
                    if (fn.call(obj, obj[k], k) === false) return false;
                }
            }
        }
    }

    /**
     * <pre>
     * 속성복사 함수
     * </pre>
     *
     * @function
     * @param src {JSON}
     * @param dest {JSON}
     */
    function extend() {
        var args = [].slice.call(arguments),
            src = args.shift(),
            over = args[args.length - 1] === false ? args.pop() : true,
            obj,
            hasProp = Object.prototype.hasOwnProperty;

        while (obj = args.shift()) {
            for (var name in obj) {
                if (!hasProp.call(obj, name) || (!over && (name in src))) { continue; }
                src[name] = obj[name];
            }
        }

        return src;
    }

    /**
     * <pre>
     * ???
     * </pre>
     *
     * @function
     * @param c {JSON}
     * @param d {JSON}
     */
    function getNumberValue(c, d) {
        var r;
        if (c && (r = c.value)) return r | 0;
        if (d && (r = d.value)) return r | 0;
        return 0;
    };

    function calcPercentValue(r, n, v) {
        switch (n) {
            case 'top':
                return $(r).height() * v / 100;
        };
    };


    // ======================================== //
    // 이벤트 리스너								//
    // ======================================== //
    /**
     * <pre>
     * 이벤트 리스너 클래스
     * </pre>
     *
     * @class
     * @name EventListener
     * @constructor
     */
    function EventListener() {
        this._listeners = {};
    }

    /** @lends EventListener.prototype */
    extend(EventListener.prototype, {
        /** @constructs */
        constructor: EventListener,

        /**
         * <pre>
         * 이벤트 핸들러를 등록
         * </pre>
         *
         * @function
         * @param {String} name 이벤트 이름
         * @param {Function} handler 핸들러 함수
         */
        on: function (name, handler) {
            var names = name.split(/\s+/);
            for(var i = 0, len = names.length; i < len; i++) {
                (this._listeners[names[i]] || (this._listeners[names[i]] = [])).push(handler);
            }
        },

        /**
         * <pre>
         * 이벤트 핸들러를 제거
         * </pre>
         *
         * @function
         * @param {String} name 이벤트 이름
         * @param {Function} [handler] 핸들러 함수
         */
        off: function (name, handler) {
            if (!handler) {
                delete this._listeners[name];
                return;
            }

            each(this._listeners[name], function (value, key) {
                if (handler === value) {
                    delete this[key];
                    return false;
                }
            });
        },

        /**
         * <pre>
         * 이벤트 핸들러를 실행
         * </pre>
         *
         * @function
         * @param {String} name 이벤트 이름
         * @param {Array} args 핸들러함수에 넘길 인자들
         */
        trigger: function (name, args) {
            var self = this;

            if (!(name in this._listeners)) {
                return;
            }

            args = args || [];
            args.unshift({
                type: name
            });
            each(self._listeners[name], function (fn, i) {
                fn.apply(self, args);
            });
        }
    });

    var nextId = (function() {
        var _cid = 0;
        return function() {
            return _cid++;
        };
    })();

    var ParallaxScenes = function() {
        this.scenes = [];
        this.currentScene = 0;

        this._bindEvents();
    };

    extend(ParallaxScenes.prototype, {
        constructor: ParallaxScenes,

        getCurrentScene: function() {
            return this.scenes[this.currentScene];
        },

        _bindEvents: function() {
            var self = this;

            $(document).on('DOMMouseScroll mousewheel wheel', (function () {
                var timer = null;
                return function (e, delta) {
                    var scene = self.getCurrentScene();
                    if (scene.isAnimate) { e.preventDefault(); return; }
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        if (delta > 0) {
                            console.log('up');
                            scene.gotoPrevFrame();
                            if(scene.isStartFrame() && self.currentScene > 0){
                                var s = self.scenes[--self.currentScene]
                                s.play();
                            }
                            scene.play();
                        } else {
                            console.log('down');
                            scene.gotoNextFrame();
                            if(scene.isEndFrame() && self.currentScene < self.scenes.length - 1){
                                var s = self.scenes[++self.currentScene];
                                s.gotoFrame(100);
                                s.play();
                            }
                            scene.play();
                        }

                    }, 200);
                };
            })());
        },
        add: function() {
            var args = Array.prototype.slice.call(arguments);
            for(var i = 0, len = args.length; i < len; i++) {
                this.scenes.push(args[i]);
                args[i].gotoFrame(0);
                args[i].play();
            }
            return this;
        }
    });

    // ======================================== //
    // 모듈 생성자								//
    // ======================================== //
    /**
     * <pre>
     * 패럴럭스 스크롤러 클래스
     * </pre>
     *
     * @class
     * @name ParallaxScene
     * @constructor
     * @param {Object} [options] 옵션 객체
     * @param {String} [options.containerSelector=#wrap] 컨테이너 셀렉터
     * @param {String} [options.itemSelector=.kfa-item] 아이템 셀렉터
     * @param {String} [options.framesAttribute=data-kfa-frames] 프레임 속성 이름
     * @param {String} [options.easingAttribute=data-kfa-easing] 이징 속성 이름
     * @param {Number} [options.scrollSpeed=0.15] 스크롤 속도
     * @param {Boolean} [options.autoStart=false] 자동 시작 여부
     */
    ParallaxScenes.Scene  = function(el, options) {
        // 옵션 확장
        var opts = this.options = $.extend({
            itemSelector: '.kfa-item',
            framesAttribute: 'data-frames', // <div data-frame="0 {top:10} 100{top:100}"> 으로도 사용 가능
            easingAttribute: 'data-easing', // 
            easing: 'easeInOutQuad',
            duration: 600,
            totalFrame: 1000,
            scrollSize: 100, // 휠한번에 이동할 스크롤 크기
            autoStart: false
        }, options);

        // 멤버 변수
        this.$container = $(el);
        this.$items = this.$container.find(opts.itemSelector);
        this.scrollTop = this.startScrollTop = this.smoothScrollTop = 0;
        this.cid = nextId();
        this.data = [];

        // 실행 준비
        this._cacheData();
        this._bindEvents();

        // 시작
        this.gotoFrame(0);
        opts.autoStart && this.play();
    };

    // ======================================== //
    // 모듈 정적 메서드							//
    // ======================================== //
    /** @lends ParallaxScenes.Scene */
    extend(ParallaxScenes.Scene, {
        /* inherit EventListener */
        prototype: new EventListener,

        /* static properties */
        animStyles: {
            /**
             * <pre>
             * 두 프레임간의 투명도 계산
             * </pre>
             *
             * @function
             * @param {jQuery} $target 대상 jQuery 객체
             * @param {JSON} fromStyle 이전프레임의 스타일
             * @param {JSON} toStyle 현재프레임의 스타일
             * @param {Float} percent 두 프레임 사이에 위치한 스크롤의 위치값 비율
             * @return {JSON} 계산된 스타일값
             */
            opacity: function ($target, fromStyle, toStyle, percent) {
                var n = getNumberValue,
                    curr = n(toStyle.opacity),
                    prev = n(fromStyle.opacity),
                    doa = (curr - prev),
                    cssObj = {};

                if (doa != 0) {
                    if (curr < prev) {
                        doa = prev - Math.abs(doa * percent);
                    } else {
                        doa = Math.abs(doa * percent);
                    }
                } else {
                    doa = curr;
                }

                cssObj.opacity = Math.abs(doa);
                cssObj.display = (doa == 0 ? 'none' : 'block');

                return cssObj;
            },

            /**
             *
             * @param $target
             * @param fromStyle
             * @param toStyle
             * @param percent
             * @returns {{backgroundPosition: string}}
             */
            bgPos: function ($target, fromStyle, toStyle, percent) {
                var n = getNumberValue,
                    currXY = toStyle.bgPos ? [toStyle.bgPos.x, toStyle.bgPos.y] : [0, 0],
                    prevXY = fromStyle.bgPos ? [fromStyle.bgPos.x, fromStyle.bgPos.y] : [0, 0],
                    diffX = parseInt(currXY[0], 10) - parseInt(prevXY[0], 10),
                    diffY = parseInt(currXY[1], 10) - parseInt(prevXY[1], 10);

                return {
                    'backgroundPosition': Math.round(diffX * percent + (prevXY[0] | 0)) + 'px ' + Math.round(diffY * percent + (prevXY[1] | 0)) + 'px'
                };
            },

            /**
             *
             * @param $target
             * @param fromStyle
             * @param toStyle
             * @param percent
             * @returns {null}
             */
            update: function($target, fromStyle, toStyle, percent){
                var diff = Math.abs(parseInt(fromStyle.update.value, 10) - parseInt(toStyle.update.value, 10)),
                    idx = Math.round(diff * percent);
                $target.hide().eq(idx).show();
                return null;
            },

            rotate: function($target, fromStyle, toStyle, percent){
                var diff = Math.abs(getNumberValue(fromStyle.rotate) - getNumberValue(toStyle.rotate)),
                    angle = Math.round(diff * percent);
                $target.rotate(angle);
                return null;
            },

            /**
             * <pre>
             * 두 프레임간의 스타일값 비율 계산
             * </pre>
             *
             * @private
             * @function
             * @param {jQuery} $target 대상 jQuery 객체
             * @param {JSON} prevStyle 이전프레임의 스타일
             * @param {JSON} currStyle 현재프레임의 스타일
             * @param {Float} per 두 프레임 사이에 위치한 스크롤의 위치값 비율
             * @param {String} name 스타일 이름
             * @return {JSON} 계산된 스타일값
             */
            _def: function ($target, prevStyle, currStyle, per, name) {
                var n = getNumberValue,
                    pv = n(prevStyle[name]),
                    pu = prevStyle[name].unit,
                    cv = n(currStyle[name]),
                    cu = currStyle[name].unit,
                    ret = {};

                if (pu === '%') {
                    //pv = calcPercentValue($WINDOW, name, pv);
                    //pu = 'px';
                }

                if (cu === '%') {
                    //cv = calcPercentValue($WINDOW, name, cv);
                }

                ret[name] = Math.round((cv - pv) * per + pv) + pu;
                ret[name] = Number(ret[name]) || ret[name];

                return ret;
            }
        }
    });

    // ======================================== //
    // 모듈 메서드								//
    // ======================================== //
    /** @lends ParallaxScenes.Scene.prototype */
    extend(ParallaxScenes.Scene.prototype, {
        /** @constructs */
        constructor: ParallaxScenes.Scene,

        /**
         * <pre>
         * scrollTop 값 반환
         * </pre>
         *
         * @function
         * @param {Boolean} isCalc 계산여부
         * @return {Number} scrollTop
         */
        getScrollTop: function (isCalc) {
            return this.smoothScrollTop;
        },

        gotoPrevFrame: function() {
            this.gotoFrame(Math.max(0, this.scrollTop - this.options.scrollSize));
        },

        gotoNextFrame: function() {
            this.gotoFrame(Math.min(this.options.totalFrame, this.scrollTop + this.options.scrollSize));
        },

        gotoFrame: function (val) {
            this.startScrollTop = this.scrollTop;
            this.smoothScrollTop = this.scrollTop = val;
        },

        isEndFrame: function() {
            return this.scrollTop === this.options.totalFrame;
        },

        isStartFrame: function() {
            return this.scrollTop === 0;
        },

        /**
         * <pre>
         * 이벤트 바인딩
         * </pre>
         *
         * @private
         * @function
         */
        _bindEvents: function () {
            var self = this,
                opts = this.options;

            /*
            $WINDOW.on('DOMMouseScroll.parallaxscroller mousewheel.parallaxscroller wheel.parallaxscroller', (function () {
                    var timer = null;
                    return function (e) {
                        if(!self.$container[0].contains(e.target)) {
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        }

                        if (self.isAnimate) { e.preventDefault(); return; }
                        clearTimeout(timer); timer = null;
                        timer = setTimeout(function () {
                            self.trigger('scrollstart', [self.scrollTop]);
                            var delta = e.originalEvent.wheelDeltaY || e.originalEvent.wheelDelta,
                                top;

                            if (delta > 0) {
                                if(self.scrollTop === opts.scrollSize) {
                                    self.trigger('lastscroll', ['up']);
                                }
                                top = Math.max(0, self.scrollTop - opts.scrollSize);
                            } else {
                                if(self.scrollTop === opts.totalFrame - opts.scrollSize) {
                                    self.trigger('lastscroll', ['down']);
                                }
                                top = Math.min(opts.totalFrame, self.scrollTop + opts.scrollSize);
                            }
                            self.gotoFrame(top);
                            self.play();
                        }, 200);
                    };
                })());
                */

            // TODO : 밸것
            self.options.debug && $WINDOW.on('movingbar', function (e, scroll) {
                self.isAnimate = true;
                self.scrollTop = scroll;
                self.getScrollTop(true);
                self.update();
                self.isAnimate = false;
            });

            // 옵션으로 넘어온 이벤트들을 바인딩
            if (opts.on) {
                each(opts.on, function (fn, key) {
                    self.on(key, fn);
                });
            }
        },

        _lazyImages: function () {
            var self = this,
                opts = self.options;
            return (new $.Deferred(function (defer) {
                // 해당씬의 lazy이미지들을 로딩하여 모두 끝나면 .resolve() 호출
                if (opts.lazyItems && opts.lazyItems[self.scrollTop]) {
                    var $target = $(opts.lazyItems[self.scrollTop]),
                        $items = $target.find('.lazy'),
                        count = 0, total = 0,
                        loaded = function (defer) {
                            count -= 1;
                            if (!count) {
                                self.trigger('lazyloadend');
                                defer.resolve();
                                return defer;
                            }
                            self.trigger('lazyloading', [total, count]);
                        };

                    if ($target.hasClass('lazy')) {
                        $items = $items.addBack($target);
                    }
                    if (count = total = $items.length) {
                        self.trigger('lazyloadstart', [total]);

                        $items.each(function (i) {
                            var $item = $items.eq(i),
                                src = $item.attr('data-original');
                            if ($item.is('img')) {
                                $item.one('load error', function (e) {
                                    loaded(defer);
                                    if(e.type === 'error') {
                                        console.error('img load fail: ' + this.src);
                                    }
                                }).attr('src', src);
                            } else {
                                $('<img />').one('load errpr', function () {
                                    $item.css('background-image', 'url(' + src + ')');
                                    $(this).remove();

                                    loaded(defer);
                                }).attr('src', src);
                            }
                            $item.removeClass('lazy');
                        });
                        return;
                    }
                }
                defer.resolve();
            })).promise();
        },

        /**
         * <pre>
         * 데이터 캐싱
         * 필요한 데이타(엘리먼트, 프레임, css정보)를 미리 캐싱하고 data-frame속성을 파싱
         * </pre>
         *
         * @private
         * @function
         */
        _cacheData: function () {
            var self = this,
                framesAttr = this.options.framesAttribute,
                data = this.data,
                $items = this.$items,
                $e, i, d, frames;

            if (this.options.data) {
                for (i = 0; d = this.options.data[i]; i += 1) {
                    $e = $(d.target);

                    if ($e.css('position') === 'static') {
                        $e.css('position', 'absolute');
                    }

                    frames = this._parseData({ frames: d.frames });
                    if (frames.length == 0) { continue; }
                    data.push({
                        target: $e,
                        frames: frames
                    });
                }
            } else {
                for (i = 0; ($e = $items.eq(i))[0]; i += 1) {
                    if (!$e.attr(framesAttr)) {
                        continue;
                    }

                    if ($e.css('position') === 'static') {
                        $e.css('position', 'absolute');
                    }

                    frames = this._parseData($e);
                    if (frames.length == 0) { continue; }
                    data.push({
                        target: $e,
                        frames: frames
                    });
                }
            }
        },

        /**
         * 데이터 파싱
         *
         * @param {jQuery|JSON} args 대상 객체 또는 속성 정보
         * @param {String} [args.frames=''] args가 속성 정보일때 프레임 값
         * @returns {Array} 프레임 데이터 배열
         */
        _parseData: function (args) {
            var opts = this.options,
                attr = $.extend({
                    frames: ''
                }, args instanceof jQuery ? {
                    frames: args.attr(opts.framesAttribute)
                } : args),
                frameMatch,	// 0:frame
                partsMatch, // 1:frameKey, 2:frameStyle
                styleMatch,// 1:styleName, 2styleValue, 3:styleUnit 4:custom
                customMatch, style,
                combineStyle = {},
                frames = [];

            if (!attr.frames) { return []; }

            // 각 프레임을 분리
            while ((frameMatch = REGEXP_FRAME.exec(attr.frames))) {
                // 프레임과 스타일 분리
                partsMatch = frameMatch[0].match(REGEXP_PARTS);
                style = {}


                // 스타일문자열 파싱
                while ((styleMatch = REGEXP_STYLE.exec(partsMatch[2]))) {
                    style[styleMatch[1]] = {
                        value: styleMatch[2],
                        unit: styleMatch[3] || ''
                    }, customMatch = null;
                    while((customMatch = REGEXP_STYLE_VALUE.exec(styleMatch[2]))) {
                        style[ styleMatch[1] ][ customMatch[1] ] = customMatch[2];
                    }
                }

                // 프레임 배열에 저장
                each(partsMatch[1].split(/\s*,\s*/), function (val) {
                    frames.push({
                        offset: parseInt(val, 10),
                        style: style
                    });
                });
            }

            // 프레임의 offset값을 기준으로 정렬
            frames.sort(function (a, b) {
                return a.offset - b.offset;
            });

            // 이전 스타일 병합
            each(frames, function (f) {
                extend(f.style, extend(combineStyle, f.style), false);
            });

            return frames;
        },

        /**
         * <pre>
         * context 설정 함수
         * </pre>
         *
         * @param {Function} fn fn의 context를 this로 지정
         */
        context: function (fn) {
            var self = this;
            return function () {
                fn.apply(self, arguments);
            };
        },

        /**
         * <pre>
         * 캐싱된 항목을 클백함수로 하나씩 접근
         * </pre>
         *
         * @param {Function} fn 콜백 반복함수
         */
        each: function (fn) {
            each(this.data, this.context(fn));
        },

        /**
         * <pre>
         * 시작
         * </pre>
         *
         * @function
         */
        play: function (val) {
            var self = this,
                opts = self.options;

            console.log(this.cid, 'play...');

            self.isAnimate = true;
            if(arguments.length > 0) {
                self.scrollTop = val;
            }
            console.log('lazy play...');
            self._lazyImages().done(function () {
                self.trigger('animatestart');
                console.log('lazy end...');

                $({frame:self.startScrollTop}).stop().clearQueue().animate({frame:self.scrollTop}, {
                   duration: opts.duration,
                   easing: opts.easing,
                   step: function(now, fx) {
                       self.smoothScrollTop = now;
                       self.update();
                   },
                   complete: function(){
                       self.isAnimate = false;
                   }
                });
            });
        },

        /**
         * <pre>
         * 애니메이션 실행
         * 스크롤이벤트가 발생할 때 각 엘리먼트에 대한 애니메이션 처리
         * </pre>
         *
         * @function
         */
        update: function () {
            var self = this,
                scrollTop = self.getScrollTop();

            self.each(function (part, i) {
                self.setFrame(part);
            });
            this.trigger('updating', [scrollTop]);
        },

        /**
         * <pre>
         * 객체에 프레임 적용
         * 프레임에 해당하는 스타일을 엘리먼트에 적용
         * </pre>
         *
         * @param {JSON} data 해당 엘리먼트, 프레임정보, 각 프레임에 대한 스타일 정보를 담고 있는 객체
         */
        setFrame: function (data) {
            var scrollTop = this.getScrollTop(),
                target = data.target,
                frames = data.frames,
                step = frames.length,
                len = step,
                cssObj;

            for(var i = 0; i < step; i++) {
                if (scrollTop < frames[i].offset) {
                    step = i;
                    break;
                }
            }

            switch (step) {
                case 0: // 처음
                    cssObj = this.getStyleByFrame(target, frames[0]);
                    break;
                case len: // 끝
                    cssObj = this.getStyleByFrame(target, frames[step - 1]);
                    break;
                default:
                    cssObj = this.getStyleByFrames(target, frames[step - 1], frames[step]);
                    break;
            }

            cssObj && target.css(cssObj);
        },

        /**
         * <pre>
         * 두 프레임 사이의 스타일값 계산
         * </pre>
         *
         * @function
         * @param {jQuery} target 엘리먼트
         * @param {JSON} from 이전프레임
         * @param {JSON} nextFrame 현재프레임
         * @return {JSON} 계산된 스타일
         */
        getStyleByFrames: function (target, from, to) {
            // (0 - 10) /
            var self = this,
                scrollTop = self.getScrollTop(),
                per = (scrollTop - from.offset) / (to.offset - from.offset),
                fromStyle = from.style,
                toStyle = to.style,
                styles = ParallaxScenes.Scene.animStyles,
                cssObj = {};

            each(fromStyle, function (item, styleName) {
                var fn;
                if (styleName in styles) {
                    fn = styles[styleName]; // opacity, backgroundPosition 같이 별도의 처리가 필요한 스타일
                } else {
                    fn = styles['_def']; // 기본스타일
                }
                extend(cssObj, fn.call(self, target, fromStyle, toStyle, per, styleName));
            });

            return cssObj;
        },

        /**
         * <pre>
         * 특정 프레임의 스타일 반환
         * </pre>
         *
         * @function
         * @param {jQuery} target 엘리먼트
         * @param {JSON} prevFrame 이전프레임
         * @param {JSON} nextFrame 현재프레임
         * @return {JSON} 계산된 스타일
         */
        getStyleByFrame: function (target, frame) {
            var style = frame.style,
                cssObj = {};

            each(style, function (item, styleName) {
                if (styleName == 'opacity') {
                    cssObj['display'] = (item.value | 0) === 0 ? 'none' : 'block';
                }

                cssObj[styleName] = item.value + item.unit;
                cssObj[styleName] = Number(cssObj[styleName]) || cssObj[styleName];
            });

            return cssObj;
        }
    });



    // ======================================== //
    // 전역 변수 등록								//
    // ======================================== //
    window.ParallaxScenes = ParallaxScenes;

    $(document.body).append('<div id="track" style="position:fixed;bottom:0;left:0;right:0;height:30px;background-color:blue;"><span style="cursor:col-resize;width:2px;height:30px;background-color:red;display:inline-block;position:absolute;left:0;top:0;"></span></div>').find('#track').each(function () {
        $(this).on('selectstart', function (e) { e.preventDefault(); });

        var isDown = false,
            $bar = $(this).find('span'),
            $win = $(window),
            barLeft = 0;

        $(this).on('mousedown', function (e) {
            isDown = true;
            barLeft = $(this).position().left;
        });
        $(document).on('mousemove mouseup', function (e) {
            if (!isDown) { return; }
            switch (e.type) {
                case 'mousemove':
                    var scroll = Math.max(e.pageX - barLeft, 0);
                    $bar.css('left', scroll);
                    $win.triggerHandler('movingbar', [scroll]);
                    break;
                case 'mouseup':
                    isDown = false;
                    break;
            }
        });
    });

})(jQuery);
