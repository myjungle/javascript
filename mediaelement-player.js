/*!
 * @author: 김승일
 * @email: comahead@nate.com
 */
!(function () {
    "use strict";

    var idx = 0, // 고유 시퀀스 용도
        core = jint,
        nextIdx = function () {
            return idx++;
        },
        dateUtil = core.date,
        isTouch = core.isTouch;

    /**
     * 배열을 좀더 쉽게 관리하기 위한 배열래퍼
     * @class
     * @name ArrayList
     * @extends jint.Base
     */
    var ArrayList = core.Base.extend(/**@lends ArrayList */{
        $mixins: [core.Listener], // 해당 클래스에서 이벤트를 사용할 수 있도록 지정,
        $statics: {
            ON_ADDED: 'added',
            ON_REMOVEDITEM: 'removeditem',
            ON_REMOVEDALL: 'removeall'
        },
        defaults: {

        },
        initialize: function (options) {
            var me = this;

            me.options = $.extend(true, {}, me.defaults, options);

            me.currentIndex = 0;

            // 내부 배열
            me.list = [];
        },
        clean: function () {
            this.list = [];
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
        remove: function (ids) {
            var me = this;

            ids = core.isArray(ids) ? ids : [].push(ids);
            core.each(ids, function(id) {
                core.array.remove(me.list, function (item) {
                    if (item.id + '' === id + '') {
                        me.trigger('removeditem', {id: id});
                        return true;
                    }
                });
            });
            me.length = me.list.length;
            me.currentIndex = Math.min(me.currentIndex, me.length - 1);
            me.trigger('removedall', {tracks: ids});
        },

        /**
         * 현재 요소 반환
         * @returns {*}
         */
        current: function (id) {
            if(id) {
                this._setCurrentIndexById(id);
            }
            return this.at(this.currentIndex);
        },
        /**
         * id에 해당하는 항목으로 선택
         * @param id
         * @returns {number}
         */
        _setCurrentIndexById: function(id) {
            var idx = 0;
            for(var i = 0; i < this.list.length; i++) {
                if(this.list[i].id+'' === id+'') {
                    this.currentIndex = i;
                    break;
                }
            }
        },

        indexOf: function(id) {
            for(var i = 0; i < this.list.length; i++) {
                if(this.list[i].id+'' === id+'') {
                    return i;
                }
            }
            return -1;
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
                if (item.id + '' === id + '') {
                    return true;
                }
            });
        },
        /**
         * idx번째 요소를 반환
         * @param {Number} idx
         * @returns {*}
         */
        at: function (idx) {
            if (idx < 0 || idx >= this.list.length) {
                return null;
            }
            return this.list[idx];
        },

        get: function (id) {
            return this.find('id', id);
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
         * 배열의 요소에서 name이 value를 갖는 요소를 반환
         * @param {String} name 키명
         * @param {Mix} value 값
         * @returns {*}
         * @private
         * @example
         * find('id', 100)
         */
        find: function (name, value) {
            for (var i = -1, item; item = this.list[++i];) {
                if (item[name]+'' === value+'') {
                    return item;
                }
            }
            return null;
        },

        sort: function(ids) {
            var res = [];
            core.each(ids, function (item, i) {
                res.push(this.get(item));
            }.bind(this));
            this.list = res;;
            this.currentIndex = Math.min(this.currentIndex, this.tracks.length - 1);
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

            //me.conSize = me.$el[me.sizeName]();
            me.$bar.css(me.sizeName, 0).css('cursor', 'pointer').attr('title', '0'); // 타이틀
            me.$el.css('cursor', 'pointer');

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
                    per = ((me.isHoriz ? val : conSize - val) / conSize),                  // 퍼센테이지
                    newValue = (per * me.options.maxValue);

                var e = $.Event('valuechange');
                me.triggerHandler(e, {value: newValue});
                if (e.isDefaultPrevented()) {
                    return;
                }
                me.setValue(newValue);
            });

            me._bindKeyboardEvents();
        },

        _bindKeyboardEvents: function () {
            var me = this;

            if (!isTouch) {
                // 비터치기반 디바이스에서 키보드의 상하좌우 키로 바를 이동시킬 수 있도록 바인딩
                me.upKey = me.isHoriz ? 39 : 38;                    // 업키보드
                me.downKey = me.isHoriz ? 37 : 40;                  // 다운 키보드
                var lastTime = 0;

                me.on('keydown', function (e) {
                    if (e.keyCode === me.downKey || e.keyCode === me.upKey) { // <> 38:up, 40: down
                        e.stopPropagation();
                        e.preventDefault();

                        if (lastTime === 0) {
                            lastTime = +new Date;
                        }

                        // 키를 누른 상태가 유지되면, 0.3초마다 바를 이동
                        if ((+new Date) - lastTime < 200) {
                            return;
                        }

                        lastTime = +new Date;
                        me._moveBar(e.keyCode === me.downKey ? -1 : 1);
                    }
                }).on('keyup', function (e) {
                    if (e.keyCode === me.downKey || e.keyCode === me.upKey) {
                        e.stopPropagation();
                        e.preventDefault();

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

    var Dropdown = {
        $dropdown: $(),
        $btn: $(),
        bind: function (el) {
            var me = this;
            $(el).on('click', '.d-toggle', function (e) {
                e.stopPropagation();

                var $el = $(this),
                    isOn = $el.hasClass('on'),
                    $layer = $el.siblings($el.attr('data-target'));

                me.hide();
                me.$btn = $el.toggleClass('on', !isOn);
                me.$dropdown = $layer.toggleClass('none', isOn);
            }).on('click', '.layer', function (e) {
                e.stopPropagation();
            }).on('click', '.layer .btn_close', function (e) {
                e.stopPropagation();
                me.hide();
            });

            /*$(document).on('click.dropdown', function () {
                me.hide();
            });*/
        },

        hide: function () {
            var me = this;
            me.$dropdown.addClass('none');
            me.$btn.removeClass('on');
        }

    };

    var PlayList = ui.View.extend({
        name: 'PlayList',
        selectors: {
            list: '.d-tracklist'
        },
        initialize: function(el, options) {
            var me = this;

            if (me.callParent(el, options) === false) {
                return;
            }

            // 트랙 클릭 시
            me.$list.on('click', 'a', function(e) {
                e.preventDefault();
                me.triggerHandler('selected', {id: $(this).attr('data-id')});
            });
            me.on('click', '.d-removeall', function (e) {
                // 선택삭제
                e.preventDefault();
                var tracks = me.getCheckedList();
                me.$list.find('input:checked').closest('li').empty().remove();
                me.triggerHandler('removedtrack', {tracks: tracks});
            }).on('click', '.d-up', function() {
                me.$list.find('input:checked').parent().each(function () {
                    var $prev = $(this).prev();
                    if($prev.length) {
                        $(this).after($prev);
                    }
                });

                me.$list.children().each(function(i) {
                    $(this).find('>span.num').text(i + 1);
                });
                me.triggerHandler('moveditem', {dir: 'up'});
            }).on('click', '.d-down', function() {
                core.each(core.array.reverse(me.$list.find('input:checked').parent()), function () {
                    var $next = $(this).parent().next();
                    if($next.length) {
                        $(this).parent().before($next);
                    }
                });

                me.$list.children().each(function(i) {
                    $(this).find('>span.num').text(i + 1);
                });
                me.triggerHandler('moveditem', {dir: 'down'});
            }).on('click', '.check_all input:checkbox', function () {
                // 전체선택
                me.$list.find('input:checkbox').prop('checked', $(this).prop('checked'));
            });
        },

        getCheckedList: function () {
            var res = [];
            this.$el.find('input:checkbox:checked').each(function () {
                res.push(this.value);
            });
            return res;
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
        addRow: function (data) {
            var me = this;

            me.$list.append(
                ['<li class="d-track-'+data.id+'">',
                        '<input type="checkbox" name="" value="'+data.id+'" title="'+data.title+' 곡 선택하기">',
                    '<span class="num"></span>',
                        '<span class="title"><a href="#" data-id="'+data.id+'">'+data.title+'</a></span>',
                        '<span>'+data.artist+'</span>',
                    '</li>'].join(''));

            me.$list.children().each(function(i) {
                $(this).find('>span.num').text(i + 1);
            });
        },

        /**
         * id에 해당하는 행 삭제
         * @param {String} id
         * @private
         */
        removeRow: function (id) {
            var me = this;

            //me.options.list.remove(id);
            me.$list.find('.d-track-' + id + '').empty().remove();
            me.$list.children().each(function(i) {
                $(this).find('>span.num').text(i + 1);
            });
        },

        select: function (id) {
            var me = this;

            me.$list.find('.d-track-'+id).activeItem();
        }
    });

    /**
     * 오디오 플레이어 클래스
     * @class
     * @extends ui.View
     */
    var AudioPlayer = ui('JintAudioPlayer', {
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
            volumeBar: '.d-volumebar',           // 볼륨바
            playlistLayer: '.d-playlistlayer'
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

            me.hasPlaylistLayer = me.$playlistLayer.length > 0;     // 트랙리스트 요소 존재여부
            me.hasTimeBar = me.$timeBar.length > 0;         // 타임트랙 요소 존배 여부
            me.hasVolumeBar = me.$volumeBar.length > 0;     // 볼륨트랙 요소 존배여부

            me.$('.d-control').disabled();
            me._createMedia();

            if (core.isTouch) {
                // 터치기반 디바이스에서는 볼륨조절이 불가능하므로 볼륨관련 컨트롤들은 숨긴다.
                me.$('.d-vol').hide();
            }

            Dropdown.bind(me.$el);

            me.iidx = 0;
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

            me.enables(false);
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
                        me._togglePlayButton(true);
                        me._setTrackInfo();
                        break;
                    case 'pause':
                        me._togglePlayButton(false);
                        break;
                    case 'ended':
                        me._togglePlayButton(false);
                        me._checkNextPlay();
                        break;
                    case 'timeupdate':
                        me._showTime();
                        break;
                    case 'canplay':
                        me.enables();
                        break;
                    case 'loadeddata':
                    case 'loadedmetadata':
                        me._showDuration();
                        break;
                    case 'error':
                        me.enables(false);
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
                var track = me.tracks.current();
                if(!track) { return; }
                me.stop();
                me.setSrc(track.src);
                me.play(0);
            }).on('click', '.d-pause', function (e) {
                e.preventDefault();
                me.pause();
            }).on('click', '.d-stop', function (e) {
                e.preventDefault();

                me.pause();
                me.setCurrentTime(0);
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

            me._initProgress();

            ////////////////////////////////////////////////////////////////////////////

            me.tracks = new ArrayList();
            me.tracks.on('added', function (e, track) {
                if (me.tracks.length === 1) {
                    me.setSrc(track.src);
                }
                // TODO
                console.log('add count:', me.tracks.length, ', index:', me.tracks.currentIndex, ', list:', me.tracks.list);
            }).on('removedall', function () {
                // TODO
                console.log('add count:', me.tracks.length, ', index:', me.tracks.currentIndex, ', list:', me.tracks.list);
                 if (me.tracks.length === 0) {
                     me.initPlayer();
                 } else {
                     if(!me.media.paused) {
                         var track = me.tracks.current();
                         if(!track) { return; }

                         me.stop();
                         me.setSrc(track.src);
                         me.play();
                     }
                 }
            });

            if (me.hasPlaylistLayer) {
                me.playList = new PlayList(me.$playlistLayer);
                me.playList.on('selected', function (e, data) {
                    e.preventDefault();
                    me.playById(data.id);
                }).on('removedtrack', function (e, data) {
                    me.tracks.remove(data.tracks)
                });

                me.tracks.on('added', function (e, data) {
                    me.playList.addRow(data);
                });

                me.$media.on('playing', function () {
                    me.playList.select(me.tracks.current().id);
                });
            }

        },

        _initProgress: function() {
            var me = this;
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
                        direction: 'vertical',
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
                        me.$('.d-volumevalue').text(me.media.muted ? 0 : parseInt(me.media.volume * 100, 10));
                        me.volumeCtrl.setValue(me.media.muted ? 0 : me.media.volume);
                    });
                }
            }
        },

        _setTrackInfo: function (track) {
            var me = this,
                track = track || me.tracks.current();

            if(!track) { return; }

            me.$('.d-title').text(track.title || '제목없음');
            me.$('.d-artist').text(track.artist || '아티스트명');
            me.$('.d-lyricbox').text(track.lyrics||'가사가 없습니다.');
            me.$('.d-control.down').attr('data-id', track.id || '');

            if(me.hasPlaylistLayer && track.id) {
                me.playList.select(track.id);
            }
        },

        /**
         * 다음곡 재생
         * @private
         */
        _checkNextPlay: function () {
            var me = this;

            if (me.tracks.currentIndex === me.tracks.length - 1) {
                if (me.options.loop) {
                    me.next();
                }
            } else {
                me.next();
            }
        },

        enables: function (isEnabled) {
            if (!isEnabled) {
                this._togglePlayButton(false);
            }

            this.$('.d-control').disabled(isEnabled === false);
        },

        /**
         * 재생버튼 토글링
         * @param isPlay
         * @private
         */
        _togglePlayButton: function (isPlay) {
            var me = this;

            if (isPlay) {
                me.$('.d-play').replaceClass('d-play play', 'd-pause pause').attr('title', '정지').html('정지');
            } else {
                me.$('.d-pause').replaceClass('d-pause pause', 'd-play play').attr('title', '재생').html('재생');
            }
        },

        /**
         * 현재 시간 표시
         * @private
         */
        _showTime: function () {
            var me = this;
            if(!me._lastTime) {
                me._lastTime = +new Date;
            }
            if((+new Date - me._lastTime) > 1000) {
                me.$time.html(mejs.Utility.secondsToTimeCode(me.media.currentTime,
                        me.options.alwaysShowHours || me.media.duration > 3600,
                    me.options.showTimecodeFrameCount,
                        me.options.framesPerSecond || 25));

                me._lastTime = +new Date;
            }
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
         *
         */
        initPlayer: function () {
            var me = this;

            me.stop();
            me.setSrc('');
            me._showTime();
            me._showDuration();
            me.enables(false);
            me._setTrackInfo({});
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
            if(!this.media.paused) { return; }
            this.media.play(time);
        },
        /**
         *
         * @param time
         * @param id
         */
        playById: function (time, id) {
            var track = this.tracks.current(id);
            this.playByTrack(track);
        },
        /**
         *
         * @param track
         */
        playByTrack: function (track) {
            if(track) {
                this.stop();
                this.setSrc(track.src);
                this.play();
            }
        },
        sort: function(ids) {
            this.tracks.sort(ids);
        },

        /**
         * 일시정지
         */
        pause: function () {
            if(this.media.paused) { return; }
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


})();

