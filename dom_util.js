/**
 *  creator : 김 영목 (ym@vi-nyl.com)
 *  company : vinyl
 *  description : utility 함수 모음
 */

var UTIL = {

    /**
     *  "DOM EVENT" functions - event의 처리/등록/버블링 등에 관한 처리구현.
     */

    /**
     * attachEvent/addEventListner 구현
     */
    addEvent: function(element, evtName, func) {
        if (document.addEventListener) {
            element.addEventListener(evtName, func, false);
        } else {
            element.attachEvent('on' + evtName, func);
        }
    },

    /**
     * event bubble 방지하기
     */
    stopBubble: function(event) {
        event = event || window.event;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    /**
     * 이벤트 발생 앨리먼트(target) 내부의 발생지점 좌표를 반환.
     */
    get_mouseOffset: function(target, ev) {
        ev = ev || window.event;
        var mousePos = this.get_mouseCoords(ev);
        var docPos = this.get_elementPosition(target);

        return {
            x: mousePos.x - docPos.x,
            y: mousePos.y - docPos.y
        };
    },

    /**
     * 문서(document) 내 마우스가 위치한 좌표반환 (사용자가 스크롤한 영역포함)
     */
    get_mouseCoords: function(ev) {
        if (ev.pageX || ev.pageY) // Firefox and other browsers
        {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        } else { // IE
            return {
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
    },

    /**
     * 문서(document) 내 해당 앨리먼트(e)가 위치한 좌표반환.
     */
    get_elementPosition: function(e) {
        var left = 0;
        var top = 0;

        while (e.offsetParent) // offsetParent : 해당 엘리먼트의 가장 가까운 부모 앨리먼트 반환.
        {
            left += e.offsetLeft;
            top += e.offsetTop;
            e = e.offsetParent;
        }

        left += e.offsetLeft;
        top += e.offsetTop;

        return {
            x: left,
            y: top
        };
    },

    /**
     * event 발생시 브라우저별로 자체 제공하는 특별기능 끄기
     */
    turnoff_fx_event_func: function(event) {
        event = event || window.event;

        if (event.preventDefault) {
            event.preventDefault(); // firefox/모질라에서 event 발생시 자체 제공하는 특별기능 끄기.
        } else {
            event.returnValue = false; // IE에서 event 발생시 자체 제공하는 특별기능 끄기.
        }
    },

    /**
     * 사용자가 enter 키를 눌렀는지 여부체크
     */
    check_enter: function(event) {
        event = event || window.event;
        if (event && event.keyCode === 13) return true;
    },

    /**
     * mouseover/out 이벤트(event)가 '지정한 앨리먼트(ck_element)'에서 발생했는지, 아님 외부 앨리먼트의 버블(bubble)로 인해 발생했는지를 검증.
     *
     * @param ck_element - 검증될 element
     * @param event - 발생한 event
     *
     * @return { isOuter : (ck_element에서 발생했다면, false), evTarget : (event 발생 element) }
     */
    event_validation: function(ck_element, event) {

        var type, target, currentTarget, relatedTarget, IEtarget;

        if (!window.event && event) // FF, Safari, Chrome, Opera
        {
            type = event.type;
            target = event.target;
            currentTarget = event.currentTarget;
            relatedTarget = event.relatedTarget;

        } else if (window.event) { // IE

            event = window.event;
            target = event.srcElement;
            switch (event.type) {
                case 'mouseover':
                    IEtarget = event.fromElement;
                    break;
                case 'mouseout':
                    IEtarget = event.toElement;
                    break;
            }
        }

        var compareTarget, result = true;
        var _innerFinder = function(nodez) {

            compareTarget = null;

            if (!window.event) { // FF, Safari, Chrome, Opera

                if (currentTarget == relatedTarget) result = false;
                compareTarget = relatedTarget;

            } else if (window.event) { // IE

                if (IEtarget == ck_element) {
                    result = false;
                }
                compareTarget = IEtarget;
            }

            if (result && nodez && nodez.hasChildNodes()) {
                for (var i = 0; i < nodez.childNodes.length; i++) {
                    if (nodez.childNodes[i] == compareTarget) {
                        result = false;
                        break;
                    }

                    if (nodez.childNodes[i].hasChildNodes()) _innerFinder(nodez.childNodes[i]);
                }
            }
        };

        _innerFinder((!window.event) ? currentTarget : ck_element);

        var evTarget = (IEtarget) ? IEtarget : compareTarget;
        return {
            'isOuter': result,
            'evTarget': evTarget
        };
    },

    /**
     *  "OBJECT MODEL VIEW" functions - window/document/element 의 위치/길이/영역 등에 관한 멀티브라우저 구현.
     */

    /**
     *  window.innerWidth 멀티브라우저 구현
     */
    get_innerWidth: function() {
        if (window.innerWidth) return window.innerWidth;

        if (!window._INNERWIDTH_DIV) {
            _INNERWIDTH_DIV = document.body.appendChild(document.createElement('div'));
            _INNERWIDTH_DIV.style.cssText = 'position:absolute; top:100px; left:100%; z-index:1; visibility:hidden;';
            _INNERWIDTH_DIV.style.left = _INNERWIDTH_DIV.offsetLeft + 'px';
        }

        _INNERWIDTH_DIV.style.left = '100%';

        return _INNERWIDTH_DIV.offsetLeft;
    },

    /**
     *  window.innerHeight 멀티브라우저 구현
     */
    get_innerHeight: function() {
        if (window.innerHeight) return window.innerHeight;

        if (!window._INNERHEIGHT_DIV) {
            _INNERHEIGHT_DIV = document.body.appendChild(document.createElement('div'));
            _INNERHEIGHT_DIV.style.cssText = 'position:absolute; top:100%; left:100px; z-index:1; visibility:hidden;';
            _INNERHEIGHT_DIV.style.top = _INNERHEIGHT_DIV.offsetTop + 'px';
        }

        _INNERHEIGHT_DIV.style.top = '100%';

        return _INNERHEIGHT_DIV.offsetTop;
    },

    /**
     *  "DOM Core/Html Controller" functions - DOM core/html 에 관한 함수들.
     */

    /**
     * element의 text-node값 바꾸기
     *
     * @param element - element
     * @param text - 변경하길 원하는 text value
     */
    replace_text: function(element, text) {
        if (element) {
            this.clear_children(element);
            element.appendChild(document.createTextNode(text));
        }
    },

    /**
     *  element의 자식노드들 전부 삭제하기
     */
    clear_children: function(element) {
        if (element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.childNodes[0]);
            }
        }
        return element;
    },

    /**
     *  지정한 element 삭제하기
     */
    remove_element: function(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    /**
     * element의 자식노드들중 '지정한 앨리먼트를 제외'하고 전부 삭제하기
     *
     * @param element - element
     * @param excepts {array} - 삭제하지 않을 앨리먼트들의 집합.
     */
    clear_children_except: function(element, excepts) {
        if (element && element.childNodes) {
            var delList = [];
            for (var i = 0; i < element.childNodes.length; i++) {

                var do_put = true;
                for (var j = 0; j < excepts.length; j++) {
                    if (element.childNodes[i] == excepts[j]) {
                        do_put = false;
                    }
                }

                if (do_put) delList.push(element.childNodes[i]);
            }

            for (var i = 0; i < delList.length; i++) {
                delList[i].parentNode.removeChild(delList[i]);
            }
        }

        return element;
    },

    /**
     * element 안에 속한 모든 text-node 값 얻어오기
     */
    get_text: function(element) {
        var text = '';
        if (element) {
            if (element.childNodes) {
                for (var i = 0; i < element.childNodes.length; i++) {
                    var childNode = element.childNodes[i];
                    if (childNode.nodeValue) {
                        text = text + childNode.nodeValue;
                    } else if (childNode.firstChild && childNode.firstChild.nodeValue) {
                        text = text + childNode.firstChild.nodeValue;
                    }
                }
            }
        }

        return text;
    },

    /**
     *  cross browsing <input> tag 만들기 - IE6 에서의 문제해결
     */
    get_input: function(type, name) {
        var _navigator = this.check_navigator();
        if (_navigator == 'ie6' || _navigator == 'ie7') {
            var html = "<input type='" + type + "' ";
            if (name) html = html + " name='" + name + "'";
            html = html + " >";
            var input = document.createElement(html);
        } else {
            var input = document.createElement('input');
            input.type = type;
            if (name) input.name = name;
        }
        return input;
    },

    /**
     *  좌우 whitespaces(공백) 제거하기
     */
    clear_spaces: function(str) {
        return str.replace(/(^[\s]*)|([\s]*$)/g, '');
    },

    /**
     *  <br/> => '\n' 변환
     */
    get_lineText: function(str) {
        str = str.replace(/<br[^>]*>/ig, '\n');
        return str;
    },

    /**
     *  '\n' => <br/> 변환
     */
    get_brText: function(str) {
        str = str.replace(/\n/g, '<br/>');
        return str;
    },

    /**
     *  selection 객체 가져오기.
     */
    get_selection: function(oj) {
        if (oj) {
            return (oj.getSelection) ? oj.getSelection() : oj.selection;
        } else {
            return (window.getSelection) ? window.getSelection() : document.selection;
        }
    },

    /**
     *  사용자가 선택한 selection 의 text 부분만을 발췌하기
     */
    get_selected_text: function(selection) {
        // ie => selection.text , other browsers => selection 자체를 반환하면 된다.
        return (selection.text) ? selection.text : selection;
    },

    /**
     *  selection 으로 부터 Range Object 얻어오기.
     */
    get_range: function(userSelection) {

        // selection.text 함수가 제공된다는 건, selection 이 현재 text range object 의 역할을 한다는 의미 => ie.
        if (document.selection && userSelection.createRange) {
            return userSelection.createRange();
            //  ff, opera
        } else if (userSelection.getRangeAt) {
            return userSelection.getRangeAt(0);
            //  Safari !
        } else {
            var range = document.createRange();
            range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
            range.setEnd(userSelection.focusNode, userSelection.focusOffset);
            return range;
        }
    },

    /**
     *  드래그앤드롭 등 event 발생시, 불필요하게 주변 영역이 선택되는 경우 해제하기.
     */
    remove_selection: function() {
        var selection = this.get_selection();
        if (selection.empty) { //  IE, Opear
            selection.empty();
        } else { //  FF, others
            selection.removeAllRanges();
        }
    },

    /**
     *  get elements by class name
     */
    get_class: function(searchClass, node, tag) {
        var classElements = [];
        node = node || document;
        tag = tag || '*';

        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
            if (pattern.test(els[i].className)) {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    },

    /**
     *  "Javascript Core Control" functions
     */

    /**
     *  convert '{}' to 'function'. 객체리터럴 {} 을 => function 으로 변환. new 생성자를 가능케함.
     */
    make_function: function( /*oj_literal*/ ) {

        var func = function() {};

        if (arguments[0]) add_stuffs_to_function(func.prototype, arguments[0]);

        return func;
    },

    /**
     *  'function'에 'object literal'의 기능들을 추가하기.
     */
    add_stuffs_to_function: function(func /*, stuff1, stuff2 ... */ ) {

        for (var i = 1; i < arguments.length; i++) {
            if (arguments[i]) {
                for (var x in arguments[i]) {
                    func[x] = arguments[i][x];
                }
            }
        }

        return func;
    },

    /**
     *  사용자 브라우저 정보 가져오기
     */
    check_navigator: function() {

        if (/Firefox/.test(navigator.userAgent)) {
            return 'firefox';
        } else if (/MSIE 8\.0/.test(navigator.appVersion) && /Trident\/4.0/.test(navigator.userAgent)) {
            return 'ie8';
        } else if (/MSIE 7\.0/.test(navigator.appVersion)) {
            return 'ie7';
        } else if (/MSIE 6\.0/.test(navigator.appVersion)) {
            return 'ie6';
        }
    }
};




if (!window.e_) {
    e_ = function(i) {
        i = document.getElementById(i);
        return i;
    };
}

if (!window.ce_) {
    ce_ = function(i, attr) {
        i = document.createElement(i);

        if (typeof attr === 'object') {
            for (key in attr) {

                if (key === 'class') {
                    i.className = attr[key];
                } else if (key === 'style') {
                    i.style.cssText = attr[key];
                } else {
                    i.setAttribute(key, attr[key]);
                }
            }
        }
        return i;
    };
}

if (!window.ct_) {
    ct_ = function(i) {
        i = document.createTextNode(i);
        return i;
    };
}

if (!window.et_) {
    et_ = function(i) {
        return document.getElementsByTagName(i);
    };
}

if (!window.plus_) {
    plus_ = function(p, s) {
        return p.appendChild(s);
    };
}

if (!window.rm_) {
    rm_ = function(o) {
        if (o && o.parentNode) o.parentNode.removeChild(o);
    };
}

if (!window.ec_) { //  getElementsByClassName
    ecls_ = function(searchClass, node, tag) {
        var classElements = [];
        if (node == null) node = document;
        if (tag == null) tag = '*';

        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
            if (pattern.test(els[i].className)) {
                classElements[j] = els[i];
                j++;
            }
        }
        return classElements;
    }
}
