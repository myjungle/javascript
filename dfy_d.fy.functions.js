//d.fy functions
var F = (function($win, $doc, $docel, $body) {

    'use strict';

    var

    //get utilities from D
    browser = D.browser,
        ismobile = browser.mobile,
        isoldie = browser.ie && 9 > browser.ie,
        csstransform = browser.support.transform,
        create = D.create,
        classname = D.classname,
        data = D.data,
        event = D.event,
        style = D.style,
        loadimage = D.image.load,
        fillimage = D.image.fill,
        animate = D.ani.set,
        stopanimate = D.ani.stop,
        easings = D.easings,
        find = D.find,

        regexpsnsprovider = /(facebook|twitter|google ?plus|pinterest)/i,

        $scrolltarget = (browser.webkit) ? $body : $docel;


    return {

        //word break: keep-all
        keepallwords: function(text) {

            var i, max, temp,
                $element = document.createElement('div'),
                $children;

            if (!browser.ie && !browser.firefox && lang == 'kr') {
                if (typeof(text) == 'string' && !(/^<img/).test(text)) {
                    $element.innerHTML = text;
                    $children = find('strong, em, span', $element);
                    if ($children.length) {
                        for (i = 0, max = $children.length; i < max; i++) {
                            $children[i].innerHTML = F.keepallwords($children[i].innerHTML);
                        }
                        text = $element.innerHTML;
                    } else {
                        text = '<kw>' + text.split(' ').join('</kw> <kw>') + '</kw>';
                    }
                } else if (text.constructor == Array) {
                    for (i = 0, max = text.length; i < max; i++) {
                        text[i] = F.keepallwords(text[i]);
                    }
                }
            }

            return text;

        },

        getlanguagedata: function(target, withoutkeepwords, usestriptags, extraoption) {
            var key, replacement, text = '';
            if (target) {
                text = target[lang] || target.kr || '';
            }
            if (typeof(withoutkeepwords) == 'object') {
                replacement = withoutkeepwords;
                withoutkeepwords = usestriptags;
                usestriptags = extraoption;
            }
            if (replacement) {
                for (key in replacement) {
                    text = text.replace('{: ' + key + ' :}', replacement[key]);
                }
            }
            return (text && !withoutkeepwords) ? F.keepallwords(text) : (usestriptags) ? D.striptags(text) : text;
        },

        getlangfromurl: function() {
            var _lang = location.href.match(/(?:#!\/|\/)(kr|en|jp)\//i);
            return (_lang) ? _lang[1] : '';
        },

        getlocationorigin: function() {
            return location.origin || location.protogol + '//' + location.hostname + ((location.port) ? ':' + location.port : '');
        },


        cutstring: (function() {

            var testtext = 'A0田',
                ellipsis = '...';

            return function($target, text, maxlines) {

                var height, gap, textlength = text.length,
                    index = 0;

                $target.style.fontSize = 0;
                height = $target.offsetHeight;
                $target.style.fontSize = '';
                $target.innerHTML = testtext;
                gap = $target.offsetHeight - height;
                height += gap * maxlines + gap / 2;
                index = 0;

                while (textlength > index && height > $target.offsetHeight) {
                    if (index >= textlength - 1) {
                        $target.innerHTML = text;
                        return;
                    }
                    index = index + 2;
                    $target.innerHTML = text.substring(0, index) + ellipsis;
                }
                $target.innerHTML = text.substring(0, index - 2) + ellipsis;

            }

        })(),


        //add pseudo element to buttons for ie7(not supported) and ie8(font-size bug)
        button: (function() {
            var $buttons, i;
            return {
                set: function($parent, selector) {
                    if (9 > browser.ie) {
                        if (selector == undefined) {
                            selector = '.button';
                        }
                        $buttons = find(selector, $parent);
                        for (i = 0, max = $buttons.length; i < max; i++) {
                            if (!find('span.after', $buttons[i]).length) {
                                $buttons[i].appendChild(create('<span class="after">' + data.get($buttons[i], 'icon') + '</span>'));
                            }
                        }
                    }
                }
            }
        })(),

        featured: function($list) {

            var $imgs = [],
                imgwidth = 1920,
                imgheight = 480,
                i = 0,
                max = $list.length;

            for (; i < max; i++) {
                $imgs[i] = find('img', $list[i])[0];
                style.set($list[i].children[0], {
                    scale3d: 1.05
                });
                if (!ismobile) {
                    event.add($list[i], {
                        mouseenter: hover,
                        mouseleave: leave
                    });
                }
            }

            function hover() {
                animate(this.children[0], {
                    scale3d: 1
                }, {
                    time: (browser.ie) ? 1 : 5,
                    easing: 'easeOutQuad'
                });
            }

            function leave() {
                animate(this.children[0], {
                    scale3d: 1.05
                }, {
                    time: 0.5,
                    easing: 'easeOutCubic'
                });
            }

            return {
                resize: function() {
                    var listwidth = $imgs[0].parentNode.offsetWidth,
                        listheight = $list[0].offsetHeight;
                    for (i = 0; i < max; i++) {
                        fillimage($imgs[i], listwidth, listheight, imgwidth, imgheight);
                    }
                }
            }

        },

        gridlist: function($box, areas, colsmap, option) {

            if (!$box) {
                return null;
            }

            var
            $listboxs = find('> ul.list', $box),
                $listbox = $listboxs[0],

                $fakebox = create('<div class="fakebox" />'), // for list box height
                $items = find('li', $box),
                $imgs = [],
                $clears = [],
                $covers = [],
                $links = [],
                $texts = [],

                $catebox = find('#cates')[0],

                years,
                cateline,
                more,

                option = option || {},

                numdisplay = option.numdisplay || 30,
                nownumdisplay = numdisplay,
                numdisplaymore = option.numdisplaymore || numdisplay,

                visibles = [],
                numvisibles = 0,

                imgsize = option.imagesize || [426, 426],
                imgwidth = imgsize[0],
                imgheight = imgsize[1],

                nowcate = 'all',
                catelengths,

                thumbnailadded = [],
                horizontalimages = [],

                clickable = true,

                transition = browser.support.transition,

                types,
                viewtype = option.viewtype || 'grid',
                resizeaction = {},
                anioption = {
                    opacity: {
                        time: 0.75,
                        easing: 'easeOutCubic'
                    },
                    texts: {
                        time: 1,
                        easing: 'easeOutQuart'
                    }
                },
                i = 0,
                max = $items.length,
                j = 0;


            style.set($fakebox, 'opacity', 0);
            $box.insertBefore($fakebox, $listboxs[$listboxs.length - 1].nextSibling);

            for (; i < max; i++) {

                $clears[i] = find('span.clear', $items[i])[0];
                $covers[i] = find('span.cover', $items[i])[0];
                $links[i] = find('a', $items[i])[0];

                if ($clears[i] || $links[i]) {

                    data.set($items[i], 'index', i);
                    if (!ismobile) {
                        event.add($items[i], {
                            'mouseenter': linkhover,
                            'mouseleave': linkout
                        });
                    }

                    $texts[i] = find('span.txt', $items[i])[0];

                }

                if (numdisplay > j) {
                    visibles[i] = true;
                    numvisibles++;
                    j++;
                } else {
                    $items[i].style.display = 'none';
                }

                horizontalimages[i] = data.get($items[i], 'image-h');

            }

            function linkhover() {
                var index = this.getAttribute('data-index');
                types[viewtype].over(index);
            }

            function linkout() {
                var index = this.getAttribute('data-index');
                types[viewtype].out(index);
            }

            types = {

                grid: (function() {

                    var
                    cols, rows, grids, rowindex, blankindex,
                        boxwidth, itemwidth, itemheight,
                        newleft, newtop, newwidth, newheight, noplace,
                        sizex, sizey, differentx,
                        type, x, y;


                    function resize(sizemodechanged) {

                        var stopncontinue;

                        cols = colsmap[sizemode] || colsmap['default'];
                        rows = 0;
                        grids = [];
                        boxwidth = $listbox.offsetWidth;
                        if (cols == 'auto') {
                            cols = Math.floor(boxwidth / 160);
                            if (colsmap.min) {
                                cols = Math.floor(cols / colsmap.min) * colsmap.min;
                            }
                        }
                        itemwidth = Math.round(boxwidth / cols);
                        if (mode == 'project') {
                            itemheight = Math.round(itemwidth * 1);
                        } else {
                            itemheight = Math.round(itemwidth * 1.2);
                        }

                        addline();

                        for (i = 0; i < max; i++) {

                            if (!visibles[i]) {
                                continue;
                            }

                            type = gettype($items[i]);
                            sizex = areas.x[type];
                            sizey = areas.y[type];

                            if (sizex > cols) {
                                sizey = Math.max(1, Math.round(sizey * cols / sizex));
                                sizex = cols;
                            }
                            //140717
                            if (sizemode == 'mini' && mode == 'project') {
                                sizey = 1;
                            }

                            for (rowindex = 0; rowindex > -1; rowindex++) {

                                !grids[rowindex] && addline();
                                blankindex = getblankindex(grids[rowindex]);

                                if (blankindex == -1 || blankindex + sizex > cols) {
                                    continue;
                                } else {
                                    stopncontinue = false;
                                    for (x = blankindex; x < blankindex + sizex; x++) {
                                        if (grids[rowindex][x]) {
                                            stopncontinue = true;
                                            break;
                                        }
                                    }
                                    if (stopncontinue) {
                                        continue;
                                    }
                                }

                                for (y = 0, noplace = false; y < sizey; y++) {
                                    !grids[rowindex + y] && addline();
                                    if (noplace == true || grids[rowindex + y][blankindex]) {
                                        noplace = true;
                                        break;
                                    }
                                    for (x = blankindex; x < sizex; x++) {
                                        if (grids[rowindex + y][x]) {
                                            noplace = true;
                                            break;
                                        }
                                    }
                                }

                                if (noplace) {
                                    continue;
                                }

                                for (j = 0; j < sizey; j++) {
                                    fillgrid(rowindex + j, blankindex, blankindex + sizex);
                                }

                                newleft = itemwidth * blankindex;
                                newtop = itemheight * rowindex;
                                newwidth = itemwidth * sizex + ((blankindex + sizex == cols) ? boxwidth - itemwidth * cols : 0);
                                newheight = itemheight * sizey;

                                style.set($items[i], {
                                    width: newwidth,
                                    height: newheight
                                });

                                style.set($items[i], {
                                    left: newleft,
                                    top: newtop
                                });

                                resizeimage(i);

                                if (sizemodechanged && $imgs[i]) {
                                    $imgs[i].src = getimagesrc($items[i], i);
                                }

                                data.set($items[i], {
                                    x: blankindex,
                                    y: rowindex
                                });

                                break;

                            }

                        }

                        style.set($fakebox, 'minHeight', Math.max(rows, 3) * itemheight);

                    }

                    function fillgrid(rowindex, from, to) {
                        for (; from < to; from++) {
                            grids[rowindex][from] = 1;
                        }
                    }

                    function addline() {
                        var i = 0,
                            array = [];
                        for (; i < cols; i++) {
                            array.push(0);
                        }
                        rows++;
                        grids.push(array);
                    }

                    function getblankindex(array) {
                        var i = 0,
                            max = array.length;
                        for (; i < max; i++) {
                            if (!array[i]) {
                                return i;
                            }
                        }
                        return -1;
                    }

                    return {
                        over: function(index) {
                            animate($imgs[index], {
                                scale3d: 1
                            }, {
                                time: (browser.ie) ? 1 : 5,
                                easing: 'easeOutQuad'
                            });
                            animate($clears[index], {
                                opacity: (isoldie) ? 0.5 : 1
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                            animate($texts[index], {
                                opacity: 1
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                            if ($covers[index]) {
                                animate($covers[index], {
                                    borderWidth: 6,
                                    opacity: 1
                                }, {
                                    time: 0.3,
                                    easing: 'easeOutCubic'
                                });
                            }
                        },
                        out: function(index) {
                            animate($imgs[index], {
                                scale3d: 1.05
                            }, {
                                time: 0.5,
                                easing: 'easeOutCubic'
                            });
                            animate($clears[index], {
                                opacity: 0
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                            animate($texts[index], {
                                opacity: 0
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                            if ($covers[index]) {
                                animate($covers[index], {
                                    borderWidth: 0,
                                    opacity: 0
                                }, {
                                    time: 0.3,
                                    easing: 'easeOutCubic'
                                });
                            }
                        },
                        resize: resize
                    }

                })(),

                line: (function() {

                    var noned;

                    function resize(sizemodechanged) {
                        style.set($fakebox, 'minHeight', $box.offsetHeight);
                        for (i = 0, j = 0; i < max; i++) {
                            $items[i].style.height = '';
                            style.set($items[i], 'height', $items[i].offsetHeight);
                            resizeimage(i);
                        }
                    }

                    return {
                        over: function(index) {
                            animate($imgs[index], {
                                scale3d: 1
                            }, {
                                time: (browser.ie) ? 1 : 5,
                                easing: 'easeOutQuad'
                            });
                            animate($texts[index], {
                                color: '#ffe000'
                            }, {
                                time: 0.3,
                                easing: 'easeOutQuad'
                            });
                            animate(find('span span', $texts[index])[0], {
                                color: '#ffe000'
                            }, {
                                time: 0.3,
                                easing: 'easeOutQuad'
                            });
                            animate($covers[index], {
                                opacity: 0
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                        },
                        out: function(index) {
                            animate($imgs[index], {
                                scale3d: 1.05
                            }, {
                                time: 0.5,
                                easing: 'easeOutCubic'
                            });
                            animate($texts[index], {
                                color: '#626262'
                            }, {
                                time: 0.3,
                                easing: 'easeOutQuad'
                            });
                            animate(find('span span', $texts[index])[0], {
                                color: '#8d8d8d'
                            }, {
                                time: 0.3,
                                easing: 'easeOutQuad'
                            });
                            animate($covers[index], {
                                opacity: 1
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                        },
                        resize: resize
                    }

                })(),

                zine: (function() {

                    var cutstringtimers = [];

                    function resize(sizemodechanged) {
                        var maxline = option.textlinemap[sizemode] || option.textlinemap['default'],
                            $textbox, text, i = 0,
                            max = $texts.length;
                        for (; i < max; i++) {
                            $textbox = $texts[i].children[1];
                            text = data.get($textbox, 'text');
                            if (text) {
                                clearTimeout(cutstringtimers[i]);
                                cutstringtimers[i] = setTimeout((function($textbox, text, maxline) {
                                    return function() {
                                        F.cutstring($textbox, text, maxline);
                                        types.line.resize();
                                    }
                                })($textbox, text, maxline), 500);
                            }
                        }
                        return;
                    }

                    return {
                        over: function(index) {
                            animate($imgs[index], {
                                scale3d: 1
                            }, {
                                time: (browser.ie) ? 1 : 5,
                                easing: 'easeOutQuad'
                            });
                            animate($clears[index], {
                                opacity: (isoldie) ? 0.5 : 0.3
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                            animate($covers[index], {
                                borderWidth: 6,
                                opacity: 1
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                        },
                        out: function(index) {
                            animate($imgs[index], {
                                scale3d: 1.05
                            }, {
                                time: 0.5,
                                easing: 'easeOutCubic'
                            });
                            animate($clears[index], {
                                opacity: 0
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                            animate($covers[index], {
                                borderWidth: 0,
                                opacity: 0
                            }, {
                                time: 0.3,
                                easing: 'easeOutCubic'
                            });
                        },
                        resize: resize
                    }

                })()

            }

            function covering(issorting) {
                classname.add($fakebox, 'cover');
                animate($fakebox, {
                    opacity: 1
                }, {
                    time: 0.35,
                    easing: 'easeOutQuad',
                    onend: (issorting) ? sorting : changeview
                });
            }

            function sorting() {
                for (i = 0; i < max; i++) {
                    style.set($items[i], 'display', (visibles[i]) ? '' : 'none');
                }
                resize();
                uncovering();
            }

            function uncovering() {
                animate($fakebox, {
                    opacity: 0
                }, {
                    time: 0.35,
                    easing: 'easeInQuad',
                    onend: uncoveringend
                });
            }

            function uncoveringend() {
                classname.remove($fakebox, 'cover');
                clickable = true;
                checkvisible();
            }

            function gettype($target) {
                return parseInt($target.className.match(/type([0-9])/)[1]) - 1;
            }

            function changeview(isfirst) {

                var $tg, newsrc;

                for (i = 0, j = 0; i < max; i++) {
                    if (!ismobile) {
                        $texts[i] && style.set($texts[i], {
                            color: ''
                        });
                        $tg = find('span span', $texts[i])[0];
                        $tg && style.set($tg, {
                            color: ''
                        });
                    }
                    if ($imgs[i]) {
                        $imgs[i].src = getimagesrc($items[i], i);
                    }
                    if (viewtype == 'grid') {
                        if ($clears[i] && !ismobile) {
                            style.set($texts[i], {
                                opacity: 0
                            });
                            style.set($clears[i], {
                                opacity: 0
                            });
                            if ($covers[i]) {
                                style.set($covers[i], {
                                    opacity: 0
                                });
                            }
                        }
                        style.set($items[i], 'position', 'absolute');
                    } else if (viewtype == 'line') {
                        if ($clears[i] && !ismobile) {
                            style.set($texts[i], {
                                opacity: ''
                            });
                            style.set($clears[i], {
                                opacity: 0.5
                            });
                            style.set($covers[i], {
                                opacity: 1
                            });
                        }
                        style.set($items[i], {
                            position: 'relative',
                            left: 0,
                            top: 0,
                            width: 'auto',
                            height: 'auto'
                        });
                    } else if (viewtype == 'zine') {
                        if ($clears[i] && !ismobile) {
                            style.set($clears[i], {
                                opacity: 0
                            });
                            style.set($covers[i], {
                                opacity: 0
                            });
                        }
                    }
                }

                settypeclass();

                resize();
                uncovering();

            }

            function settypeclass() {
                if (viewtype == 'grid') {
                    classname.remove($box, 'listlined');
                    (mode == 'project') && classname.add($box, 'listnormal');
                } else if (viewtype == 'line') {
                    classname.remove($box, 'listnormal');
                    classname.add($box, 'listlined');
                }
            }

            function setvisibles() {

                var check;

                clickable = false;
                numvisibles = 0;

                for (i = 0, j = 0; i < max; i++) {

                    //check match category
                    check = nowcate == 'all' || (data.get($items[i], 'cate') + ',').indexOf(nowcate + ',') != -1;

                    if (check) {
                        if (nownumdisplay > numvisibles) {
                            visibles[i] = true;
                            numvisibles++;
                        } else {
                            break;
                        }
                    }

                }

                more.check();

            }

            more = (function() {

                var
                $morebtnbox = create('<p class="loadmore"><a class="wi big tbig g plus"><span></span></a></p>'),
                    $morebtn = find('a', $morebtnbox)[0],

                    css = {
                        enter: {
                            color: '#626262',
                            paddingTop: 10
                        },
                        leave: {
                            color: '#8d8d8d',
                            paddingTop: 0
                        }
                    },

                    btnadded = false;


                $box.appendChild($morebtnbox);
                F.hidefocus($morebtn);

                event.add($morebtn, {
                    mouseenter: function() {
                        // animate(this, css.enter, { time: 0.35, easing: 'easeOutCubic' });
                    },
                    mouseleave: function() {
                        // animate(this, css.leave, { time: 0.35, easing: 'easeOutCubic' });
                    },
                    click: load
                });

                function load(e) {
                    nownumdisplay += numdisplaymore;
                    setvisibles();
                    sorting();
                    return event.cancel(e);
                }

                function langset() {
                    find('span', $morebtn)[0].innerHTML = labels[lang].list.loadmore[mode];
                }

                return {

                    langset: langset,

                    check: function(e) {

                        var hasmore, btnboxheight;

                        if (nowcate == 'all') {
                            hasmore = max > nownumdisplay;
                        } else {
                            hasmore = catelengths[nowcate] > nownumdisplay;
                        }

                        if (hasmore) {
                            classname.remove($morebtnbox, 'nomore');
                            btnadded = true;
                        } else {
                            classname.add($morebtnbox, 'nomore');
                            btnadded = false;
                        }

                    }

                }

            })();

            function setcategory() {

                var
                $titlebox,
                    $btn = find('#catebtn')[0],
                    $items = find('li', $catebox),
                    $cates = [],
                    $numtxts = [],

                    titlechangetimer,
                    opened = false,

                    anioption = {
                        over: {
                            time: 0.35,
                            easing: 'easeOutQuad'
                        },
                        out: {
                            time: 0.25,
                            easing: 'easeOutQuad'
                        },
                        open: {
                            time: 0.75,
                            easing: 'easeInOutQuart',
                            rounding: true,
                            onend: onopen
                        },
                        close: {
                            time: 0.5,
                            easing: 'easeOutQuart',
                            rounding: true
                        }
                    },

                    now = -1,

                    i = 0,
                    max = $items.length;


                $titlebox = find('article.listcates h3 span')[0];

                catelengths = [];

                for (; i < max; i++) {
                    $cates[i] = F.hidefocus(find('a', $items[i])[0]);
                    data.set($cates[i], 'index', i);
                    event.add($cates[i], (ismobile) ? {
                        click: change
                    } : {
                        mouseenter: over,
                        mouseleave: out,
                        click: change
                    });
                    $numtxts[i] = find('em', $items[i])[0];
                    catelengths[i] = data.get($cates[i], 'cate-length');
                    data.remove($cates[i], 'cate-length');
                }

                function over() {
                    var index = data.get(this, 'index');
                    if (index != now) {
                        animate(this, {
                            color: '#ffe000'
                        }, anioption.over);
                        animate($numtxts[index], {
                            backgroundColor: '#ffe000'
                        }, anioption.over);
                    }
                }

                function out(ignore) {
                    var index = data.get(this, 'index');
                    if (ignore === true || index != now) {
                        animate(this, {
                            color: '#626262'
                        }, anioption.over);
                        animate($numtxts[index], {
                            backgroundColor: '#353535'
                        }, anioption.out);
                    }
                }

                function change(e) {
                    var index;
                    if (clickable) {
                        index = data.get(this, 'index');
                        if (now != index) {
                            nowcate = data.get(this, 'cate-id');
                            for (i = 0; i < max; i++) {
                                if (i == index) {
                                    over.call(this);
                                } else {
                                    out.call($cates[i], true);
                                    classname.remove($cates[i], 'on');
                                }
                            }
                            classname.add(this, 'on');

                            //change category
                            visibles = [];
                            nownumdisplay = numdisplay;

                            setvisibles();

                            covering(true);

                            now = index;

                        }
                    }
                    return event.cancel(e);
                }

                function titlechange(newtitle) {
                    $titlebox.innerHTML = newtitle;
                }

                function toggle(e) {
                    var height;
                    if (!opened) {
                        style.set($catebox, {
                            height: 'auto',
                            display: 'block'
                        });
                        height = $catebox.offsetHeight;
                        $catebox.style.height = 0;
                        animate($catebox, {
                            height: height
                        }, anioption.open);
                        this.innerHTML = this.innerHTML.replace('plus', 'minus');
                        opened = true;
                    } else {
                        style.set($catebox, {
                            height: $catebox.offsetHeight
                        });
                        animate($catebox, {
                            height: 0
                        }, anioption.close);
                        this.innerHTML = this.innerHTML.replace('minus', 'plus');
                        opened = false;
                    }
                    return event.cancel(e);
                }

                function onopen() {
                    this.style.height = 'auto';
                }

                event.add($btn, 'click', toggle);

                over.call($cates[0]);
                now = 0;

            }

            function settypebutton(_viewtype) {

                var $btns = find('#typebtns button'),
                    types = [],
                    nowtype,
                    i = 0,
                    max = $btns.length,
                    anioption = {
                        time: 0.3
                    };


                function change() {
                    var index;
                    if (clickable) {
                        index = parseInt(this.getAttribute('data-index'));
                        if (index != nowtype) {
                            nowtype = index;
                            viewtype = types[index];
                            data.set('listdefaultview', viewtype);
                            out.call($btns[nowtype]);
                            clickable = false;
                            covering(false);
                        }
                    }
                }

                function hover() {
                    for (i = 0; i < max; i++) {
                        animate($btns[i], {
                            opacity: ($btns[i] == this) ? 1 : 0.3
                        }, anioption);
                    }
                }

                function out() {
                    for (i = 0; i < max; i++) {
                        animate($btns[i], {
                            opacity: (i == nowtype) ? 1 : 0.3
                        }, anioption);
                    }
                }

                for (; i < max; i++) {
                    F.hidefocus($btns[i]).setAttribute('data-index', i);
                    if (ismobile) {
                        event.add($btns[i], {
                            'click': change
                        });
                    } else {
                        event.add($btns[i], {
                            'mouseover': hover,
                            'mouseout': out,
                            'click': change
                        });
                    }
                    types[i] = $btns[i].getAttribute('data-type');
                    if (classname.has($btns[i], 'on')) {
                        nowtype = i;
                    }
                }

                nowtype = nowtype || 0;

                out.call($btns[nowtype]);

            }

            function checkvisible() {
                var top;
                for (i = 0; i < max; i++) {
                    if (!thumbnailadded[i] && visibles[i]) {
                        if (ismobile) {
                            loadthumbnail(i);
                            thumbnailadded[i] = true;
                        } else {
                            top = $items[i].getBoundingClientRect().top;
                            if (areaheight - top > 0) {
                                loadthumbnail(i);
                                thumbnailadded[i] = true;
                            }
                        }
                    }
                }
            }

            function resizeimage(index, withcheckhorizontal) {
                if ($imgs[index]) {
                    setimage($imgs[index], $items[index], checkhmode(index));
                }
            }

            function setimage($img, $target, isdoublewidth) {
                if (viewtype == 'zine') {
                    if (sizemode == 'mobile' || sizemode == 'mini') {
                        $img.style.width = $img.style.height = $img.style.margin = '';
                    } else {
                        fillimage($img, $target.offsetWidth / 2, $target.offsetHeight, imgwidth, imgheight);
                    }
                } else {
                    fillimage($img, $target.offsetWidth, $target.offsetHeight, (isdoublewidth) ? imgwidth * 2 : imgwidth, imgheight);
                }
            }

            function checkhmode(index) {
                return horizontalimages[index] && (viewtype == 'line' || (viewtype == 'grid' && (gettype($items[index]) == 1 || sizemode == 'mini')));
            }

            function getimagesrc($item, index) {
                return (checkhmode(index)) ? horizontalimages[index] : data.get($item, 'image');
            }

            function addimage($img, index) {
                var $item = $items[index];
                if (viewtype == 'zine') {
                    $item.replaceChild($img, find('img', $item)[0]);
                } else {
                    $item.insertBefore($img, $item.firstChild);
                }
                style.set($img, {
                    scale3d: 1.05
                });
                $imgs[index] = $img;
                resizeimage(index);
            }

            function loadthumbnail(index) {

                var
                $item = $items[index],
                    imageurl = getimagesrc($item, index);

                if (imageurl) {
                    if (ismobile) {
                        addimage(create('<img src="' + imageurl + '" alt="">', $box), index);
                    } else {
                        classname.add($item, 'loading');
                        loadimage(imageurl, function() {
                            style.set(this, 'opacity', 0);
                            addimage(this, index);
                            classname.remove($item, 'loading');
                            // if ( transition ) {//use transition
                            //  this.style[transition] = 'opacity 0.5s linear';
                            //  setTimeout(function() {
                            //  $imgs[index].style.opacity = 1;
                            //  }, 0);
                            // } else {
                            animate(this, {
                                opacity: 1
                            }, {
                                time: 0.5,
                                easing: 'linear'
                            });
                            // }
                        });
                    }
                }

            }

            function hideitem() {
                style.set(this.parentNode, 'display', 'none');
            }

            function resize() {
                types[viewtype].resize(prevsizemode !== sizemode);
                checkvisible();
            }

            function scroll(scrolltop) {
                checkvisible();
            }

            (function() {
                return;
                var $psy = find('[data-special="psy"]', $listbox)[0];
                if (ismobile || !$psy || !browser.support.transform) {
                    return;
                }
                $psy.style.backgroundColor = '#ffe000';
                event.add(
                    $psy, {
                        mouseenter: function() {
                            animate($psy, {
                                backgroundColor: '#000'
                            }, {
                                time: 1
                            });
                            animate(find('img', this)[0], {
                                rotateZ: 3600,
                                scale3d: 0,
                                opacity: 0
                            }, {
                                time: 1,
                                easing: 'easeOutCubic'
                            });
                        },
                        mouseleave: function() {
                            animate($psy, {
                                backgroundColor: '#ffe000'
                            }, {
                                time: 1
                            });
                            animate(find('img', this)[0], {
                                rotateZ: 0,
                                scale3d: 1,
                                opacity: 1
                            }, {
                                time: 1,
                                easing: 'easeOutCubic'
                            });
                        }
                    }
                );
            })();

            changeview(true);

            more.check();
            resize();

            return {
                langset: more.langset,
                setcategory: setcategory,
                settypebutton: settypebutton,
                scroll: scroll,
                resize: resize
            }

        },

        setlinkbuttons: function($box, list, colorset) {

            var $buttons = [],
                i = 0,
                max = list.length,
                anioption = {
                    time: 0.25,
                    easing: 'easeOutSine'
                },
                supporttransition = browser.support.transition,
                key;

            for (; i < max; i++) {
                key = list[i].name;
                if (list[i].name == 'qrcode') {
                    $buttons[i] = create('<span class="button ' + linkmap[key].c + '"><img src="' + F.getimagesrc(list[i].url) + '" alt="' + linkmap[key].t + '"></span>', $box);
                } else {
                    $buttons[i] = create('<a href="' + list[i].url + '" class="button ' + linkmap[key].c + '" data-icon="' + linkmap[key].i + '" target="_blank"></a>', $box);
                }
                if (colorset) {
                    $buttons[i].style.color = colorset;
                }
                /*
//140718 data.bg color to button text color - 
if ( colorset ) {
$buttons[i].style.color = colorset[2];
$buttons[i].style.backgroundColor = colorset[1];
if ( list[i].name != 'qrcode' && colorset[0] && colorset[1] ) {
event.add($buttons[i], { mouseenter: hover, mouseleave: leave });
}
}*/
            }

            function hover() {
                coloring(this, colorset[0]);
            }

            function leave() {
                coloring(this, colorset[1]);
            }

            function coloring($target, color) {
                var p = {
                    backgroundColor: color
                };
                if (supporttransition) {
                    style.set($target, p);
                } else {
                    animate($target, p, anioption);
                }
            }

            function langset() {
                for (i = 0; i < max; i++) {
                    key = list[i].name;
                    if (key != 'qrcode') {
                        $buttons[i].innerHTML = linkmap[key].t[lang];
                        if (9 > browser.ie && !find('span.after', $buttons[i]).length) {
                            $buttons[i].appendChild(create('<span class="after">' + data.get($buttons[i], 'icon') + '</span>'));
                        }
                    }
                }
            }

            return {
                langset: langset
            }

        },

        addsharebuttons: function($target) {

            var $buttons = [],
                defaultcolor, whereto = ['facebook', 'twitter', 'pinterest'],
                i = 0,
                max = whereto.length,
                anioption = {
                    time: 0.3
                };

            for (; i < max; i++) {
                $buttons[i] = create([
                    '<a href="#" data-provider="', icons[whereto[i]].name, '">',
                    icons[whereto[i]].icon,
                    '<span>Share on ', icons[whereto[i]].name, '</span>',
                    '</a>'
                ].join(''));
                event.add($buttons[i], (!ismobile) ? {
                    mouseenter: hover,
                    mouseleave: leave,
                    click: F.sharing
                } : {
                    click: F.sharing
                });
                $target.appendChild($buttons[i]);
            }

            defaultcolor = D.color.getcode($buttons[0], 'color');

            function hover() {
                var provider = F.getprovider(this);
                animate(this, {
                    color: icons[provider].color
                }, anioption);
            }

            function leave() {
                var provider = F.getprovider(this);
                animate(this, {
                    color: defaultcolor
                }, anioption);
            }

        },

        getprovider: function($target) {
            var provider = data.get($target, 'provider') || '';
            if (!provider) {
                provider = $target.innerHTML.match(regexpsnsprovider);
                if (provider) {
                    provider = provider[1];
                }
            }
            return provider.replace(/ /g, '').toLowerCase();
        },

        sharing: function(e) {

            var provider = F.getprovider(this),
                shareurl = encodeURIComponent(location.href);

            if (provider == 'facebook') {
                window.open('https://www.facebook.com/sharer/sharer.php?u=' + shareurl);
            } else if (provider == 'twitter') {
                window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(document.title) + '&url=' + shareurl);
            } else if (provider == 'googleplus') {
                window.open('https://plus.google.com/share?url=' + shareurl);
            } else if (provider == 'pinterest') {
                return F.openPinitLayer(e);
            }

            return event.cancel(e);

        },

        openPinitLayer: function(e) {
            (function(d) {
                var js = d.createElement('script');
                js.setAttribute('type', 'text/javascript');
                js.setAttribute('charset', 'UTF-8');
                js.setAttribute('src', 'http://assets.pinterest.com/js/pinmarklet.js?r=' + Math.random() * 99999999);
                d.body.appendChild(js);
            })(document);
            return event.cancel(e);
        },

        carousel: function($mask, $wrapper, $items, $paging, display, option) {

            if (!$mask) {
                return;
            }
            return {
                resize: function() {

                }
            };

            var nowpage = 0,
                numitems = $items.length,
                option = option || {},
                paging = F.pageindicator($paging, 1, {
                    onchange: changepage,
                    imagename: (option.imagename) ? option.imagename : ''
                }),
                onmove = option.onmove,
                onend = option.onend,
                onchange = option.onchange,
                scroll = fakescroll.set($mask, {
                    scrollsizelock: true,
                    usetransform: 'translate3d',
                    hide: true,
                    x: {
                        blockparentscroll: true
                    },
                    y: {
                        disable: true
                    }
                })
                    .addEventListener('pagechange', onpagechange);


            if (onmove) {
                scroll.addEventListener('scroll', function(e) {
                    onmove(e.scrollLeft);
                });
            }
            if (onend) {
                scroll.addEventListener('scrollend', function(e) {
                    onend(e.pageLeft);
                });
            }

            function resize() {

                var numdisplay = display[sizemode] || display['default'],
                    maskwidth = $mask.offsetWidth,
                    itemwidth, wrapperwidth,
                    i = 0;

                if (numdisplay === false || numdisplay === numitems) {

                    $wrapper.style.width = scroll.wrapper.style.width = '';
                    for (; i < numitems; i++) {
                        $items[i].style.width = '';
                    }

                    scroll.x.blockparentscroll = false;
                    scroll.reset();
                    $paging.style.display = 'none';

                    return;

                }

                itemwidth = Math.ceil(maskwidth / numdisplay);

                if ($mask.id == 'whatwedo') {
                    wrapperwidth = areawidth * Math.ceil(numitems / numdisplay) + 100;
                } else {
                    wrapperwidth = itemwidth * (numdisplay * Math.ceil(numitems / numdisplay));
                    for (; i < numitems; i++) {
                        style.set($items[i], 'width', itemwidth);
                    }
                }
                style.set($wrapper, 'width', wrapperwidth);
                style.set(scroll.wrapper, 'width', wrapperwidth);

                scroll.x.scrollsize = scroll.x.scrollsizefix = maskwidth;
                scroll.x.blockparentscroll = true;
                scroll.reset();

                $paging.style.display = '';
                paging.setpagelength(Math.ceil(numitems / numdisplay));

            }

            function onpagechange(e) {
                nowpage = e.pageLeft;
                paging.change(nowpage);
                onchange && onchange(nowpage);
            }

            function changepage(pageindex) {
                nowpage = pageindex;
                scroll.pageLeft(nowpage);
            }

            resize();

            return {
                prev: function() {
                    scroll.pageLeft(nowpage - 1);
                },
                next: function() {
                    scroll.pageLeft(nowpage + 1);
                },
                resize: resize
            }

        },

        xlider: function($box, $wrapper, $items, $paging, display, option) {
            //xlider: function($box, option) {

            var
            option = option || {},
                arrows = option.arrows !== false,
                useswipe = option.swipe !== false,
                useanimate = option.animate !== false,

                paging = F.pageindicator($paging, 1, {
                    onchange: changepage,
                    imagename: (option.imagename) ? option.imagename : ''
                }),

                eventmove = option.onmove,
                eventchange = option.onchange,
                eventchangeend = option.onchangeend,

                $wrapper,
                $arrows, $prev, $next,

                $blocker,
                blockeradded = false,

                boxwidth,
                windowwidth,

                nowpage = (option.defaultpage && option.defaultpage > -1) ? option.defaultpage : 0,
                totalpage,

                downx, downy, basex, swipeangle, starttime, moved, wrapperdownx,

                canceled = false,

                anioption = {
                    slide: {
                        time: 0.3,
                        easing: 'easeOutQuart',
                        onupdate: onmove,
                        onend: changeend
                    },
                    back: {
                        time: 0.2,
                        easing: 'easeOutQuart',
                        onupdate: onmove,
                        onend: changeend
                    }
                },

                i = 0,
                numitems = $items.length;

            $wrapper.style.overflow = 'hidden';
            $blocker = create('<div class="blocker" />');

            //add arrow buttons
            if (arrows) {
                $arrows = create('<p class="arrows" />', $box.parentNode);
                $prev = create('<button class="prev" data-frag="prev"><span class="t">Previous</span><span class="i">&#x25C5;</span></button>', $arrows);
                event.add($prev, 'click', toprev);
                $next = create('<button class="next" data-frag="next"><span class="t">Next</span><span class="i">&#x25BB;</span></button>', $arrows);
                event.add($next, 'click', tonext);
            }

            function down(e) {

                if (canceled) {
                    return true;
                }

                downx = basex = event.getpoint(e)[0];

                //check for ios 7 safari swipe back/forward
                if (15 > downx || downx > windowwidth - 15) {
                    return true;
                }

                stopanimate($wrapper);

                downy = event.getpoint(e)[1];
                starttime = new Date().getTime();

                moved = 0;
                wrapperdownx = style.get($wrapper, 'translate3dX');
                swipeangle = false;

                event.add($docel, (ismobile) ? {
                    touchmove: move,
                    touchend: up
                } : {
                    mousemove: move,
                    mouseup: up
                });

            }

            function move(e) {

                var x = event.getpoint(e)[0],
                    y = event.getpoint(e)[1],
                    nowtime = new Date().getTime();

                //check swipe angle and cancel sliding with vertical move
                if (swipeangle === false) {
                    swipeangle = Math.abs((Math.atan2(downx - x, downy - y) * 180) / Math.PI);
                    if (45 > swipeangle || swipeangle > 135) {
                        event.remove($docel, (ismobile) ? {
                            touchmove: move,
                            touchend: up
                        } : {
                            mousemove: move,
                            mouseup: up
                        });
                        return true;
                    }
                }

                moved = x - downx;
                if ((!nowpage && moved > 0) || (nowpage == totalpage - 1 && 0 > moved)) {
                    moved /= 2;
                }
                style.set($wrapper, 'translate3dX', wrapperdownx + moved);
                onmove(wrapperdownx + moved);

                if (nowtime - 300 > starttime) {
                    starttime = nowtime;
                    basex = x;
                }

                //cancel click in desktop
                if (!ismobile && !blockeradded) {
                    $box.appendChild($blocker);
                    blockeradded = true;
                }

                return event.cancel(e);

            }

            function onmove(v) {
                if (typeof(v) != 'number') {
                    v = v.translate3dX;
                }
                eventmove && eventmove.call($box, v);
            }

            function up(e) {

                var x = event.getpoint(e)[0],
                    movedvalue = x - basex;

                if (x != downx) {
                    if (20 > Math.abs(x - downx)) {
                        back();
                    } else if (!movedvalue || new Date().getTime() - starttime > 300) {
                        if (moved > boxwidth / 2 && nowpage) {
                            toprev(false, true);
                        } else if (-boxwidth / 2 > moved && nowpage != totalpage - 1) {
                            tonext(false, true);
                        } else {
                            back();
                        }
                    } else {
                        if (movedvalue > 0 && nowpage) {
                            toprev(false, true);
                        } else if (0 > movedvalue && nowpage != totalpage - 1) {
                            tonext(false, true);
                        } else {
                            back();
                        }
                    }
                } else {
                    back();
                }

                if (!ismobile && blockeradded) {
                    $box.removeChild($blocker);
                    blockeradded = false;
                }

                event.remove($docel, (ismobile) ? {
                    touchmove: move,
                    touchend: up
                } : {
                    mousemove: move,
                    mouseup: up
                });

            }

            function back() {
                wrappermove(nowpage, 'back');
            }

            function change(page) {
                var nextpage;
                nextpage = (typeof(page) == 'number') ? page : (this.getAttribute) ? parseInt(this.getAttribute('data-page')) : null;
                if (nextpage !== null && nextpage != nowpage && nextpage > -1 && totalpage > nextpage) {
                    readytomove(nextpage);
                    wrappermove(nextpage, 'slide');
                }
            }

            function toprev(e, fromswipe) {
                if (!nowpage) {
                    return false;
                }
                readytomove((!nowpage) ? totalpage - 1 : nowpage - 1);
                wrappermove();
                return false;
            }

            function tonext(e, fromswipe) {
                if (nowpage == totalpage - 1) {
                    return false;
                }
                readytomove((nowpage == totalpage - 1) ? 0 : nowpage + 1);
                wrappermove();
                return false;
            }

            function readytomove(nextpage) {
                nowpage = nextpage;
                setbuttons();
                paging.change(nowpage);
                eventchange && eventchange.call($box, nowpage);
            }

            function wrappermove(pageto, anioptionkey) {
                if (useanimate) {
                    animate($wrapper, {
                        translate3dX: -boxwidth * ((pageto || pageto === 0) ? pageto : nowpage)
                    }, anioption[anioptionkey || 'slide']);
                } else {
                    changeend();
                }
            }

            function setbuttons() {
                if (arrows) {
                    classname.decide($prev, 'disabled', !nowpage);
                    classname.decide($next, 'disabled', nowpage == totalpage - 1);
                }
            }

            function changeend() {
                eventchangeend && eventchangeend.call($box, nowpage);
            }

            function resize() {

                var numdisplay = display[sizemode] || display['default'],
                    itemwidth, wrapperwidth,
                    i = 0;

                canceled = false;

                boxwidth = $box.offsetWidth,
                windowwidth = $body.offsetWidth;

                if (numdisplay === false || numdisplay === numitems) {
                    style.set($wrapper, {
                        width: '',
                        translate3dX: ''
                    });
                    for (; i < numitems; i++) {
                        $items[i].style.width = '';
                    }
                    canceled = true;
                    $paging.style.display = $arrows.style.display = 'none';
                    return;
                }

                itemwidth = Math.ceil(boxwidth / numdisplay);
                totalpage = Math.ceil(numitems / numdisplay);

                if (nowpage > totalpage - 1) {
                    nowpage = totalpage - 1;
                    paging.change(nowpage);
                }

                if ($box.id == 'whatwedo') {
                    wrapperwidth = areawidth * totalpage + 100;
                } else {
                    wrapperwidth = itemwidth * (numdisplay * totalpage);
                    for (; i < numitems; i++) {
                        style.set($items[i], 'width', itemwidth);
                    }
                }

                style.set($wrapper, {
                    width: wrapperwidth,
                    translate3dX: -boxwidth * nowpage
                });

                $paging.style.display = '';
                paging.setpagelength(totalpage);

                // if ( !browser.android ) {
                anioption.slide.time = Math.max(750, Math.min(boxwidth, 1000)) / 1000;
                anioption.back.time = anioption.slide.time * 0.7;
                // }

            }

            if (useswipe) {
                event.add($wrapper, (ismobile) ? {
                    touchstart: down
                } : {
                    mousedown: down
                });
            }

            function changepage(pageindex) {
                readytomove(pageindex);
                wrappermove();
            }

            resize();
            setbuttons();
            paging.change(nowpage);
            changeend();

            return {
                prev: function() {
                    return toprev();
                },
                next: function() {
                    return tonext();
                },
                resize: resize
            }

        },


        pinstyle: function($box, $items, colsmap) {

            var cols, itemwidth, minheight,
                heights = [],
                i = 0,
                j, max = $items.length;

            function resize() {

                itemwidth = $items[0].offsetWidth;
                heights.length = 0;
                cols = colsmap[sizemode] || colsmap['default'];

                if (2 > cols) {
                    for (i = 0; i < max; i++) {
                        style.set($items[i], {
                            position: '',
                            left: '',
                            top: ''
                        });
                    }
                    style.set($box, 'height', 'auto');
                    return;
                }

                for (i = 0; i < cols; i++) {
                    heights.push(0);
                }

                for (i = 0; i < max; i++) {
                    minheight = Math.min.apply(Math, heights);
                    for (j = 0; j < cols; j++) {
                        if (minheight === heights[j]) {
                            heights[j] += $items[i].offsetHeight;
                            style.set($items[i], {
                                position: 'absolute',
                                left: itemwidth * j,
                                top: minheight
                            });
                            break;
                        }
                    }
                }

                style.set($box, 'height', Math.max.apply(Math, heights));

            }

            resize();

            return {
                resize: resize
            }

        },


        column: function($target) {

            if (!$target) {
                return null;
            }

            var texts = $target.innerHTML,
                $column1 = create('<span class="column c1" />'),
                $column2 = create('<span class="column c2" />'),
                $clearfloat = create('<span style="clear:both;height:0;display:block;overflow:hidden;" />'),
                splitedtext = texts.split(' '),
                halfheight, lineheight, i, max;

            function resize() {

                if (browser.support.columnlayout) {
                    return;
                }

                if (sizemode == 'mobile' || sizemode == 'mini' || sizemode == 'tablet') {
                    $target.innerHTML = texts;
                    return;
                }

                $column1.innerHTML = texts;
                $target.appendChild($column1);
                halfheight = $column1.offsetHeight / 2;
                $column1.innerHTML = '';

                for (i = 0, max = splitedtext.length, lineheight = 0; i < max; i++) {
                    $column1.innerHTML += splitedtext[i] + ' ';
                    if (!lineheight) {
                        lineheight = $column1.offsetHeight * 0.75;
                    } else if ($column1.offsetHeight > halfheight + lineheight) {
                        break;
                    }
                }

                $target.removeChild($column1);

                $target.innerHTML = '';

                $column1.innerHTML = splitedtext.slice(0, i).join(' ');
                $column2.innerHTML = splitedtext.slice(i, max).join(' ');

                $target.appendChild($column1);
                $target.appendChild($column2);
                $target.appendChild($clearfloat);

            }

            resize();

            return {
                resize: resize
            }

        },


        pageindicator: function($box, numpages, option) {

            var i = 0,
                $items = [],
                hrefprefix = option.hrefprefix,
                onchange = option.onchange,
                onhover = option.onhover,
                page, parentbg, imgname;

            if (!$box) {
                return;
            }

            if (option.imagename) {
                imgname = 'icn_' + option.imagename + '.png';
            } else {
                // parentbg = D.color.getcode($box.parentNode, 'backgroundColor');
                // imgname = ( parentbg == '#ffe000' )? 'icn_dotpageiny.png' : 'icn_dotpage.png';
                imgname = 'icn_dotpage.png';
            }

            for (; i < numpages; i++) {
                $items[i] = createitem(i);
            }

            function createitem(index) {

                var page = index + 1,
                    newitem =
                        (hrefprefix) ?
                    // create('<a href="#'+ hrefprefix + page +'" class="item" data-index="'+ index +'"><span>'+ page +' Page</span></a>') :
                    // create('<span class="item" data-index="'+ index +'"><span>'+ page +' Page</span></span>');
                    create('<a href="#' + hrefprefix + page + '" class="item" data-index="' + index + '"><img src="' + imgroot + imgname + '" alt="' + page + ' Page"></a>') :
                        create('<span class="item" data-index="' + index + '"><img src="' + imgroot + imgname + '" alt="' + page + ' Page"></span>');

                if (onhover) {
                    newitem.onmouseover = onhover;
                }

                newitem.onclick = change;

                $box.appendChild(newitem);

                return newitem;

            }

            function change(index) {

                var img, isclick = (isNaN(index)) ? true : false,
                    nowpage = (!isclick) ? index : parseInt(this.getAttribute('data-index'));

                for (i = 0; i < numpages; i++) {
                    if (i == nowpage) {
                        classname.add($items[i], 'on');
                    } else {
                        classname.remove($items[i], 'on');
                    }
                }

                isclick && onchange && onchange(nowpage);

                return false;

            }

            function setpagelength(pages) {

                var i = 0,
                    max = Math.max(numpages, pages);

                for (; i < max; i++) {
                    if (i >= pages) {
                        $items[i].parentNode.removeChild($items[i]);
                    } else if (i >= numpages) {
                        $items[i] = createitem(i);
                    }
                }

                numpages = pages;

            }

            return {
                change: change,
                setpagelength: setpagelength
            }

        },

        spriteani: function(target, totalframe, property, time, loop) {
            var currentframe, temp = {};
            totalframe--;

            function onupdate(e) {
                var frame = Math.round(totalframe * e.v);
                if (currentframe != frame) {
                    style.set(target, property, -target.parentNode.offsetWidth * frame);
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
        },

        setvisualimage: function($target, _source, usevideo, istopvisual) {

            $target.innerHTML = '';

            if (usevideo) {
                return null;
            }

            var
            source = (_source.constructor == Array) ? _source.slice().sort(F.randomsort) : [_source],

                $items = [],
                $images = [],

                imagesize = [
                    [0, 0],
                    [960, 1280]
                ],

                itemindex = 0,
                previtemindex = -1,
                imageindex = 0,

                autotimer = null,
                autotime = 5000,

                zindex = 0,

                splited,
                paused = false,

                anioption = {
                    p: {
                        opacity: 1
                    },
                    o: {
                        time: 1.5,
                        easing: 'easeOutCirc',
                        onend: changed
                    }
                },

                i = 0,
                max = source.length;

            for (; i < max; i++) {
                splited = typeof(source[i]) != 'string';
                $items[i] = create([
                    '<div class="group">',
                    '<img src="', (!splited) ? source[i] : source[i].horizontal, '" alt="">', (splited) ? '<img src="' + source[i].vertical + '" alt="">' : '',
                    '</div>'
                ].join(''), $target);
                style.set($items[i], 'display', (!i) ? 'block' : 'none');
                $images[i] = find('img', $items[i]);
            }
            if (viewmode && mode == 'project' || mode == 'news') {
                $target.appendChild(create('<img src="' + imgroot + 'bg_detailclear.png" class="clear" alt="">'));
            }

            function setimagedisplay() {
                var i;
                for (i = 0; i < max; i++) {
                    if ($images[i].length > 1) {
                        $images[i][imageindex].style.display = '';
                        $images[i][(imageindex) ? 0 : 1].style.display = 'none';
                        fillimage($images[i][imageindex], areawidth, areaheight);
                    } else {
                        fillimage($images[i][0], areawidth, areaheight);
                    }
                }
            }

            function change() {

                previtemindex = itemindex;
                itemindex = (itemindex == max - 1) ? 0 : itemindex + 1;

                style.set($items[itemindex], {
                    display: 'block',
                    zIndex: ++zindex,
                    opacity: 0
                });
                animate($items[itemindex], anioption.p, anioption.o);

            }

            function auto() {
                autotimer = setTimeout(change, autotime);
            }

            function changed() {
                stopanimate($items[itemindex]);
                style.set($items[itemindex], 'opacity', 1);
                if (previtemindex > -1) {
                    style.set($items[previtemindex], 'display', 'none');
                }
                clearTimeout(autotimer);
                (max > 1) && auto();
            }

            function resize() {
                imageindex = (areawidth > areaheight) ? 0 : 1;
                setimagedisplay();
                (max > 1) && changed();
            }

            function scroll(v) {
                if (max > 1 && istopvisual) {
                    if (v > areaheight) {
                        if (!paused) {
                            clearTimeout(autotimer);
                        }
                        paused = true;
                    } else {
                        if (paused) {
                            auto();
                        }
                        paused = false;
                    }
                }
            }

            functions.resize.push(resize);
            functions.scroll.push(scroll);

            (max > 1) && auto();

            return find('img', $target)[0];
            /*
var h, v, imgs;
if ( (/^\#/).test(source) ) { //color
$target.style.backgroundColor = source;
return null;
} else { //image
if ( !splited ) {
$target.innerHTML = '<img src="'+ F.getimagesrc(source) +'" alt="">';
} else {
if ( typeof(source) == 'string' ) {
h = v = F.getimagesrc(source);
} else {
h = F.getimagesrc(source.horizontal);
v = F.getimagesrc(source.vertical);
}
imgs = find('img', $target);
if ( imgs.length == 2 ) {
imgs[0].src = h;
imgs[1].src = v;
} else {
$target.innerHTML = '<img src="'+ h +'" alt=""><img src="'+ v +'" alt="">';
}
}
return $target.children[0];
}
*/

        },

        setvisualvideo: function($target, source, istopvisual) {

            var
            $videobox = create('<div class="videowrap" />', $target),
                $videos = [],

                videopaths = source.slice(),
                nowindex = 0,
                previndex = -1,
                nextindex = 0,

                videowidth = 1920,
                videoheight = 1080,

                aborted = false,
                classsetted = false,

                html = [],

                numvideos = videopaths.length,

                i = 0,
                max = numvideos;

            videopaths.sort(F.randomsort);
            videopaths = videopaths.slice(0, Math.min(max, 5));
            max = videopaths.length;

            classname.remove($target, 'error');

            for (; i < max; i++) {
                $videos[i] = create([
                    '<video preload="', 'metadata', '">',
                    '<source src="', videopaths[i], '.mp4" type="video/mp4">',
                    '<source src="', videopaths[i], '.webm" type="video/webm">',
                    '</video>'
                ].join(''), $videobox);
                event.add($videos[i], {
                    canplay: oncanplay,
                    play: onplay,
                    timeupdate: ontimeupdate,
                    ended: onplayend,
                    error: onerror
                });
            }

            function onerror(e) {
                if (!aborted) {
                    style.set(find('div.visual', $target.parentNode)[0], 'opacity', '');
                    classname.add($target, 'error');
                    $target.style.display = 'none';
                    $target.innerHTML = '';
                    $videos = $videobox = null;
                    max = 0;
                    aborted = true;
                    D.publish($target.parentNode, 'videoaborted');
                }
            }

            function oncanplay() {
                if (!aborted && this == $videos[nowindex]) {
                    $videos[nowindex].play();
                }
            }

            function onplay() {}

            function ontimeupdate() {
                if (!aborted && !classsetted && this == $videos[nowindex]) {
                    $videos[nowindex].className = 'playing';
                    if (previndex > -1) {
                        $videos[previndex].className = '';
                    }
                    classsetted = true;
                }
            }

            function loadnext() {

                if (!aborted) {

                    if ($videos[nowindex].readyState) {
                        $videos[nowindex].play();
                    } else {
                        $videos[nowindex].load();
                    }

                    if (2 > max) {
                        $videos[nowindex].loop = 'loop';
                        $videos[nowindex].play();
                        aborted = true;
                        return;
                    }

                    //preload next video
                    nextindex = (nowindex == max - 1) ? 0 : nowindex + 1;
                    $videos[nextindex].className = 'ready';
                    if (!$videos[nowindex].readyState) {
                        $videos[nextindex].load();
                    }

                }

            }

            function play() {
                if (!aborted) {
                    $videos[nowindex].className = 'playing';
                    loadnext();
                }
            }

            function onplayend() {
                classsetted = false;
                previndex = nowindex;
                nowindex = nextindex;
                loadnext();
            }

            function resize() {
                if (!aborted) {
                    D.fill($videobox, $target.offsetWidth, $target.offsetHeight, videowidth, videoheight);
                }
            }

            function scroll(v) {
                if (!aborted && istopvisual) {
                    if (v > areaheight) {
                        if (!$videos[nowindex].paused) {
                            $videos[nowindex].pause();
                        }
                    } else {
                        if ($videos[nowindex].paused) {
                            $videos[nowindex].play();
                        }
                    }
                }
            }

            functions.resize.push(resize);
            functions.scroll.push(scroll);

            play();

            return {
                empty: function() {
                    var i = 0;
                    for (; i < max; i++) {
                        $videos[i].pause();
                        // event.remove($videos[i], { canplay: oncanplay, play: onplay, timeupdate: ontimeupdate, ended: onplayend, error: onerror });
                        $videobox.removeChild($videos[i]);
                        $videos[i] = null;
                    }
                    $videobox.parentNode.removeChild($videobox);
                    $videos = $videobox = null;
                }
            }

        },


        setsnsicons: function($context) {

            var $icons = find('span.sssocial', $context),
                i = 0,
                max = $icons.length,
                anioption = {
                    time: 0.4,
                    easing: 'easeOutQuart',
                    rounding: true
                };

            for (; i < max; i++) {
                event.add($icons[i], {
                    'mouseover': snsiconhover,
                    'mouseout': snsiconhout
                });
            }

            function snsiconhover() {
                animate(this, {
                    translate3dY: this.offsetWidth - this.offsetHeight - 1
                }, anioption);
            }

            function snsiconhout() {
                animate(this, {
                    translate3dY: 0
                }, anioption);
            }

        },


        getdfysnsbox: function() {
            var $list = create('<ul class="snsicons" />'),
                key;
            for (key in dfysns) { //dfysns at d.base
                create([
                    '<li><a href="', dfysns[key], '" target="_blank">',
                    '<span class="txt">D.FY ', icons[key].name, '</span><span class="sssocial ', key, '"><span>', icons[key].icon, '</span><span>', icons[key].icon, '</span></span>',
                    '</a></li>'
                ].join(''), $list);
            }
            return $list;
        },


        playmovie: function($box, movieurl) {
            /*
var $iframe = find('iframe', $box)[0];
$iframe.src = movieurl;
event.add(find('.btn', $box)[0], 'click', function() {
this.style.display = 'none';
animate(find('.cover', $box)[0], { opacity: 0 }, { time: 0.15, onend: function() {
this.style.zIndex = 0;
} });
// try {
$iframe.contentWindow.postMessage('{"method":"play"}', $iframe.src.split('?')[0]);
// } catch(e) {}
});
return;
*/
            event.add(find('.btn', $box)[0], 'click', function() {
                find('iframe', $box)[0].src = movieurl + '&autoplay=1';
                animate(find('.cover', $box)[0], {
                    opacity: 0
                }, {
                    time: 0.2,
                    onend: function() {
                        this.style.zIndex = 0;
                    }
                });
                this.style.display = 'none';
            });
        },


        dframes: function($title, $box) {

            var $items = [],
                colsmap = {
                    mini: 3,
                    mobile: 4,
                    tablet: 6
                },
                setted = false;

            if (!datacaches.dframes) {
                if (!islocal) {
                    D.ajax({
                        url: 'https://api.instagram.com/v1/users/1441409062/media/recent?count=12&client_id=ae3459875450462691ef42d404905883',
                        datatype: 'jsonp',
                        callback: function(_data) {
                            datacaches.dframes = _data;
                            setting(_data);
                        }
                    });
                }
            } else {
                setting(datacaches.dframes);
            }

            function setting(data) {
                var i = 0,
                    max = data.data.length;
                for (; i < max; i++) {
                    $items[i] = create('<li><img src="' + data.data[i].images.low_resolution.url + '" alt=""><a href="' + data.data[i].link + '" target="_blank"></a></li>', $box);
                    style.set($items[i].children[0], 'scale3d', 1.2);
                    if (!ismobile) {
                        event.add($items[i], {
                            mouseenter: hover,
                            mouseleave: leave
                        });
                    }
                }
                if (!ismobile) {
                    event.add($title, {
                        mouseenter: hover,
                        mouseleave: leave
                    });
                }
                event.add($title, {
                    click: function() {
                        window.open($items[0].children[1].href);
                    }
                });
                setted = true;
                resize();
            }

            function hover() {
                var istitle = this == $title,
                    $tg = (this == $title) ? $items[0] : this;
                if (istitle) {
                    animate(this, {
                        opacity: 0
                    }, {
                        time: 0.3,
                        easing: 'easeOutCubic'
                    });
                }
                animate($tg.children[0], {
                    scale3d: 1
                }, {
                    time: 0.75,
                    easing: 'easeOutCubic'
                });
                animate($tg.children[1], {
                    borderWidth: 6
                }, {
                    time: 0.3,
                    easing: 'easeOutCubic'
                });
            }

            function leave() {
                var istitle = this == $title,
                    $tg = (this == $title) ? $items[0] : this;
                if (istitle) {
                    animate(this, {
                        opacity: 1
                    }, {
                        time: 0.3,
                        easing: 'easeOutCubic'
                    });
                }
                animate($tg.children[0], {
                    scale3d: 1.2
                }, {
                    time: 0.5,
                    easing: 'easeOutCubic'
                });
                animate($tg.children[1], {
                    borderWidth: 0
                }, {
                    time: 0.3,
                    easing: 'easeOutCubic'
                });
            }

            function onborder() {
                this.children[0].style.margin = '-' + this.style.border;
            }

            function resize() {
                var basewidth, cols, size, i, max;
                if (setted) {
                    basewidth = Math.min(areawidth, 1920);
                    cols = colsmap[sizemode] || Math.floor(basewidth / 160);
                    size = Math.ceil(basewidth / cols);
                    style.set($title, 'width', size);
                    style.set($box, 'height', size);
                    for (i = 0, max = $items.length; i < max; i++) {
                        style.set($items[i], {
                            width: size,
                            height: size,
                            display: (i >= cols) ? 'none' : ''
                        });
                    }
                }
            }

            return {
                resize: resize
            }
        },


        scroll: (function() {

            var callback,
                disabled = false;

            function disable() {
                if (!disabled) {
                    if (ismobile) {
                        event.add($docel, 'touchmove', event.cancel);
                    } else {
                        event.add($docel, 'mousewheel', event.cancel);
                        event.add($docel, 'keydown', event.cancel);
                    }
                    disabled = true;
                }
            }

            function enable() {
                if (disabled) {
                    if (ismobile) {
                        event.remove($docel, 'touchmove', event.cancel);
                    } else {
                        event.remove($docel, 'mousewheel', event.cancel);
                        event.remove($docel, 'keydown', event.cancel);
                    }
                    disabled = false;
                }
                callback && callback();
                callback = null;
            }

            return {
                to: function(value, time, delay, $target) {
                    disable();
                    if (typeof(delay) == 'function') {
                        callback = delay;
                        delay = 0;
                    }
                    animate($target || $scrolltarget, {
                        scrollTop: value
                    }, {
                        time: time || 1,
                        delay: delay,
                        easing: 'easeInOutQuart',
                        onend: enable
                    });
                }
            }

        })(),


        dateformat: (function() {
            var enmonthmap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return function(time, withdate) {
                var text;
                //time = new Date( parseInt(time)*1000 );
                time = new Date(parseInt(time, 10));
                if (lang == 'kr') {
                    text = time.getFullYear() + '년 ' + (time.getMonth() + 1) + '월';
                    if (withdate) {
                        text += ' ' + time.getDate() + '일';
                    }
                } else if (lang == 'jp') {
                    text = time.getFullYear() + '年 ' + (time.getMonth() + 1) + '月';
                    if (withdate) {
                        text += ' ' + time.getDate() + '日';
                    }
                } else {
                    if (withdate) {
                        text = enmonthmap[time.getMonth()] + ' ' + time.getDate() + ', ' + time.getFullYear();
                    } else {
                        text = enmonthmap[time.getMonth()] + ', ' + time.getFullYear();
                    }
                }
                return text;
            }
        })(),


        isfilledarray: function(array) {
            var i = 0,
                max = array.length;
            for (; i < max; i++) {
                if (!array[i]) {
                    return false;
                }
            }
            return true;
        },


        removeme: function() {
            (this.parentNode) && this.parentNode.removeChild(this);
        },


        hidefocus: function($target) {
            if (browser.ie) {
                $target.hideFocus = true;
            }
            return $target;
        },

        getimagesrc: function(src) {
            if (src) {
                if (!(/\//).test(src)) {
                    src = uploadroot + src;
                }
                if (!islocal) {
                    src = src.replace(/^\.+/, '');
                }
            }
            return src || '';
        },

        getuploadedsrc: function(src) {
            if (!src) {
                src = "";
            } else if (src != "" && src.indexOf("/") < 0) {
                src = uploadroot + src;
            }
            return src;
        },

        randomsort: function() {
            return Math.random() - Math.random();
        }

    }


})(window, document, document.documentElement, document.body);
