// animation.js
// http://www.psyonline.kr

var ani = {

    // common options
    fps: 72,
    time: 1,
    easing: 0,
    delay: 0,
    method: 'time' // 'time' or 'step'

}

ani.isie = navigator.userAgent.match(/msie/i);
if ((/msie 9/i).test(navigator.userAgent)) ani.isie = false;

ani.ablelist = 'left|right|top|bottom|width|minWidth|height|minHeight|fontSize|color|' +
    'verticalAlign|margin|marginTop|marginRight|marginBottom|marginLeft|padding|' +
    'paddingTop|paddingRight|paddingBottom|paddingLeft|border|borderWidth|' +
    'borderColor|borderTop|borderTopColor|borderTopWidth|borderRight|' +
    'borderRightColor|borderRightWidth|borderBottom|borderBottomColor|' +
    'borderBottomWidth|borderLeft|borderLeftColor|borderLeftWidth|background|' +
    'backgroundColor|backgroundPosition|opacity|scrollTop|scrollLeft|';

ani.splitlist = 'margin|padding|borderWidth|borderColor|border|borderTop|' +
    'borderRight|borderBottom|borderLeft|background|';

ani.opvlist = 'width|minWidth|height|minHeight|fontSize|' +
    'paddingTop|paddingRight|paddingBottom|paddingLeft|' +
    'borderTopWidth|borderRightWidth|borderBottomWidth|borderLeftWidth|';

ani.setstyle = function(tg, step) {
    var s, sv;
    for (var i in tg.vs) {
        s = i;
        if (i.match(/color/i)) sv = ani.tocolorcode([tg.vs[i][0][step], tg.vs[i][1][step], tg.vs[i][2][step]]);
        else if (i == 'backgroundPosition') sv = tg.vs[i][0][step] + 'px ' + tg.vs[i][1][step] + 'px';
        else if (i == 'opacity') {
            sv = tg.vs[s][step];
            if (ani.isie) {
                s = 'filter';
                sv = 'alpha(opacity=' + parseInt(tg.vs[i][step] * 100) + ')';
            }
        } else if (i == 'scrollLeft' || i == 'scrollTop') {
            tg[i] = tg.vs[i][step];
        } else sv = (ani.opvlist.indexOf(s + '|') != -1 && 0 > tg.vs[i][step]) ? 0 : tg.vs[i][step] + 'px';
        tg.style[s] = sv;
    }
}

ani.tojs = function(v) {
    if (v.indexOf('-') == -1) return v;
    else {
        var vs = v.toLowerCase().split('-');
        var rv = vs[0];
        for (var i = 1, max = vs.length; i < max; i++) rv += vs[i].replace(vs[i].charAt(0), vs[i].charAt(0).toUpperCase());
        return rv;
    }
}

