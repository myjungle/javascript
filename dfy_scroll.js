/*
 * 스크롤바에 디자인을 입히기 위한 대체 스크립트
 * Alternate script for scrollbar design
 * Info - http://www.psyonline.kr/1330044766
 * Demo - http://www.psyonline.kr/plugin/fakescroll/demo.html
 */


var fakescroll = function() {


    var fs = {};

    //전체 스크롤바에 적용되는 공통 기본 옵션
    //animate, useswipe, tag, usetransform 을 제외한 옵션은 x, y를 구분해서 따로 사용가능
    fs.defaultoption = {

        //track, arrow에 mousedown할 때, 또는 wheel을 사용할 때 적용되는 한 번에 이동되는 크기(숫자).
        scrollsize: 100,

        //이동 되는 크기를 주어진 값에 맞게 조절(숫자, 사용하지 않을 경우 0).<br />
        //이 옵션을 사용할 경우 이벤트 함수에서 pageLeft, pageTop, totalPageLeft, totalPageTop값 속성을 사용할 수 있음.
        scrollsizefix: 0,

        //bar사용을 제외하고, 스크롤 될 때 이동 되는 크기를 고정할 것인지 여부(true 또는 false).
        //scrollsizefix값이 지정되어 있지 않으면 scrollsize값으로 지정되고, scrollsizefix값이 지정되어 있으면 해당 값으로 scrollsize값을 변경함.
        //이 옵션을 사용할 경우 이벤트 함수에서 pageLeft, pageTop, totalPageLeft, totalPageTop값 속성을 사용할 수 있음.
        //hide옵션을 주고, 이벤트와 함께 carousel 형식의 화면도 구현 가능.
        scrollsizelock: false,

        //arrow를 포함한 track의 길이
        //사용하지 않을 경우(0), target 또는 outsidetrack옵션으로 주어진, track의 parent가 되는 엘리먼트의 client(내부) 크기로 지정됨.
        //고정할 경우에는 숫자로 지정.
        //'+', '-' 와 함께 문자로 지정할 경우(ex: '-20', '+40'), target 또는 outsidetrack옵션으로 주어진, track의 parent가 되는 엘리먼트의 client(내부) 크기에 대해 상대적으로 지정됨.
        //고정(숫자)이 아니고, x/y track의 parent가 같고, x/y 스크롤이 모두 생길 경우, 각각 서로의 넓이 또는 높이 만큼 길이가 줄어들고 scrollbar.neutralzone 이 display:block 됨.
        tracksize: 0,

        //track을 target 외부에서 사용할 경우 지정(엘리먼트 자체 또는 id(문자))
        outsidetrack: null,

        //bar의 길이(숫자(고정) 또는 'auto'(비율에 맞춤)).
        barsize: 'auto',

        //bar의 최소 길이(숫자)
        barminsize: 20,

        //track에 넣을 html(문자). CSS만으로는 해결이 안될 때. ㅋㅋ
        trackhtml: '',

        //bar에 넣을 html(문자). 이것도 CSS만으로는 해결이 안될 때.
        barhtml: '',

        //애니매이션 효과 사용 여부(true 또는 false).
        //swipe에서의 animation은 관련 없음.
        animate: true,

        //track을 표시하지 않을 것인지 여부(true 또는 false).
        //true일 경우 track과 안쪽의 bar, arrow 모두 생성하지 않음. swipe나 wheel을 이용한 스크롤은 가능.
        hide: false,

        //track(bar, arrow 포함)에 컨트롤 기능을 뺄 것인지 여부(true 또는 false).
        //true일 경우, css pointer-events:none 도 지정하기 때문에 지원되는 브라우저에서는 bar가 보이더라도 bar 부분에서 swipe 가능.
        nointeract: false,

        //컨텐츠 영역을 swipe(드래그)가능하게 할 것인지 여부(true 또는 false).
        useswipe: true,

        //컨텐츠 영역을 swipe(드래그)할 경우 방향에 따라 주 방향을 결정해서 고정할 것인지 여부(true 또는 false)
        directionlock: true,

        //스크롤 기능을 사용하지 않을 것인지 여부(true 또는 false).
        //true로 설정 시 스크롤 기능이 아예 없어지고, x/y 모두 disable이 true일 경우 wrapper를 제거하고 null 반환(.remove() 실행).
        disable: false,

        //x, y 스크롤이 더 이상 스크롤 될 값이 없는 경우에도 상위 엘리먼트의 스크롤을 막을것인지 여부(true 또는 false).
        //blockparentscroll을 사용할 경우 스크롤 될 값이 없어도 swipe 가능. x, y 둘 다 없을 경우 y가 우선.
        blockparentscroll: false,

        //스크롤 바를 만드는 데 사용할 태그명(문자).
        //지정된 태그가 block 요소가 아닐 경우 css에서 display:block;을 추가.
        tag: 'div',

        //스크롤 될 때 wrapper에 css transform을 사용할 것인지 여부('translate3d' 또는 'translate'. 사용하지 않을 경우 false).
        //'translate3d'로 지정할 경우 translate3d 적용. 브라우저가 지원하지 않을 경우 translate 적용.
        //css transform을 지원하지 않거나 false일 경우 margin을 사용.
        //css transform이 적용되었을 경우 환경에 따라 다소 느려질 수 있고, 이벤트의 layer(X|Y)값을 구하려면 이벤트의 page(X|Y)와, offset(Left|Top), scrollbar의 scroll(Left|Top)() 등을 이용해 구해야함.
        usetransform: 'translate3d'

    };

    //스크롤 track, bar, arrow, content에 지정할 css 클래스 명
    fs.cssclass = {
        content: 'scroll-content',
        neutralzone: 'scroll-neutralzone',
        x: ['scroll-track scroll-track-x', 'scroll-bar scroll-bar-x', 'scroll-arrow scroll-arrow-left', 'scroll-arrow scroll-arrow-right', 'scroll-content-x'],
        y: ['scroll-track scroll-track-y', 'scroll-bar scroll-bar-y', 'scroll-arrow scroll-arrow-up', 'scroll-arrow scroll-arrow-down', 'scroll-content-y'],
        iosmode: 'ios'
    };


    //부모 엘리먼트의 스크롤바 이벤트를 해제, reset을 위해 생성된 스크롤바 오브젝트들을 저장
    fs.items = [];

    //스크롤 생성 함수
    //parameters : (target 엘리먼트 자체 또는 id(문자), 옵션);
    //return 스크롤바 오브젝트
    fs.set = function(target, option, preset) {

        var i, j, max, flag, scrollbar, usetransform, childs, scroll, arrowflags, tag,
            defaultoption = fs.defaultoption,
            cssclass = fs.cssclass,
            items = fs.items,
            handle = fs.handle,
            create = fs.createtag,
            fscrollbar = fs.scrollbar,
            style = fs.style,
            findelement = fs.findelement,
            remove = fs.remove,
            browser = fs.browser,
            notdisplayed = false;

        //target이 엘리먼트인지 확인
        target = findelement(target);

        //target이 없거나 엘리먼트가 아닌 경우 취소
        if (!target) {
            return null;
        }

        //이미 지정되어 있는 경우 remove
        for (i = 0, max = items.length; i < max; i++) {
            if (items[i] && items[i].target == target) {
                items[i] = remove(items[i]);
                break;
            }
        }

        //target의 기본 scroll 값을 초기화
        target.scrollTop = 0;
        target.scrollLeft = 0;

        //target에 기본 스크롤바를 감춤
        target.style.overflow = 'hidden';

        //target에 position이 static일 경우 relative로 변경.
        if (style.get(target, 'position') == 'static') {
            style.set(target, 'position', 'relative');
        }

        //target의 display가 none 상태일 경우 임시로 block.
        if (style.get(target, 'display') == 'none') {
            style.set(target, 'display', 'block');
            notdisplayed = true;
        }

        option = option || {};
        tag = option.tag || defaultoption.tag;

        //반환 될 scroll bar object
        //animate, useswipe, directionlock, usetransform 속성은 x, y 구분하지 않고 공통으로 사용.
        scrollbar = {

            id: items.length,
            target: target,

            animate: (option.animate != undefined) ? option.animate : defaultoption.animate,
            useswipe: (option.useswipe != undefined) ? option.useswipe : defaultoption.useswipe,
            directionlock: (option.directionlock != undefined) ? option.directionlock : defaultoption.directionlock,
            slidermode: option.slidermode,
            wcp: ['marginLeft', 'marginTop']

        };

        //wrapper에 적용할 css 속성. transform을 사용할 경우 재지정.
        usetransform = (option.usetransform != undefined) ? option.usetransform : defaultoption.usetransform;
        if (usetransform && browser.support.transform && (browser.support.translate3d || browser.support.translate)) {
            scrollbar.wcp = (browser.support.translate3d && usetransform == 'translate3d') ? ['tx3d', 'ty3d'] : ['tx', 'ty'];
        }

        //이벤트를 document에 적용해야할 경우
        //해당 scrollbar object를 가져오기가 애매해서 closure로 접근해서 함수 인수로 넘기게.
        scrollbar.handle = {
            start: function(e) {
                handle.start(scrollbar, this, e);
            },
            end: function(e) {
                handle.end(scrollbar, e);
            },
            barmove: function(e) {
                handle.barmove(scrollbar, e);
            },
            wheel: function(e) {
                handle.wheel(scrollbar, e);
            },
            swipe: function(e) {
                handle.swipe(scrollbar, e);
            },
            swipeend: function(e) {
                handle.swipeend(scrollbar, e);
            },
            killautoscroll: function(e) {
                fs.killautoscroll(scrollbar);
            }
        };

        //wrapper 엘리먼트 추가
        scrollbar.wrapper = create(scrollbar, tag, cssclass.content, 'wrapper');
        childs = target.childNodes;
        for (i = 0, max = childs.length; i < max; i++) {
            scrollbar.wrapper.appendChild(childs[i]);
            max--;
            i--;
        }
        target.appendChild(scrollbar.wrapper);

        //focus 시 해당 엘리먼트로 스크롤하기 위해 모든 엘리먼트에 onfocus 이벤트 추가
        childs = scrollbar.wrapper.getElementsByTagName('*');
        for (i = 0, max = childs.length; i < max; i++) {
            fs.event.add(childs[i], 'focus', function() {
                var me = this;
                setTimeout(function() {
                    scrollbar.target.scrollTop = 0;
                    scrollbar.scrollTo(me);
                }, 0);
            });
        }

        //scrollbar 변수에 속성 설정 및 엘리먼트 추가
        arrowflags = ['left', 'right', 'up', 'down'];
        for (i = 0; i < 2; i++) {

            flag = (!i) ? 'x' : 'y';

            scrollbar[flag] = {};
            option[flag] = option[flag] || {};

            //disable일 경우
            if (option.disable || option[flag].disable) {

                scrollbar[flag].disable = true;
                scrollbar[flag].blockparentscroll = option[flag].blockparentscroll || option.blockparentscroll || defaultoption.blockparentscroll;

                //아닐 경우 defaultoption에 해당하는 값을 scrollbar변수에 추가
            } else {

                //함수 인수 option 또는 option의 x, y를 확인하고 있을 경우 사용
                //option[flag] > option > defaultoption
                //animate, useswipe, directionlock, tag, usetransform 속성은 x, y 별도 옵션에서는 삭제
                for (j in defaultoption) {
                    if (j != 'animate' && j != 'useswipe' && j != 'tag' && j != 'usetransform' && j != 'directionlock') {
                        scrollbar[flag][j] = option[flag][j] || option[j] || defaultoption[j];
                    }
                }

                //현재값 초기화
                scrollbar[flag].now = 0;

                //이동할 값 초기화
                scrollbar[flag].to = 0;

                //page 초기화
                scrollbar[flag].nowpage = 0;
                scrollbar[flag].totalpage = 1;

                //scrollsizelock이 걸려있으면 scrollsize와 scrollsizefix를 동일하게 설정
                if (scrollbar[flag].scrollsizelock) {
                    if (!scrollbar[flag].scrollsizefix) {
                        scrollbar[flag].scrollsizefix = scrollbar[flag].scrollsize;
                    } else {
                        scrollbar[flag].scrollsize = scrollbar[flag].scrollsizefix;
                    }
                }

                //hide가 아닐 경우에만 track, bar, arrow 생성 및 속성 설정
                if (!scrollbar[flag].hide) {

                    //outsidetrack이 엘리먼트인지 확인
                    scrollbar[flag].outsidetrack = findelement(scrollbar[flag].outsidetrack);

                    //tracksizefix속성을 추가하고 option에 tracksize가 있을 경우 고정값인지 상대값인지 확인
                    scrollbar[flag].tracksizefix = false;
                    if (scrollbar[flag].tracksize) {
                        //고정값 확인
                        if (typeof(scrollbar[flag].tracksize) == 'number') {
                            scrollbar[flag].tracksizefix = true;
                        } else if (typeof(scrollbar[flag].tracksize) == 'string') {
                            //상대값(+, -)확인. 형식에 맞지 않으면 0(사용안함)으로 설정
                            if ((/^(\-|\+)[1-9]/).test(scrollbar[flag].tracksize)) {
                                scrollbar[flag].tracksize = parseInt(scrollbar[flag].tracksize);
                            } else {
                                scrollbar[flag].tracksize = 0;
                            }
                        }
                    }

                    //track 생성
                    scrollbar[flag].track = create(scrollbar, tag, cssclass[flag][0], 'track-' + flag, flag);
                    if (scrollbar[flag].trackhtml) {
                        scrollbar[flag].track.innerHTML = scrollbar[flag].trackhtml;
                    }

                    //no interact 옵션이 있으면 css pointer events도 지정
                    if (scrollbar[flag].nointeract) {
                        scrollbar[flag].track.style.pointerEvents = 'none';
                    }

                    //bar 생성 후 track에 append
                    scrollbar[flag].bar = create(scrollbar, tag, cssclass[flag][1], 'bar-' + flag, flag);
                    if (scrollbar[flag].barhtml) {
                        scrollbar[flag].bar.innerHTML = scrollbar[flag].barhtml;
                    }
                    scrollbar[flag].track.appendChild(scrollbar[flag].bar);

                    //track container 설정 후 append. outsidetrack이 지정된 경우 outsidetrack에 넣음.
                    scrollbar[flag].trackcontainer = scrollbar[flag].outsidetrack || target;
                    scrollbar[flag].trackcontainer.appendChild(scrollbar[flag].track);

                    //track container에 position이 static일 경우 relative로 변경.
                    if (style.get(scrollbar[flag].trackcontainer, 'position') == 'static') {
                        style.set(scrollbar[flag].trackcontainer, 'position', 'relative');
                    }

                    //arrow 크기
                    scrollbar[flag].arrowsize = [0, 0];

                    //slider모드가 아닐 경우에만 arrow 생성
                    if (!scrollbar.slidermode) {

                        //arrow 생성 후 track에 append
                        scrollbar[flag].arrow = [
                            create(scrollbar, tag, cssclass[flag][2], 'arrow-' + arrowflags[i * 2], flag),
                            create(scrollbar, tag, cssclass[flag][3], 'arrow-' + arrowflags[i * 2 + 1], flag)
                        ];
                        scrollbar[flag].track.appendChild(scrollbar[flag].arrow[0]);
                        scrollbar[flag].track.appendChild(scrollbar[flag].arrow[1]);

                        //arrow[0]의 offsetWidth가 없을 경우 arrow를 사용하지 않는 것으로 간주. arrow제거
                        if (!scrollbar[flag].arrow[0].offsetWidth) {
                            scrollbar[flag].track.removeChild(scrollbar[flag].arrow[0]);
                            scrollbar[flag].track.removeChild(scrollbar[flag].arrow[1]);
                            scrollbar[flag].arrow = null;
                            //아닐경우 arrow size 계산. arrow와 bar의 간격을 사용하기 위해 arrow에 margin이 지정된 경우 해당 값을 더함.
                        } else {
                            if (flag == 'x') {
                                for (j = 0; j < 2; j++) {
                                    scrollbar[flag].arrowsize[j] = scrollbar[flag].arrow[j].offsetWidth + style.get(scrollbar[flag].arrow[j], 'marginLeft') + style.get(scrollbar[flag].arrow[j], 'marginRight');
                                }
                            } else {
                                for (j = 0; j < 2; j++) {
                                    scrollbar[flag].arrowsize[j] = scrollbar[flag].arrow[j].offsetHeight + style.get(scrollbar[flag].arrow[j], 'marginTop') + style.get(scrollbar[flag].arrow[j], 'marginBottom');
                                }
                            }
                            scrollbar[flag].arrowsize[3] = scrollbar[flag].arrowsize[0] + scrollbar[flag].arrowsize[1];
                        }

                    }

                    //bar size minus. bar크기에서 뺄 값(padding, border)
                    if (flag == 'x') {
                        scrollbar[flag].bar.style.width = 0;
                        scrollbar[flag].bsizem = scrollbar[flag].bar.offsetWidth;
                    } else {
                        scrollbar[flag].bar.style.height = 0;
                        scrollbar[flag].bsizem = scrollbar[flag].bar.offsetHeight;
                    }

                }

            }

        }

        //x, y 모두 disable이면 wrapper제거하고 null반환
        if (scrollbar.x.disable && scrollbar.y.disable) {
            return remove(scrollbar);
        }

        //x, y 모두 hide, disable이 아니고, 트랙사이즈가 고정이 아니고 container가 같으면 neutralzone추가
        if (!scrollbar.x.hide && !scrollbar.y.hide && !scrollbar.x.disable && !scrollbar.y.disable && !scrollbar.x.tracksizefix && !scrollbar.y.tracksizefix && scrollbar.x.trackcontainer == scrollbar.y.trackcontainer) {
            scrollbar.neutralzone = create(scrollbar, tag, cssclass.neutralzone, 'neutralzone');
            scrollbar.x.trackcontainer.appendChild(scrollbar.neutralzone);
        }

        //기타 필요한 속성, 함수 대입
        scrollbar.reset = fscrollbar.reset;
        scrollbar.remove = fscrollbar.remove;
        scrollbar.scrollLeft = fscrollbar.scrollLeft;
        scrollbar.scrollTop = fscrollbar.scrollTop;
        scrollbar.scrollTo = fscrollbar.scrollTo;
        scrollbar.pageLeft = fscrollbar.pageLeft;
        scrollbar.pageTop = fscrollbar.pageTop;
        scrollbar.pageTo = fscrollbar.pageTo;
        scrollbar.scrollWidth = fscrollbar.scrollWidth;
        scrollbar.scrollHeight = fscrollbar.scrollHeight;
        scrollbar.maxScrollLeft = fscrollbar.maxScrollLeft;
        scrollbar.maxScrollTop = fscrollbar.maxScrollTop;
        scrollbar.stop = fscrollbar.stop;
        scrollbar.cancelSwipe = fscrollbar.cancelSwipe;

        //eventvars. 이벤트에 필요한 변수들을 넣을 object,
        scrollbar.evs = {};

        //스크롤바에 scroll, scrollstart, scrollend, pagechange, reset 이벤트 설정
        scrollbar.event = {
            scrollstart: [],
            scroll: [],
            scrollend: [],
            pagechange: [],
            reset: [],
            add: function(type, callback) {
                return fscrollbar.event.add(scrollbar, type, callback);
            },
            remove: function(type, callback) {
                return fscrollbar.event.remove(scrollbar, type, callback);
            }
        }
        scrollbar.addEventListener = scrollbar.event.add;
        scrollbar.removeEventListener = scrollbar.event.remove;

        delete scrollbar.useswipe;

        items.push(scrollbar);

        return (preset) ? scrollbar : fs.reset(scrollbar, notdisplayed);

    }

    //scrollbar object에 대입하기 위한 함수들
    fs.scrollbar = {

        reset: function() {
            return fs.reset(this);
        },

        remove: function() {
            return fs.remove(this);
        },

        scrollLeft: function(value, noani) {
            return fs.scrollLeft(this, value, noani);
        },

        scrollTop: function(value, noani) {
            return fs.scrollTop(this, value, noani);
        },

        scrollTo: function(x, y, noani) {
            return fs.scrollTo(this, x, y, noani);
        },

        pageLeft: function(value, noani) {
            return fs.pageLeft(this, value, noani);
        },

        pageTop: function(value, noani) {
            return fs.pageTop(this, value, noani);
        },

        pageTo: function(x, y, noani) {
            return fs.pageTo(this, x, y, noani);
        },

        scrollWidth: function() {
            return fs.scrollWidth(this);
        },

        scrollHeight: function() {
            return fs.scrollHeight(this);
        },

        maxScrollLeft: function() {
            return fs.maxScrollLeft(this);
        },

        maxScrollTop: function() {
            return fs.maxScrollTop(this);
        },

        stop: function() {
            return fs.stop(this, true);
        },

        cancelSwipe: function() {
            return fs.cancelSwipe(this);
        },

        event: {
            add: function(scrollbar, type, callback) {
                type = type.toLowerCase();
                if (scrollbar.event[type]) {
                    scrollbar.event[type].push(callback);
                }
                return scrollbar;
            },
            remove: function(scrollbar, type, callback) {
                type = type.toLowerCase();
                if (scrollbar.event[type]) {
                    for (var i = 0, max = scrollbar.event[type].length; i < max; i++) {
                        if (scrollbar.event[type][i] == callback) {
                            scrollbar.event[type].splice(i, 1);
                            max--;
                            i--;
                        }
                    }
                }
                return scrollbar;
            }
        }

    }

    //사이즈 재설정 등
    fs.reset = function(scrollbar, notdisplayed) {

        var currentscroll, otherscroll, target = scrollbar.target,
            wrapper = scrollbar.wrapper,
            browser = fs.browser,
            style = fs.style,
            classname = fs.classname,
            event = fs.event,
            wcp = scrollbar.wcp,
            cssclass = fs.cssclass,
            handle = scrollbar.handle,
            xscroll = scrollbar.x,
            yscroll = scrollbar.y,
            flags = [
                //   0,  1,   2,    3,   4,   5
                ['x', 'y', 'width', 'clientWidth', 'offsetWidth', 'scrollWidth'],
                ['y', 'x', 'height', 'clientHeight', 'offsetHeight', 'scrollHeight']
            ];

        //scroll 멈춤
        fs.stop(scrollbar);

        //for ie7 bug : overflow가 disable이거나 zoom이 있으면 scrollWidth, scrollHeight을 제대로 못가져옴
        if (browser.ie == 7) {
            target.style.overflow = 'visible';
            wrapper.style.zoom = 0;
        }

        //스크롤이 생기는지 먼저 체크
        for (i = 0; i < 2; i++) {

            currentscroll = scrollbar[flags[i][0]];

            if (!currentscroll.disable) {

                //scroll 값 초기화
                style.set(wrapper, wcp[i], 0);

                //scroll size를 정확히 계산하기 위해 일단 track을 display none, wrapper에서 구분 css클래스를 제거
                if (!currentscroll.hide) {
                    currentscroll.track.style.display = 'none';
                }
                classname.remove(wrapper, cssclass[flags[i][0]][4]);

                //target의 client size
                currentscroll.clientsize = target[flags[i][3]];

                //contentsize check
                currentscroll.contentsize = Math.max(target[flags[i][5]], wrapper[flags[i][4]], wrapper[flags[i][5]]);

                //망할 ie7 ㅠ
                if (browser.ie == 7 && wrapper.getElementsByTagName('*').length) {
                    currentscroll.contentsize = Math.max(currentscroll.contentsize, wrapper.getElementsByTagName('*')[0][flags[i][4]]);
                }

                //스크롤바가 표시되는 지 여부
                currentscroll.show = currentscroll.contentsize > currentscroll.clientsize;

                //스크롤바가 표시되면 다시 css클래스 추가
                if (currentscroll.show && !currentscroll.outsidetrack && !currentscroll.hide) {
                    classname.add(wrapper, cssclass[flags[i][0]][4]);
                }

            }

        }

        //x, y 모두 show일 경우 newtralzone 표시
        if (scrollbar.neutralzone) {
            scrollbar.neutralzone.style.display = (xscroll.show && yscroll.show) ? 'block' : 'none';
        }

        var barmaxsize, tracksize, nowpage, totalpage, pagechanged = false;
        for (i = 0; i < 2; i++) {

            currentscroll = scrollbar[flags[i][0]];
            otherscroll = scrollbar[flags[i][1]];

            if (currentscroll.show) {

                //wrapper에 css class가 주어진 후 다시 contentsize를 구함
                currentscroll.contentsize = Math.max(target[flags[i][5]], wrapper[flags[i][4]], wrapper[flags[i][5]]);

                //망할 ie7 ㅠ
                if (browser.ie == 7 && wrapper.getElementsByTagName('*').length) {
                    currentscroll.contentsize = Math.max(currentscroll.contentsize, wrapper.getElementsByTagName('*')[0][flags[i][4]]);
                }

                //가능한 최대 scroll 값
                currentscroll.ablesize = currentscroll.clientsize - currentscroll.contentsize;

                //현재값이 있으면 해당 값으로 이동
                if (currentscroll.now) {
                    if (currentscroll.scrollsizefix && currentscroll.nowpage) {
                        currentscroll.now = -currentscroll.scrollsizefix * currentscroll.nowpage;
                    }
                    if (currentscroll.ablesize > currentscroll.now) {
                        currentscroll.now = currentscroll.ablesize;
                    }
                    style.set(wrapper, wcp[i], currentscroll.now);
                }
                currentscroll.to = currentscroll.now;

                //scrollsizefix가 지정되어있으면 nowpage및 totalpage를 설정
                if (currentscroll.scrollsizefix) {
                    nowpage = Math.round(-currentscroll.now / currentscroll.scrollsizefix);
                    totalpage = Math.floor(Math.abs(currentscroll.ablesize / currentscroll.scrollsizefix)) + 1;
                    if (nowpage != currentscroll.nowpage || totalpage != currentscroll.totalpage) {
                        currentscroll.nowpage = nowpage;
                        currentscroll.totalpage = totalpage;
                        pagechanged = true;
                    }
                }

                if (!currentscroll.hide) {

                    //set track
                    //트랙사이즈가 고정이면
                    if (currentscroll.tracksizefix) {
                        tracksize = currentscroll.tracksize;
                        //고정이 아니면
                    } else {
                        //x 일때 y, y일때 x의 outsidetrack이 없거나 있는데 서로 다른 경우 track container의 offset값으로 설정
                        if (currentscroll.outsidetrack && (!otherscroll.outsidetrack || currentscroll.outsidetrack != otherscroll.outsidetrack)) {
                            tracksize = currentscroll.trackcontainer[flags[i][3]];
                            //x 일때 y, y일때 x가 표시될때는 trackcontainer가 같은 경우 서로의 offset값 만큼 뺌
                        } else if (otherscroll.show && currentscroll.trackcontainer == otherscroll.trackcontainer) {
                            otherscroll.track.style.display = 'block';
                            tracksize = currentscroll.trackcontainer[flags[i][3]] - otherscroll.track[flags[i][4]];
                            //아니면 그냥 track container의 offset값으로 설정
                        } else {
                            tracksize = currentscroll.trackcontainer[flags[i][3]];
                        }
                        //tracksize가 상대값일 경우에 맞게 마지막으로 tracksize를 더함
                        tracksize += currentscroll.tracksize;
                    }
                    style.set(currentscroll.track, flags[i][2], Math.max(tracksize, 0));

                    //bar의 최대 사이즈
                    barmaxsize = (currentscroll.arrowsize[0]) ? tracksize - currentscroll.arrowsize[3] : tracksize;

                    //bar의 사이즈
                    if (currentscroll.barsize == 'auto') {
                        currentscroll.bnowsize = Math.max(Math.round(barmaxsize * (currentscroll.clientsize / currentscroll.contentsize)), currentscroll.barminsize);
                    } else {
                        currentscroll.bnowsize = currentscroll.barsize;
                    }
                    currentscroll.bnowsize -= currentscroll.bsizem;
                    style.set(currentscroll.bar, flags[i][2], currentscroll.bnowsize);

                    //bar의 최소, 최대 위치
                    currentscroll.bminpos = currentscroll.arrowsize[0];
                    currentscroll.bmaxpos = currentscroll.bminpos + barmaxsize - currentscroll.bnowsize - currentscroll.bsizem;

                    //bar 이동
                    fs.movebar(scrollbar, flags[i][0], currentscroll.now);

                    //track을 다시 보이게
                    currentscroll.track.style.display = 'block';

                }

            } else {

                currentscroll.now = 0;
                currentscroll.ablesize = 0;

            }

        }

        //for ie7 bug : 다시 overflow hidden. ie에서 zoom이 없으면 스크롤바가 바로 표시되지 않아서 zoom=1추가.
        if (browser.ie == 7) {
            target.style.overflow = 'hidden';
            wrapper.style.zoom = 1;
        }

        //mobile과 slidermode가 아니고 y scroll이 생길 경우 wrapper와 y scroll 자체에 wheel event 추가, 아닐 경우 제거
        if (!browser.mobile && !scrollbar.slidermode) {
            if (yscroll.show) {
                event.add(wrapper, 'mousewheel', handle.wheel);
                if (!yscroll.hide) {
                    event.add(yscroll.track, 'mousewheel', handle.wheel);
                }
            } else if (!yscroll.disable) {
                event.remove(wrapper, 'mousewheel', handle.wheel);
                if (!yscroll.hide) {
                    event.remove(yscroll.track, 'mousewheel', handle.wheel);
                }
            }
        }

        //target의 display가 none 상태였을 경우 다시 none
        if (notdisplayed) {
            style.set(scrollbar.target, 'display', 'none');
        }

        //pagechange 이벤트 보냄
        if (pagechanged) {
            fs.scrollevent.load(scrollbar, 'pagechange');
        }

        //reset 이벤트
        fs.scrollevent.load(scrollbar, 'reset');

        return scrollbar;

    }

    //scroll
    fs.scroll = function(scrollbar, targetflag, value, withbar, noani, returnv) {

        var to, property, pagechanged, wrapper = scrollbar.wrapper,
            flag = (targetflag == 'x' || targetflag == 'left' || targetflag == 'right') ? 'x' : 'y',
            wrappercssflag = scrollbar.wcp[(flag == 'x') ? 0 : 1],
            currentscroll = scrollbar[flag];

        //withbar가 false이고, value가 있는 경우 value는 bar의 위치. 비율에 맞게 컨텐츠 위치로 수정
        if (!withbar && value > 0) {
            value = Math.round(currentscroll.ablesize * ((value - currentscroll.bminpos) / (currentscroll.bmaxpos - currentscroll.bminpos)));
        }

        //적용할 값을 계산. 120531 현재 이동할 값 to를 지정해서 스크롤이 될 때 해당 to값에 scrollsize를 더함

        to = Math.round((value != undefined) ? value : (targetflag == 'up' || targetflag == 'left') ? currentscroll.to + currentscroll.scrollsize : currentscroll.to - currentscroll.scrollsize);
        if (currentscroll.scrollsizefix) {
            to = Math.round(to / currentscroll.scrollsizefix) * currentscroll.scrollsizefix;
        }
        to = (to > 0) ? 0 : (to < currentscroll.ablesize) ? currentscroll.ablesize : to;

        //scrollsizefix가 있을 경우 현재 페이지 설정
        if (currentscroll.scrollsizefix) {
            pagechanged = fs.setpage(scrollbar, flag, to);
            if (currentscroll.scrollsizelock) {
                to = -currentscroll.nowpage * currentscroll.scrollsizefix;
            }
        }

        //변경될 값만 원하는 거면 값만 return. 현재는 scrollTo에서만 사용. pagechanged 값을 같이 보냄.
        if (returnv) {
            return [to, pagechanged];
        }

        //값에 변동이 없으면 취소
        if (!scrollbar.slidermode && currentscroll.to == to) {
            return;
        }

        //페이지가 변경 됐으면 pagechange이벤트 넘김
        if (pagechanged) {
            fs.scrollevent.load(scrollbar, 'pagechange');
        }

        //to를 설정. scrollTo에서 returnv값을 받는 경우는 scrollTo함수 자체에서 to를 설정.
        currentscroll.to = to;

        //animation 제거
        fs.ani.stop(wrapper);

        //option에 animate 속성이 있거나 noani인수가 없으면 애니매이션 처리
        if (scrollbar.animate && !noani) {
            property = {};
            property[wrappercssflag] = to;
            fs.handle.animate(scrollbar, property, value == undefined || withbar);
            //아니면 그냥 이동
        } else {
            currentscroll.now = to;
            fs.style.set(wrapper, wrappercssflag, to);
            if (value == undefined || withbar || withbar === 0) {
                fs.movebar(scrollbar, flag, to, false, noani);
            }
            fs.scrollevent.load(scrollbar, 'ing');
        }

    }

    //스크롤 이벤트를 호출
    fs.scrollevent = {

        //animate속성이 false일 경우에는 scroll 이벤트만 호출
        load: function(scrollbar, type, withing) {

            var events = scrollbar.event,
                scrollstartfired = scrollbar.evs.scrollstartfired,
                fire = fs.scrollevent.fire;

            //scroll start
            if (type == 'start' && !scrollstartfired && scrollbar.animate) {

                if (events.scrollstart.length) {
                    fire(scrollbar, 'scrollstart');
                }
                scrollbar.evs.scrollstartfired = true;

                //scroll ing
            } else if (type == 'ing' && events.scroll.length) {

                fire(scrollbar, 'scroll');

                //scroll end
            } else if (type == 'end') {

                //scroll 이벤트만 사용할 수 있으니 같이 실행
                if (withing) {
                    fs.scrollevent.load(scrollbar, 'ing');
                }

                if (scrollstartfired) {
                    if (events.scrollend.length) {
                        fire(scrollbar, 'scrollend');
                    }
                    scrollbar.evs.scrollstartfired = false;
                }

                //pagechange, reset
            } else if (type == 'pagechange' || type == 'reset') {

                if (events[type].length) {
                    fire(scrollbar, type);
                }

            }

        },

        fire: function(scrollbar, type) {
            var bullet = fs.scrollevent.bullet(scrollbar, type),
                events = scrollbar.event[type],
                i = 0,
                max = events.length;
            for (; i < max; i++) {
                events[i].call(scrollbar, bullet);
            }
        },

        //스크롤 이벤트에 넘겨줄 정보
        bullet: function(scrollbar, type) {
            var xscroll = scrollbar.x,
                yscroll = scrollbar.y;
            return {
                type: type,
                scrollLeft: -xscroll.now,
                scrollTop: -yscroll.now,
                scrollWidth: Math.max(xscroll.contentsize, xscroll.clientsize) || 0,
                scrollHeight: Math.max(yscroll.contentsize, yscroll.clientsize) || 0,
                pageLeft: xscroll.nowpage || 0,
                pageTop: yscroll.nowpage || 0,
                totalPageLeft: xscroll.totalpage || 0,
                totalPageTop: yscroll.totalpage || 0,
                barLeft: xscroll.bar && xscroll.bar.offsetLeft || 0,
                barTop: yscroll.bar && yscroll.bar.offsetTop || 0,
                barWidth: xscroll.bar && xscroll.bar.offsetWidth || 0,
                barHeight: yscroll.bar && yscroll.bar.offsetHeight || 0
            };
        }

    }

    //bar나 arrow를 누르고 있을 경우 자동 스크롤
    fs.autoscroll = function(scrollbar, flag, value, fromslider) {

        //slider mode 일 경우에는 해당 위치로 옮기고 끝
        if (scrollbar.slidermode) {
            if (!fromslider) {
                value = Math.max(value - scrollbar[flag].bnowsize / 2, 0);
            }
            fs.scroll(scrollbar, flag, value, 0);
            return;
        }

        var xscroll = scrollbar.x,
            yscroll = scrollbar.y;

        fs.killautoscroll(scrollbar);
        fs.event.add(document, 'mouseup', scrollbar.handle.killautoscroll);

        //방향을 구함
        //value가 있으면 track
        if (value != undefined) {
            if (flag == 'x') {
                flag = ((xscroll.bar.offsetLeft + xscroll.bar.offsetWidth) > value) ? 'left' : 'right';
            } else {
                flag = ((yscroll.bar.offsetTop + yscroll.bar.offsetHeight) > value) ? 'up' : 'down';
            }
            //value가 없으면 arrow. arrow일 경우 value를 bar의 min/max position으로 지정
        } else {
            flag = flag.match(/arrow-([a-z]+)/)[1];
            value = (flag == 'up') ? yscroll.bminpos : (flag == 'down') ? yscroll.bmaxpos + yscroll.bar.offsetHeight : (flag == 'left') ? xscroll.bminpos : xscroll.bmaxpos + xscroll.bar.offsetWidth;
        }

        var isfirst = true;
        var action = function() {

            //value를 지나치거나 value와 같으면 끝냄
            if (
                (flag == 'left' && xscroll.bar.offsetLeft <= value) || (flag == 'right' && xscroll.bar.offsetLeft + xscroll.bar.offsetWidth >= value) || (flag == 'up' && yscroll.bar.offsetTop <= value) || (flag == 'down' && yscroll.bar.offsetTop + yscroll.bar.offsetHeight >= value)
            ) {
                fs.killautoscroll(scrollbar);
                return;
            }

            fs.scroll(scrollbar, flag);
            scrollbar.evs.astimer = setTimeout(action, (isfirst) ? 500 : 30);
            isfirst = false;

        }
        action();

    }

    //auto scroll timer clear
    fs.killautoscroll = function(scrollbar) {
        clearTimeout(scrollbar.evs.astimer);
        fs.event.remove(document, 'mouseup', scrollbar.handle.killautoscroll);
    }

    //get|set scroll left
    fs.scrollLeft = function(scrollbar, value, noani) {
        var offset;
        if (offset = fs.getoffset(scrollbar, value)) {
            scrollbar.scrollLeft(offset[0]);
        } else if (!isNaN(parseInt(value))) {
            fs.scroll(scrollbar, 'x', -value, true, noani);
        } else {
            return -scrollbar.x.now;
        }
    }

    //get|set scroll top
    fs.scrollTop = function(scrollbar, value, noani) {
        var offset;
        if (offset = fs.getoffset(scrollbar, value)) {
            scrollbar.scrollTop(offset[1]);
        } else if (!isNaN(parseInt(value))) {
            fs.scroll(scrollbar, 'y', -value, true, noani);
        } else {
            return -scrollbar.y.now;
        }
    }

    //get offset position
    //scrollbar wrapper안에 있는 엘리먼트인지 파악하고. 맞을 경우 wrapper로 부터의 offset값 반환. 아니면 false
    fs.getoffset = function(scrollbar, target) {
        var saveposition, body, left, top, element = fs.findelement(target);
        if (element) {
            body = document.body;
            left = top = 0;
            //wrapper를 offsetParent로 지정하기 위해 position을 임시로 저장하고 relative로 지정.
            saveposition = fs.style.get(scrollbar.wrapper, 'position');
            scrollbar.wrapper.style.position = 'relative';
            while (element != scrollbar.wrapper && element != body) {
                left += element.offsetLeft;
                top += element.offsetTop;
                element = element.offsetParent;
            }
            scrollbar.wrapper.style.position = saveposition;
            if (element == body) {
                return false;
            }
            return [left, top];
        }
        return false;
    }

    //scrollTo
    //scroll함수는 x,y가 구분되어 있어서 그냥 scroll을 실행했을 경우 이전 animation timer가 clear되서 y만 적용됨
    //animation함수에서 timer를 속성별로 구분하면 되긴 하지만 스크롤 이벤트 보내는 문제도 있고 이게 더 나은 것 같아서 일단은 이렇게..
    fs.scrollTo = function(scrollbar, x, y, noani) {
        var i, flag, offset, value, to, changed, pagechanged, args = arguments;
        property = {}, wrapper = scrollbar.wrapper, wcp = scrollbar.wcp;
        for (i = 1; i < 3; i++) {
            offset = fs.getoffset(scrollbar, args[i]) || offset;
            value = (offset || (!args[i] && offset)) ? offset[i - 1] : args[i];
            if (!isNaN(parseInt(value))) {
                flag = (2 > i) ? 'x' : 'y';
                to = fs.scroll(scrollbar, flag, -value, false, false, true); //실제 스크롤을 하지 않고, to값만 전달받음.
                if (scrollbar[flag].to != to[0]) {
                    changed = true;
                }
                if (to[1]) {
                    pagechanged = true;
                }
                property[wcp[i - 1]] = scrollbar[flag].to = to[0];
            }
        }
        if (changed) {
            if (pagechanged) {
                fs.scrollevent.load(scrollbar, 'pagechange');
            }
            if (scrollbar.animate && !noani) {
                fs.handle.animate(scrollbar, property, true);
            } else {
                for (var i = 0, flag; i < 2; i++) {
                    if (!isNaN(property[wcp[i]])) {
                        flag = (!i) ? 'x' : 'y';
                        scrollbar[flag].now = scrollbar[flag].to = property[wcp[i]];
                        fs.style.set(wrapper, wcp[i], property[wcp[i]]);
                        fs.movebar(scrollbar, flag, property[wcp[i]]);
                    }
                }
                fs.scrollevent.load(scrollbar, 'ing');
            }
        }
    }

    //get|set page left
    fs.pageLeft = function(scrollbar, value, noani) {
        if (!isNaN(value)) {
            fs.scrollLeft(scrollbar, value * scrollbar.x.scrollsizefix, noani);
        } else {
            return scrollbar.x.nowpage;
        }
    }

    //get|set page top
    fs.pageTop = function(scrollbar, value, noani) {
        if (!isNaN(value)) {
            fs.scrollTop(scrollbar, value * scrollbar.y.scrollsizefix, noani);
        } else {
            return scrollbar.y.nowpage;
        }
    }

    //set page left and top
    fs.pageTo = function(scrollbar, x, y, noani) {
        if (!isNaN(x) && !isNaN(y)) {
            fs.scrollTo(scrollbar, x * scrollbar.x.scrollsizefix, y * scrollbar.y.scrollsizefix, noani);
        }
    }

    //get scroll content width
    fs.scrollWidth = function(scrollbar) {
        return -scrollbar.x.contentsize;
    }

    //get scroll content height
    fs.scrollHeight = function(scrollbar) {
        return -scrollbar.y.contentsize;
    }

    //get max scroll left
    fs.maxScrollLeft = function(scrollbar) {
        return -scrollbar.x.ablesize;
    }

    //get max scroll top
    fs.maxScrollTop = function(scrollbar) {
        return -scrollbar.y.ablesize;
    }

    //stop
    //스크롤 범위를 넘어갔으면 초기화하고 scroll 이벤트 넘김. 범위를 넘어가지 않았으면 현재값을 Math.round처리
    //swipe start에서도 실행. swipe start에서 실행하는 게 아니면 end이벤트 실행.
    fs.stop = function(scrollbar, withendevent) {

        fs.ani.stop(scrollbar.wrapper);

        var i, flag, currentscroll;
        for (i = 0; i < 2; i++) {
            flag = (!i) ? 'x' : 'y';
            currentscroll = scrollbar[flag];
            if (!currentscroll.disable) {
                currentscroll.now = currentscroll.to = (currentscroll.now > 0) ? 0 : (currentscroll.ablesize > currentscroll.now) ? currentscroll.ablesize : Math.round(currentscroll.now);
                fs.style.set(scrollbar.wrapper, scrollbar.wcp[i], currentscroll.now);
                fs.movebar(scrollbar, flag, currentscroll.now, true);
            }
        }

        if (fs.eventkiller.killed) {
            fs.eventkiller.leave();
        }

        if (withendevent) {
            fs.scrollevent.load(scrollbar, 'end', true);
            fs.event.remove(document, 'mousemove', scrollbar.handle.swipe, scrollbar.id);
            fs.event.remove(document, 'mouseup', scrollbar.handle.swipeend, scrollbar.id);
            return scrollbar;
        }

    }

    //swipe cancel
    fs.cancelSwipe = function(scrollbar) {
        fs.event.remove(document, 'mousemove', scrollbar.handle.swipe, scrollbar.id);
        return scrollbar;
    }

    //bar 위치 이동
    fs.movebar = function(scrollbar, flag, value, fromswipe, noani) {

        var currentscroll = scrollbar[flag];

        if (currentscroll.show && !currentscroll.hide) {

            value = currentscroll.bminpos + ((currentscroll.bmaxpos - currentscroll.bminpos) * (value / currentscroll.ablesize));

            //swipe할때 움직이는 경우 min, max 위치를 넘지 않게 하고 넘을 경우
            //bar의 크기를 가로세로가 같을때까지만 줄이고 position value를 다시 설정
            var barsize, flags, cssflag = (flag == 'x') ? 'left' : 'top';
            if (fromswipe) {
                flags = (flag == 'x') ? ['offsetHeight', 'width'] : ['offsetWidth', 'height'];
                barsize = currentscroll.bnowsize;
                if (currentscroll.bminpos > value) {
                    barsize = Math.round(currentscroll.bnowsize + (value - currentscroll.bminpos) * 4);
                    if (currentscroll.bar[flags[0]] - currentscroll.bsizem > barsize) {
                        barsize = currentscroll.bar[flags[0]] - currentscroll.bsizem;
                    }
                    value = currentscroll.bminpos;
                } else if (value > currentscroll.bmaxpos) {
                    barsize = Math.round(currentscroll.bnowsize + (currentscroll.bmaxpos - value) * 4);
                    if (currentscroll.bar[flags[0]] - currentscroll.bsizem > barsize) {
                        barsize = currentscroll.bar[flags[0]] - currentscroll.bsizem;
                    }
                    value = currentscroll.bmaxpos + currentscroll.bnowsize - barsize;
                }
                fs.style.set(currentscroll.bar, flags[1], barsize);
            }

            //slidermode면서 noani가 없으면 애니매이션을 위해 scroll 시킴
            //처음 default value일때는 애니매이션을 없애기 위해서 noani 추가
            if (scrollbar.slidermode && !noani) {
                var property = {};
                property[cssflag] = value;
                fs.ani.set(currentscroll.bar, property, {
                    time: 0.5,
                    rounding: true
                });
            } else {
                fs.style.set(currentscroll.bar, cssflag, value);
            }

        }

    }

    //page set. page가 변경되었는지 아닌지 true | false return
    fs.setpage = function(scrollbar, flag, to) {
        var currentscroll = scrollbar[flag],
            page = Math.round(-to / currentscroll.scrollsizefix);
        page = (0 > page) ? 0 : (page > currentscroll.totalpage - 1) ? currentscroll.totalpage - 1 : page;
        if (page != currentscroll.nowpage) {
            currentscroll.nowpage = page;
            return true;
        }
        return false;
    }

    //이벤트 핸들러들
    fs.handle = {

        //event handler - mouse down | touch start
        start: function(scrollbar, target, e) {

            var flag, etarget, eventvars = scrollbar.evs,
                handle = scrollbar.handle,
                browser = fs.browser,
                addevent = fs.event.add;

            if (scrollbar.slidermode) {
                fs.ani.stop(scrollbar[(scrollbar.y.disable) ? 'x' : 'y'].bar);
            } else {
                fs.stop(scrollbar);
            }

            //스크롤 방향 초기화
            eventvars.swdrt = 0;

            flag = target.dataset.fsflag;
            eventvars.target = target;

            //wrapper - swipe
            if (flag == 'wrapper') {

                //srcElement가 input, select, textarea면 move할 때 blur
                etarget = e.target || e.srcElement;
                var srctag = etarget.nodeName.toLowerCase();
                if (srctag == 'input' || srctag == 'select' || srctag == 'textarea') {
                    //input type이 range면 swipe 취소
                    //select는 mobile이 아닌 webkit브라우저에서 blur를 줘도 옵션이 없어지지도 않고 구리게 되는데 방법을 잘 모르겠어서 같이 취소
                    if ((srctag == 'input' && etarget.type == 'range') || (srctag == 'select' && !browser.mobile && browser.webkit)) {
                        return true;
                    }
                    eventvars.fcusel = etarget;
                    //아니고, 모바일이 아니면 preventDefault해서 텍스트 선택안되게
                } else if (!browser.mobile && e.preventDefault) {
                    e.preventDefault();
                }

                eventvars.sweventdead = false;
                eventvars.offsetpos = [scrollbar.x.now, scrollbar.y.now];
                eventvars.clientpos = eventvars.swbasepos = fs.handle.getpoint(e);
                eventvars.swstime = new Date().getTime();
                addevent(document, 'mousemove', handle.swipe, scrollbar.id);
                addevent(document, 'mouseup', handle.swipeend, scrollbar.id);

                return true;

                //track일 경우 autoscroll실행 클릭한 지점만큼만 움직이게 클릭한 지점을 넘겨줌
            } else if ((/track/).test(flag)) {

                etarget = e.target || e.srcElement;
                flag = flag.match(/track-([a-z]+)/)[1];
                fs.autoscroll(scrollbar, flag, (flag == 'x') ? (e.offsetX || e.layerX) + etarget.offsetLeft : (e.offsetY || e.layerY) + etarget.offsetTop);

                //arrow일 경우 autoscroll실행
            } else if ((/arrow/).test(flag)) {

                fs.autoscroll(scrollbar, flag);

                //bar
            } else {

                if (flag == 'bar-x') {
                    eventvars.offsetpos = target.offsetLeft;
                    eventvars.clientpos = fs.handle.getpoint(e)[0];
                } else {
                    eventvars.offsetpos = target.offsetTop;
                    eventvars.clientpos = fs.handle.getpoint(e)[1];
                }

                fs.classname.add(target, 'active');
                addevent(document, 'mousemove', handle.barmove);
                addevent(document, 'mouseup', handle.end);

            }

            return fs.handle.killevent(e, true);

        },

        //mouse up | touch end
        end: function(scrollbar, e) {

            fs.classname.remove(scrollbar.evs.target, 'active');
            fs.event.remove(document, 'mousemove', scrollbar.handle.barmove);
            fs.event.remove(document, 'mouseup', scrollbar.handle.end);

        },

        //bar - mouse move | touch move
        barmove: function(scrollbar, e) {

            var newposition, eventvars = scrollbar.evs,
                flag = eventvars.target.dataset.fsflag.match(/bar-(x|y)/)[1],
                currentscroll = scrollbar[flag],
                cssflag = (flag == 'x') ? 'left' : 'top',
                nowposition = fs.handle.getpoint(e)[(flag == 'x') ? 0 : 1];

            if (eventvars.clientpos != nowposition) {

                newposition = eventvars.offsetpos - (eventvars.clientpos - nowposition);
                if (currentscroll.bminpos > newposition) {
                    newposition = currentscroll.bminpos;
                } else if (newposition > currentscroll.bmaxpos) {
                    newposition = currentscroll.bmaxpos;
                }

                fs.style.set(eventvars.target, cssflag, newposition);
                fs.scroll(scrollbar, flag, newposition);

            }

            return fs.handle.killevent(e);

        },

        //mouse wheel
        wheel: function(scrollbar, e) {

            var wheeldata = e.wheelDelta || e.detail,
                yscroll = scrollbar.y;
            if (fs.browser.firefox) {
                wheeldata *= -1;
            }

            //blockparentscroll을 사용하지 않고 더 이상 스크롤 될 값이 없을 때는 그냥 넘김
            if (!yscroll.blockparentscroll && ((wheeldata > 0 && yscroll.now == 0) ||
                (0 > wheeldata && yscroll.now == yscroll.ablesize))) {
                return true;
            }

            fs.scroll(scrollbar, (wheeldata > 0) ? 'up' : 'down');

            return fs.handle.killevent(e, true);

        },

        //swipe
        swipe: function(scrollbar, e) {

            if (scrollbar.evs.sweventdead) {
                return true;
            }

            var eventvars = scrollbar.evs,
                handle = fs.handle,
                nowposition = handle.getpoint(e),
                nowtime = new Date().getTime(),
                i, pagechanged, property, currentscroll, rounding = scrollbar.wcp[0] == 'marginLeft',
                moved = [],
                newposition = [],
                flag = ['x', 'y'],
                xscroll = scrollbar.x,
                yscroll = scrollbar.y;

            for (i = 0; i < 2; i++) {
                //이동한 거리
                moved[i] = eventvars.clientpos[i] - nowposition[i];
                //새 위치를 설정
                newposition[i] = eventvars.offsetpos[i] - moved[i];
            }

            //swipe방향이 정해져 있지 않으면
            if (!eventvars.swdrt && (Math.abs(moved[0]) || Math.abs(moved[1]))) {

                //swipe 방향을 정함. x, y를 기준으로 ±30도 안쪽이면 방향고정 f==free ㅋㅋ
                var degree = Math.abs((Math.atan2(moved[0], moved[1]) * 180) / Math.PI);
                eventvars.swdrt =
                //y가 우선
                (xscroll.blockparentscroll && !yscroll.disable && (!xscroll.show || xscroll.disable)) ? 'y' :
                    (yscroll.blockparentscroll && !xscroll.disable && (!yscroll.show || yscroll.disable)) ? 'x' :
                    (!scrollbar.directionlock) ? 'f' : //120822 방향을 고정하지 않는 옵션 추가.
                (45 > degree || degree > 135) ? 'y' : (100 > degree && degree > 80) ? 'x' : 'f';
                //(15>degree || degree>165)? 'y' : (105>degree && degree>75)? 'x' : 'f';//x, y, f 를 결정하는 각도 수정.

                //blockparentscroll을 사용하지 않고 방향이 x|y일때 해당 방향에 더 이상 스크롤 될 값이 없을 때는 그냥 넘김
                for (i = 0; i < 2; i++) {
                    currentscroll = scrollbar[flag[i]];
                    if (!currentscroll.blockparentscroll && eventvars.swdrt == flag[i] && (
                        (0 > moved[i] && currentscroll.now == 0) || (moved[i] > 0 && currentscroll.now == currentscroll.ablesize)
                    )) {
                        i = (!i) ? 1 : 0;
                        currentscroll = scrollbar[flag[i]];
                        //scrollsizefix 일 경우 x일때 y, y일때 x의 위치를 재 설정
                        if (currentscroll.scrollsizefix) {
                            property = {};
                            property[scrollbar.wcp[i]] = Math.round(currentscroll.now / currentscroll.scrollsizefix) * currentscroll.scrollsizefix;
                            if (!pagechanged) {
                                pagechanged = fs.setpage(scrollbar, flag[i], property[scrollbar.wcp[i]]);
                            }
                            property[scrollbar.wcp[i]] = fs.ani.getvalues('', currentscroll.now, property[scrollbar.wcp[i]], fs.ani.fps / 2, 'easeOutExpo', rounding);
                            handle.animate(scrollbar, property, true, true, 0.5);
                        }
                        handle.removeswipehandle(scrollbar);
                        return true;
                    }
                }

                if (pagechanged) {
                    fs.scrollevent.load(scrollbar, 'pagechange');
                }

                //input, select, textarea면 focus를 해제
                if (eventvars.fcusel) {
                    eventvars.fcusel.blur();
                    eventvars.fcusel = null;
                }

                //스크롤이 되면 부모 스크롤바의 document이벤트를 제거해서 해당 스크롤만 실행되게
                handle.removeswipehandle(scrollbar, true);

                //컨텐츠에 지정된 이벤트발생을 차단
                if (!fs.eventkiller.killed && !fs.browser.mobile) {
                    fs.eventkiller.call(scrollbar.target);
                }

            }

            //start하고 0.3초가 지난 경우 기준시간과 위치를 재설정
            if (nowtime - 300 > eventvars.swstime) {
                eventvars.swstime = nowtime;
                eventvars.swbasepos = nowposition;
            }

            fs.scrollevent.load(scrollbar, 'start');

            for (i = 0; i < 2; i++) {
                currentscroll = scrollbar[flag[i]];
                if ((currentscroll.show || currentscroll.blockparentscroll) && (eventvars.swdrt == 'f' || eventvars.swdrt == flag[i])) {
                    //new value가 0보다 크거나 ablesize보다 작으면, 이동값을 /2해서 더 작게 가게
                    if (newposition[i] > 0) {
                        newposition[i] /= 2;
                    } else if (currentscroll.ablesize > newposition[i]) {
                        newposition[i] -= (newposition[i] - currentscroll.ablesize) / 2;
                    }
                    currentscroll.now = currentscroll.to = newposition[i];
                    fs.style.set(eventvars.target, scrollbar.wcp[i], newposition[i]);
                    fs.movebar(scrollbar, flag[i], newposition[i], true);
                }
            }

            fs.scrollevent.load(scrollbar, 'ing');

            return handle.killevent(e);

        },

        //mobile swipe end
        swipeend: function(scrollbar, e) {

            var eventvars = scrollbar.evs,
                handle = fs.handle,
                nowposition = handle.getpoint(e),
                property = {};
            var currentscroll, swipetime = new Date().getTime() - eventvars.swstime;
            var i, j, max, flag, to, page = [],
                values = [],
                limit = null,
                moved = [],
                pagechanged = false,
                fps = fs.ani.fps,
                easing = 'easeOutCubic',
                rounding = scrollbar.wcp[0] == 'marginLeft';

            for (i = 0; i < 2; i++) {
                limit = null;
                flag = (!i) ? 'x' : 'y';
                currentscroll = scrollbar[flag];
                moved[i] = eventvars.swbasepos[i] - nowposition[i];
                if ((currentscroll.show || currentscroll.blockparentscroll) && ((!moved[i] && currentscroll.scrollsizefix) || eventvars.swdrt == 'f' || eventvars.swdrt == flag)) {

                    if (Math.abs(moved[i]) > 5) {

                        //scrollsizelock이 걸려있으면 page단위로 이동
                        if (currentscroll.scrollsizelock) {

                            //스크롤 범위를 벗어난 경우 scrollsizefix보다 움직인 거리가 크면 page이동.
                            if (currentscroll.now > 0 || currentscroll.ablesize > currentscroll.now) {
                                if (Math.abs(moved[i]) > currentscroll.scrollsizefix) {
                                    page[i] = (moved[i] > 0) ? currentscroll.nowpage + 1 : currentscroll.nowpage - 1;
                                }
                                //0.3초 안에 영역 안쪽에서 움직였으면 움직인 방향으로 page 설정
                            } else if (300 > swipetime) {
                                page[i] = (moved[i] > 0) ? currentscroll.nowpage + 1 : currentscroll.nowpage - 1;
                            }
                            //아니면 가까운 페이지로
                            if (page[i] == undefined) {
                                currentpage = Math.round(-currentscroll.now / currentscroll.scrollsizefix);
                                page[i] = (currentpage > currentscroll.nowpage) ? currentscroll.nowpage + 1 : (currentscroll.nowpage > currentpage) ? currentscroll.nowpage - 1 : currentpage;
                            }
                            page[i] = (0 > page[i]) ? 0 : (page[i] > currentscroll.totalpage - 1) ? currentscroll.totalpage - 1 : page[i];
                            values[i] = fs.ani.getvalues('', currentscroll.now, -page[i] * currentscroll.scrollsizefix, fps, 'easeOutExpo', rounding);

                            //0.3초 안에 움직였고 움직인 거리가 있으면 swipe
                        } else if (300 > swipetime && moved[i]) {

                            to = Math.round(currentscroll.now - moved[i] * ((300 - swipetime) / 25));
                            if (currentscroll.scrollsizefix) {
                                to = Math.round(to / currentscroll.scrollsizefix) * currentscroll.scrollsizefix;
                            }

                            //스크롤 범위를 이미 넘어간 상태에서 넘어간 반대방향일 경우 최종 to가 스크롤 범위에서 현재 초과된 범위를 뺀 값보다 작으면 취소
                            if ((moved[i] > 0 && to > -currentscroll.now) || (0 > moved[i] && currentscroll.ablesize + currentscroll.ablesize - currentscroll.now > to)) {
                                to = (moved[i] > 0) ? 0 : currentscroll.ablesize;
                                values[i] = fs.ani.getvalues(scrollbar.wcp[i], currentscroll.now, to, fps / 2, easing, rounding);
                            } else {
                                //스크롤 범위를 이미 넘어간 상태에서 넘어간 방향으로 움직였으면 움직인 크기만큼만 지정
                                if ((0 > moved[i] && currentscroll.now > 0) || (moved[i] > 0 && currentscroll.ablesize > currentscroll.now)) {
                                    limit = currentscroll.now - moved[i] / 4;
                                    values[i] = fs.ani.getvalues('', currentscroll.now, limit, fps / 10, easing, rounding);
                                    j = values[i].length;
                                } else {
                                    values[i] = fs.ani.getvalues('', currentscroll.now, to, fps * 2, easing, rounding);
                                    //값들이 컨텐츠 스크롤 범위를 넘어갔는지 체크해서 넘어갔으면 limit만큼 가고 다시 원위치
                                    for (j = 0, max = values[i].length; j < max; j++) {
                                        if (0 > moved[i]) {
                                            if (values[i][j] > 0) {
                                                if (limit == null) {
                                                    limit = Math.abs((values[i][j - 1] || 0) - values[i][j]) * 7;
                                                }
                                                if (values[i][j] > limit) {
                                                    values[i][j] /= 2;
                                                    j = j + 1;
                                                    values[i].length = j;
                                                    break;
                                                }
                                                values[i][j] /= 2;
                                            }
                                        } else if (currentscroll.ablesize > values[i][j]) {
                                            if (limit == null) {
                                                limit = currentscroll.ablesize - ((values[i][j - 1] || currentscroll.ablesize) - values[i][j]) * 7;
                                            }
                                            if (limit > values[i][j]) {
                                                values[i][j] -= (values[i][j] - currentscroll.ablesize) / 2;
                                                j = j + 1;
                                                values[i].length = j;
                                                break;
                                            }
                                            values[i][j] -= (values[i][j] - currentscroll.ablesize) / 2;
                                        }
                                    }
                                }
                                //범위를 넘어갔으면 맞는 위치로 돌림
                                if ((0 > moved[i] && values[i][j - 1] > 0) || (moved[i] > 0 && currentscroll.ablesize > values[i][j - 1])) {
                                    to = (0 > moved[i]) ? 0 : currentscroll.ablesize;
                                    values[i] = values[i].concat(fs.ani.getvalues('', values[i][j - 1], to, fps / 2, easing, rounding));
                                }
                            }
                            if (currentscroll.scrollsizefix) {
                                page[i] = Math.round(-to / currentscroll.scrollsizefix);
                            }

                        }

                    }

                }

                //이동이 없으면 제 위치로
                if (!values[i]) {
                    to = (currentscroll.now > 0) ? 0 : (currentscroll.ablesize > currentscroll.now) ? currentscroll.ablesize : Math.round(currentscroll.now);
                    if (currentscroll.scrollsizefix) {
                        to = Math.max(currentscroll.ablesize, Math.round(to / currentscroll.scrollsizefix) * currentscroll.scrollsizefix);
                        page[i] = Math.round(-to / currentscroll.scrollsizefix);
                        page[i] = (0 > page[i]) ? 0 : (page[i] > currentscroll.totalpage - 1) ? currentscroll.totalpage - 1 : page[i];
                    }
                    values[i] = fs.ani.getvalues('', currentscroll.now, to, fps / 2, easing, rounding);
                }

                //page체크
                if (page[i] != currentscroll.nowpage) {
                    currentscroll.nowpage = page[i];
                    pagechanged = true;
                }

                property[scrollbar.wcp[i]] = values[i];

            }

            //page가 변경됐으면 pagechange이벤트
            if (pagechanged) {
                fs.scrollevent.load(scrollbar, 'pagechange');
            }

            if (property[scrollbar.wcp[0]] != undefined || property[scrollbar.wcp[1]] != undefined) {
                handle.animate(scrollbar, property, true, true, 2);
            } else {
                fs.scrollevent.load(scrollbar, 'end');
            }

            handle.removeswipehandle(scrollbar);

            if (fs.eventkiller.killed) {
                fs.eventkiller.leave();
                return handle.killevent(e);
            }

        },

        //scroll animation
        animate: function(scrollbar, property, withbar, fromswipe, time) {
            fs.ani.set(scrollbar.wrapper, property, {
                time: time,
                rounding: scrollbar.wcp[0] == 'marginLeft',
                onstart: function() {
                    fs.scrollevent.load(scrollbar, 'start');
                },
                onupdate: function(v) {
                    fs.handle.onanimate(scrollbar, v, withbar, fromswipe);
                },
                onend: function(v) {
                    fs.handle.onanimate(scrollbar, v, withbar, fromswipe);
                }
            });
        },

        onanimate: function(scrollbar, v, withbar, fromswipe) {
            var i, flag, wcp = scrollbar.wcp;
            for (i = 0; i < 2; i++) {
                flag = (!i) ? 'x' : 'y';
                if (v[wcp[i]] != undefined) {
                    scrollbar[flag].now = v[wcp[i]];
                    if (fromswipe) {
                        scrollbar[flag].to = scrollbar[flag].now;
                    }
                    if (withbar) {
                        fs.movebar(scrollbar, flag, v[wcp[i]], fromswipe);
                    }
                }
            }
            fs.scrollevent.load(scrollbar, (v.type == 'update') ? 'ing' : 'end', true);
        },

        //swipe 관련 document event handler 제거
        //parent가 true이면 부모 스크롤바의 event handler만 제거.
        removeswipehandle: function(scrollbar, parent) {
            var removeevent = fs.event.remove;
            if (parent) {
                var i, j, targetscrollbar, flag = ['x', 'y'],
                    max = fs.items.length,
                    parent = scrollbar.target.parentNode;
                while (parent.nodeName.toLowerCase() != 'body') {
                    for (i = 0; i < max; i++) {
                        targetscrollbar = fs.items[i];
                        if (targetscrollbar && targetscrollbar.target == parent) {
                            //ie8이하 버전에서 호출순서가 다른 문제때문에 mouseup이 됐을 때 이동되지 않게 하기 위해 swipe direction을 'q'로 설정.
                            targetscrollbar.evs.swdrt = 'q';
                            targetscrollbar.stop();
                            //removeevent(document, 'mousemove', targetscrollbar.handle.swipe, targetscrollbar.id);
                            //removeevent(document, 'mouseup', targetscrollbar.handle.swipeend, targetscrollbar.id);
                            //ie8이하 버전에서는 event handler의 호출 순서가 지정된 순서와 달라서 부모 스크롤 먼저 스크롤 되는 걸 막을 수 없음. 원래 위치로 되돌림
                            //ie9랑 opera에서는 event가 remove 되고나서도 한 번 더 실행이 되서.. ㅠ
                            //sweventdead 속성을 추가하고 swipe handler에서 sweventdead가 true면 취소
                            //이게 맞는 건진 모르겠음 ㅋㅋ
                            targetscrollbar.evs.sweventdead = true;
                            if (9 > fs.browser.ie) {
                                for (j = 0; j < 2; j++) {
                                    targetscrollbar[flag[j]].now = targetscrollbar[flag[j]].to = targetscrollbar.evs.offsetpos[j];
                                    fs.style.set(targetscrollbar.wrapper, targetscrollbar.wcp[j], targetscrollbar[flag[j]].now);
                                    fs.movebar(targetscrollbar, flag[j], targetscrollbar[flag[j]].now, true);
                                }
                            }
                            break;
                        }
                    }
                    parent = parent.parentNode;
                }
            } else {
                removeevent(document, 'mousemove', scrollbar.handle.swipe, scrollbar.id);
                removeevent(document, 'mouseup', scrollbar.handle.swipeend, scrollbar.id);
            }
        },

        //누른 지점
        getpoint: function(e) {
            return (fs.browser.mobile) ? [
                (e.touches[0]) ? e.touches[0].pageX : e.changedTouches[0].pageX, (e.touches[0]) ? e.touches[0].pageY : e.changedTouches[0].pageY
            ] : [e.clientX, e.clientY];
        },

        killevent: function(e, withpreventdefault) {
            if (e.stopPropagation) {
                e.stopPropagation();
                if (withpreventdefault && e.preventDefault) {
                    e.preventDefault();
                }
            }
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        }

    }

    //스크롤바 제거. wrapper, track 제거
    fs.remove = function(scrollbar) {

        var target = scrollbar.target,
            wrapper = scrollbar.wrapper,
            xtrack = scrollbar.x.track,
            ytrack = scrollbar.y.track;

        //wrapper 제거
        if (wrapper) {
            var childs = wrapper.childNodes;
            for (var i = 0, max = childs.length; i < max; i++) {
                target.appendChild(childs[i]);
                max--;
                i--;
            }
            target.removeChild(wrapper);
        }

        //x track 제거
        if (xtrack) {
            xtrack.parentNode.style.position = '';
            xtrack.parentNode.removeChild(xtrack);
        }

        //y track 제거
        if (ytrack) {
            ytrack.parentNode.style.position = '';
            ytrack.parentNode.removeChild(ytrack);
        }

        //overflow 재 설정
        target.style.overflow = '';


        //fs.items에서도 제거
        for (var i = 0, items = fs.items, max = items.length; i < max; i++) {
            if (items[i] == scrollbar) {
                items[i] = null;
                break;
            }
        }

        return null;

    }

    //이벤트 add, remove
    //ie에서 이벤트 currentTarget 관련 참조 - Flexible Javascript Events(http://ejohn.org/projects/flexible-javascript-events/)
    fs.event = {

        typeinmobile: {
            mouseover: 'touchstart',
            mousedown: 'touchstart',
            mousemove: 'touchmove',
            mouseout: 'touchend',
            mouseup: 'touchend'
        },

        type: function(type) {
            var browser = fs.browser,
                typeinmobile = fs.event.typeinmobile;
            if (browser.mobile && typeinmobile[type]) {
                return typeinmobile[type];
            } else if (browser.firefox && type == 'mousewheel') {
                return 'DOMMouseScroll';
            }
            return type;
        },

        //swipe할 때 중첩이 있으면 document에 handler가 여러개 붙게 되는데 type+callback을 속성 명으로만 쓰면
        //해당 handler를 제대로 remove하지 못해서 id를 추가로 붙임 ㅠ
        add: function(target, type, callback, id) {
            type = fs.event.type(type);
            if (target.addEventListener) {
                target.addEventListener(type, callback, false);
            } else {
                target[type + id + callback] = function() {
                    callback.call(target, window.event);
                }
                target.attachEvent('on' + type, target[type + id + callback]);
            }
        },

        remove: function(target, type, callback, id) {
            type = fs.event.type(type);
            if (target.removeEventListener) {
                target.removeEventListener(type, callback, false);
            } else {
                if (target[type + id + callback]) {
                    target.detachEvent('on' + type, target[type + id + callback]);
                    target[type + id + callback] = null;
                }
            }
        }

    }

    //css 클래스명 add, remove
    fs.classname = {

        add: function(target, name) {
            this.set('add', target, name);
        },

        remove: function(target, name) {
            this.set('remove', target, name);
        },

        set: function(flag, target, name) {
            var base = (' ' + target.className).replace(new RegExp(' ' + name, 'g'), '');
            target.className = ((flag == 'add') ? base + ' ' + name : base).replace(/^ +/, '');
        }

    }

    //스타일 get, set
    fs.style = {

        exp: [ //translate3d, translate
            //get, set x, set y
            [/translate3d\(([e0-9\-\.]+)(?:px)?, ([e0-9\-\.]+)(?:px)?/, /(translate3d\()[e0-9\-\.]+(?:px)?/, /(translate3d\([e0-9\-\.]+(?:px)?, )[e0-9\-\.]+(?:px)?/],
            [/translate\(([e0-9\-\.]+)(?:px)?, ([e0-9\-\.]+)(?:px)?/, /(translate\()[e0-9\-\.]+(?:px)?/, /(translate\([e0-9\-\.]+(?:px)?, )[e0-9\-\.]+(?:px)?/]
        ],

        get: function(target, property) {
            var rv, translate, support = fs.browser.support;
            if ((/^t(x|y)(3d)?/).test(property)) {
                translate = property;
                property = support.transform;
            } else if (property == 'opacity' && !support.opacity) {
                property = 'filter';
            }
            rv = (target.style[property]) ? target.style[property] :
                (target.currentStyle) ? target.currentStyle[property] :
                document.defaultView.getComputedStyle(target, null)[property];
            if (property == support.transform) {
                if ((/3d/).test(translate)) { //translate3d
                    rv = rv.match(fs.style.exp[0][0]);
                    return (!rv) ? 0 : parseInt((translate == 'tx3d') ? rv[1] : rv[2]);
                } else { //translate
                    rv = rv.match(fs.style.exp[1][0]);
                    return (!rv) ? 0 : parseInt((translate == 'tx') ? rv[1] : rv[2]);
                }
            }
            if (property == 'opacity') {
                return parseFloat(rv);
            }
            if (property == 'filter') {
                rv = parseFloat(rv.match(/alpha *\( *opacity *[=:] *([0-9\.]+) *\)/i)[1]);
                return (rv || rv === 0) ? rv / 100 : 1;
            }
            return (rv == 'auto') ? 0 : ((/(pt|px)$/).test(rv)) ? parseInt(rv) : rv;
        },

        set: function(target, property, value) {
            var support = fs.browser.support;
            if (value != undefined) {
                if ((/^t(x|y)(3d)?/).test(property)) {
                    if ((/3d/).test(property)) { //translate3d
                        target.style[support.transform] = target.style[support.transform].replace(fs.style.exp[0][(property == 'tx3d') ? 1 : 2], '$1' + value + 'px');
                    } else { //translate
                        target.style[support.transform] = target.style[support.transform].replace(fs.style.exp[1][(property == 'tx') ? 1 : 2], '$1' + value + 'px');
                    }
                } else if (property == 'opacity') {
                    if (!support.opacity) {
                        target.style.filter = 'alpha(opacity=' + (value * 100) + ')';
                    } else {
                        target.style.opacity = value;
                    }
                } else {
                    target.style[property] = (!isNaN(value)) ? value + 'px' : value;
                }
            }
        }

    }

    //태그생성. create 후 event 추가하고, dataset이 없을 경우 추가
    fs.createtag = function(scrollbar, tagname, classname, fsflag, flag) {

        var tag = document.createElement(tagname),
            support = fs.browser.support;

        if (!tag.dataset) {
            tag.dataset = {};
            if (9 > fs.browser.ie) {
                tag.style.filter = 'inherit';
            }
        }
        tag.dataset.fsflag = fsflag;

        tag.className = classname;

        //usertransform 옵션을 사용할 경우 style.get set 을 할 때 어긋나지 않게 wrapper에 기본 transform 값 지정
        //지정하지 않으면 css에서 translate로 지정했더라도 matrix로 변경되어 있어서.
        if (fsflag == 'wrapper') {
            if ((/^t(x|y)(3d)?/).test(scrollbar.wcp[0])) {
                tag.style[support.transform] += ' ' + ((/3d/).test(scrollbar.wcp[0]) ? support.translate3d : support.translate);
            }
        } else {
            tag.style.position = 'absolute';
            //tag.style.overflow='hidden';//ie6은 hidden을 지정하지 않으면 모양이 이상하게 나오지만 ie6은 이제 죽어가고 css에서도 지정가능하니까 보류 ㅋㅋ
        }

        if ((fsflag == 'wrapper' && scrollbar.useswipe) || (fsflag != 'neutralzone' && (flag && !scrollbar[flag].nointeract))) {
            fs.event.add(tag, 'mousedown', scrollbar.handle.start);
        }

        return tag;

    }

    //엘리먼트 찾기. 문자열일 경우 id로 찾아보고 엘리먼트인지 확인 후 return
    fs.findelement = function(target) {
        if (typeof(target) == 'string') {
            target = document.getElementById(target);
        }
        return (target && target.nodeType && target.nodeType == 1) ? target : null;
    }

    //animation 임시용
    fs.ani = {

        fps: 72,
        time: 1,
        easing: 'easeOutQuint',
        target: [],
        timer: [],

        set: function(target, property, option) {
            option = option || {};
            var p, maxstep = 0,
                no = fs.ani.no(target),
                time = option.time || fs.ani.time,
                totalframe = Math.round(time * fs.ani.fps),
                values = {};
            clearTimeout(fs.ani.timer[no]);
            for (p in property) {
                values[p] = (property[p].length) ? property[p] : fs.ani.getvalues(p, fs.style.get(target, p), property[p], totalframe, option.easing || fs.ani.easing, option.rounding);
                maxstep = Math.max(values[p].length, maxstep);
            }
            if (2 > maxstep) {
                for (p in property) {
                    property[p] = property[p][0];
                }
                property.type = 'end';
                property.percent = 1;
                option.onend && option.onend.call(target, property);
                return;
            }
            var starttime, endtime, delay = (time * 1000) / totalframe;
            var action = function() {
                var step = Math.round(totalframe * ((new Date().getTime() - starttime) / (endtime - starttime)));
                var p, arg = {};
                if (maxstep - 1 > step) {
                    for (p in property) {
                        arg[p] = values[p][step];
                        fs.style.set(target, p, arg[p]);
                    }
                    arg.type = 'update';
                    option.onupdate && option.onupdate.call(target, arg);
                    fs.ani.timer[no] = setTimeout(action, delay);
                } else {
                    for (p in property) {
                        arg[p] = values[p][values[p].length - 1];
                        fs.style.set(target, p, arg[p]);
                    }
                    arg.type = 'end';
                    option.onend && option.onend.call(target, arg);
                }
            };
            fs.ani.timer[no] = setTimeout(function() {
                starttime = new Date().getTime();
                endtime = starttime + (time * 1000);
                option.onstart && option.onstart.call(target, {
                    type: 'start'
                });
                action();
            }, (option.delay || 0) * 1000);
        },

        stop: function(target) {
            clearTimeout(fs.ani.timer[fs.ani.no(target)]);
        },

        no: function(target) {
            for (var i = 0, max = fs.ani.target.length; i < max; i++) {
                if (target == fs.ani.target[i]) {
                    return i;
                }
            }
            fs.ani.target.push(target);
            return fs.ani.target.length - 1;
        },

        getvalues: function(property, from, to, totalframe, easing, rounding) {
            var nv, rv = [],
                gap = to - from,
                eqs = fs.ani.equations;
            for (var i = 1; i <= totalframe; i++) {
                nv = eqs[easing](i, from, gap, totalframe);
                rv.push((property == 'opacity') ? parseInt(nv * 1000) / 1000 : (rounding) ? Math.round(nv) : nv);
                if (nv == to) {
                    return rv;
                }
            }
            return rv;
        },

        //Convert to JS from "Robert Penner's Easing Equations".
        //http://robertpenner.com/easing/
        equations: {
            linear: function(t, b, c, d) {
                return c * t / d + b;
            },
            easeOutCubic: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeOutQuint: function(t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeOutExpo: function(t, b, c, d) {
                return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
            }
        }

    }

    //swipe할때 wrapper 컨텐츠에 적용된 이벤트들을 죽임
    fs.eventkiller = {

        killer: null,
        killed: false,

        call: function(target) {
            target.appendChild(fs.eventkiller.killer);
            fs.eventkiller.killed = true;
        },

        leave: function() {
            fs.eventkiller.killer.parentNode.removeChild(fs.eventkiller.killer);
            fs.eventkiller.killed = false;
        }

    }

    //browser검사, 몇몇 기능 지원여부.
    fs.browser = function() {

        var browser = {
            support: {
                fixed: true,
                opacity: true,
                transform: false
            }
        }

        var nua = navigator.userAgent,
            ie = nua.match(/msie ([0-9])+/i); //ie
        if (ie) {
            ie = parseInt(ie[1]);
            if (7 > ie) {
                browser.support.fixed = false;
            }
            if (9 > ie) {
                browser.support.opacity = false;
            }
            browser.ie = ie;
        }
        browser.firefox = (/firefox/i).test(nua);
        browser.webkit = (/applewebkit/i).test(nua);
        browser.opera = (/opera/i).test(nua);
        browser.ios = (/ip(ad|hone|od)/i).test(nua);
        browser.android = (/android/i).test(nua);
        browser.mobile = document.hasOwnProperty && document.hasOwnProperty('ontouchstart') && (browser.ios || browser.android);

        //event killer로 사용할 div 지정. 하면서 support 확인
        var div = document.createElement('div'),
            css = 'position:absolute;left:0;top:0;width:100%;height:100%;background:#f60;z-index:10000;opacity:0;';
        if (!browser.support.opacity) {
            css += 'filter:alpha(opacity=0)';
        }
        div.style.cssText = css;

        //브라우저 transform 지원여부.
        var n = ['t', 'WebkitT', 'MozT', 'OT', 'msT'],
            t = 'ransform',
            ts = 'ransition';
        if (div.style.hasOwnProperty) {
            for (var i = 0; i < 5; i++) {
                if (div.style[n[i] + ts] != undefined) {
                    browser.support.transition = n[i] + ts;
                }
                if (div.style[n[i] + t] != undefined) {
                    t = n[i] + t;
                    browser.support.transform = t;
                    //translate3d지원여부. 값은 기본 지정값을 지정.
                    div.style[t] = 'translate3d(0px, 0px, 0px)';
                    browser.support.translate3d = div.style[t];
                    //translate지원여부. 값은 기본 지정값을 지정.
                    div.style[t] = 'translate(0px, 0px)';
                    browser.support.translate = div.style[t];
                    div.style[t] = '';
                    break;
                }
            }
        }

        fs.eventkiller.killer = div;

        return browser;

    }();





    //프리셋
    fs.preset = function(target, name, option, presetoption) {
        target = fs.findelement(target);
        if (!target) {
            return null;
        }
        option = option || {};
        option.x = option.x || {};
        option.y = option.y || {};
        return fs.presetlist[name](target, option, presetoption);
    }

    fs.presetlist = {

        //ios 스크롤 흉내
        'ios-mode': function(target, option, hideatfirst) {

            fs.classname.add(target, fs.cssclass.iosmode);
            option.animate = true;
            option.tracksize = option.tracksize || '-2';
            option.nointeract = true;
            option.barminsize = 35;

            var i, currentscroll, scrollbar = fs.set(target, option);
            scrollbar.display = function(e, isfirst) {
                e = e || {
                    type: 'blank'
                };
                if (e.type == 'scrollstart' || e.type == 'blank') {
                    for (i = 0; i < 2; i++) {
                        currentscroll = scrollbar[(!i) ? 'x' : 'y'];
                        if (!currentscroll.disable && !currentscroll.hide) {
                            fs.ani.stop(currentscroll.bar);
                            fs.style.set(currentscroll.bar, 'opacity', 0.5);
                        }
                    }
                    if (e.type == 'blank') {
                        scrollbar.display({}, 0.5);
                    }
                } else {
                    for (i = 0; i < 2; i++) {
                        currentscroll = scrollbar[(!i) ? 'x' : 'y'];
                        if (!currentscroll.disable && !currentscroll.hide) {
                            fs.ani.set(currentscroll.bar, {
                                opacity: 0
                            }, {
                                easing: 'linear',
                                time: 0.25,
                                delay: isfirst
                            });
                        }
                    }
                }
            }

            scrollbar.addEventListener('scrollstart', scrollbar.display).addEventListener('scrollend', scrollbar.display);
            if (hideatfirst) {
                for (i = 0; i < 2; i++) {
                    currentscroll = scrollbar[(!i) ? 'x' : 'y'];
                    if (!currentscroll.disable && !currentscroll.hide) {
                        fs.style.set(currentscroll.bar, 'opacity', 0);
                    }
                }
            } else {
                scrollbar.display({
                    type: 'scrollstart'
                });
                scrollbar.display({}, 1);
            }

            return scrollbar;

        },

        //mouse over할 때만 track이 보이게
        'show-only-over': function(target, option) {

            var scrollbar = fs.set(target, option);
            var i, currentscroll, bardowned = false,
                overed = false,
                action = function(e, delay) {
                    overed = e && (e.type == 'mouseover' || e.type == 'touchstart');
                    if (bardowned) {
                        return;
                    }
                    for (i = 0; i < 2; i++) {
                        currentscroll = scrollbar[(!i) ? 'x' : 'y'];
                        if (!currentscroll.disable && currentscroll.show) {
                            fs.ani.set(currentscroll.track, {
                                opacity: (overed) ? 1 : 0
                            }, {
                                easing: 'linear',
                                time: 0.2,
                                delay: delay
                            });
                        }
                    }
                    if (scrollbar.neutralzone && scrollbar.neutralzone.offsetWidth) {
                        fs.ani.set(scrollbar.neutralzone, {
                            opacity: (overed) ? 1 : 0
                        }, {
                            easing: 'linear',
                            time: 0.2,
                            delay: delay
                        });
                    }
                }, bardown = function() {
                    bardowned = true;
                    fs.event.add(document, 'mouseup', barup, scrollbar.id);
                }, barup = function() {
                    bardowned = false;
                    if (!overed) {
                        action('', 0);
                    }
                    fs.event.remove(document, 'mouseup', barup, scrollbar.id);
                }

            fs.event.add(scrollbar.target, 'mouseover', action);
            fs.event.add(scrollbar.target, 'mouseout', action);
            for (i = 0; i < 2; i++) {
                currentscroll = scrollbar[(!i) ? 'x' : 'y'];
                if (!currentscroll.disable && !currentscroll.hide) {
                    fs.style.set(currentscroll.track, 'opacity', 1);
                    fs.event.add(currentscroll.bar, 'mousedown', bardown);
                }
            }
            if (scrollbar.neutralzone && scrollbar.neutralzone.offsetWidth) {
                fs.style.set(scrollbar.neutralzone, 'opacity', 1);
            }
            action('', 1);

            return scrollbar;

        },

        //slider
        'slider-x': function(target, option) {
            return fs.presetter.slider(target, option, 'x');
        },
        'slider-y': function(target, option) {
            return fs.presetter.slider(target, option, 'y');
        },

        //switch
        'switch-x': function(target, option) {
            return fs.presetter['switch'](target, option, 'x');
        },
        'switch-y': function(target, option) {
            return fs.presetter['switch'](target, option, 'y');
        }

    }

    fs.presetter = {

        slider: function(target, option, flag) {

            if (option.barsize == undefined || option.min == undefined || option.max == undefined || option.min == option.max || option.min > option.max) {
                return null;
            }

            var sizeflag, positionflag;
            if (flag == 'x') {
                option.y.disable = true;
                sizeflag = 'clientWidth';
                positionflag = 'Left';
            } else {
                option.x.disable = true;
                sizeflag = 'clientHeight';
                positionflag = 'Top';
            }

            var gap = option.max - option.min,
                osize = target[sizeflag],
                size = osize + gap,
                step = option.step || 1;
            var nowvalue = Math.round(((option.value != undefined) ? option.value : option.min) / step) * step;
            if (option.min > nowvalue) {
                nowvalue = option.min;
            }
            option.animate = false;
            option.slidermode = true;
            option.scrollsizefix = step;

            var scrollbar = fs.set(target, option, true);
            if (flag == 'x') {
                fs.style.set(scrollbar.wrapper, 'width', size);
                fs.style.set(scrollbar.wrapper, 'height', 1);
            } else {
                fs.style.set(scrollbar.wrapper, 'width', 1);
                fs.style.set(scrollbar.wrapper, 'height', size);
            }
            fs.style.set(scrollbar.wrapper, 'opacity', 0);
            scrollbar.reset();
            scrollbar['scroll' + positionflag]((size - osize) * ((nowvalue - option.min) / gap), true);

            scrollbar.addEventListener('scroll', function(e) {
                var value = option.min + (gap * e['scroll' + positionflag] / (size - osize));
                if (nowvalue != value) {
                    option.onchange && option.onchange(value);
                    nowvalue = value;
                }
            });
            var bardown = false,
                setposition = function() {
                    if (bardown) {
                        fs.autoscroll(scrollbar, flag, scrollbar[flag].bar['offset' + positionflag], true);
                        bardown = false;
                    }
                    fs.event.remove(document, 'mouseup', setposition, scrollbar.id);
                };
            fs.event.add(scrollbar[flag].bar, 'mousedown', function() {
                bardown = true;
                fs.event.add(document, 'mouseup', setposition, scrollbar.id);
            });

            return scrollbar;

        },

        'switch': function(target, option, flag) {

            if (option.barsize == undefined) {
                return null;
            }

            option.min = 0;
            option.max = target[(flag == 'x') ? 'clientWidth' : 'clientHeight'];
            option.step = option.max;
            option.value = (option.value) ? option.step : 0;
            var changed, onchange = option.onchange;
            option.onchange = function(value) {
                option.value = value;
                onchange && onchange((option.value) ? true : false);
                changed = true;
            }
            var scrollbar = fs.presetter.slider(target, option, flag);
            var toggle = function() {
                if (!changed) {
                    setTimeout(function() { //ie6 bug?
                        scrollbar[(flag == 'x') ? 'scrollLeft' : 'scrollTop']((option.value) ? 0 : option.step);
                    }, 0);
                }
                fs.event.remove(document, 'mousemove', move, scrollbar.id);
                fs.event.remove(document, 'mouseup', toggle, scrollbar.id);
            }
            var mouseposition;
            var reset = function(e) {
                changed = false;
                mouseposition = fs.handle.getpoint(e);
                fs.event.add(document, 'mousemove', move, scrollbar.id);
                fs.event.add(document, 'mouseup', toggle, scrollbar.id);
            }
            var move = function(e) {
                var nowmouseposition = fs.handle.getpoint(e);
                if (mouseposition[0] != nowmouseposition[0] || mouseposition[1] != nowmouseposition[1]) {
                    changed = true;
                }
            }
            fs.event.add(scrollbar[flag].bar, 'mousedown', reset);
            fs.event.add(scrollbar[flag].track, 'mousedown', reset);

            return scrollbar;

        }

    }


    return fs;
}();
