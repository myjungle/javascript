/*!
 * @author: 김승일
 * @email: comahead@nate.com
 */
!(function ($, core, ui, undefined) {
    "use strict";

    var idx = 0, // 고유 시퀀스 용도
        nextIdx = function () {
            return idx++;
        },
        dateUtil = core.date,
        isTouch = core.isTouch;

    /**
     * 배열을 좀더 쉽게 관리하기 위한 배열헬퍼
     * @class
     * @name ArrayList
     * @extends jCore.Base
     */
    var ArrayList = core.Base.extend(/**@lends ArrayList */{
        $mixins: [core.Listener], // 해당 클래스에서 이벤트를 사용할 수 있도록 지정
        initialize: function () {
            var me = this;

            // 내부 배열
            me.list = [];
        },
        /**
         * 새로운 요소 추가
         * @param {JSON} data 새로운 요소(id속성은 반드시 존재해야 한다).
         * @returns {boolean}
         */
        add: function (data) {
            var me = this;

            if (!core.array.include(me.list, function (item) {
                // 이미 존재하는 요소는 추가하지 않는다.
                if (item.id === data.id) {
                    return true;
                }
            })) {
                // 요소 추가
                me.list.push(data);
                me.length = me.list.length;
                me.trigger('added', data);
            }
            return false;
        },
        /**
         * 주어진 id를 갖는 요소 삭제
         * @param {String} id
         */
        remove: function (id) {
            var me = this;
            core.array.remove(me.list, function (item) {
                return item.id === id;
            });
            me.length = me.list.length;
            me.trigger('removed', {id: id});
        },
        /**
         * 첫번째 요소 반환
         * @returns {*}
         */
        first: function () {
            return this.list[0];
        },
        /**
         * 마지막 요소 반환
         * @returns {*}
         */
        last: function () {
            return this.list[this.list.length - 1];
        },
        /**
         * 주어진 id를 갖는 요소가 존재하는지 체크
         * @param {String} id
         * @returns {*}
         */
        has: function (id) {
            var me = this;
            return core.array.include(me.list, function (item) {
                if (item.id === id) {
                    return true;
                }
            });
        },
        /**
         * idx번째 요소를 반환
         * @param {Number} idx
         * @returns {*}
         */
        get: function (idx) {
            if (idx < 0 || idx >= this.list.length) {
                return null;
            }
            return this.list[idx];
        },
        /**
         * 현재 배열의 반복함수
         * @param fn
         * @returns {*}
         */
        each: function (fn) {
            return core.each(this.tracks, fn);
        },
        /**
         * 배열의 요소에서 name이 value를 갖는 요소를 반환
         * @param {String} name 키명
         * @param {Mix} value 값
         * @returns {*}
         * @private
         * @example
         * _get('id', 100)
         */
        _get: function (name, value) {
            for (var i = -1, item; item = this.list[++i];) {
                if (item[name] === value) {
                    return item;
                }
            }
            return null;
        }
    });

    /**
     * 배열클래스를 이용한 플레이리스트 관리클래스
     * @class
     * @name PlayList
     * @extends ArrayList
     */
    var PlayList = ArrayList.extend(/**@lends PlayList */{
        defaults: {

        },
        /**
         * 생성자
         * @param el
         * @param options
         */
        initialize: function (el, options) {
            var me = this;

            this.callParent();
            this.$el = $(el);
            this.options = $.extend({}, this.defaults, options);
            this.currentIndex = 0;

            // 리스트 엘리먼트에 이미 항목들이 들어있으면,
            // 이를 데이터화하여 내부배열로 갖고 있는다.
            this._read();

            // 리스트에서 링크를 클릭(곡 or 삭제버튼)
            me.$el.on('click', 'a', function (e) {
                e.preventDefault();
                var $el = $(this),
                    id = $el.attr('data-id');

                if ($el.hasClass('d-remove')) {
                    // 삭제 버튼이면
                    me._removeRow(id);
                    me.trigger('removed', {id: id});
                } else {
                    // 곡 버튼
                    var data = $el.data();
                    data.title = $el.text();
                    data.src = $el.attr('href');
                    me.trigger('selected', data);
                }
            });
        },
        /**
         *
         * 리스트 엘리먼트에 이미 항목들이 들어있으면,
         * 이를 데이터화하여 내부배열로 갖고 있는다.
         * @private
         */
        _read: function () {
            var me = this,
                $items = this.$el.find('li');
            $items.each(function () {
                var data = $(this);
                me.add({
                    id: data.id + "",
                    title: data.title,
                    src: data.src
                });
            });
        },
        /**
         * 내부배열에 들어있는 데이타를 바탕으로 플레이리스트 화면을 갱신
         * @private
         */
        _render: function () {
            var me = this;
            me.$el.empty();
            me.each(function (data) {
                me._addRow(data);
            });
        },
        /**
         * 새로운 행 추가
         * @param data.id
         * @param data.src
         * @param data.title
         * @param data.artist
         * @param data.album
         * @private
         */
        _addRow: function (data) {
            var me = this;
            me.$el.append('<li><a href="' + data.src + '" data-src="' + data.src + '" data-id="' + data.id + '" data-title="' + data.title + '">' + data.title + '</a> - <a href="#" data-id="' + data.id + '" class="d-remove">X</a></li>')
        },
        /**
         * id에 해당하는 행 삭제
         * @param {String} id
         * @private
         */
        _removeRow: function (id) {
            var me = this;

            me.remove(id);
            me.$el.find('a[data-id="' + id + '"]').parent().empty().remove();
        },

        /**
         * 새로운 요소 추가
         * @param data.id
         * @param data.src
         * @param data.title
         * @param data.artist
         * @param data.album
         * @private
         */
        add: function (data) {
            if (this.has(data.id)) {
                return;
            }

            this.callParent(data);
            this._addRow(data);
        },

        /**
         * id에 해당하는 요소 삭제
         * @param {String} id
         * @private
         */
        remove: function (id) {
            if (this.has(id)) {
                return;
            }

            this.callParent(id);
            this._removeRow(id);
        },
        /**
         * 현재 요소 반환
         * @param {Number} idx
         * @returns {*}
         */
        current: function (idx) {
            if (arguments.length === 1 && idx >= 0 && idx < this.list.length) {
                this.currentIndex = idx;
            }
            return this.get(this.currentIndex);
        },
        /**
         * 다음 요소 반환
         * @returns {*}
         */
        next: function () {
            this.currentIndex = this.currentIndex + 1 >= this.list.length ? 0 : this.currentIndex + 1;
            return this.current();
        },
        /**
         * 이전 요소 반환
         * @returns {*}
         */
        prev: function () {
            this.currentIndex = this.currentIndex - 1 < 0 ? this.list.length - 1 : this.currentIndex - 1;
            return this.current();
        },
        /**
         * 주어진 값에 해당하는 항목을 활성화.
         * @param {String} name
         * @param {Mix} value
         */
        select: function (name, value) {
            var me = this;
            //core.each(where, function(value, key) {
            //console.log(me.$el.find('[data-'+key+'="'+value+'"]').length);
            var item = me._get(name, value);
            if (item) {
                me.$el.find('[data-id="' + item.id + '"]').parent().activeItem('on');
            }
            //return false;
            //});
        }
    });

    /**
     * 진행바 컨트롤 클래스
     * @class
     * @name ProgressBar
     * @extends ui.View
     */
    var ProgressBar = ui.View.extend(/**@lends ProgressBar */{
        name: 'progressBar',
        defaults: {
            direction: 'horizontal',    // 방향
            maxValue: 100,              // 최대값
            minValue: 0,                // 최소값
            distValue: 10,              // 이동크기
            titleFormat: '{0}'          // 타이틀 포맷
        },
        selectors: {
            bar: '.d-bar'               // 바
        },
        /**
         * 생성자
         * @param el
         * @param options
         */
        initialize: function (el, options) {
            if (this.callParent(el, options) === false) {
                return;
            }

            var me = this;

            me.isHoriz = me.options.direction === 'horizontal'; // 방향
            me.sizeName = me.isHoriz ? 'width' : 'height';      // 사이즈명
            me.xyName = me.isHoriz ? 'X' : 'Y';                 // 좌표방향명
            me.dirName = me.isHoriz ? 'left' : 'top';           // 방향명

            me.upKey = me.isHoriz ? 39 : 38;                    // 업키보드
            me.downKey = me.isHoriz ? 37 : 40;                  // 다운 키보드

            //me.conSize = me.$el[me.sizeName]();
            me.$bar.css(me.sizeName, 0).attr('title', '0'); // 타이틀

            me._initEvents();
        },
        /**
         * 이벤트 비인딩
         * @private
         */
        _initEvents: function () {
            var me = this;

            // 바의 위치를 클릭한 위치로 이동
            me.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var val = e['page' + me.xyName] - me.$el.offset()[me.dirName],
                    conSize = me.$el[me.sizeName](),        // 트랙사이즈
                    per = (val / conSize),                  // 퍼센테이지
                    newValue = per * me.options.maxValue;

                var e = $.Event('valuechange');
                me.triggerHandler(e, {value: newValue});
                if (e.isDefaultPrevented()) {
                    return;
                }
                me.setValue(newValue);
            });

            if (!isTouch) {
                // 비터치기반 디바이스에서 키보드의 상하좌우 키로 바를 이동시킬 수 있도록 바인딩
                var lastTime = 0;

                me.on('keydown', function (e) {
                    if (e.keyCode === me.downKey || e.keyCode === me.upKey) { // <> 38:up, 40: down
                        if (lastTime === 0) {
                            lastTime = +new Date;
                        }

                        // 키를 누른 상태가 유지되면, 0.3초마다 바를 이동
                        if ((+new Date) - lastTime < 300) {
                            return;
                        }
                        lastTime = +new Date;
                        me._moveBar(e.keyCode === me.downKey ? -1 : 1);
                    }
                }).on('keyup', function (e) {
                    if (e.keyCode === me.downKey || e.keyCode === me.upKey) {
                        me._moveBar(e.keyCode === me.downKey ? -1 : 1);
                    }
                });
            }
        },

        /**
         * 바 이동
         * @param dir -1: 감소, 1: 증가
         * @private
         */
        _moveBar: function (dir) {
            var me = this,
                newValue = 0;

            if (dir < 0) {
                newValue = Math.max(0, me.value - me.options.distValue);
            } else {
                newValue = Math.min(me.options.maxValue, me.value + me.options.distValue);
            }

            var e = $.Event('valuechange');
            me.triggerHandler(e, {value: newValue});
            if (e.isDefaultPrevented()) {
                return;
            }
            me.setValue(newValue);
        },

        /**
         * 최대값 설정
         * @param newValue
         */
        setMaxValue: function (newValue) {
            var me = this;
            me.options.maxValue = newValue;
            if (newValue < me.value) {
                me.setValue(newValue);
            }
        },

        /**
         * 값 설정
         * @param value
         */
        setValue: function (value) {
            var me = this;

            if (value < me.options.minValue || value > me.options.maxValue) {
                return;
            }

            me.value = value;
            //me.$bar[0].style[me.sizeName] = ((value / me.options.maxValue) * me.conSize) + 'px';
            me.$bar[0].style[me.sizeName] = Math.min(100, ((value / me.options.maxValue) * 100)) + '%';
        }
    });

    /**
     * 오디오 플레이어 클래스
     * @class
     * @extends ui.View
     */
    var AudioPlayer = ui('AudioPlayer', /**@lends AudioPlayer*/{
        bindjQuery: 'audioPlayer',
        defaults: {
            mediaType: 'audio/mp3',         // 기본 미디어 타입
            shuffle: false,                 // 섞기 여부
            loop: false,                    // 반복 여부
            alwaysShowHours: false,         // 시간 표시 여부
            showTimecodeFrameCount: false,  //
            framesPerSecond: 0.5,           // 초당 프렘수
            startVolume: 0.5,               // 기본 음량
            features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],
            success: function () {
                // 미디어객체가 성공적으로 생성됐을 실행할 콜백함수

            }
        },
        selectors: {
            timeTrack: '.d-timetrack',          // 타임트랙
            timeBar: '.d-timebar',              // 타임바
            time: '.d-time',                    // 타임표시 요소
            duration: '.d-duration',            // 총시간 표시 요소
            progressBar: '.d-progressbar',      // 다운로드 진행바
            volumeTrack: '.d-volumetrack',      // 볼륨트랙
            volumeBar: '.d-volumebar',          // 볼륨바
            trackList: '.d-tracklist'           // 트랙리스트
        },
        /**
         *
         * @param el
         * @param options
         */
        initialize: function (el, options) {
            var me = this;

            if (me.callParent(el, options) === false) {
                return;
            }

            me.hasTrackList = me.$trackList.length > 0;     // 트랙리스트 요소 존재여부
            me.hasTimeBar = me.$timeBar.length > 0;         // 타임트랙 요소 존배 여부
            me.hasVolumeBar = me.$volumeBar.length > 0;     // 볼륨트랙 요소 존배여부

            me._createMedia();

            if (core.isTouch) {
                // 터치기반 디바이스에서는 볼륨조절이 불가능하므로 볼륨관련 컨트롤들은 숨긴다.
                me.$('.d-vol').hide();
            }
        },

        /**
         * 미디어객체 생성
         * @private
         */
        _createMedia: function () {
            var me = this;

            if (me._initedMedia) {
                return;
            }
            me._initedMedia = true;

            var id = 'media_' + nextIdx();

            me._enables(false);
            me.$el.append('<audio id="' + id + '" type="audio/mp3" preload="auto" src="javascript:;"></audio>');

            new MediaElement(id, $.extend({}, me.options, {
                success: function (media, node) {
                    me.media = media;
                    me.$media = $(media);

                    me._initEvents();
                    me.options.success.apply(me.$el[0], arguments);
                    me.setVolume(me.options.startVolume);
                    me.triggerHandler('success', {media: media});
                },
                fail: function () {
                    me.triggerHandler('error');
                }
            }));
        },

        /**
         * 미디어객체에서 발생하는 이벤트에 핸들러 설정하고 , 현재 클래스에서 바깥으로 이벤트를 발생
         * @private
         */
        _handleMedia: function () {
            var me = this;

            me.$media.on('play pause volumechange ended loadeddata canplay seeked seeking error playing loadedmetadata timeupdate ready', function (e) {
                switch (e.type) {
                    //case  'play':
                    case  'playing':
                        me._togglePlay(true);
                        break;
                    case 'pause':
                        me._togglePlay(false);
                        break;
                    case 'ended':
                        me._togglePlay(false);
                        me._nextPlay();
                        break;
                    case 'timeupdate':
                        me._showTime();
                        break;
                    case 'canplay':
                        me._enables();
                        //me._showDuration();
                        break;
                    case 'loadeddata':
                    case 'loadedmetadata':
                        me._showDuration();
                        break;
                    case 'error':
                        me._enables(false);
                        break;
                }

                if (e.type !== 'timeupdate') {
                    console.log('type:', e.type);
                }
                me.triggerHandler(e.type, {media: me.media});
            });
        },

        /**
         * 해당 요소 내부에 있는 컨트롤들에 핸들러 설정
         * @private
         */
        _initEvents: function () {
            var me = this;

            me._handleMedia();

            me.on('click', '.d-play', function (e) {
                e.preventDefault();
                me.media.play();
            }).on('click', '.d-pause', function (e) {
                e.preventDefault();
                me.media.pause();
            }).on('click', '.d-stop', function (e) {
                e.preventDefault();

                me.media.pause();
                me.media.setCurrentTime(0);
                me.triggerHandler('stop', {media: me.media});
            }).on('click', '.d-prev', function (e) {
                e.preventDefault();
                me.prev();
            }).on('click', '.d-next', function (e) {
                e.preventDefault();
                me.next();
            }).on('click', '.d-volumeup', function (e) {
                e.preventDefault();
                me.setVolume(Math.min(1, me.media.volume + 0.1));
            }).on('click', '.d-volumedown', function (e) {
                e.preventDefault();
                me.setVolume(Math.max(0, me.media.volume - 0.1));
            }).on('click', '.d-loop', function (e) {
                e.preventDefault();

                $(this).toggleClass('on', me.isLoop = !me.isLoop);
            }).on('click', '.d-mute', function (e) {
                e.preventDefault();

                me.setMuted(!me.media.muted);
            });

            ////////////////////////////////////////////////////////////////////////////
            if (me.hasTrackList) {
                me.tracks = new PlayList(me.$trackList);
                me.tracks.on('selected', function (e, data) {
                    me.setSrc(data.src);
                    me.play();
                }).on('added', function () {
                    if (me.tracks.length === 1) {
                        me.setSrc(me.tracks.current().src);
                    }
                }).on('removed', function () {
                    if (me.tracks.length === 0) {
                        me.stop();
                        me.setSrc('');
                        me._showTime();
                        me._showDuration();
                        me._enables(false);
                    } else {
                        me.stop();
                        me.setSrc(me.tracks.next().src);
                    }
                });
                me.$media.on('playing', function () {
                    me.tracks.select('src', decodeURIComponent(me.media.src));
                });
            }

            //////////////////////////////////////////////////////////////////////////////
            if (me.hasTimeBar) {
                me.timeCtrl = new ProgressBar(me.$timeTrack[0], {
                    selectors: {
                        bar: '.d-timebar'
                    }
                }).on('valuechange', function (e, data) {
                        me.setCurrentTime(data.value);
                    });

                me.timeCtrl.setValue(0);
                me.$media.on('timeupdate ended', function (e) {
                    switch (e.type) {
                        case 'timeupdate':
                            me.timeCtrl.setValue(me.media.currentTime);
                            break;
                        case 'ended':
                            me.timeCtrl.setValue(0);
                            break;
                    }
                }).on('canplay', function () {
                    me.timeCtrl.setMaxValue(me.media.duration);
                });
            }

            /////////////////////////////////////////////////////////////////////////////
            if (me.hasVolumeBar) {
                if (mejs.MediaFeatures.hasTouch) {
                    me.$('[class^=d-vol]').hide();
                } else {
                    me.volumeCtrl = new ProgressBar(me.$volumeTrack[0], {
                        maxValue: 1,
                        distValue: 0.1,
                        value: me.options.startVolume,
                        selectors: {
                            bar: '.d-volumebar'
                        }
                    }).on('valuechange', function (e, data) {
                            if (me.media.muted) {
                                e.preventDefault();
                                return;
                            }
                            me.setVolume(data.value);
                        });

                    me.$media.on('volumechange canplay', function (e) {
                        console.log(me.media.volume);
                        me.volumeCtrl.setValue(me.media.muted ? 0 : me.media.volume);
                    });
                }
            }
        },

        /**
         * 다음곡 재생
         * @private
         */
        _nextPlay: function () {
            var me = this;

            if (me.tracks.currentIndex === me.tracks.length - 1) {
                if (me.options.loop) {
                    me.next();
                }
            } else {
                me.next();
            }
        },

        _enables: function (isEnabled) {
            if (!isEnabled) {
                this._togglePlay(false);
            }
            this.$('.d-control').prop('disabled', isEnabled === false);
        },

        /**
         * 재생버튼 토글링
         * @param isPlay
         * @private
         */
        _togglePlay: function (isPlay) {
            var me = this;

            if (isPlay) {
                me.$('.d-play').replaceClass('d-play', 'd-pause').attr('title', '정지').html('정지');
            } else {
                me.$('.d-pause').replaceClass('d-pause', 'd-play').attr('title', '재생').html('재생');
            }
        },

        /**
         * 현재 시간 표시
         * @private
         */
        _showTime: function () {
            var me = this;

            me.$time.html(mejs.Utility.secondsToTimeCode(me.media.currentTime,
                    me.options.alwaysShowHours || me.media.duration > 3600,
                me.options.showTimecodeFrameCount,
                    me.options.framesPerSecond || 25));
        },

        /**
         * 총 시간 표시
         * @private
         */
        _showDuration: function () {
            var me = this;

            me.$duration.html(me.media.duration > 0 ?
                    mejs.Utility.secondsToTimeCode(me.media.duration,
                            me.options.alwaysShowHours || me.media.duration > 3600,
                        me.options.showTimecodeFrameCount,
                            me.options.framesPerSecond || 25) :
                    ((me.options.alwaysShowHours ? '00:' : '') + (me.options.showTimecodeFrameCount ? '00:00:00' : '00:00'))
            );
        },

        /**
         * src 설정
         * @param url
         */
        setSrc: function (url) {
            var me = this;

            if (me.media.pluginType === 'native' && !('oncanplay' in document.createElement('audio'))) {
                me.$media.on('progress.canplay', function () {
                    me.$media.triggerHandler('canplay');
                    me.$media.off('progress.canplay');
                });
            }

            console.log('setSrc', url);
            me.media.setSrc(url);
        },
        /**
         * 로드
         */
        load: function () {
            this.media.load();
        },
        /**
         * 재생
         * @param time
         */
        play: function (time) {
            this.media.play(time);
        },
        /**
         * 일시정지
         */
        pause: function () {
            this.media.pause();
        },
        /**
         * 정지
         */
        stop: function () {
            this.media.stop()
        },
        /**
         * 볼륨 설정
         * @param vol
         */
        setVolume: function (vol) {
            try {
                this.media.setVolume(vol);
            } catch (e) {
            }
        },
        /**
         * 음소거
         * @param muted
         */
        setMuted: function (muted) {
            this.media.setMuted(muted);
        },
        /**
         * 재생 위치 설정
         * @param time
         */
        setCurrentTime: function (time) {
            this.media.setCurrentTime(time);
        },
        /**
         * 곡추가
         * @param data
         */
        add: function (data) {
            this.tracks.add(data);
        },
        /**
         * 다음곡 재생
         */
        next: function () {
            var me = this,
                item = me.tracks.next(true);

            me.setSrc(item.src);
            me.play();
        },
        /**
         * 이전 곡 재생
         */
        prev: function () {
            var me = this,
                item = me.tracks.prev(true);

            me.setSrc(item.src);
            me.play();
        },
        /**
         * 순서섞기
         */
        shuffle: function () {
            this.tracks.shuffle();
        }
    });


    window.AudioPlayer = AudioPlayer;
})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);


/*
 var media = new MediaElement('player2');

 // play, pause, ended,  volumechange
 var $bar = $('#progressbar');
 media.addEventListener('timeupdate', function(e) {
 var cur = e.target.currentTime,
 dur = e.target.duration;

 $bar[0].style.width = ((cur / dur) * 100) + 'px';
 });
 media.addEventListener('play', function(e) {
 $('#play').html('정지');
 });
 media.addEventListener('pause', function(e) {
 $('#play').html('재생');
 });
 media.addEventListener('ended', function(e) {
 $('#play').html('재생');
 });


 $('#play').click(function() {
 //media.setSrc('Peacock Song_AR.mp3');

 if (media.paused) {
 media.play();
 } else {
 media.pause();
 }
 });

 $('#next').click(function(){
 media.setSrc('ee.mp3');
 media.play();
 });
 */