ani.torgb = function(v, tg, p) {
    if (v.constructor != Array) {
        if (v == 'transparent' || v == 'rgba(0, 0, 0, 0)') {
            var tmp, ck = false;
            while (!tg.tagName.match(/(body|html)/i)) {
                tg = tg.parentNode;
                tmp = ani.getstyle(tg, p);
                if (tmp != 'transparent' && tmp != 'rgba(0, 0, 0, 0)') {
                    v = ani.torgb(tmp, tg);
                    ck = true;
                    break;
                }
            }
            if (!ck) v = [255, 255, 255];
        } else if (v.match(/rgb\(/)) {
            v = v.match(/rgb\(([0-9]+), *([0-9]+), *([0-9]+)\)/);
            v = [parseInt(v[1]), parseInt(v[2]), parseInt(v[3])];
        } else {
            v = v.replace('#', '');
            if (v.length > 5) v = [v.substr(0, 2), v.substr(2, 2), v.substr(4, 2)];
            else {
                v = [v.substr(0, 1), v.substr(1, 1), v.substr(2, 1)];
                v = [v[0] + v[0], v[1] + v[1], v[2] + v[2]];
            }
            v = [parseInt((eval('0x' + v[0])).toString(10)),
                parseInt((eval('0x' + v[1])).toString(10)),
                parseInt((eval('0x' + v[2])).toString(10))
            ];
        }
    }
    return v;
}

ani.tocolorcode = function(v) {
    for (var i = 0, tmp, rv = ''; i < 3; i++) {
        v[i] = (v[i] > 255) ? 255 : (v[i] < 0) ? v[i] = 0 : v[i];
        rv += (2 > v[i].toString(16).length) ? '0' + v[i].toString(16) : v[i].toString(16);
    }
    return '#' + rv.toUpperCase();
}

ani.toint = function(v, p, tg) {
    if (!v) return 0;
    if (v.constructor == Array || (typeof(v) == 'number')) return v;
    if (v.match(/(em|%)/) && p != 'backgroundPosition') return 0;
    var tmp;
    if (tmp = v.match(/(-?[0-9\.])+/g)) {
        if (tmp.length == 1) return parseFloat(tmp[0]);
        if (tmp.length == 2) return [parseFloat(tmp[0]), parseFloat(tmp[1])];
    } else if (tmp = p.match(/^(min)?(width|height)/i)) {
        var offv = eval('tg.offset' + tmp[2].replace(tmp[2].charAt(0), tmp[2].charAt(0).toUpperCase()));
        var rellist = (p.match(/width/i)) ? ['borderRightWidth', 'borderLeftWidth', 'paddingRight', 'paddingLeft'] : ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
        for (var i = 0; i < 4; i++) offv -= ani.toint(ani.getstyle(tg, rellist[i]), rellist[i], tg);
        return offv;
    } else return 0;
}

ani.getstyle = function(tg, v) {
    var gv;
    if (v == 'scrollLeft' || v == 'scrollTop') return tg[v];
    if (ani.isie && v == 'opacity') v = 'filter';
    if (tg.style[v]) gv = tg.style[v];
    else {
        if (tg.currentStyle) gv = tg.currentStyle[v];
        else gv = document.defaultView.getComputedStyle(tg, null)[v];
    }
    if (ani.isie && v == 'filter' && gv) {
        gv = parseFloat(gv.match(/alpha *\( *opacity *[=:] *([0-9\.]+) *\)/i)[1]);
        return (gv || gv === 0) ? gv / 100 : 1;
    }
    if (v == 'opacity') return parseFloat(gv);
    if (v.match(/color/i)) gv = ani.torgb(gv, tg, v);
    else if (ani.isie && v == 'backgroundPosition') gv = ani.getstyle(tg, 'backgroundPositionX') + ' ' + ani.getstyle(tg, 'backgroundPositionY');
    return gv;
}

ani.split = function(v) {
    var tmp, rv = [];
    if (v[0].match(/(margin|padding|borderWidth|borderColor)/)) {
        var pp = ['Top', 'Right', 'Bottom', 'Left'];
        var order = [
            [0, 0, 0, 0],
            [0, 1, 0, 1],
            [0, 1, 2, 1],
            [0, 1, 2, 3]
        ];
        v[1] = (typeof(v[1]) == 'string') ? v[1].replace(/ +/g, ' ').split(' ') : [v[1]];
        for (var i = 0; i < 4; i++) {
            rv.push([
                v[0].replace(/([a-z]+)((Width|Color)?)/, '$1' + pp[i] + '$2'),
                v[1][order[v[1].length - 1][i]]
            ]);
        }
    } else if (v[0].match(/border/)) {
        if (tmp = v[1].match(/[0-9]+(?:px)?/)) {
            if (v[0].match(/^border$/)) rv = rv.concat(ani.split([v[0] + 'Width', tmp[0]]));
            else rv.push([v[0] + 'Width', tmp[0]]);
        }
        if (tmp = v[1].match(/#[a-z0-9]{3,6}/i)) {
            if (v[0].match(/^border$/)) rv = rv.concat(ani.split([v[0] + 'Color', tmp[0]]));
            else rv.push([v[0] + 'Color', tmp[0]]);
        }
    } else if (v[0].match(/background$/)) {
        if (tmp = v[1].match(/#[a-z0-9]{3,6}/i)) rv.push(['backgroundColor', tmp[0]]);
        if (tmp = v[1].match(/(-?[0-9]+(?:px)? +-?[0-9]+(?:px)?)/i)) rv.push(['backgroundPosition', tmp[0]]);
    }
    return rv;
}

ani.arraycomp = function(v1, v2) {
    if (v1.length != v2.length) return false;
    for (var i = 0, max = v1.length; i < max; i++)
        if (v1[i] != v2[i]) return true;
    return false;
}

ani.getvs = function(fps, time, from, to, easing, isopacity) {
    var v, rate, gap = to - from,
        rv = [];
    if (typeof(easing) == 'number') {
        easing = (easing) ? from + (gap / 2) + (((0 > gap) ? easing * -1 : easing) * (Math.abs(gap) / 200)) : false;
        for (var i = 1, max = Math.round(fps * time); i <= max; i++) {
            v = from + gap * i / max;
            if (easing !== false) {
                rate = (v - from) / gap;
                v = from * (1 - rate) * (1 - rate) + easing * 2 * rate * (1 - rate) + to * rate * rate;
            }
            rv.push((from == to) ? from : (isopacity) ? parseInt(Math.abs(v * 100)) / 100 : Math.round(v));
        }
    } else {
        for (var i = 1, max = Math.round(fps * time); i <= max; i++) {
            v = ani.equations[easing](i, from, gap, max);
            rv.push((from == to) ? from : (isopacity) ? parseInt(Math.abs(v * 100)) / 100 : Math.round(v));
        }
    }
    return rv;
}

ani.set = function(vs) {
    if (!vs || !vs.target || !vs.to) return false;
    var tg = (typeof(vs.target) == 'string') ? document.getElementById(vs.target) : vs.target;
    clearTimeout(tg.timer);
    var v, rv, ck = false;
    if (typeof(vs.to) == 'string') v = vs.to.replace(/ *: */g, ':').replace(/ *; */g, ';').split(';')
    else {
        v = [];
        for (var i in vs.to) v.push([ani.tojs(i), vs.to[i]]);
    }
    for (var i = 0, max = v.length; i < max; i++) {
        if (v[i]) {
            if (typeof(v[i]) == 'string') {
                v[i] = v[i].split(':');
                v[i][0] = ani.tojs(v[i][0]);
            }
            if (!v[i][0] || (!v[i][1] && v[i][1] !== 0) || ani.ablelist.indexOf(v[i][0] + '|') == -1) {
                v.splice(i, 1);
                max--;
                i--;
                continue;
            }
            if (ani.splitlist.indexOf(v[i][0] + '|') != -1) {
                rv = ani.split(v[i]);
                v.splice(i, 1);
                for (var j = 0, jmax = rv.length; j < jmax; j++) v.push(rv[j]);
                max += jmax - 1;
                i--;
                continue;
            }
            v[i][1] = (v[i][0].match(/color/i)) ? ani.torgb(v[i][1]) : ani.toint(v[i][1]);
            v[i].splice(1, 0, ani.toint(ani.getstyle(tg, v[i][0]), v[i][0], tg));
        } else {
            v.splice(i, 1);
            max--;
            i--;
        }
    }
    tg.step = 0;
    tg.fps = (vs.fps) ? vs.fps : ani.fps;
    tg.time = (vs.time) ? vs.time : ani.time;
    tg.timer = null;
    tg.method = (vs.method) ? vs.method : ani.method;
    tg.onstart = vs.onstart;
    tg.onupdate = vs.onupdate;
    tg.onend = vs.onend;
    tg.vs = {};
    var easing = (vs.easing) ? vs.easing : ani.easing;
    for (var i in v) {
        if ((typeof(v[i][1]) != 'number') ? ani.arraycomp(v[i][1], v[i][2]) : v[i][1] != v[i][2]) {
            if (typeof(v[i][1]) == 'number') tg.vs[v[i][0]] = ani.getvs(tg.fps, tg.time, v[i][1], v[i][2], easing, v[i][0] == 'opacity');
            else {
                tg.vs[v[i][0]] = [];
                for (var j = 0, jmax = v[i][1].length; j < jmax; j++) tg.vs[v[i][0]].push(ani.getvs(tg.fps, tg.time, v[i][1][j], v[i][2][j], easing));
            }
        }
    }
    tg.timer = setTimeout(function() {
        if (tg.method == 'time') {
            tg.starttime = new Date() - 1;
            tg.endtime = tg.starttime + (tg.time * 1000);
        }
        if (tg.onstart) tg.onstart(tg);
        ani.action(tg);
    }, (vs.delay) ? vs.delay * 1000 : ani.delay * 1000);
}

ani.action = function(tg) {
    tg.step = (tg.method == 'step') ? tg.step + 1 : Math.round(tg.fps * (((new Date() - 1) - tg.starttime) / (tg.endtime - tg.starttime))) + 1;
    if (Math.round(tg.time * tg.fps) > tg.step) {
        ani.setstyle(tg, tg.step);
        if (tg.onupdate) tg.onupdate(tg);
        tg.timer = setTimeout(function() {
            ani.action(tg)
        }, (tg.time * 1000) / (tg.fps * tg.time));
    } else {
        if (tg.step > Math.round(tg.time * tg.fps) - 1) ani.setstyle(tg, Math.round(tg.time * tg.fps) - 1);
        if (tg.onend) tg.onend(tg);
    }
}

// Convert to JS from "Robert Penner's Easing Equations".
// http://robertpenner.com/easing/
ani.equations = {
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
        if (t < d / 2) return ani.equations.easeOutQuad(t * 2, b, c / 2, d);
        return ani.equations.easeInQuad((t * 2) - d, b + c / 2, c / 2, d);
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
        if (t < d / 2) return ani.equations.easeOutCubic(t * 2, b, c / 2, d);
        return ani.equations.easeInCubic((t * 2) - d, b + c / 2, c / 2, d);
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
        if (t < d / 2) return ani.equations.easeOutQuart(t * 2, b, c / 2, d);
        return ani.equations.easeInQuart((t * 2) - d, b + c / 2, c / 2, d);
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
        if (t < d / 2) return ani.equations.easeOutQuint(t * 2, b, c / 2, d);
        return ani.equations.easeInQuint((t * 2) - d, b + c / 2, c / 2, d);
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
        if (t < d / 2) return ani.equations.easeOutSine(t * 2, b, c / 2, d);
        return ani.equations.easeInSine((t * 2) - d, b + c / 2, c / 2, d);
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
        if (t < d / 2) return ani.equations.easeOutExpo(t * 2, b, c / 2, d);
        return ani.equations.easeInExpo((t * 2) - d, b + c / 2, c / 2, d);
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
        if (t < d / 2) return ani.equations.easeOutCirc(t * 2, b, c / 2, d);
        return ani.equations.easeInCirc((t * 2) - d, b + c / 2, c / 2, d);
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
        } else s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeOutInElastic: function(t, b, c, d, a, p) {
        if (t < d / 2) return ani.equations.easeOutElastic(t * 2, b, c / 2, d, a, p);
        return ani.equations.easeInElastic((t * 2) - d, b + c / 2, c / 2, d, a, p);
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
        if (t < d / 2) return ani.equations.easeOutBack(t * 2, b, c / 2, d, s);
        return ani.equations.easeInBack((t * 2) - d, b + c / 2, c / 2, d, s);
    },
    easeInBounce: function(t, b, c, d) {
        return c - ani.equations.easeOutBounce(d - t, 0, c, d) + b;
    },
    easeOutBounce: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
        else if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        else if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    },
    easeInOutBounce: function(t, b, c, d) {
        if (t < d / 2) return ani.equations.easeInBounce(t * 2, 0, c, d) * .5 + b;
        else return ani.equations.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    },
    easeOutInBounce: function(t, b, c, d) {
        if (t < d / 2) return ani.equations.easeOutBounce(t * 2, b, c / 2, d);
        return ani.equations.easeInBounce((t * 2) - d, b + c / 2, c / 2, d);
    }
}
