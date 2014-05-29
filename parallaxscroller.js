
/*!
 * Parallax Scroller
 * 
 * @author 김승일
 * @version 1.0(2013-03-11) 최초 생성
 */
(function ($) {
    "use strict";

    // ======================================== //
    // 익명함수내 전역 변수						//
    // ======================================== //
    var $win = $(window),
        REGEXP_FRAME = /\b[^{]+\s*{.*?}/gi, // 각 프레임
        REGEXP_PARTS = /([0-9\s,]+)\s*\{(.*?)\}/, // 프레임에서 key frame, easing, style 분리
        REGEXP_STYLE = /\s*([a-z\-]+)\[*([a-z]*)\]*\s*:\s*([^;|\}]+?)([px|%]*)\s*(?:;|$)/gi,// style 파싱
        REGEXP_STYLE_VALUE = /\b([a-z]+)\(([^\)]+)\)/gi,
        hasProp = Object.prototype.hasOwnProperty;

    window.console || (window.console = {log: function () {
    }});

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
        if (obj.push) {
            for (var i = 0, ln = obj.length; i < ln; i++) {
                if (fn.call(obj, obj[i], i) === false) return false;
            }
        } else {
            for (var k in obj) {
                if (hasProp.call(obj, k) && (fn.call(obj, obj[k], k) === false)) return false;
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
            obj;

        while (obj = args.shift()) {
            for (var name in obj) {
                if (!hasProp.call(obj, name) || (!over && (name in src))) {
                    continue;
                }
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

    // ======================================== //
    // RequestAnimationFrame 메서드 지원			//
    // ======================================== //
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function () {
            var lastTime = 0;

            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    var currTime = +new Date,
                        timeToCall = Math.max(0, 30 - (currTime - lastTime));

                    window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);

                    lastTime = currTime + timeToCall;
                };
        })();
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (function () {
            return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                function (id) {
                    window.clearTimeout(id);
                };
        })();
    }

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
    function ParallaxScroller(options) {
        // 옵션 확장
        var opts = this.options = $.extend({
            el: '#wrap',
            itemSelector: '.data-plx',
            framesAttribute: 'data-frames', // <div data-frame="0 {top:10} 100{top:100}"> 으로도 사용 가능
            scrollSize: 100, // 휠한번에 이동할 스크롤 크기
            duration: 1000,
            easing: 'easeInOutQuad',
            autoStart: false
        }, options);

        // 멤버 변수
        this.$el = $(opts.el);
        opts.itemSelector && (this.$items = this.$el.find(opts.itemSelector));
        this.toFrameValue = this.startFrameValue = this.currentFrameValue = 0;
        this.data = [];
        this.direction = 'down';

        // 실행 준비
        this._cacheData();
        this._bindEvents();

        // 시작
        this._initFrames();

        opts.autoStart && this.gotoAndPlay(this.options.scrollSize);
    };

    // ======================================== //
    // 모듈 정적 메서드							//
    // ======================================== //
    /** @lends ParallaxScroller */
    extend(ParallaxScroller, {
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
            opacity: function ($target, fromStyle, toStyle, percent, styleName) {
                var n = getNumberValue,
                    curr = n(toStyle.opacity),
                    prev = n(fromStyle.opacity),
                    doa = (curr - prev);

                if (doa !== 0) {
                    doa = (curr < prev ? prev : 0) - Math.abs(doa * percent);
                } else {
                    doa = curr;
                }

                return {
                    opacity: Math.abs(doa),
                    display: (doa == 0 ? 'none' : '')
                };
            },

            /**
             *
             * @param $target
             * @param fromStyle
             * @param toStyle
             * @param percent
             * @returns {{backgroundPosition: string}}
             */
            bgPos: function ($target, fromStyle, toStyle, percent, styleName) {
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
            movie: function ($target, fromStyle, toStyle, percent, styleName) {
                var diff = Math.abs(parseInt(fromStyle.movie.value, 10) - parseInt(toStyle.movie.value, 10)),
                    idx = Math.round(diff * percent) % $target.length;
                $target.hide().eq(idx).show();
                return null;
            },

            rotate: function ($target, fromStyle, toStyle, percent, styleName) {
                var diff = Math.abs(getNumberValue(fromStyle.rotate) - getNumberValue(toStyle.rotate)),
                    angle = Math.round(diff * percent) % 360;
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
             * @param {JSON} fromStyle 이전프레임의 스타일
             * @param {JSON} toStyle 현재프레임의 스타일
             * @param {Float} percent 두 프레임 사이에 위치한 스크롤의 위치값 비율
             * @param {String} styleName 스타일 이름
             * @return {JSON} 계산된 스타일값
             */
            _def: function ($target, fromStyle, toStyle, percent, styleName) {
                var num = getNumberValue,
                    fromValue = num(fromStyle[styleName]),
                    fromUnit = fromStyle[styleName].unit || 'px',
                    toValue = num(toStyle[styleName]),
                    val, ret = {};

                val = (toValue - fromValue) * percent + fromValue;
                ret[styleName] = Math.round(val) + fromUnit;
                return ret;
            }
        }
    });

    // ======================================== //
    // 모듈 메서드								//
    // ======================================== //
    /** @lends ParallaxScroller.prototype */
    extend(ParallaxScroller.prototype, {
        /** @constructs */
        constructor: ParallaxScroller,

        /**
         * <pre>
         * toFrameValue 값 반환
         * </pre>
         *
         * @function
         * @return {Number} currentFrameValue
         */
        getCurrentFrame: function () {
            return this.currentFrameValue;
        },

        gotoAndPlay: function(frame) {
            this.setScrollTop(frame);
            this.play();
        },

        gotoAndStop: function(frame) {
            this.setScrollTop(frame);
            this.update();
        },

        gotoFrame: function(frame) {
            this.startFrameValue = this.currentFrameValue = this.toFrameValue = frame;
            this.update();
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
                opts = self.options;

            if (self.options.type === 'virtual-scroll') {

                $win.off('.parallaxscroller')
                    .on('mousewheel.parallaxscroller keydown.parallaxscroller', (function () {
                        var timer = null;
                        return function (e, delta) {
                            if (e.type === 'keydown' && !(e.which === 38 || e.which === 40)) {
                                return;
                            }

                            if (self.isAnimate) {
                                e.preventDefault();
                                return;
                            }
                            if(self.options.totalFrame > self.currentFrameValue) {
                                e.preventDefault();
                            }

                            clearTimeout(timer);
                            timer = setTimeout(function () {
                                var top;
                                if (delta > 0 || e.which === 38) {
                                    top = Math.max(0, self.toFrameValue - opts.scrollSize);
                                } else if(delta < 0 || e.which === 40){
                                    top = Math.min(opts.totalFrame, self.toFrameValue + opts.scrollSize);
                                } else {
                                    return;
                                }
                                self.direction = delta > 0 ? 'up' : 'down';
                                self.trigger('scrollstart', {frame:self.currentFrameValue, direction:self.direction });
                                self.gotoAndPlay(top);
                            }, 200);
                        };
                    })());

            } else {
                // scroll 이벤트 바인딩
                $win.on('scroll.parallaxscroller',function () {
                    self.setScrollTop($win.scrollTop());
                }).trigger('scroll.parallaxscroller');
            }

            // resize 이벤트 바인딩
            // $WINDOW.on('resize.parallax', function () {
            //var h = self.$el.height();
            //self.$el.css({ top: '50%', marginTop: -h / 2 });
            // }).trigger('resize.parallax');

            // TODO : 밸것
            $win.on('movingbar', function (e, scroll) {
                self.gotoAndPlay(scroll);
            });

            // 옵션으로 넘어온 이벤트들을 바인딩
            if (opts.on) {
                each(opts.on, function (fn, key) {
                    self.on(key, fn);
                });
            }
        },

        /**
         *
         * @returns {*}
         * @private
         */
        _lazyImages: function () {
            var self = this,
                opts = self.options;
            return (new $.Deferred(function (defer) {
                // 해당씬의 lazy이미지들을 로딩하여 모두 끝나면 .resolve() 호출
                if (opts.lazyItems && opts.lazyItems[self.toFrameValue]) {
                    var $target = $(opts.lazyItems[self.toFrameValue]),
                        $items = $target.find('.lazy'),
                        count = 0, total = 0,
                        loaded = function (e, defer) {
                            if (e.type === 'error') { console.error('img load fail: ' + this.src); }
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
                                $item.one('load error',function (e) {
                                    loaded(e, defer);
                                }).attr('src', src);
                            } else {
                                $('<img />').one('load errpr',function () {
                                    $item.css('background-image', 'url(' + src + ')');
                                    $(this).remove();
                                    loaded(e, defer);
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
            var data = this.data,
                $e, i, d, frames, s;

            for (i = 0; d = this.options.data[i]; i += 1) {
                $e = $(d.target);

                frames = this._parseData({ frames: d.frames });
                if (frames.length > 0) {
                    data.push(s = {
                        target: $e,
                        frames: frames
                    });
                    if(d.easing) {
                        s.easing = d.easing;
                    }
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

            if (!attr.frames) {
                return [];
            }

            // 각 프레임을 분리
            while ((frameMatch = REGEXP_FRAME.exec(attr.frames))) {
                // 프레임과 스타일 분리
                partsMatch = frameMatch[0].match(REGEXP_PARTS);
                style = {}

                // 스타일문자열 파싱
                while ((styleMatch = REGEXP_STYLE.exec(partsMatch[2]))) {
                    style[styleMatch[1]] = {
                        value: styleMatch[3]
                    }, customMatch = null;
                    styleMatch[2] && (style[styleMatch[1]]['easing'] = styleMatch[2]);
                    styleMatch[4] && (style[styleMatch[1]]['unit'] = styleMatch[4]);

                    while ((customMatch = REGEXP_STYLE_VALUE.exec(styleMatch[2]))) {
                        style[styleMatch[1]][ customMatch[1] ] = customMatch[2];
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
        play: function () {
            var self = this,
                opts = self.options,
                _run = function () {
                    if (!self.isAnimate) {
                        return;
                    }

                    self.getCurrentFrame(true);
                    self.update();
                    requestAnimationFrame(_run);
                };

            if (opts.type === 'virtual-scroll') {
                self._lazyImages().done(function () {
                    self.isAnimate = true;
                    self.trigger('animatestart', [self.startFrameValue]);
                    $({frame: self.startFrameValue}).stop().clearQueue().animate({frame: self.toFrameValue}, {
                        duration: opts.duration,
                        easing: 'linear',
                        step: function (now, fx) {
                            self.currentFrameValue = now;
                            self.update();
                        },
                        complete: function () {
                            self.isAnimate = false;
                            self.trigger('animateend', [self.toFrameValue]);
                        }
                    });
                });
            } else {
                _run();
            }
        },

        _initFrames: function() {
            this.each(function(part) {
                //if (0 <= part.frames[0].offset) {
                    part.target.css( this._getStyleByFrame(part.target, part.frames[0]) );
                //}
            });
        },

        setScrollTop: function (val) {
            val = Math.min(val, this.options.totalFrame);
            this.startFrameValue = this.toFrameValue;
            this.toFrameValue = val;
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
                scrollTop = self.getCurrentFrame();

            self.each(function (part, i) {
                var target = part.target,
                    frames = part.frames,
                    step = frames.length,
                    len = step,
                    cssObj;

                for (var i = 0; i < step; i++) {
                    if (scrollTop < frames[i].offset) {
                        step = i;
                        break;
                    }
                }

                switch (step) {
                    case 0: // 처음
                        cssObj = this._getStyleByFrame(target, frames[0]);
                        break;
                    case len: // 끝
                        cssObj = this._getStyleByFrame(target, frames[step - 1]);
                        break;
                    default:
                        cssObj = this._getStyleByFrames(target, frames[step - 1], frames[step], part.easing);
                        break;
                }

                cssObj && target.css(cssObj);
            });
            self.trigger('animating', [scrollTop]);
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
        _getStyleByFrames: function (target, from, to, easingFn) {
            var self = this,
                currentFrame = self.getCurrentFrame(),
                percent = (currentFrame - from.offset) / (to.offset - from.offset),
                fromStyle = from.style, toStyle = to.style,
                duration = self.options.duration,
                styles = ParallaxScroller.animStyles,
                defaultEasing = $.easing[self.options.easing],
                cssObj = {};

            if (easingFn) {
                percent = $.easing[ easingFn ](percent, duration * percent, 0, 1, duration);
            } else {
                percent = defaultEasing(percent, duration * percent, 0, 1, duration);
            }

            each(fromStyle, function (item, styleName) {
                var fn = styles[styleName in styles ? styleName : '_def']; // opacity, backgroundPosition 같이 별도의 처리가 필요한 스타일

                extend(cssObj, fn.call(self, target, fromStyle, toStyle, percent, styleName));
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
        _getStyleByFrame: function (target, frame) {
            var style = frame.style,
                styles = ParallaxScroller.animStyles,
                cssObj = {};

            each(style, function (item, styleName) {
                var fn = styles[styleName in styles ? styleName : '_def'];
                extend(cssObj, fn.call(self, target, frame.style, frame.style, 0, styleName));
            });

            return cssObj;
        }
    });

    // ======================================== //
    // 전역 변수 등록								//
    // ======================================== //
    window.ParallaxScroller = ParallaxScroller;

    $(document.body).append('<div id="track" style="position:fixed;bottom:0;left:5px;right:0;height:30px;background-color:blue;"><span style="cursor:col-resize;width:2px;height:30px;background-color:red;display:inline-block;position:absolute;left:0;top:0;"></span></div>').find('#track').each(function () {
        $(this).on('selectstart', function (e) {
            e.preventDefault();
        });

        var isDown = false,
            $bar = $(this).find('span'),
            $win = $(window),
            barLeft = 0;

        $(this).on('mousedown', function (e) {
            isDown = true;
            barLeft = $(this).position().left;
        });
        $(document).on('mousemove mouseup', function (e) {
            if (!isDown) {
                return;
            }
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
