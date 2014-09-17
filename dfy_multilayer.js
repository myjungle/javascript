// http://www.psyonline.kr

var multilayer = new multilayercontrol('multilayer');

function multilayercontrol(varname) {

    var isie = (navigator.userAgent.toLowerCase().indexOf('msie') != -1) ? true : false;
    var isopera = (navigator.userAgent.toLowerCase().indexOf('opera') != -1) ? true : false;
    var issafari = (navigator.userAgent.toLowerCase().indexOf('safari') != -1) ? true : false;
    var css = (document.compatMode != 'BackCompat') ? true : false;
    if ((/msie 9/i).test(navigator.userAgent)) isie = false;

    this.titleheight = 13;
    this.titleclass = 'multiplelayertitle';
    this.buttonclass = 'multiplelayerbutton';
    this.left = 0;
    this.top = 0;
    this.width = 200;
    this.height = 200;
    this.minwidth = 100;
    this.padding = 3;
    this.border = ['1px solid #555', '1px solid #000', '1px solid #000', '1px solid #555'];
    this.background = '#222';
    this.zindex = 1;
    this.minopacity = 75;
    this.maxopacity = 100;
    this.dragable = true;
    this.resizeable = true;
    this.cpadding = 0;
    this.cborder = ['1px solid #000', '1px solid #555', '1px solid #555', '1px solid #000'];
    this.cbackground = '#353535';
    this.button = {
        use: true,
        minsrc: '',
        minalt: '최소화',
        maxsrc: '',
        maxalt: '최대화',
        returnsrc: '',
        returnalt: '이전 크기로',
        closesrc: '',
        closealt: '닫기',
        space: 2,
        minopacity: 50,
        maxopacity: 100
    }
    this.shadow = {
        use: true,
        color: '#000',
        x: 3,
        y: 3,
        minopacity: 10,
        maxopacity: 20
    }
    this.imageloadmessage = '';

    var max, items = [];
    this.additem = function(value) {
        items.push(value);
    }
    this.initialize = function() {
        setlink();
        max = items.length;
        for (var i = 0; i < max; i++) {
            if (!items[i].type) continue;
            if (items[i].type == 'image') this.init_image(items[i], i);
            else if (items[i].type == 'swf') this.init_swf(items[i], i);
            else if (items[i].type == 'html') this.init_html(items[i], i);
            else if (items[i].type == 'element') this.init_element(items[i], i);
        }
        var winresize = window.onresize;
        var winscroll = window.onscroll;
        window.onresize = function() {
            if (winresize) winresize();
            eval(varname).maximize();
        }
        window.onscroll = function() {
            if (winscroll) winscroll();
            eval(varname).movemax();
        }
    }
    var setlink = function() {
        var f, nv, get, el = document.body.getElementsByTagName('*');
        for (var i = 0, els = el.length; i < els; i++) {
            if (el[i].rel && el[i].rel.indexOf(varname) != -1) {
                if (f = el[i].rel.match(/(\.open|\.close)/)) {
                    nv = el[i].rel.replace(varname + f[0], '');
                    if (get = nv.match(/^ *\((.+)\) *$/)) {
                        el[i].act = varname + f[0] + '(' + get[1] + ')';
                        el[i].onclick = function() {
                            eval(this.act);
                            return false;
                        }
                    }
                } else {
                    nv = el[i].rel.replace(varname, '');
                    if (get = nv.match(/^ *\((.+)\) *$/)) {
                        el[i].args = get[1];
                        el[i].st = false;
                        el[i].onclick = function() {
                            if (this.st == false) {
                                eval(varname + '.open(' + this.args + ')');
                                this.st = true;
                            } else if (this.st == true) {
                                eval(varname + '.close(' + this.args + ')');
                                this.st = false;
                            }
                            return false;
                        }
                    }
                }
            }
        }
    }
    this.init_image = function(v, n) {
        if (!v.src) return;
        var img = new Image();
        img.src = v.src;
        var imgck = function() {
            if (img.complete) eval(varname).init_ldimage(v, n, img);
            else setTimeout(imgck, 100);
        }
        imgck();
    }
    this.init_ldimage = function(v, n, img) {
        if (!v.width) v.width = img.width;
        if (!v.height) v.height = img.height;
        v.rate = ((img.height * 100) / img.width) / 100;
        items[n] = this.create(v);
        if (v.autoopen) this.open(n + 1);
    }
    this.init_swf = function(v, n) {
        if (!v.src) return;
        if (!v.width) v.width = this.width;
        if (!v.height) v.height = this.height;
        v.rate = ((v.height * 100) / v.width) / 100;
        items[n] = this.create(v);
        if (v.autoopen) this.open(n + 1);
    }
    this.init_html = function(v, n) {
        if (!v.content) return;
        if (!v.width) v.width = this.width;
        if (!v.height) v.height = this.height;
        items[n] = this.create(v);
        if (v.autoopen) this.open(n + 1);
    }
    this.init_element = function(v, n) {
        if (!v.targetid) return;
        var obj = document.getElementById(v.targetid);
        if (!obj) return;
        v.content = obj.cloneNode(true);
        hide(obj);
        obj.id = '';
        this.init_html(v, n);
    }
    this.create = function(v) {
        var co = function(style) {
            if (isie) o = document.createElement('<div style="' + style + '">');
            else {
                o = document.createElement('div');
                o.setAttribute('style', style);
            }
            return o;
        }
        var getnum = function(str) {
            if (typeof(str) == 'number') return 0;
            else {
                var match = str.match(/ *([0-9]+).+/);
                if (!match) return 0;
                else return parseInt(match[1]);
            }
        }
        var dresspb = function(o, f, v) {
            if (!o.mv) o.mv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (v.constructor == Array) {
                if (v.length == 1) v = v[0];
                else if (v.length == 2) var sna = [0, 1, 0, 1];
                else if (v.length == 3) var sna = [0, 1, 2, 1];
                else if (v.length == 4) var sna = [0, 1, 2, 3];
                else return o;
            }
            var j = (f == 'padding') ? 0 : 4;
            if (sna) {
                var pc = ['Top', 'Right', 'Bottom', 'Left'];
                for (var i = 0; i < 4; i++) {
                    eval('o.style.' + f + pc[i] + '=\'' + ((f == 'padding') ? px(v[sna[i]]) : v[sna[i]]) + '\'');
                    o.mv[i + j] += (f == 'padding') ? v[sna[i]] : getnum(v[sna[i]]);
                }
            } else {
                eval('o.style.' + f + '=\'' + ((f == 'padding') ? px(v) : v) + '\'');
                for (var i = 0; i < 4; i++) o.mv[i + j] += (f == 'padding') ? v : getnum(v);
            }
            o.mv[8] = o.mv[1] + o.mv[3] + o.mv[5] + o.mv[7];
            o.mv[9] = o.mv[0] + o.mv[2] + o.mv[4] + o.mv[6];
            return o;
        }
        var item = co('position:absolute;display:none;');
        if (v.id) item.id = v.id;
        item.w = (v.width) ? v.width : this.width;
        item.left = (v.left || v.left == 0) ? v.left : this.left;
        item.top = (v.top || v.top == 0) ? v.top : this.top;
        dresspb(item, 'padding', (v.padding || v.padding == 0) ? v.padding : this.padding);
        dresspb(item, 'border', (v.border || v.border == 0) ? v.border : this.border);
        item.style.background = (v.background) ? v.background : this.background;
        item.minw = (v.minwidth) ? v.minwidth - item.mv[8] : this.minwidth - item.mv[8];
        item.minop = (v.minopacity || v.minopacity === 0) ? v.minopacity : this.minopacity;
        item.maxop = (v.maxopacity || v.maxopacity === 0) ? v.maxopacity : this.maxopacity;
        if (v.onclose) item.onclose = v.onclose;
        if ((this.button.use && (v.buttonuse == undefined || v.buttonuse != false)) || v.buttonuse) {
            var btnreturn = ((this.button.returnsrc && (v.buttonreturn == undefined || v.buttonreturn != false)) || v.buttonreturnsrc) ? true : false;
            var btnmin = ((this.button.minsrc && (v.buttonmin == undefined || v.buttonmin != false)) || v.buttonminsrc) ? true : false;
            var btnmax = ((this.button.maxsrc && (v.buttonmax == undefined || v.buttonmax != false)) || v.buttonmaxsrc) ? true : false;
            var btnclose = ((this.button.closesrc && (v.buttonclose == undefined || v.buttonclose != false)) || v.buttonclosesrc) ? true : false;
            var minop = (v.buttonminopacity || v.buttonminopacity == 0) ? v.buttonminopacity : this.button.minopacity;
            if (btnreturn || btnclose) {
                var inhtml = '',
                    tg = 'this.parentNode.parentNode';
                var style = 'margin-left:' + px((v.buttonspace || v.buttonspace == 0) ? v.buttonspace : this.button.space) +
                    ';cursor:pointer;filter:alpha(opacity=' + minop + ');opacity:' + (minop / 100) + ';';
                if (btnreturn && (btnmin || btnmax)) {
                    if (btnmin) inhtml += '<img src="' + ((v.buttonminsrc) ? v.buttonminsrc : this.button.minsrc) +
                        '" alt="' + this.button.minalt + '" style="' + style + '" name="min" onclick="' + varname + '.minimize(' + tg + ');" />';
                    inhtml += '<img src="' + ((v.buttonreturnsrc) ? v.buttonreturnsrc : this.button.returnsrc) +
                        '" alt="' + this.button.returnalt + '" style="' + style + ';display:none;" name="return" onclick="' + varname + '.returns(' + tg + ');" />';
                    if (btnmax) inhtml += '<img src="' + ((v.buttonmaxsrc) ? v.buttonmaxsrc : this.button.maxsrc) +
                        '" alt="' + this.button.maxalt + '" style="' + style + '" name="max" onclick="' + varname + '.maximize(' + tg + ');" />';
                }
                if (btnclose) inhtml += '<img src="' + ((v.buttonclosesrc) ? v.buttonclosesrc : this.button.closesrc) +
                    '" alt="' + this.button.closealt + '" style="' + style + '" name="close" onclick="' + varname + '.closeact(' + tg + ');" />';
                item.btn = co('position:absolute;right:' + px(item.mv[1]) + ';cursor:default');
                item.btn.className = (v.buttonclass) ? v.buttonclass : this.buttonclass;
                item.btn.innerHTML = inhtml;
                item.btn.minop = minop;
                item.btn.maxop = (v.buttonmaxopacity || v.buttonmaxopacity == 0) ? v.buttonmaxopacity : this.button.maxopacity;
                var btns = item.btn.getElementsByTagName('img');
                for (var i = 0, j = btns.length; i < j; i++) {
                    btns[i].onmouseover = function() {
                        setopacity(this, this.parentNode.maxop);
                    }
                    btns[i].onmouseout = function() {
                        setopacity(this, this.parentNode.minop);
                    }
                    if (btns[i].name == 'min') item.btn.min = btns[i];
                    else if (btns[i].name == 'max') item.btn.max = btns[i];
                    else if (btns[i].name == 'return') item.btn.returns = btns[i];
                    else if (btns[i].name == 'close') item.btn.close = btns[i];
                }
                item.btn.onmouseover = canceldrag;
                item.btn.onmouseout = resetdrag;
                item.appendChild(item.btn);
            }
        }
        if (v.title) {
            item.tit = co('position:absolute;left:' + px(item.mv[3]) + ';height:1em;overflow:hidden;');
            item.tit.innerHTML = v.title;
            item.appendChild(item.tit);
            item.tit.className = (v.titleclass) ? v.titleclass : this.titleclass;
        }
        item.tarea = co('overflow:hidden');
        item.tarea.h = (v.titleheight || v.titleheight == 0) ? v.titleheight : this.titleheight;
        item.tarea.style.height = px(item.tarea.h);
        item.appendChild(item.tarea);
        item.con = co('background:' + ((v.cbackground) ? v.cbackground : this.cbackground) + ';overflow:hidden;');
        dresspb(item.con, 'padding', (v.cpadding || v.cpadding == 0) ? v.cpadding : this.cpadding);
        dresspb(item.con, 'border', (v.cborder || v.cborder == 0) ? v.cborder : this.cborder);
        if (v.type == 'image') {
            item.con.innerHTML = '<img src="' + v.src + '"' + ((v.alt) ? ' alt="' + v.alt + '" />' : ' />');
            item.con.img = item.con.getElementsByTagName('img')[0];
            item.con.rate = v.rate;
        } else if (v.type == 'swf') {
            if (isie) {
                item.swf = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0" ';
                item.swf += 'width="' + v.width + '" height="' + v.height + '"';
                if (v.swfid) item.swf += ' id="' + v.swfid + '"';
                item.swf += ' style="margin:0 auto">';
                item.swf += '<param name="allowScriptAccess" value="always" />';
                item.swf += '<param name="allowFullScreen" value="true" />';
                item.swf += '<param name="movie" value="' + v.src + '" />';
                item.swf += '<param name="quality" value="high" />';
                item.swf += '<param name="wmode" value="transparent" />';
                item.swf += '<param name="bgcolor" value="none" />';
                if (v.flashvars) item.swf += '<param name="flashvars" value="' + v.flashvars + '"/>';
                item.swf += '</object>';
            } else {
                var swf = '<embed src="' + v.src + '" quality="high" wmode="transparent" bgcolor="none" width="' + v.width + '" height="' + v.height + '" ';
                if (v.swfid) swf += 'id="' + v.swfid + '" ';
                if (v.flashvars) swf += 'flashvars="' + v.flashvars + '" ';
                swf += 'allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" ' +
                    'pluginspage="http://www.macromedia.com/go/getflashplayer" /></embed>';
                item.con.innerHTML = swf;
                item.con.img = item.con.getElementsByTagName('embed')[0];
            }
            item.con.rate = v.rate;
        } else if (v.type == 'html' || v.type == 'element') {
            if (v.type == 'html') item.con.innerHTML = v.content;
            else if (v.type == 'element') item.con.appendChild(v.content);
            var childs = item.con.getElementsByTagName('*');
            var cs = childs.length;
            if (cs > 0) {
                for (var i = 0; i < cs; i++) {
                    if (i == 0 && (v.getfirstelement == undefined || v.getfirstelement != false)) item.con.html = childs[0];
                    if (childs[i].tagName.toLowerCase() == 'iframe') {
                        item.hideiframe = co('position:absolute;left:' + px(item.mv[3] + item.con.mv[7]) + ';top:' + px(item.tarea.h + item.mv[0] + item.con.mv[4]) + ';width:100px;height:100px;background:#FFF;display:none;overflow:hidden;');
                        setopacity(item.hideiframe, 0);
                        item.appendChild(item.hideiframe);
                        break;
                    }
                }
            }
            if (v.overflow) item.con.style.overflow = v.overflow;
            else if (v.type == 'html' && !v.content.match(/^ *<[a-z].+/i)) item.con.style.overflow = 'auto';
            item.con.onmouseover = canceldrag;
            item.con.onmouseout = resetdrag;
        }
        item.con.w = (!css && isie) ? v.width + item.con.mv[8] : v.width;
        item.con.h = (!css && isie) ? v.height + item.con.mv[9] : v.height;
        item.con.style.width = px(item.con.w);
        item.con.style.height = px(item.con.h);
        if (v.type == 'image' || v.type == 'swf') item.con.style.textAlign = 'center';
        item.appendChild(item.con);
        document.body.appendChild(item);
        if ((this.shadow.use && (v.shadowuse == undefined || v.shadowuse != false)) || v.shadowuse) {
            item.sdw = co('position:absolute;background:' + ((v.shadowcolor) ? v.shadowcolor : this.shadow.color) + ';display:none;');
            item.sdw.x = (v.shadowx || v.shadowx == 0) ? v.shadowx : this.shadow.x;
            item.sdw.y = (v.shadowy || v.shadowy == 0) ? v.shadowy : this.shadow.y;
            item.sdw.minop = (v.shadowminopacity || v.shadowminopacity == 0) ? v.shadowminopacity : this.shadow.minopacity;
            item.sdw.maxop = (v.shadowmaxopacity || v.shadowmaxopacity == 0) ? v.shadowmaxopacity : this.shadow.maxopacity;
            document.body.appendChild(item.sdw);
        }
        item.style.width = px(item.con.w + item.con.mv[8]);
        if ((this.dragable && (v.dragable == undefined || v.dragable != false)) || v.dragable) item.savedrag = item.drag = true;
        if ((this.resizeable && (v.resizeable == undefined || v.resizeable != false)) || v.resizeable) item.saveresize = item.resize = true;
        item.onmousemove = itemmousemove;
        item.onmousedown = itemmousedown;
        item.onmouseout = itemmouseout;
        return item;
    }

    this.finditem = function(f, x) {
        if (typeof(x) == 'object') {
            for (var i = 0, xs = x.length; i < xs; i++) this.finditem(f, x[i]);
            return;
        } else if (typeof(x) == 'string') {
            for (var i = 0; i < max; i++) {
                if (items[i].id == x) {
                    var item = items[i];
                    break;
                }
            }
        } else if (typeof(x) == 'number') var item = items[x - 1];
        if (item) {
            if (f == 'open') {
                if (item.tagName) this.openact(item);
                else if (this.imageloadmessage) eval(this.imageloadmessage);
            } else if (f == 'close') this.closeact(item);
        }
    }
    this.open = function() {
        this.finditem('open', arguments);
    }
    this.close = function() {
        this.finditem('close', arguments);
    }
    this.openact = function(item) {
        if (!item.setcds) {
            item.setcds = true;
            item.style.top = px(-50000);
            show(item);
            item.btnw = (item.btn) ? item.btn.offsetWidth : 0;
            setosize(item, item.offsetWidth - item.mv[8], item.offsetHeight - item.mv[9]);
            setcsize(item);
            setpos(item, (item.left == 'center') ? ((getwinsize('clientWidth') / 2) - ((item.w + item.mv[8]) / 2)) + getwinsize('scrollLeft') : item.left, (item.top == 'center') ? ((getwinsize('clientHeight') / 2) - ((item.h + item.mv[9]) / 2)) + getwinsize('scrollTop') : item.top);
        }
        show(item);
        if (item.sdw) {
            show(item.sdw);
            setbgsize(item);
        }
        this.setzindex(item);
        item.opened = true;
        this.setdepth(item);
    }
    this.closeact = function(item) {
        hide(item);
        if (item.sdw) hide(item.sdw);
        if (item.swf) item.con.innerHTML = '';
        item.opened = false;
        if (item.onclose) item.onclose();
    }
    var fullsizeitem = null;
    var savescroll = null;
    this.maximize = function(item) {
        if (!item && !fullsizeitem) return;
        if (item) savescroll = [getwinsize('scrollLeft'), getwinsize('scrollTop')];
        if (fullsizeitem) item = fullsizeitem;
        else savevs(item, item.minimize);
        setpos(item, getwinsize('scrollLeft'), getwinsize('scrollTop'));
        if (item.minimize) {
            if (item.swf) ieswf(item);
            item.minimize = false;
        }
        setsize(item, item.w - (getwinsize('clientWidth') - item.mv[8]), item.h - (getwinsize('clientHeight') - item.mv[9]));
        settarea(item);
        show(item.con);
        hide(item.btn.max);
        if (item.btn.min) show(item.btn.min, true);
        show(item.btn.returns, true);
        if (item.sdw) hide(item.sdw);
        item.drag = false;
        item.resize = false;
        fullsizeitem = item;
    }
    this.movemax = function() {
        if (!fullsizeitem) return;
        else {
            fullsizeitem.style.left = px(getwinsize('scrollLeft'));
            fullsizeitem.style.top = px(getwinsize('scrollTop'));
        }
    }
    this.returns = function(item, tomin) {
        if (fullsizeitem == item) {
            if (issafari || !css) {
                document.body.scrollLeft = savescroll[0];
                document.body.scrollTop = savescroll[1];
            } else {
                document.documentElement.scrollLeft = savescroll[0];
                document.documentElement.scrollTop = savescroll[1];
            }
            item.drag = item.save.drag;
            item.resize = item.save.resize;
            if (item.save.mleft != null && tomin) setpos(item, item.save.mleft, item.save.mtop);
            else setpos(item, (tomin) ? item.save.left + (item.save.w - item.minw) : item.save.left, item.save.top);
            setsize(item, item.w - item.save.w, item.h - item.save.h);
            if (!isie) fullsizeitem = null;
        } else {
            setpos(item, item.left - (item.w - item.minw), item.top);
            setosize(item, item.save.w, item.save.h);
        }
        settarea(item);
        show(item.con);
        hide(item.btn.returns);
        if (item.btn.min) show(item.btn.min, true);
        if (item.btn.max) show(item.btn.max, true);
        if (item.sdw) show(item.sdw);
        if (isie && fullsizeitem == item) { //ie bug
            if (item.save.mleft != null && tomin) setpos(item, item.save.mleft, item.save.mtop);
            else setpos(item, (tomin) ? item.save.left + (item.save.w - item.minw) : item.save.left, item.save.top);
            fullsizeitem = null;
        }
        if (item.minimize) {
            if (item.swf && !tomin) ieswf(item);
            item.minimize = false;
        }
        if (item.sdw) setbgsize(item);
    }
    this.minimize = function(item) {
        if (fullsizeitem == item) {
            this.returns(item, true);
            setpos(item, item.left, item.top);
        } else {
            savevs(item);
            setpos(item, item.left + (item.w - item.minw), item.top);
        }
        settarea(item, true);
        hide(item.con);
        hide(item.btn.min);
        if (item.btn.max) show(item.btn.max, true);
        show(item.btn.returns, true);
        item.style.width = px(item.minw);
        item.style.height = 'auto';
        if (item.tit) item.tit.style.width = px(item.minw - item.btnw);
        if (item.sdw) setbgsize(item);
        if (item.swf) item.con.innerHTML = '';
        item.minimize = true;
    }
    var savevs = function(item, frommin) {
        if (!item.save) item.save = {};
        if (frommin) {
            item.save.mleft = item.left;
            item.save.mtop = item.top;
        } else {
            item.save.mleft = null;
            item.save.mtop = null;
            item.save.left = item.left;
            item.save.top = item.top;
            item.save.w = item.w;
            item.save.h = item.h;
            item.save.drag = item.drag;
            item.save.resize = item.resize;
        }
    }
    this.setzindex = function(item) {
        this.zindex += 2;
        item.style.zIndex = this.zindex;
        if (item.sdw) item.sdw.style.zIndex = this.zindex - 1;
    }
    this.setdepth = function(item) {
        for (var i = 0; i < max; i++) {
            if (items[i].opened) {
                if (items[i] == item) {
                    this.setzindex(items[i]);
                    setopacity(items[i], items[i].maxop);
                    if (items[i].sdw) setopacity(items[i].sdw, items[i].sdw.maxop);
                } else {
                    setopacity(items[i], items[i].minop);
                    if (items[i].sdw) setopacity(items[i].sdw, items[i].sdw.minop);
                }
            }
        }
    }
    var setsize = function(item, w, h) {
        if ((item.con.w - w) < 0 || (item.con.h - h) < 0 || (item.w - w) < item.minw) return;
        setosize(item, item.w - w, item.h - h);
        item.con.w = item.con.w - w;
        item.con.h = item.con.h - h;
        item.con.style.width = px(item.con.w);
        item.con.style.height = px(item.con.h);
        setcsize(item);
    }
    var setosize = function(item, w, h) {
        item.w = w;
        item.h = h;
        item.style.width = px(item.w);
        item.style.height = px(item.h);
        if (item.tit) item.tit.style.width = px(item.w - item.btnw);
        if (item.resize) item.resizezone = [(item.w + item.mv[8]) - 10, (item.h + item.mv[9]) - 10];
        if (item.sdw) setbgsize(item);
    }
    var setcsize = function(item) {
        if (!item.con.img && !item.con.html && !item.hideiframe) return;
        var w = (!css && isie) ? item.con.w - item.con.mv[8] : item.con.w;
        var h = (!css && isie) ? item.con.h - item.con.mv[9] : item.con.h;
        if (item.con.img) {
            if ((w * item.con.rate) > h) {
                item.con.img.style.width = px(h / item.con.rate);
                item.con.img.style.height = px(h);
                item.con.img.style.marginTop = 0;
            } else {
                item.con.img.style.width = px(w);
                item.con.img.style.height = px(w * item.con.rate);
                item.con.img.style.marginTop = px((h - (w * item.con.rate)) / 2);
            }
        } else if (item.con.html) {
            item.con.html.style.width = px(w);
            item.con.html.style.height = px(h);
        }
        if (item.hideiframe) {
            item.hideiframe.style.width = px(w);
            item.hideiframe.style.height = px(h);
        }
    }
    var settarea = function(item, tomin) {
        if ((item.tarea.h - item.mv[2]) < 0) return;
        item.tarea.style.height = (tomin) ? px(item.tarea.h - item.mv[2]) : px(item.tarea.h);
    }
    var setbgsize = function(item) {
        item.sdw.style.width = px(item.offsetWidth);
        item.sdw.style.height = px(item.offsetHeight);
    }
    var setpos = function(item, left, top) {
        item.left = left;
        item.top = top;
        item.style.left = px(left);
        item.style.top = px(top);
        if (item.sdw) {
            item.sdw.style.left = px(left + item.sdw.x);
            item.sdw.style.top = px(top + item.sdw.y);
        }
    }

        function ieswf(item) {
            item.con.innerHTML = item.swf;
            item.con.img = item.con.getElementsByTagName('object')[0];
        }
    var getwinsize = function(pc) {
        if (isopera && pc == 'clientHeight') return self.innerHeight;
        if (issafari) {
            if (pc == 'scrollLeft') return document.body.scrollLeft;
            if (pc == 'scrollTop') return document.body.scrollTop;
        }
        return (css) ? eval('document.documentElement.' + pc) : eval('document.body.' + pc);
    }
    var setopacity = function(item, value) {
        if (isie) item.style.filter = 'alpha(opacity=' + value + ')';
        else item.style.opacity = value / 100;
    }
    var show = function(item, inline) {
        if (inline) item.style.display = 'inline';
        else {
            if (item.style.display != 'block') {
                if (item.swf) ieswf(item);
                item.style.display = 'block';
            }
        }
    }
    var hide = function(item) {
        item.style.display = 'none';
    }
    var px = function(v) {
        return v + 'px';
    }

    var mitem, mx, my, docevent = {};
    var itemmousemove = function(e) {
        if (fullsizeitem == this) return;
        if (this.drag || this.resize) {
            if (isie) {
                e = window.event;
                e.target = e.srcElement;
            }
            var x = (e.offsetX) ? e.offsetX : e.layerX;
            var y = (e.offsetY) ? e.offsetY : e.layerY;
            if (e.target != this) {
                x = x + this.mv[9];
                y = y + this.tarea.h + this.mv[8];
            }
            if (this.resize && (x > this.resizezone[0] && y > this.resizezone[1])) {
                this.mmode = 'resize';
                document.body.style.cursor = 'nw-resize';
            } else if (this.drag) {
                this.mmode = 'drag';
                document.body.style.cursor = 'move';
            } else {
                this.mmode = null;
                document.body.style.cursor = 'default';
            }
        } else {
            this.mmode = null;
            document.body.style.cursor = 'default';
        }
    }
    var itemmousedown = function(e) {
        eval(varname).setdepth(this);
        if (this.drag || this.resize) {
            this.onmousemove = null;
            this.onmouseout = null;
            if (isie) e = window.event;
            mitem = this;
            mx = e.clientX;
            my = e.clientY;
            if (!this.savedocevent) {
                docevent.mdown = document.onmousedown;
                docevent.mmove = document.onmousemove;
                docevent.mup = document.onmouseup;
                this.savedocevent = true;
            }
            document.onmousedown = function() {
                return false;
            }
            document.onmousemove = mousemove;
            document.onmouseup = mouseup;
        }
    }
    var itemmouseout = function() {
        document.body.style.cursor = 'default';
    }
    var mousemove = function(e) {
        if (mitem) {
            if (isie) e = window.event;
            if (mitem.mmode == 'resize') setsize(mitem, (mx - e.clientX), (my - e.clientY));
            else if (mitem.mmode == 'drag') {
                var x = mitem.left - (mx - e.clientX);
                var y = mitem.top - (my - e.clientY);
                if (x < (10 - (mitem.w + mitem.mv[8]))) x = 10 - (mitem.w + mitem.mv[8]);
                if (y < (10 - (mitem.h + mitem.mv[9]))) y = 10 - (mitem.h + mitem.mv[9]);
                setpos(mitem, x, y);
            }
            if (mitem.hideiframe) show(mitem.hideiframe);
            mx = e.clientX;
            my = e.clientY;
            return false;
        }
    }
    var mouseup = function() {
        if (mitem) {
            mitem.onmousemove = itemmousemove;
            mitem.onmouseout = itemmouseout;
            if (mitem.hideiframe) hide(mitem.hideiframe);
            mitem.savedocevent = false;
            mitem = null;
            document.onmousedown = docevent.mdown;
            document.onmousemove = docevent.mmove;
            document.onmouseup = docevent.mup;
            document.body.style.cursor = 'default';
            return false;
        }
    }
    var canceldrag = function() {
        this.parentNode.drag = false;
        this.parentNode.resize = false;
        document.body.style.cursor = 'default';
    }
    var resetdrag = function() {
        this.parentNode.drag = this.parentNode.savedrag;
        this.parentNode.resize = this.parentNode.saveresize;
    }

}
