//d.fy
D.FY = (function($win, $doc, $docel, $body) {

    'use strict';

    var

    //get utilities from D
    browser = D.browser,
        ismobile = browser.mobile,
        isoldie = browser.ie && 9 > browser.ie,
        isios = browser.ios,
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

        removeme = F.removeme,

        path,
        sethead,

        //page objects
        fulllayout, header, aside, sidecontent, content, footer, fulllayer,
        pagecontrols = {},

        //form
        form,

        //link controls
        bottomlinks, setlinks,

        //body cover
        coverblock,

        //prev next button control
        prevnext,

        updown,

        //mobile | mini
        issmallsize = false,

        //elements
        $wrap = find('#wrap')[0],
        $header = find('#header')[0],
        $utilbar = find('#utilbar')[0],
        $logo = find('h1')[0],
        $logoimg = $logo.children[0],
        $contentwrap = find('#contentwrap')[0],
        $content = find('#contentwrap > .contents')[0],
        $aside = find('#aside')[0],
        $sidecontent = find('#sidecontent')[0],
        $footer = find('footer')[0],
        $fy = find('#fy')[0],
        $backment = find('#backment')[0],

        $scrolltarget = (browser.webkit) ? $body : $docel,
        maxscrolltop = -1,

        supportmediaquery = browser.support.mediaquery,
        $csss, $cssskr = [],

        requiredhtml = '<em class="required" title="' + labels[lang].required + '">*</em>',

        regexp = {
            mode: /(index|about|news|people|office|project|contact|404)(\/[0-9]+)?\/?$/,
            sidemenu: /(career|request)(\/[0-9]+)?\/?$/,
            bgimgurl: /(url\("?'?|"?'?\))/g,
            email: /^[a-z0-9\._-]+@+[a-z0-9\._-]+\..+/i,
            number: /^[0-9]+$/,
            tel: /^[0-9\+-]+$/,
            url: /^[a-z0-9\:\/\.\?\=\&\%\@\~\_\|\!\,\+\#\;-]+$/i
        },

        useinput = ismobile || browser.firefox,
        scrollcanceled = false,

        fromviewtolist = false,

        i, max, temp,

        facebooklikes = -1,

        initialized = false;


    $csss = find('link[rel^="stylesheet"]');
    max = $csss.length;

    //css disabling for old browsers
    if (!supportmediaquery) {
        for (i = 1; i < max; i++) {
            $csss[i].media = 'all';
        }
        //modify mediaquery include scroll bar width
    } else {
        $scrolltarget.style.overflowY = 'scroll';
        temp = window.innerWidth - $body.offsetWidth;
        if (temp) {
            for (i = 1; i < max; i++) {
                if (i != 4) {
                    $csss[i].media = 'all and (max-width:' + (parseInt($csss[i].media.match(/([0-9]+)/)[1]) + temp) + 'px)';
                }
            }
        }
        $scrolltarget.style.overflowY = '';
    }

    $cssskr = $csss.splice(4, 4);

    function setcssskr() {
        if (supportmediaquery) {
            for (var i = 0, max = $cssskr.length; i < max; i++) {
                $cssskr[i].disabled = (lang == 'en') ? 'disabled' : '';
            }
        }
    }

    //css disabling by size for old browsers

    function setcssie() {
        var i, max, mediaqueryindex;
        if (!supportmediaquery) {
            mediaqueryindex = (sizemode == 'mini') ? 4 : (sizemode == 'mobile') ? 3 : (sizemode == 'tablet') ? 2 : 1;
            for (i = 1, max = $csss.length; i < max; i++) {
                $csss[i].disabled = (mediaqueryindex > i) ? '' : 'disabled';
            }
            for (i = 0, max = $cssskr.length; i < max; i++) {
                $cssskr[i].disabled = (lang != 'en' && mediaqueryindex > i) ? '' : 'disabled';
            }
        }
    }

    //svg to png
    if (!browser.support.svgimage) {
        $logoimg.src = $logoimg.src.replace('.svg', '.png');
        $fy.children[0].src = $fy.children[0].src.replace('.svg', '.png');
    }


    //fullsize layout. index & 404
    // #140915-1 not use.
    fulllayout = (function() {

        var
        itemdata = [],
            headercolor = 'white',

            $fullcontent = create('<div id="fullcontent" />'),
            $listbox, $paging,
            $items, $bgs, $visuals, $particleboxs, $particles,
            $titles, $texts,

            particledepths,
            parallax,
            control,
            nowpage = -1,
            prevpage = -1,
            nextpage = -1,
            ismoving = false,

            lastx = 0,

            //ëª¨ë°”ì¼ í™˜ê²½ì—ì„œ ë””ë°”ì´ìŠ¤ íšŒì „ ì‹œ í•´ë‹¹ ì‚¬ì´ì¦ˆì— ë§žëŠ” css ì ìš©ì´ ë”œë ˆì´ê°€ ìƒê¹€. ê°’ì„ ë¯¸ë¦¬ ì§€ì •.
            visualwidthmap = {
                'wide': 0.75,
                'desktop': 0.75,
                'notebook': 0.75,
                'tablet': 0.87,
                'mobile': 0.87,
                'mini': 1.25
            },

            anioption = {
                moving: {
                    time: 1,
                    easing: 'easeOutCubic'
                }
            },

            currentdata, i, max, j, jmax;


        parallax = (function() {

            function moveto($target, pageindex, x, depth, mindepth, depthgap) {
                var divvalue = (depthgap - (depth - mindepth) + 1) / 2;
                if (ismoving) {
                    if (typeof(x) == 'number') { // move event in ie
                        style.set($target.children[0], {
                            marginLeft: -(x - areawidth * pageindex) / (divvalue / 3)
                        });
                    }
                } else {
                    //style.set($target, { translate3dX: x/divvalue / divvalue });
                    animate($target, {
                        translate3dX: x / divvalue
                    }, anioption.moving);
                }
            }

            return {

                reset: function(index, noani) {
                    return; //ì›ìœ„ì¹˜ ì•ˆí•¨.
                    var i = (typeof(index) == 'number') ? index : nowpage;
                    if (i > -1 && $particles[i].length) {
                        for (j = 0, jmax = itemdata[i].particle.length; j < jmax; j++) {
                            itemdata[i].particle[j].x = null;
                            if (noani) {
                                style.set($particles[i][j], resetproperty);
                            } else {
                                animate($particles[i][j], resetproperty, {
                                    time: 0.75,
                                    easing: 'easeOutCubic'
                                });
                            }
                        }
                    }
                },

                move: function(e) {

                    var i = nowpage,
                        x = (!isNaN(e)) ? e : -(e.clientX - areawidth / 2),
                        mindepth, depthgap, divvalue;

                    if (x == lastx) {
                        return;
                    }
                    if (ismobile) {
                        x *= 2;
                    }
                    lastx = x;

                    for (i = 0, max = $items.length; i < max; i++) {
                        if ((ismoving || (!ismoving && i == nowpage)) && $particles[i].length) {
                            mindepth = particledepths[i].min;
                            depthgap = particledepths[i].max - mindepth;
                            for (j = 0, jmax = itemdata[i].visual.length; j < jmax; j++) {
                                moveto($visuals[i][j], i, x, itemdata[i].visual[j].depth, mindepth, depthgap);
                            }
                            for (j = 0, jmax = itemdata[i].particle.length; j < jmax; j++) {
                                moveto($particles[i][j], i, x, itemdata[i].particle[j].depth, mindepth, depthgap);
                            }
                        }
                    }

                }

            }

        })();

        function onmove(value) {
            ismoving = true;
            parallax.move(-value);
        }

        function toprevpage() {
            control.prev();
            return false;
        }

        function tonextpage() {
            control.next();
            return false;
        }

        function onchange(page) {
            header.setcolor(itemdata[page].theme);
            nextpage = page;
            if (nextpage > 0) {
                prevnext.add('prev', $fullcontent, {
                    id: nextpage,
                    name: itemdata[nextpage - 1].name
                }, toprevpage);
                prevnext.set('prev', true);
            } else {
                prevnext.remove('prev');
            }
            if (itemdata.length - 1 > nextpage) {
                prevnext.add('next', $fullcontent, {
                    id: nextpage + 2,
                    name: itemdata[nextpage + 1].name
                }, tonextpage);
                prevnext.set('next', true);
            } else {
                prevnext.remove('next');
            }
        }

        //change motion ended. reset

        function onchangeend(page) {
            if (page !== undefined && page != nowpage) {
                prevpage = nowpage;
                nowpage = page;
            }
            ismoving = false;
            parallax.reset(prevpage, true);
        }

        function devicemotion(e) {
            var orientation = this.orientation,
                x = (orientation == 0) ? e.gamma : (orientation == 180) ? -e.gamma : (orientation == 90) ? e.beta : (orientation == -90) ? -e.beta : null;
            if (!aside.isopened() && x != null && !ismoving) {
                parallax.move(Math.round(x * 2));
            }
        }

        function getparticletop(toppercent, height) {
            return height * areawidth / basewidth
            return areaheight * toppercent / 100;
        }

        event.add($fullcontent, {
            mouseleave: parallax.reset,
            mousemove: parallax.move
        });

        return {

            langset: function() {
                for (i = 0, max = itemdata.length; i < max; i++) {
                    $titles[i].innerHTML = F.getlanguagedata(itemdata[i].title);
                    find('span', $texts[i])[0].innerHTML = F.getlanguagedata(itemdata[i].description);
                    if (itemdata[i].linktext) {
                        find('a span.t', $texts[i])[0].innerHTML = itemdata[i].linktext[lang];
                    }
                }
                prevnext.set('prev', true);
                prevnext.set('next', true);
            },

            resize: function() {
                for (i = 0, max = itemdata.length; i < max; i++) {
                    if ($bgs[i]) {
                        fillimage($bgs[i], areawidth, areaheight, basewidth, baseheight);
                    }
                    if ($visuals[i].length) {
                        for (j = 0, jmax = itemdata[i].visual.length; j < jmax; j++) {
                            currentdata = itemdata[i].visual[j];
                            if (itemdata[i].visual[j].valign == 'middle') {
                                style.set($visuals[i][j], 'marginTop', -(currentdata.height * (areawidth * visualwidthmap[sizemode]) / currentdata.width) / 2);
                            }
                        }
                    }
                    if ($particles[i].length) {
                        for (j = 0, jmax = itemdata[i].particle.length; j < jmax; j++) {
                            currentdata = itemdata[i].particle[j];
                            style.set($particles[i][j], {
                                height: currentdata.height / 2 * areawidth / basewidth
                                //top: getparticletop(currentdata.top, currentdata.height)//,
                                //marginTop: currentdata.height
                            });
                            // animate($particles[i][j], { top: getparticletop(currentdata.top, currentdata.height) }, anioption.moving); 
                        }
                    }
                }
                style.set($contentwrap, 'height', areaheight);
                $scrolltarget.scrollTop = 0; //ios bug?
                control && control.resize();
            },

            restore: function() {
                if (!$content.parentNode || $content.parentNode != $contentwrap) {
                    classname.remove($wrap, 'full');
                    style.set($contentwrap, 'height', '100%');
                    $contentwrap.insertBefore($content, $footer);
                    $contentwrap.removeChild($fullcontent);
                    if (ismobile) {
                        event.remove($win, 'deviceorientation', devicemotion);
                    }
                }
            },

            initialize: function(_data) {

                var $textbox;

                if ($content.parentNode && $content.parentNode == $contentwrap) {
                    classname.add($wrap, 'full');
                    $contentwrap.removeChild($content);
                    $contentwrap.insertBefore($fullcontent, $footer);
                    //mobile sensor
                    if (ismobile) {
                        event.add($win, 'deviceorientation', devicemotion);
                    }
                }

                $fullcontent.innerHTML = '<div class="mask"><ul></ul></div>';
                $listbox = find('ul', $fullcontent)[0];

                itemdata = _data.articles;

                $items = [];
                $bgs = [];
                $visuals = [];
                $particles = [];
                $particleboxs = [];
                $titles = [];
                $texts = [];
                particledepths = [];

                for (i = 0, max = itemdata.length; i < max; i++) {

                    $items[i] = create('<li />', $listbox);
                    $bgs[i] = F.setvisualimage($items[i], itemdata[i].bg);
                    if (mode == 'index' && !i) {
                        classname.add($items[i], 'first');
                    }

                    $visuals[i] = [];
                    if (itemdata[i].visual) {
                        for (j = 0, jmax = itemdata[i].visual.length; j < jmax; j++) {
                            currentdata = itemdata[i].visual[j];
                            $visuals[i][j] = create([
                                '<p class="visual ', currentdata.valign, '">',
                                '<img src="' + F.getimagesrc(currentdata.image) + '" alt="">',
                                '</p>'
                            ].join(''), $items[i]);
                        }
                    }

                    $particles[i] = [];
                    if (itemdata[i].particle) {
                        $particleboxs[i] = {
                            back: create('<p class="particle back" />'),
                            front: create('<p class="particle front" />')
                        }
                        particledepths[i] = {
                            min: 0,
                            max: 0
                        };
                        for (j = 0, jmax = itemdata[i].particle.length; j < jmax; j++) {
                            currentdata = itemdata[i].particle[j];
                            $particles[i][j] = create([
                                //'<span><img src="'+ F.getimagesrc(currentdata.image) +'" alt=""><b style="color:#fff;position:relative;">'+ currentdata.depth +'</b></span>',
                                '<span><img src="' + F.getimagesrc(currentdata.image) + '" alt=""></span>'
                            ].join(''), (currentdata.depth > 0) ? $particleboxs[i].front : $particleboxs[i].back);
                            style.set($particles[i][j], {
                                top: currentdata.top / baseheight * 100 + '%',
                                width: (currentdata.width / basewidth * 100) / 2 + '%',
                                marginLeft: currentdata.left / basewidth * 100 + '%',
                                zIndex: currentdata.depth
                            });
                            particledepths[i].min = Math.min(currentdata.depth, particledepths[i].min);
                            particledepths[i].max = Math.max(currentdata.depth, particledepths[i].max);
                        }
                        if ($particleboxs[i].back.children.length) {
                            $items[i].appendChild($particleboxs[i].back);
                        } else {
                            $particleboxs[i].back = null;
                        }
                        if ($particleboxs[i].front.children.length) {
                            $items[i].appendChild($particleboxs[i].front);
                        } else {
                            $particleboxs[i].front = null;
                        }
                    }

                    $textbox = create('<div class="texts" />', $items[i]);
                    $titles[i] = create('<h2 />', $textbox);
                    $texts[i] = create('<p />', $textbox);
                    $texts[i].innerHTML = '<span></span>' + ((itemdata[i].link) ? '<br><a href="' + itemdata[i].link + '"  class="wi right"><span class="t">&nbsp;</span></a>' : '');

                }

                if (max > 1) {
                    $paging = create('<p class="dotpage" />', $fullcontent);
                    control = F.xlider($listbox.parentNode, $listbox, $items, $paging, {
                        'default': 1
                    }, {
                        arrows: false,
                        onmove: onmove,
                        onchange: onchange,
                        onchangeend: onchangeend
                    });
                } else {
                    control = null;
                    onchange(0);
                }

                setlinks($fullcontent);

                this.resize();

                onchange(0);
                onchangeend(0);

            }

        }

    })();


    fulllayer = (function() {
        var
        startY = 0,
            $layer, $layercover, $layerbg, $layerbody, $btnclose,
            contentstype;

        function touchstart(e) {
            var touch = e.touches[0] || e.changedTouches[0];
            startY = touch.pageY + $layer.scrollTop;
            if (classname.has(e.srcElement, "close-full-layer")) {
                closeFullLayer(e);
            }
            return event.cancel(e);
        }

        function touchmove(e) {
            var touch = e.touches[0] || e.changedTouches[0];
            $layer.scrollTop = startY - touch.pageY;
        }

        function touchend(e) {
            removeevents();
        }

        function removeevents() {
            event.remove($layer, {
                touchstart: touchstart,
                touchmove: touchmove,
                touchend: touchend
            });
        }

        function open(e) {
            $layercover.style.display = "block";
            $layerbg.style.display = "block";
            $layer.style.display = "block";
            classname.add(document.documentElement, "no-scroll");
            if (browser.mobile) {
                removeevents();
                event.add($layer, {
                    touchstart: touchstart,
                    touchmove: touchmove,
                    touchend: touchend
                });
            }
            $layer.scrollTop = 0;
            $btnclose.focus();
            return event.cancel(e);
        }

        function close(e) {
            $layercover.style.display = "none";
            $layerbg.style.display = "none";
            $layer.style.display = "none";
            classname.remove(document.documentElement, "no-scroll");
            if (browser.mobile) {
                removeevents();
            }
            return event.cancel(e);
        }

        function langset() {
            $layerbody.innerHTML = labels[lang][contentstype + "contents"];
        }

        function contents(e, type) {
            contentstype = type;
            langset();
            return fulllayer.open(e);
        }

        function privacypolicy() {
            active("privacypolicy");
        }

        function openprivacypolicy(e) {
            return contents(e, "privacypolicy");
        }

        function active(type) {
            var $buttons = find(".btn-full-layer-" + type),
                $button;
            for (var i = 0; i < $buttons.length; i++) {
                $button = $buttons[i];
                // if (!event.has($button, "click", eval("open"+type))) {
                if (!data.get($button, 'eventadded')) {
                    event.add($button, {
                        click: eval("open" + type)
                    });
                    data.set($button, 'eventadded', true);
                }
                $button = null;
            }
        }

        function initialize() {
            var s = '';
            s += '<div class="layer-html">\n';
            s += ' <a href="#" class="btn-close close-full-layer"><img class="close-full-layer" src="' + imgroot + 'btn_close_layer.png" alt="Close" /></a>\n';
            // s += ' <div class="logo-d-yellow"><img src="'+imgroot+'d.fy.yellow.png" alt="D.FY" /></div>\n';
            s += ' <div class="layer-body"></div>\n';
            s += '</div>\n';

            $layercover = find("#full-layer-cover")[0];
            $layerbg = find("#full-layer-bg")[0];
            $layer = find("#full-layer")[0];
            $layer.innerHTML = s;

            $layerbody = find(".layer-body", $layer)[0];
            $btnclose = find(".btn-close", $layer)[0];
            event.add($btnclose, {
                click: close
            });

            privacypolicy();

            return fulllayer;
        }

        return {
            open: open,
            close: close,
            langset: langset,
            contents: contents,
            privacypolicy: privacypolicy,
            initialize: initialize
        };
    })();


    header = function() {

        var
        $topbox = find('div.box.topbox', $contentwrap)[0],

            headercolor = 'white',
            headercolorexp = /hc\-(white|colored)/,

            $logoimgy = create('img', {
                src: $logoimg.src.replace('d.fy.', 'd.fy.c.'),
                'class': 'colored'
            }, $logo),

            $navidc = find('#navindicator')[0],
            $navidcin = $navidc.children[0],
            $navidciny,
            $navidcs,

            nav,
            bar,

            i, max = 3,
            src;


        //set nav indicators.
        $navidciny = $navidcin.cloneNode(true);
        $navidciny.className = 'colored';
        $navidcin.innerHTML = $navidciny.innerHTML = '<span></span><span></span><span></span>';

        $navidc.appendChild($navidciny);

        $navidcs = find('span span', $navidc);

        event.add($logo, 'click', function() {
            path.push('/');
        });

        function setcolor(theme) {

            classname.decide($header, 'bright', theme != 'dark');
            // #140915-1
            // if ( isfulllayout ) {
            //  classname.decide($contentwrap, 'bright', theme != 'dark' );
            // }

        }

        function setclip($target, x1, x2, y1, y2) {
            $target.style.clip = 'rect(' + x1 + 'px ' + x2 + 'px ' + y1 + 'px ' + y2 + 'px)';
        }

        nav = (function() {

            var
            fakeproperty = 'marginRight',
                nowindex = -1,
                anioption = {
                    idc: {
                        time: 0.3,
                        easing: 'easeOutCubic',
                        onupdate: onsetnavidc
                    },
                    hover: {
                        time: 0.3,
                        easing: 'easeOutSine'
                    }
                };

            function setindicator(index, ishover) {

                var property;

                if (index == undefined) {
                    index = nowindex;
                } else if (typeof(index) == 'string') {
                    index = (index == 'project') ? 0 : (index == 'about') ? 1 : (index == 'news') ? 2 : -1;
                }

                for (i = 0; i < 3; i++) {
                    property = {
                        marginRight: (i == index) ? 0 : 25
                    };
                    if (initialized) {
                        animate($navidcs[i], property, anioption.idc);
                        animate($navidcs[i + 3], property, anioption.idc);
                    } else {
                        onsetnavidc.call($navidcs[i], property);
                        onsetnavidc.call($navidcs[i + 3], property);
                    }
                }

                if (ishover !== true) {
                    nowindex = index;
                }

            }

            function onsetnavidc(v) {
                this.style.left = v[fakeproperty] + '%';
                this.style[fakeproperty] = v[fakeproperty] + 'px';
            }

            function resize() {
                var xpadding = style.get($navidc, 'paddingTop') * 2,
                    height = Math.round(($navidc.clientWidth - xpadding) * 0.125);
                for (i = 0; i < 6; i++) {
                    style.set($navidcs[i], {
                        height: height,
                        marginBottom: (i == 2 || i == 5) ? 0 : height
                    });
                }
            }

            event.add($navidc, {
                mousehover: function() {
                    //setindicator(-1, true);
                    animate(this, {
                        opacity: 0.5
                    }, anioption.hover);
                },
                mouseleave: function() {
                    //setindicator();
                    animate(this, {
                        opacity: 1
                    }, anioption.hover);
                },
                click: function(e) {
                    aside.open();
                    return event.cancel(e);
                }
            });

            return {
                resize: resize,
                setindicator: setindicator
            }

        })();

        bar = (function() {

            var
            $mask = find('div.mask', $utilbar)[0],
                $title = find('h2', $utilbar)[0],

                $navbox = create('<p class="group navidc"><a href="#gnb">Navigation</a></p>', $mask),
                $pnbox = create([
                    '<p class="group pn">',
                    '<a href="#" class="next ssgizmo"><span class="t">Next</span><span>&#x25C5;</span><span class="ci">&#x25C5;</span></a>',
                    '<a href="#" class="prev ssgizmo"><span class="t">Previous</span><span>&#x25BB;</span><span class="ci">&#x25BB;</span></a>',
                    '<a href="/project" class="list ssgizmo"><span class="t">List</span><span>&#x2421;</span><span class="ci">&#x2421;</span></a>',
                    '</p>'
                ].join(''), $mask),
                $sharebox = create([
                    '<p class="group share">',
                    '<strong><span class="t"></span><span class="i ssgizmo">&#xF601;</span></strong>',
                    '<a href="#" class="facebook sssocial"><span class="t">Facebook</span><span>&#xF610;</span><span class="ci">&#xF610;</span></a>',
                    '<a href="#" class="twitter sssocial"><span class="t">Twitter</span><span>&#xF611;</span><span class="ci">&#xF611;</span></a>',
                    '<a href="#" class="pinterest sssocial"><span class="t">Pinterest</span><span>&#xF650;</span><span class="ci">&#xF650;</span></a>',
                    '</p>'
                ].join(''), $mask),
                $buttons = find('p.pn a, p.share a', $mask),
                $pn = {
                    prev: find('a.prev', $pnbox)[0],
                    next: find('a.next', $pnbox)[0],
                    list: find('a.list', $pnbox)[0]
                },
                $sharebtnbox = find('strong', $sharebox)[0],
                $sharebtn = find('span.i', $sharebtnbox)[0],
                pndata = {},

                mouseentered = false,
                displayed = false,
                reduced = false,
                usereducing = false,
                minimized = false,
                pndisplayed = false,
                lastscrolltop = -1,

                values = {
                    show: {
                        translate3dY: 0
                    },
                    hide: {
                        translate3dY: -61
                    },
                    reduce: {
                        height: 51,
                        marginTop: -9
                    },
                    expand: {
                        height: 60,
                        marginTop: 0
                    },
                    smallsize: {
                        height: 50,
                        marginTop: 0
                    },
                    showshare: {
                        right: -121
                    },
                    hideshare: {
                        right: 0
                    }
                },
                anioption = {
                    show: {
                        time: 0.3,
                        easing: 'easeOutQuad'
                    },
                    hide: {
                        time: 0.3,
                        easing: 'easeOutQuad',
                        onend: displaypn
                    },
                    height: {
                        time: 0.3,
                        easing: 'easeOutQuad'
                    },
                    button: {
                        time: 0.35,
                        easing: 'easeOutQuart',
                        rounding: true
                    },
                    share: {
                        time: 0.5,
                        easing: 'easeInOutCubic',
                        onupdate: withtoggleshare
                    }
                },

                i = 0,
                max = $buttons.length;


            for (; i < max; i++) {
                event.add($buttons[i], {
                    mouseenter: buttonover,
                    mouseleave: buttonout,
                    click: (classname.has($buttons[i], 'sssocial')) ? buttonshare : buttonclick
                });
            }

            function isdisabled($target) {
                return classname.has($target, 'disabled');
            }

            function buttonover() {
                !ismobile && !isdisabled(this) && animate(this.children[1], {
                    marginTop: -this.offsetHeight
                }, anioption.button);
            }

            function buttonout() {
                !ismobile && !isdisabled(this) && animate(this.children[1], {
                    marginTop: 0
                }, anioption.button);
            }

            function buttonshare(e) {
                F.sharing.call(this, e);
                return event.cancel(e);
            }

            function buttonclick(e) {
                !isdisabled(this) && path.push.call(this);
                return event.cancel(e);
            }

            function reduce() {
                if (usereducing && !mouseentered && !reduced) {
                    animate($mask, values.reduce, anioption.height);
                    reduced = true;
                }
            }

            function expand() {
                if (usereducing && !mouseentered && reduced) {
                    animate($mask, values.expand, anioption.height);
                    reduced = false;
                }
            }

            function displaypn() {
                style.set($pnbox, 'display', (viewmode) ? '' : 'none');
                if (minimized) {
                    style.set($pnbox, values.hideshare);
                    withtoggleshare(0);
                    minimized = false;
                }
            }

            function toggleshare() {
                if (!minimized) {
                    animate($pnbox, values.showshare, anioption.share);
                    minimized = true;
                } else {
                    animate($pnbox, values.hideshare, anioption.share);
                    minimized = false;
                }
            }

            function withtoggleshare(v) {
                var value = (!isNaN(v)) ? v : v.right;
                style.set($sharebox, 'right', value);
                style.set($sharebtnbox, 'right', -value);
            }

            style.set($utilbar, values.hide);

            event.add($utilbar, {
                mouseenter: function() {
                    expand();
                    mouseentered = true;
                },
                mouseleave: function() {
                    mouseentered = false;
                }
            });

            event.add($title, 'click', function() {
                path.push('/');
            });

            event.add($pn.list, 'click', function() {
                fromviewtolist = true;
            });

            event.add(find('a', $navbox)[0], 'click', function(e) {
                aside.open();
                return event.cancel(e);
            });

            event.add($sharebtn, 'click', toggleshare);

            return {
                reduce: reduce,
                expand: expand,
                show: function() {
                    if (!displayed) {
                        classname.remove($utilbar, 'noani');
                        if (ismobile) { //use transition
                            style.set($utilbar, values.show);
                        } else {
                            animate($utilbar, values.show, anioption.show);
                        }
                        classname.add($body, 'barmode');
                        displayed = true;
                    }
                },
                hide: function(noani) {
                    if (displayed) {
                        classname.add($utilbar, 'noani');
                        if (noani === true) {
                            style.set($utilbar, values.hide);
                            stopanimate($utilbar);
                        } else {
                            animate($utilbar, values.hide, anioption.hide);
                        }
                        classname.remove($body, 'barmode');
                        displayed = false;
                    }
                },
                setpn: function(flag1, flag2, _pndata) {
                    if (flag1 == 'add') {
                        pndata[flag2] = _pndata;
                        $pn[flag2].href = '/' + mode + '/' + pndata[flag2].id;
                        classname.remove($pn[flag2], 'disabled');
                    } else {
                        classname.add($pn[flag2], 'disabled');
                    }
                },
                scroll: function(scrolltop, topboxheight) {
                    if (lastscrolltop != scrolltop) {
                        if (ismobile) {
                            this[(scrolltop && scrolltop >= maxscrolltop || (scrolltop >= areaheight && lastscrolltop > scrolltop)) ? 'show' : 'hide'](true);
                        } else {
                            this[(scrolltop >= maxscrolltop || 1 > scrolltop || lastscrolltop > scrolltop) ? 'expand' : 'reduce']();
                            this[(topboxheight && scrolltop >= topboxheight) ? 'show' : 'hide']();
                        }
                        // style.set($utilbar, 'top', Math.min(0, scrolltop-topboxheight-$mask.offsetHeight));
                        lastscrolltop = scrolltop;
                    }
                },
                resize: function() {
                    usereducing = sizemode != 'mobile' && sizemode != 'mini';
                    if (usereducing) {
                        style.set($mask, values[(reduced) ? 'reduce' : 'expand']);
                    } else {
                        style.set($mask, values['smallsize'])
                    }
                    classname[(sizemode == 'mini' && viewmode) ? 'add' : 'remove']($utilbar, 'minimized');
                },
                reset: function(title) {
                    $title.innerHTML = title.toLowerCase();
                    $pn.list.href = '/' + mode;
                    bar.hide(true);
                    displaypn();
                    resize();
                }
            }

        })();

        function langset() {}

        function resize() {
            nav.resize();
            bar.resize();
            scroll($scrolltarget.scrollTop);
        }

        function scroll(scrolltop) {
            var topboxheight = $topbox.offsetHeight,
                cutline = topboxheight - ($logoimg.offsetHeight + $logo.offsetTop * 2);
            if (!ismobile) {
                style.set($header, 'top', (topboxheight && !isindex && scrolltop > cutline) ? cutline - scrolltop : '');
            }
            if (isindex) {
                bar.hide();
            } else {
                bar.scroll(scrolltop, topboxheight);
            }
        }

        langset();

        return {
            setindicator: nav.setindicator,
            setcolor: setcolor,
            setpn: bar.setpn,
            langset: langset,
            resize: resize,
            scroll: scroll,
            reset: bar.reset
        }

    }


    aside = function() {

        var
        $blocker = create('<div class="blocker" />'),
            $closebtn = find('#closesidesbtn')[0],

            $asideinbox = $aside.children[0],

            nav,
            langbtn,
            loading,

            opened = false,
            expanded = false,

            navwidth = 0,
            expandwidth = 0,
            sidecontentwidth = 0,

            expandcontent = '',

            propertymovex = 'translate3dX',
            propertymovexalt = 'marginRight',

            callbackonclosed,

            anioption = {
                open: {
                    time: 0.4,
                    easing: 'easeInOutQuart',
                    onupdate: onmove
                },
                expand: {
                    time: 0.5,
                    easing: 'easeInOutQuart',
                    onupdate: onmove
                },
                expandall: {
                    time: 0.65,
                    easing: 'easeInOutQuart',
                    onupdate: onmove
                },
                close: {
                    time: 0.4,
                    easing: 'easeInOutQuart',
                    onupdate: onmove,
                    onend: onclosed
                },
                reduce: {
                    time: 0.5,
                    easing: 'easeInOutQuart',
                    onupdate: onmove,
                    onend: onreduced
                },
                reduceall: {
                    time: 0.55,
                    easing: 'easeInOutQuart',
                    onupdate: onmove,
                    onend: onclosed
                }
            };


        nav = (function() {

            var
            $navs = find('nav a', $aside),
                $hashnavs = {},
                expindicator = /(project|about|news)/,
                resettimer,
                anioption = {
                    onp: {
                        color: '#ffe000'
                    },
                    on: {
                        time: 0.25,
                        easing: 'linear'
                    },
                    offp: {
                        color: '#8d8d8d'
                    },
                    off: {
                        time: 0.15,
                        easing: 'linear'
                    }
                },
                i = 0,
                max = $navs.length;


            for (; i < max; i++) {
                if (regexp.sidemenu.test($navs[i].href)) {
                    $hashnavs[$navs[i].href.match(regexp.sidemenu)[1]] = $navs[i];
                    event.add($navs[i], 'click', expand);
                } else {
                    event.add($navs[i], 'click', click);
                }
                if (!ismobile) {
                    event.add($navs[i], {
                        mouseover: over,
                        mouseout: out
                    });
                }
                F.hidefocus($navs[i]);
            }

            function over(e) {
                clearTimeout(resettimer);
                var name = data.get(this, 'name');
                on(this);
                header.setindicator((expindicator.test(name)) ? name : -1, true);
            }

            function out() {
                resettimer = setTimeout(reset, 300);
            }

            function reset() {
                on(expandcontent);
                header.setindicator();
            }

            function on($target, clicked) {
                if (!$target) {
                    if (mode == 'index') {
                        $target = $navs[0];
                    } else if (mode == '404') {
                        $target = '';
                    } else {
                        for (i = 0; i < max; i++) {
                            if (data.get($navs[i], 'name') == mode) {
                                $target = $navs[i];
                                break;
                            }
                        }
                    }
                }
                for (i = 0; i < max; i++) {
                    if ($navs[i] == $target) {
                        animate($navs[i], anioption.onp, anioption.on);
                    } else {
                        animate($navs[i], anioption.offp, anioption.off);
                    }
                }
                if (typeof($target) == 'string') {
                    animate($hashnavs[$target], anioption.onp, anioption.on);
                }
            }

            function click(e) {

                on(this, true);
                path.push.call(this);

                return event.cancel(e);

            }

            function langset() {
                for (i = 0; i < max; i++) {
                    $navs[i].innerHTML = labels[lang].aside[data.get($navs[i], 'name')];
                }
            }

            on();

            return {
                on: on,
                click: click,
                langset: langset
            }

        })();

        function open(noani) {

            content.masking();

            $wrap.appendChild($blocker);

            readytomove();

            if (ismobile) {
                classname.add($utilbar, 'noani');
            }

            if (!opened) {
                $asideinbox.scrollTop = 0;
                if (isios) {
                    setTimeout(function() {
                        $scrolltarget.scrollTop = 0;
                    }, 0);
                    $aside.scrollTop = 0;
                    header.scroll(0);
                    updown.scroll(0);
                }
            }

            if (noani === true) {
                style.set($contentwrap, propertymovex, expandwidth);
                onmove({
                    translate3dX: expandwidth,
                    percent: 1
                });
            } else {
                animate($contentwrap, {
                    translate3dX: expandwidth
                }, anioption[(expanded) ? (opened) ? 'expand' : 'expandall' : 'open']);
            }

            if (!opened) {
                checkposition();
            }

            opened = true;

        }

        function onmove(e) {
            var v = e[propertymovex];
            follow(v);
            if (e.percent === 1) {
                style.set($aside, 'display', (style.get($asideinbox, 'right') !== 0) ? 'none' : '');
            }
        }

        function follow(value, withcontentwrap) {

            var percent;

            //move with content wrap
            if (withcontentwrap) {
                if (!value && csstransform) {
                    $contentwrap.style[csstransform] = '';
                } else {
                    style.set($contentwrap, propertymovex, value);
                }
            }

            //expanding
            if (expanded) {
                style.set($backment, 'marginRight', Math.max(0, Math.abs(value) - navwidth));
                if (issmallsize) {
                    percent = (-value - navwidth) / (-expandwidth - navwidth);
                    style.set($asideinbox, 'right', Math.min(0, -navwidth * percent));
                    style.set($sidecontent, 'marginLeft', -sidecontentwidth + sidecontentwidth * percent);
                } else {
                    style.set($asideinbox, 'right', 0);
                    style.set($sidecontent, 'marginLeft', 0);
                }
            }

            style.set($header, propertymovex, value);
            style.set($utilbar, propertymovex, value);
            style.set($blocker, propertymovex, value);

            updown && updown.movewith(value);

        }

        function close(e, isreduce) {

            var value;

            if (!isreduce && expanded && issmallsize) {
                isreduce = true;
            }

            readytomove();

            if (isreduce) {
                $asideinbox.scrollTop = 0;
                // $scrolltarget.scrollTop = 0;
                F.scroll.to(0, 0.35)
            }

            value = (isreduce) ? -navwidth : 0;

            if (e === true) { //no animation. from page data load
                follow(value, true);
                onclosed();
            } else {
                animate($contentwrap, {
                    translate3dX: value
                }, anioption[(expanded) ? (isreduce) ? 'reduce' : 'reduceall' : 'close']);
                //if ( e !== undefined ) {//e == undefined is call from path.change
                path.backtopage(isreduce);
                //}
            }
            callbackonclosed = (typeof(e) == 'function') ? e : null;

            if (e && e !== true) {
                return event.cancel(e);
            }

        }

        //on closed. restore contentbox.

        function onclosed() {

            content.unmasking();

            classname.remove($wrap, 'expand');
            opened = expanded = false;
            expandcontent = '';

            $sidecontent.style.display = 'none';

            removeme.call($blocker);

            callbackonclosed && callbackonclosed();

            nav.on();

        }

        function expand(e, noani) {

            var needsethead = false,
                contentid = (typeof(e) == 'string') ? e : this.href.match(regexp.sidemenu)[1];

            nav.on(contentid);

            if (expanded) {

                //reduce
                if (expandcontent == contentid) {
                    //clicked
                    if (this.nodeType) {
                        close(e, true);
                        return event.cancel(e);
                    }

                    //change content
                } else {
                    expandcontent = contentid;
                    sidecontent.swap(contentid);
                    needsethead = true;
                }

            } else {

                $sidecontent.style.display = 'block';

                sidecontent.setting(contentid);
                sidecontent.reset(contentid);

                if (issmallsize) {
                    style.set($sidecontent, 'marginLeft', -$sidecontent.offsetWidth);
                }

                expandcontent = contentid;
                classname.add($wrap, 'expand');
                expanded = true;
                open(noani);

                needsethead = true;

            }

            if (this.nodeType == 1) {
                path.push.call(this);
            }

            if ($aside.style.position == 'absolute') {
                F.scroll.to(0, 0.5);
            }

            (needsethead) && sidecontent.setheaddata(contentid);

            return event.cancel(e);

        }

        function reduce(e) {
            close(e, true);
        }

        function onreduced(e) {
            classname.remove($wrap, 'expand');
            expanded = false;
            expandcontent = '';
            $sidecontent.style.display = 'none';
            style.set($sidecontent, 'marginLeft', 0);
            nav.on();
        }

        function readytomove() {
            $aside.style.display = '';
            navwidth = $aside.offsetWidth;
            sidecontentwidth = $sidecontent.offsetWidth;
            expandwidth = (expanded) ? -(areawidth - $sidecontent.offsetLeft + style.get($sidecontent, 'marginLeft')) : -navwidth;
        }

        function resize() {
            if (opened) {
                readytomove();
                follow(expandwidth, true);
                checkposition();
            }
        }

        function checkposition() {
            if (!ismobile) {
                if (!expanded && $aside.offsetHeight > areaheight) {
                    $aside.style.position = 'absolute';
                } else {
                    $aside.style.position = '';
                }
            }
        }

        function setmobilebackmentheight() {
            if (ismobile) {
                style.set($backment, 'height', Math.min($scrolltarget.scrollHeight, $backment.children[0].offsetHeight));
            }
        }

        function langset() {
            nav.langset();
            langbtn.setbuttons();
            find('p.copy', $aside)[0].innerHTML = labels[lang].aside.copyright;
        }

        function scroll(v) {}

        event.add($closebtn, 'click', close);

        if (ismobile) {
            event.add($closebtn, 'touchstart', function() {});
        }

        //all contents language setting
        langbtn = (function() {

            var $langbtns = find('ul.lang a', $aside),
                i = 0,
                max = $langbtns.length;

            for (; i < max; i++) {
                event.add($langbtns[i], 'click', changelanguage);
            }

            setbuttons();

            function setbuttons() {
                for (i = 0; i < max; i++) {
                    $langbtns[i].parentNode.style.display = (data.get($langbtns[i], 'lang') == lang) ? 'none' : '';
                }
            }

            function changelanguage(e) {

                var _lang = data.get(this, 'lang') || F.getlangfromurl();

                if (_lang == lang) {
                    return;
                }
                lang = _lang;

                langCamel = lang.charAt(0).toUpperCase() + lang.charAt(1);

                classname.remove($docel, 'kr', 'en', 'jp');
                classname.add($docel, lang);

                setcssskr();
                setcssie();

                setbuttons();

                requiredhtml = '<em class="required" title="' + labels[lang].required + '">*</em>';

                coverblock.flash();
                header.langset();
                aside.langset();

                content.langset();
                footer.langset();

                if (expanded) {
                    sidecontent.langset();
                } else {
                    setTimeout(close, 200);
                }

                path.push(false); //location.href = location.href.replace(/#!\/[a-z]{0,2}\//, '#!/'+lang+'/');

                return event.cancel(e);

            }

            return {
                setbuttons: setbuttons,
                alllangset: changelanguage
            }

        })();

        //blocker drag
        (function() {

            var downx, boxx, basex, starttime, moved;

            function down(e) {
                boxx = style.get($blocker, propertymovex);
                downx = basex = event.getpoint(e)[0];
                starttime = D.time();
                classname.add($blocker, 'grab');
                event.add($docel, {
                    mousemove: move,
                    mouseup: up
                });
                moved = false;
                return event.cancel(e);
            }

            function move(e) {
                var x = event.getpoint(e)[0],
                    nowtime = D.time();
                style.set($contentwrap, propertymovex, Math.min(0, Math.max(expandwidth, boxx + (x - downx))));
                follow(Math.min(0, Math.max(expandwidth, boxx + (x - downx))));
                if (nowtime - 300 > starttime) {
                    starttime = nowtime;
                    basex = x;
                }
                moved = true;
                return event.cancel(e);
            }

            function up(e) {
                var movedvalue = event.getpoint(e)[0] - basex;
                if (!moved || movedvalue > 0) {
                    close(e);
                } else {
                    open();
                }
                classname.remove($blocker, 'grab');
                event.remove($docel, {
                    mousemove: move,
                    mouseup: up
                });
            }

            event.add($blocker, 'mousedown', down);

        })();

        if (!islocal) {
            find('div.fblike', $aside)[0].innerHTML = '<iframe src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com/thedfy&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=21&amp;appId=304491842995295" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:21px;" allowTransparency="true"></iframe>';
        }

        F.setsnsicons($aside);

        resize();

        return {
            open: open,
            close: close,
            expand: expand,
            reduce: reduce,
            navon: nav.on,
            langset: langset,
            alllangset: langbtn.alllangset,
            resize: resize,
            scroll: scroll,
            isopened: function() {
                return opened;
            },
            isexpanded: function() {
                return expanded;
            }
        };

    }


    sidecontent = function() {

        if (!$sidecontent) {
            return;
        }

        var
        wait = true,
            queue = '',

            nowtype = '',
            setted = false,

            $box = {
                career: find('#careers')[0],
                request: find('#requests')[0]
            },
            $careerbox = $box.career,
            $requestbox = $box.request,

            career,
            careerdata,
            request,
            requestdata,

            propertymovey = 'translate3dY',
            anioption = {
                swap: {
                    time: 0.75,
                    easing: 'easeInOutQuart',
                    onupdate: follow,
                    onend: onswap
                }
            },
            i, max;


        function swap(type) {

            var height, padding;

            if (type == 'career') {
                career.reset();
            }
            $careerbox.style.display = $requestbox.style.display = 'block';
            height = $careerbox.offsetHeight;
            if (areaheight > height) {
                style.set($careerbox, 'marginBottom', areaheight - height);
                height = areaheight;
            }

            if (type == 'career') {
                style.set($careerbox, propertymovey, -height);
                animate($careerbox, {
                    translate3dY: 0
                }, anioption.swap);
            } else {
                request.reset();
                style.set($requestbox, propertymovey, height + $scrolltarget.scrollTop);
                animate($careerbox, {
                    translate3dY: -height
                }, anioption.swap);
            }

            F.scroll.to(0, anioption.swap.time);
            nowtype = type;
            wait = true;

        }

        function follow(e) {
            var value = e[propertymovey];
            style.set($requestbox, propertymovey, value);
        }

        function onswap() {
            display();
            style.set($careerbox, 'marginBottom', '');
            if (csstransform) {
                $careerbox.style[csstransform] = $requestbox.style[csstransform] = '';
            } else {
                $careerbox.style.top = $requestbox.style.top = '';
            }
            wait = false;
        }

        function display() {
            for (i in $box) {
                $box[i].style.display = (i == nowtype) ? 'block' : 'none';
            }
        }

        career = (function() {

            var
            $h3, $h4, $ment,
                $fieldbox,
                $fields = [],
                $titles = [],
                $details = [],
                $submitbuttons = [],

                title,

                opened = [],
                fieldid = 'careerfield',
                clickable = true,
                openbytitle = false,

                $form = null,
                $inputs = [],
                $agreement,
                //formkeys = [ 'name', 'birth', 'email', 'phone', 'site', 'message', 'fallin', 'upload1', 'upload2' ],
                // formkeys = [ 'name', 'age', 'email', 'tel', 'url', 'message', 'question', 'file1Seq' ],
                // formclasses = [ 'l', 'r', 'l', 'r', '', '', '', '' ],
                // formicons = [ '&#xE407;', '&#x1F4BC;', '&#x2709;', '&#xEA02;', '&#x1F30E;', '&#x270E;', '&#x1F4A1;', '&#xEB40;' ],
                // formrequireds = [ 1, 1, 1, 1, 0, 1, 1, 0 ],
                // formtypes = [ '', 'number', 'email', 'tel', 'url', '', '', 'file' ],
                formkeys = ['name', 'age', 'email', 'tel', 'url', 'message', 'file1Seq'],
                formclasses = ['l', 'r', 'l', 'r', '', '', '', ''],
                formicons = ['&#xE407;', '&#x1F4BC;', '&#x2709;', '&#xEA02;', '&#x1F30E;', '&#x270E;', '&#xEB40;'],
                formrequireds = [1, 1, 1, 1, 0, 1, 0],
                formtypes = ['', 'number', 'email', 'tel', 'url', '', 'file'],

                supporttransition = browser.support.transition,

                anioption = {
                    open: {
                        time: 0.75,
                        easing: 'easeInOutQuart',
                        onend: onopen
                    },
                    close: {
                        time: 0.75,
                        easing: 'easeInOutQuart',
                        onend: onclose
                    }
                };


            function open(e, noani) {

                var index, html, j, jmax, openheight, scrollto;

                openbytitle = e && e.type == 'click';

                if (typeof(e) == 'number') {
                    for (i = 0; i < max; i++) {
                        if (careerdata[i].id === e) {
                            open.call($titles[i], '', noani);
                            return;
                        }
                    }
                    return;
                }

                if (!clickable) {
                    return event.cancel(e);
                }

                index = data.get(this, 'index');

                for (i = 0; i < max; i++) {
                    if (i == index) {

                        if (!$details[i]) {
                            createfield(i);
                            $fields[i].appendChild($details[i]);
                            F.addsharebuttons(find('span.shareicon', $details[index])[0]);
                        }

                        //open
                        if (!opened[i]) {

                            title.on.call($titles[i]);
                            $fields[i].appendChild($details[i]);

                            style.set($details[i], 'height', 'auto');
                            scrollto = $titles[0].offsetHeight * index + $fieldbox.offsetTop - $titles[0].offsetHeight / 2;

                            if (noani) {
                                F.scroll.to(scrollto, 0.1);
                            } else {
                                openheight = $details[i].offsetHeight;
                                style.set($details[i], 'height', 0);
                                animate($details[i], {
                                    height: openheight
                                }, anioption.open);
                                clickable = false;
                                F.scroll.to(scrollto, 0.75, (ismobile || 9 > browser.ie) ? anioption.open.time : 0);
                            }

                            opened[i] = true;

                            if (openbytitle) {
                                path.push('/career/' + careerdata[i].id, true);
                            }

                            //close
                        } else {
                            close(i);
                            if (openbytitle) {
                                path.push('/career', true);
                            }
                        }

                        //close others
                    } else if (opened[i]) {
                        close(i);
                    }
                }
                //for hash change event delay
                setTimeout(function() {
                    setheaddata();
                }, 0);

                return event.cancel(e);

            }

            function onopen() {
                this.style.height = '';
                clickable = true;
            }

            function closeall() {
                for (i = 0; i < max; i++) {
                    if (opened[i]) {
                        close(i, true);
                    }
                }
            }

            function close(index, noani) {
                title.off.call($titles[index]);
                if ($details[index]) {
                    if (noani) {
                        style.set($details[index], 'height', 0);
                        onclose.call($details[index]);
                    } else {
                        style.set($details[index], 'height', $details[index].offsetHeight);
                        animate($details[index], {
                            height: 0
                        }, anioption.close);
                    }
                }
                if ($submitbuttons[index]) {
                    event.remove($submitbuttons[index], 'click', sendform);
                    event.add($submitbuttons[index], 'click', addform);
                }
                opened[index] = false;
            }

            function onclose() {
                $form && $form.parentNode && $form.parentNode.removeChild($form);
                this.parentNode && this.parentNode.removeChild(this);
            }

            function createfield(index) {

                var
                currentdata = careerdata[index],
                    i, max, html;

                classname.add($titles[index], 'on');

                $details[index] = create('<div id="' + fieldid + currentdata.id + '" class="detail" />');
                html = ['<p class="type1 ment"></p>'];
                if (currentdata.roles) {
                    html.push('<h6 class="roles"></h6><ul class="roles"></ul>');
                }
                if (currentdata.requires) {
                    html.push('<h6 class="requires"></h6><ul class="requires"></ul>');
                }
                html.push('<p class="submit">');
                if (currentdata.wanted) {
                    html.push('<button type="button" class="button dark" data-icon="&#x2713;"></button>');
                } else {
                    html.push('<span class="button dark disabled"></span>');
                }
                html.push('</p>');
                html.push('<p class="share"><em></em><span class="shareicon"></span></p>');

                $details[index].innerHTML = html.join('');

                $submitbuttons[index] = find('p.submit button', $details[index]);
                if ($submitbuttons[index].length) {
                    $submitbuttons[index] = $submitbuttons[index][0];
                    data.set($submitbuttons[index], 'index', index);
                    event.add($submitbuttons[index], 'click', addform);
                } else {
                    $submitbuttons[index] = '';
                }

                filldetailtexts(index);

                form.set($details[index]);

            }

            function addform() {

                var index = data.get(this, 'index'),
                    i, max, openheight,
                    anioption = {
                        time: 0.75,
                        easing: 'easeInOutQuart',
                        onend: function() {
                            this.style.height = '';
                        }
                    };

                if (!$form) {

                    $form = create('<div class="forms" />');
                    create('<p class="required" />', $form);
                    for (i = 0, max = formkeys.length; i < max; i++) {
                        $inputs[i] = form.createitem($form, formtypes[i], formicons[i], formclasses[i], (formkeys[i] == 'message'));
                    }
                    form.createitem($form, 'agree', 'careerprivacypolicy');
                    $agreement = find('p.agree label', $form)[0];
                    create('<p class="lastment" />', $form);

                    form.set($form);

                    fillformtexts();

                }

                $details[index].insertBefore($form, find('p.submit', $details[index])[0]);

                form.reset($form);
                resetfileinputlabel();

                style.set($form, 'height', 'auto');
                openheight = $form.offsetHeight;
                style.set($form, 'height', 0);
                animate($form, {
                    height: openheight
                }, anioption);

                //find( ( useinput )? 'p.item input' : 'p.item span.edit', $form)[0].focus();

                event.remove($submitbuttons[index], 'click', addform);
                event.add($submitbuttons[index], 'click', sendform);
                fulllayer.privacypolicy();

                if (!ismobile) {
                    F.scroll.to(D.offset($form).top, 0.75);
                }

            }

            function sendform() {
                //var index = data.get(this, 'index'),
                var careerid = this.parentNode.parentNode.id.replace(fieldid, '');
                //form.send('career', $inputs, $agreement, formkeys, formrequireds, formtypes, { id: careerid }, sendformsuccess);
                form.send('career', $inputs, $agreement, formkeys, formrequireds, formtypes, {
                    code: careerid
                }, sendformsuccess);
            }

            function sendformsuccess() {
                form.reset($form);
                resetfileinputlabel();
                alert(labels[lang].career.form.success);
            }

            function reset() {
                for (i = 0, max = $fields.length; i < max; i++) {
                    close(i, true);
                    if (careerdata[i].wanted) {
                        title.show(i);
                    }
                }
                langset();
                $sidecontent.scrollTop = 0;
            }

            function langset() {

                var
                $detail,
                    splitedtitle;

                $h3.innerHTML = F.keepallwords(labels[lang].career.h3);
                $h4.innerHTML = F.keepallwords(labels[lang].career.h4);
                $ment.innerHTML = F.keepallwords(labels[lang].career.ment);

                for (i = 0, max = $fields.length; i < max; i++) {

                    splitedtitle = careerdata[i].title[lang].split(' ');
                    $titles[i].innerHTML = [
                        splitedtitle[0], (splitedtitle.length > 1) ? ' <span>' + splitedtitle[1] : '<span>',
                        '<span>+</span></span>'
                    ].join('');

                    title.addplus(i);

                    filldetailtexts(i);

                }
                title.resize();
                fillformtexts();

            }

            function filldetailtexts(index) {

                if (!$details[index]) {
                    return;
                }

                var
                $detail = $details[index],
                    currentdata = careerdata[index],
                    careerlabels = labels[lang].career,
                    i, max, html;

                find('> p.ment', $detail)[0].innerHTML = F.getlanguagedata(currentdata.description);
                if (currentdata.roles) {
                    find('> h6.roles', $detail)[0].innerHTML = careerlabels.role + ':';
                    html = [];
                    for (i = 0, max = currentdata.roles[lang].length; i < max; i++) {
                        html.push('<li>â€¢ ', F.keepallwords(currentdata.roles[lang][i]));
                    }
                    find('> ul.roles', $detail)[0].innerHTML = html.join('');
                }
                if (currentdata.requires) {
                    find('> h6.requires', $detail)[0].innerHTML = careerlabels.require + ':';
                    html = [];
                    for (i = 0, max = currentdata.requires[lang].length; i < max; i++) {
                        html.push('<li>â€¢ ', F.keepallwords(currentdata.requires[lang][i]));
                    }
                    find('> ul.requires', $detail)[0].innerHTML = html.join('');
                }
                if (currentdata.wanted) {
                    find('> p.submit button', $detail)[0].innerHTML = careerlabels.able;
                } else {
                    find('> p.submit span', $detail)[0].innerHTML = careerlabels.unable;
                }
                find('> p.share em', $detail)[0].innerHTML = labels[lang].button.share;

            }

            function fillformtexts() {

                var $formitems, $label,
                    careerlabels = labels[lang].career;

                if ($form) {
                    find('> p.required', $form)[0].innerHTML = requiredhtml + ' ' + labels[lang].required;
                    $formitems = find('> p.item', $form);
                    for (i = 0, max = formkeys.length; i < max; i++) {
                        $label = find('label', $formitems[i])[0];
                        if (formtypes[i] != 'file' || !data.get($label, 'uploaded')) {
                            $label.innerHTML = careerlabels[(formtypes[i] == 'file') ? ((ismobile) ? 'mobileupload' : 'upload') : formkeys[i]] + ' ' + ((formrequireds[i]) ? requiredhtml : '');
                        }
                    }
                    find('> p.agree label', $form)[0].innerHTML = labels[lang].privacypolicy + requiredhtml;
                    find('> p.lastment', $form)[0].innerHTML = careerlabels.lastment;
                }

            }

            function resetfileinputlabel() {
                var $label = find('#fileuploadlabel-career')[0];
                $label.innerHTML = labels[lang].career[(ismobile) ? 'mobileupload' : 'upload'];
                data.set($label, 'uploaded', '');
            }

            title = (function() {

                var
                $plusx = [],
                    $plusy = [],
                    anioption = {
                        color: {
                            time: 0.3,
                            easing: 'easeOutSine'
                        }
                    };

                function hover() {
                    var index;
                    if (setted && !supporttransition && !classname.has(this, 'on')) {
                        index = data.get(this, 'index');
                        animate(this, {
                            color: '#ffe000'
                        }, anioption.color);
                        animate($plusx[index], {
                            backgroundColor: '#ffe000'
                        }, anioption.color);
                        animate($plusy[index], {
                            backgroundColor: '#ffe000'
                        }, anioption.color);
                    }
                }

                function leave() {
                    var index;
                    if (setted && !supporttransition && !classname.has(this, 'on')) {
                        index = data.get(this, 'index');
                        animate(this, {
                            color: '#626262'
                        }, anioption.color);
                        if ($plusx[index]) {
                            animate($plusx[index], {
                                backgroundColor: '#626262'
                            }, anioption.color);
                            animate($plusy[index], {
                                backgroundColor: '#626262'
                            }, anioption.color);
                        }
                    }
                }

                function on() {
                    var index;
                    classname.add(this, 'on');
                    if (!supporttransition) {
                        index = data.get(this, 'index');
                        animate($plusy[index], {
                            opacity: 0
                        }, anioption.color);
                    }
                }

                function off() {
                    var index;
                    classname.remove(this, 'on');
                    leave.call(this);
                    if (!supporttransition) {
                        index = data.get(this, 'index');
                        (setted) && animate($plusy[index], {
                            opacity: 1
                        }, anioption.color);
                    }
                }

                function show(index) {
                    classname.add($titles[index], 'show');
                    if (!supporttransition) {}
                }

                function addplus(index) {
                    var $target;
                    if (!supporttransition) {
                        $target = find('span span', $titles[index])[0];
                        $plusx[index] = create('<span class="before" />', $target);
                        $plusy[index] = create('<span class="after" />', $target);
                    }
                }

                function resize() {
                    var size, i, max;
                    if ($plusx[0]) {
                        size = Math.max($plusx[0].offsetHeight, $plusy[0].offsetWidth);
                        if (size) {
                            for (i = 0, max = $plusx.length; i < max; i++) {
                                style.set($plusx[i], 'height', size);
                                style.set($plusy[i], 'width', size);
                            }
                        }
                    }
                }

                return {
                    hover: (!ismobile) ? hover : null,
                    leave: (!ismobile) ? leave : null,
                    on: on,
                    off: off,
                    show: show,
                    addplus: addplus,
                    resize: resize
                }

            })();

            function resize() {
                title.resize();
            }

            function setting() {

                $h3 = create('<h3 />');
                $h4 = create('<h4 />');
                $ment = create('<p class="firstment" />');
                $fieldbox = create('<ul class="fields">');

                $careerbox.appendChild($h3);
                $careerbox.appendChild($h4);
                $careerbox.appendChild($ment);
                $careerbox.appendChild($fieldbox);

                for (i = 0, max = careerdata.length; i < max; i++) {

                    $fields[i] = create(['<li><h5><a href="#', fieldid, careerdata[i].id, '"></a></h5></li>'].join(''));

                    $titles[i] = F.hidefocus(find('h5 a', $fields[i])[0]);
                    data.set($titles[i], 'index', i);
                    event.add($titles[i], {
                        mouseenter: title.hover,
                        mouseleave: title.leave,
                        click: open
                    });

                    $fieldbox.appendChild($fields[i]);

                }

                if (!supporttransition) {
                    classname.add($careerbox, 'old');
                }

                langset();
                reset();

            }

            return {
                open: open,
                closeall: closeall,
                langset: langset,
                resize: resize,
                reset: reset,
                setting: setting
            };

        })();

        request = (function() {

            var

            $h3, $h4, $ment, $required,
                $interested, $interestedlist,
                $budget, $period,
                $dontworry, $agreement, $lastment,
                $submitbutton,
                $sharetitle,

                $form, $inputs = [],

                //formkeys = [ 'name', 'organization', 'email', 'phone', 'site', 'checks', 'describe', 'budget', 'period' ],
                formkeys = ['name', 'companyName', 'email', 'tel', 'url', 'fieldCode', 'description', 'budget', 'period', 'file1Seq'],
                formclasses = ['l', 'r', 'l', 'r', '', '', '', 'l budget', 'r period', ''],
                formicons = ['&#xE407;', (isoldie) ? '&#xE400;' : '&#x1F4BC;', '&#x2709;', '&#xEA02;', (isoldie) ? '&#x2302;' : '&#x1F30E;', '', '&#x270E;', '', '', '&#xEB40;'],
                formrequireds = [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
                formtypes = ['', '', 'email', 'tel', 'url', 'checkbox', '', 'select', 'select', 'file'],

                i, max, j, jmax;

            function reset() {
                langset();
                form.reset($form);
                resetfileinputlabel();
                $sidecontent.scrollTop = 0;
            }

            function langset() {

                var requestlabels = labels[lang].request,
                    $formitems, $labels, $options;

                $h3.innerHTML = requestlabels.h3;
                $h4.innerHTML = F.keepallwords(requestlabels.h4);
                $ment.innerHTML = F.keepallwords(requestlabels.ment);
                $required.innerHTML = requiredhtml + ' ' + labels[lang].required;

                $formitems = find('> p.item', $form);
                for (i = 0, j = 0, max = formkeys.length; i < max; i++, j++) {
                    if (formkeys[i] == 'fieldCode') {
                        j++;
                        max--;
                    }
                    find((formtypes[j] == 'select') ? 'span.type1' : 'label', $formitems[i])[0].innerHTML = requestlabels[(formtypes[j] == 'file') ? ((ismobile) ? 'mobileupload' : 'upload') : formkeys[j]] + ((formrequireds[j]) ? ' ' + requiredhtml : '');
                }

                $labels = find('ul.checks label', $form);
                for (i = 0, max = $labels.length; i < max; i++) {
                    $labels[i].innerHTML = requestdata.field[i][lang];
                }

                $options = find('p.budget option', $form);
                for (i = 0, max = $options.length; i < max; i++) {
                    $options[i].text = requestdata.budget[lang][i];
                }
                $options = find('p.period option', $form);
                for (i = 0, max = $options.length; i < max; i++) {
                    $options[i].text = requestdata.period[lang][i];
                }

                $interested.innerHTML = requestlabels.interested + requiredhtml +
                    ' <span class="sub">' + requestlabels.interestedment + '</span>';
                $budget.innerHTML = requestlabels.budget + requiredhtml;
                $period.innerHTML = requestlabels.period + requiredhtml;
                $dontworry.innerHTML = requestlabels.dontworry;
                $agreement.innerHTML = labels[lang].privacypolicy + requiredhtml;

                $lastment.innerHTML = F.keepallwords(requestlabels.lastment);

                $submitbutton.innerHTML = requestlabels.submit;

                $sharetitle.innerHTML = labels[lang].button.share;

                form.refresh();
                form.button.set($form);

                fulllayer.privacypolicy();

            }

            function resetfileinputlabel() {
                var $label = find('#fileuploadlabel-request')[0];
                $label.innerHTML = F.keepallwords(labels[lang].request[(ismobile) ? 'mobileupload' : 'upload']);
                data.set($label, 'uploaded', '');
            }

            function setting() {

                var html = [];

                $h3 = create('<h3 />', $requestbox);
                $h4 = create('<h4 />', $requestbox);
                $ment = create('<p class="firstment" />', $requestbox);
                $required = create('<p class="required">', $requestbox);

                $form = create('<div class="forms" />', $requestbox);

                for (i = 0, max = formkeys.length; i < max; i++) {
                    if (formkeys[i] == 'fieldCode') {
                        $interested = create('<p class="type1 interested" />', $form);
                        $interestedlist = create('<ul class="checks" />', $form);
                        for (j = 0, jmax = requestdata.field.length; j < jmax; j++) {
                            html.push(
                                '<li>',
                                '<span class="ipcheck t2"><span class="before"><img src="', imgroot, 'img_checkt2.png" alt="" /></span>',
                                '<input type="checkbox" id="requestinterestedin', j + 1, '" value="', requestdata.field[j].id, '">',
                                '<label for="requestinterestedin', j + 1, '">Website Design</label></span>',
                                '</li>'
                            );
                        }
                        $interestedlist.innerHTML = html.join('');
                        $inputs[i] = $interestedlist;
                    } else if (formtypes[i] == 'select') {
                        $inputs[i] = form.createitem($form, 'select', requestdata[formkeys[i]][lang], formclasses[i]);
                        $budget = find('p.budget span.type1', $form)[0];
                        $period = find('p.period span.type1', $form)[0];
                    } else {
                        $inputs[i] = form.createitem($form, formtypes[i], formicons[i], formclasses[i], (formkeys[i] == 'description'));
                    }
                }
                $dontworry = create('<p class="dontworry" />', $form);
                form.createitem($form, 'agree', 'requestprivacypolicy');
                $agreement = find('p.agree label', $form)[0];
                $lastment = create('<p class="lastment" />', $form);

                create('<p class="submit"><button type="button" class="button dark" data-icon="&#x2713;">Submit request</button></p>', $form);
                $submitbutton = find('p.submit button', $form)[0];
                event.add($submitbutton, 'click', sendform);

                create('<p class="share"><em></em><span class="shareicon"></span></p>', $form);
                $sharetitle = find('p.share em', $form)[0];
                F.addsharebuttons(find('span.shareicon', $form)[0]);

                form.set($form);

                langset();

            }

            function sendform() {
                form.send('requestproject', $inputs, $agreement, formkeys, formrequireds, formtypes, sendformsuccess);
            }

            function sendformsuccess() {
                form.reset($form);
                resetfileinputlabel();
                alert(labels[lang].request.form.success);
            }

            return {
                reset: reset,
                langset: langset,
                setting: setting
            }

        })();

        function langset() {
            career.langset();
            request.langset();
            setheaddata();
        }

        function setting(type) {

            if (!setted) {
                career.setting();
                request.setting();
            }

            nowtype = type;
            display();

            setted = true;

        }

        function setheaddata(contentid) {

            var currentdata = labels[lang][contentid || sidemode],
                title = currentdata.h3,
                ment = D.striptags(currentdata.h4 + ' ' + currentdata.ment),
                i, max;

            if (sidemode == 'career' && sidemodeid) {
                for (i = 0, max = careerdata.length; i < max; i++) {
                    if (careerdata[i].id == sidemodeid) {
                        title = title + ' - ' + F.getlanguagedata(careerdata[i].title, true, true);
                        ment = F.getlanguagedata(careerdata[i].description, true, true);
                        break;
                    }
                }
            }

            sethead(title, ment);

        }

        function resize() {
            career.resize();
        }

        return {

            swap: swap,
            langset: langset,
            setting: setting,
            setheaddata: setheaddata,

            setdata: function(data) {

                lang = F.getlangfromurl();

                if (!lang) {
                    lang = (data.locale && (/^(kr|en|jp)$/i).test(data.locale)) ? data.locale.toLowerCase() : 'kr';
                    path.push((isindex) ? '/' : false);
                }

                langCamel = lang.charAt(0).toUpperCase() + lang.charAt(1);

                classname.add($docel, lang);

                aside.langset();
                footer.langset();

                careerdata = data.career;
                requestdata = data.request;

            },

            wait: function() {
                return wait;
            },

            reset: function(contentid) {
                var flag = sidemode || contentid;
                if (flag == 'career') {
                    career.reset();
                } else if (flag == 'request') {
                    request.reset();
                }
            },

            careeropen: career.open,
            careercloseall: career.closeall,
            resize: resize

        };

    };

    content = (function() {

        var
        $toplinkbox = find('> ul.toplinks', $content)[0],
            $topbox = find('> div.topbox', $content)[0],
            $topboxvisual = find('div.visual', $topbox)[0],
            $topboxvideo = null,

            $topvisualimage,
            topvisualvideocontrol,

            $topboxtxt = {
                h3: create('<h3 class="ment t2" />'),
                img: create('<div class="topvibox" />'),
                ment1: create('<p class="ment" />'),
                ment2: create('<p class="ment t2" />')
            },
            topboxtxttype,
            $topboxlink = create('<p class="link"></p>'),
            $topboxdimmed = create('<div class="dimmed" />'),

            $items,
            $articles,

            $bottombannerbox = create('<div class="banners" />'),

            $coverimgs,
            $filled,

            toplinkitems = {
                projectrequest: create('<li><a href="/request" class="wi right"><span>&nbsp;</span></a></li>'),
                careers: create('<li><a href="/career" class="wi right"><span>&nbsp;</span></a></li>')
            },

            videouseable = browser.support.video && !browser.mobile,

            contentdata,
            control,

            banners,

            modules = [],

            scrollidc,

            masked,

            columns,
            cssbackgroundsize = browser.support.backgroundsize,

            firstdataloaded = false;


        style.set($topboxdimmed, 'opacity', 0.7);

        if (videouseable) {
            $topboxvideo = create('<div class="visual video" />', $topbox);
        }

        // set visual image when video is error
        D.subscribe($topbox, 'videoaborted', setvisualimages);

        function setvisualimages(usevideo) {
            //top visual box
            $topvisualimage = F.setvisualimage($topboxvisual, contentdata.header.visual, usevideo, true);
            if (!usevideo) {
                topvisualvideocontrol = null;
                scroll();
                resize();
            }
        }

        function change(_data) {

            var
            $article,
                $inbox,
                loopdata, modulename, bgcolor, projectinfotheme,
                html,
                i, max;

            contentdata = _data;

            clearing();

            classname[(isfulllayout) ? 'add' : 'remove']($contentwrap, 'fulllayout');

            header.setindicator(mode);

            prevnext.setposition();

            // #140915-1
            // if ( isfulllayout ) {
            //  aside.navon();
            //  fulllayout.initialize(_data);
            //  langset();
            //  return;
            // } else {
            //  fulllayout.restore();
            // }

            //top box color
            if (contentdata.header.theme == 'bright') {
                classname.add($topbox, 'bright');
                classname.add($toplinkbox, 'bright');
                header.setcolor('bright');
            } else {
                classname.remove($topbox, 'bright');
                classname.remove($toplinkbox, 'bright');
                header.setcolor('dark');
            }

            $content.className = 'contents ' + contentdata.name + ((viewmode) ? 'detail' : '');

            //top links
            for (i in toplinkitems) {
                removeme.call(toplinkitems[i]);
            }
            loopdata = toplinkcases[mode];
            for (i = 0, max = loopdata.length; i < max; i++) {
                if (toplinkitems[loopdata[i]]) {
                    $toplinkbox.appendChild(toplinkitems[loopdata[i]]);
                }
            }

            //topbox background color
            bgcolor = '';
            projectinfotheme = '';
            if (mode == 'project' && contentdata.articles[0] && contentdata.articles[0].module == 'project-info') {
                bgcolor = contentdata.articles[0].bg;
                projectinfotheme = contentdata.articles[0].theme;
                updown.setcolor(bgcolor, projectinfotheme);
            } else {
                updown.setcolor();
            }
            $content.style.backgroundColor = $topbox.style.backgroundColor = bgcolor;

            //top visual videos
            if ($topboxvideo) {
                if (topvisualvideocontrol) {
                    topvisualvideocontrol.empty();
                }
                topvisualvideocontrol = null;
                $topboxvideo.innerHTML = '';
                $topboxvideo.style.display = 'none';
                if (videouseable && contentdata.header.videos) {
                    topvisualvideocontrol = F.setvisualvideo($topboxvideo, contentdata.header.videos, true);
                    $topboxvideo.style.display = 'block';
                }
            }

            setvisualimages((topvisualvideocontrol) ? true : false);

            if (isfulllayout) {
                if (contentdata.header.link.constructor != Array) {
                    contentdata.header.link = [contentdata.header.link];
                }
                html = [];
                for (i = 0, max = contentdata.header.link.length; i < max; i++) {
                    html.push(['<a href="', contentdata.header.link[i].url, '" class="wi right"><span>&nbsp;</span></a>'].join(''));
                }
                $topboxlink.innerHTML = html.join(' &nbsp ');
            }

            //articles
            loopdata = contentdata.articles;
            for (i = 0, max = loopdata.length; i < max; i++) {
                modulename = loopdata[i].module;
                if ((/comp-basic-/).test(modulename) && !loopdata[i].image) {
                    modulename = loopdata[i].module = 'comp-basic';
                }
                $article = create('article', $content);
                classname.add($article, 'box');
                $inbox = create('<div class="inbox" />', $article);
                if (loopdata[i].bg && (/^#/).test(loopdata[i].bg)) {
                    style.set($article, 'backgroundColor', loopdata[i].bg);
                }
                if (loopdata[i].bgimage && loopdata[i].bgimage !== "") {
                    classname.add($article, 'filled');
                    style.set($article, 'backgroundImage', 'url(\'' + F.getimagesrc(loopdata[i].bgimage) + '\')');
                }
                if (modulename) {
                    classname.add($article, modulename);
                }
                classname.add($article, loopdata[i].name);
                if (modulename == 'contactus') {
                    modules[i] = contactusset($inbox, $article);
                } else {
                    modules[i] = module[modulename || 'default']($inbox, $article, loopdata[i].name,
                        //default data
                        (modulename == 'listcates') ? contentdata.categories :
                        loopdata[i],
                        //sub data
                        (modulename == 'listbox') ? contentdata.categories : (modulename == 'listcates') ? loopdata[i + 1].list : (loopdata[i].name == 'peoplement') ? loopdata[i + 1].list.length : ((/^imgslide/).test(modulename)) ? [bgcolor, projectinfotheme] : ''
                    );
                }
            }

            //prev | next
            prevnext[(contentdata.prev) ? 'add' : 'remove']('prev', $topbox, contentdata.prev);
            prevnext[(contentdata.next) ? 'add' : 'remove']('next', $topbox, contentdata.next);

            //bottom banners
            banners.set();

            //full background for old browsers
            if (!cssbackgroundsize) {
                $filled = find('.filled', $content);
                $coverimgs = [];
                for (i = 0, max = $filled.length; i < max; i++) {
                    $coverimgs[i] = create('<p class="coverbg"><img src="' + style.get($filled[i], 'backgroundImage').replace(regexp.bgimgurl, '') + '" alt="" /></p>');
                    $filled[i].insertBefore($coverimgs[i], $filled[i].firstChild);
                    style.set($filled[i], 'backgroundImage', 'url()');
                    $coverimgs[i] = $coverimgs[i].children[0];
                    $coverimgs[i].onload = coverimgloaded;
                }
            }

            langset();

            setlinks($content);

            columns.reset();

            F.setsnsicons($content);

            scroll();
            resize();

        }

        function langset() {

            var text, temp, i, max;

            //browser title
            settitle();

            header.reset(contentdata.title[lang]);

            // #140915-1
            // if ( isfulllayout ) {
            //  fulllayout.langset();
            //  return;
            // }

            //top links
            for (i in toplinkitems) {
                find('span', toplinkitems[i])[0].innerHTML = labels[lang].button[i];
            }

            //top box
            if (contentdata) {

                text = F.getlanguagedata(contentdata.header.text);

                topboxtxttype = ((/^\<img/).test(text)) ? 'img' : (mode == 'people' && viewmode) ? 'h3' : (mode == 'contact' || (mode == 'project' && viewmode) || (mode == 'news' && viewmode)) ? 'ment2' : (!contentdata.header.text) ? '' : 'ment1';
                for (i in $topboxtxt) {
                    if (i == topboxtxttype) {
                        if (topboxtxttype == 'img') {
                            if (!islocal) {
                                text = text.replace(/\.+\//, '/');
                            }
                            $topbox.parentNode.insertBefore($topboxtxt[i], $topbox.nextSibling);
                        } else {
                            $topbox.appendChild($topboxtxt[i]);
                        }
                        if (viewmode) {
                            if (mode == 'people') {
                                text = '<em>' + F.getlanguagedata(contentdata.header.name) + '</em> <span>' + F.getlanguagedata(contentdata.header.position) + '</span>';
                                viewmodedata.name = contentdata.header.name;
                            } else if (mode == 'project') {
                                text = '<em>' + F.getlanguagedata(contentdata.header.title) + '</em> <span>' + F.getlanguagedata(contentdata.header.description) + '</span>';
                            } else if (mode == 'news') {
                                if (lang == 'kr' || lang == 'jp') {
                                    text = '<em>' + F.getlanguagedata(contentdata.header.title) + '</em> <span>' + F.dateformat(contentdata.header.date, true) + ' <span> <span>' + F.getlanguagedata(contentdata.header.category) + '</span> <em>' + contentdata.header.author[lang] + '</em></span></span>';
                                } else if (lang == 'en') {
                                    text = '<em>' + F.getlanguagedata(contentdata.header.title) + '</em> <span>' + F.dateformat(contentdata.header.date, true) + ' <span>by <em>' + contentdata.header.author[lang] + '</em> <span>' + F.getlanguagedata(contentdata.header.category) + '</span></span></span>';
                                }
                            }
                        }
                        $topboxtxt[i].innerHTML = text;
                    } else {
                        removeme.call($topboxtxt[i]);
                    }
                }
                if (isfulllayout) {
                    // $topboxtxt[topboxtxttype].innerHTML = F.getlanguagedata(contentdata.header.text);
                    for (i = 0, max = contentdata.header.link.length; i < max; i++) {
                        find('span', $topboxlink)[i].innerHTML = contentdata.header.link[i][lang];
                    }
                    $topbox.appendChild($topboxlink);
                    $topbox.insertBefore($topboxdimmed, $topboxtxt[topboxtxttype]);
                    resettopboxtextposition();
                } else {
                    removeme.call($topboxlink);
                }

            }

            //prev | next
            prevnext.set('prev', true);
            prevnext.set('next', true);

            //modules
            for (i = 0, max = modules.length; i < max; i++) {
                modules[i].langset();
            }

            //reset columns
            columns.resize();

            //banner
            banners.langset();

        }

        function resettopboxtextposition() {
            var mentheight;
            if (topboxtxttype) {
                if (isfulllayout) {
                    mentheight = $topboxtxt[topboxtxttype].offsetHeight;
                    style.set($topboxtxt[topboxtxttype], 'marginTop', -mentheight / 2);
                    style.set($topboxlink, 'marginTop', mentheight / 2);
                } else {
                    style.set($topboxtxt[topboxtxttype], 'marginTop', '');
                }
            }
        }

        function settitle() {

            var title, ment, thumb,
                looptarget, i, max;

            if (viewmode) {
                if (mode == 'people') {
                    title = contentdata.header.name[lang] + ', ' + contentdata.header.position[lang];
                    ment = '';
                    if (contentdata.articles.length && contentdata.articles[0].module == 'whoiam') {
                        ment += F.getlanguagedata(contentdata.articles[0].ment, true, true);
                    }
                } else if (mode == 'project') {
                    title = contentdata.header.title[lang];
                    ment = contentdata.header.description[lang];
                    if (contentdata.articles.length && contentdata.articles[0].module == 'project-info') {
                        ment += ' - ' + F.getlanguagedata(contentdata.articles[0].p, true, true);
                    }
                } else {
                    title = contentdata.header.title[lang];
                    looptarget = contentdata.articles[0].content;
                    for (i = 0, max = looptarget.length; i < max; i++) {
                        if (looptarget[i].type == 'text') {
                            F.getlanguagedata(looptarget[i], true, true);
                            break;
                        }
                    }
                }
                thumb = F.getimagesrc(contentdata.header.img);
            } else {
                title = contentdata.title[lang];
                if (mode == 'project' || mode == 'news' || mode == 'office' || mode == 'contact') {
                    ment = F.getlanguagedata(contentdata.header.text, true, true);
                } else if (mode == 'about') {
                    ment = F.getlanguagedata(contentdata.articles[0].h4, true, true) + ' ' + F.getlanguagedata(contentdata.articles[1].h4, true, true);
                } else if (mode == 'people') {
                    ment = F.getlanguagedata(contentdata.articles[0].h4, true, true) + '. ' + F.getlanguagedata(contentdata.articles[0].p, true, true);
                }
            }

            sethead(title, ment, thumb);

        }

        function clearing() {
            for (i = 0, max = modules.length; i < max; i++) {
                $content.removeChild(modules[i].outbox);
            }
            modules = [];
        }

        function back(e) {
            console.log('content back');
            return event.cancel(e);
        }

        function scroll(scrolltop) {

            var visualheight = $topboxvisual.offsetHeight,
                top, opacity, scale;

            // #140915-1
            // if ( isindex ) {
            //  //index.scroll(scrolltop);
            //  return;
            // }
            if (!scrolltop && scrolltop !== 0) {
                scrolltop = $scrolltarget.scrollTop;
            }

            if (firstdataloaded && !ismobile && $topboxvisual) {
                if (scrolltop >= 0) {
                    top = Math.max(0, scrolltop / 2);
                    opacity = 1 - 0.8 * scrolltop / visualheight;
                    scale = 1;
                } else {
                    top = 0;
                    opacity = 1;
                    scale = 1 + Math.abs(scrolltop) / 750;
                }
                if (topvisualvideocontrol && !classname.has($topboxvideo, 'error')) {
                    style.set($topboxvisual, {
                        opacity: 0
                    });
                    style.set($topboxvideo, {
                        top: top,
                        opacity: opacity,
                        scale: scale
                    });
                } else {
                    style.set($topboxvisual, {
                        top: top,
                        opacity: opacity,
                        scale: scale
                    });
                }
            }

            // scrollidc[( visualheight > scrolltop )? 'up' : 'down']();

            //modules
            for (i = 0, max = modules.length; i < max; i++) {
                modules[i].scroll(scrolltop);
            }

            functions.call('scroll', scrolltop);

        }

        function resize() {

            var $infobox, $imgtoshow, $imgtohide,
                height, key;

            checknarrowheight();

            style.set($topbox, 'height', areaheight);
            style.set($topboxvisual, 'height', areaheight);
            if ($topboxvideo) {
                style.set($topboxvideo, 'height', areaheight);
            }

            // #140915-1
            // if ( isfulllayout ) {
            //  fulllayout.resize();
            //  functions.call('resize');
            //  return;
            // }

            //project view topbox color set. get project-info box's color
            // if ( mode == 'project' && viewmode && contentdata ) {
            //  $infobox = find('article.project-info')[0];
            //  $topboxtxt.ment2.style.color = ( sizemode == 'mini' )? style.get( find('p.type1', $infobox)[0], 'color' ) : '';
            //  $topboxtxt.ment2.style.backgroundColor = ( sizemode == 'mini' )? style.get($infobox, 'backgroundColor' ) : '';
            // }

            //top visual
            //if ( !ismobile && $topboxvisual ) {
            // if ( $topboxvisual ) {
            //  if ( $topboxvisual.children.length > 1 ) {
            //  classname.add($topboxvisual, 'full');
            //  style.set($topbox, 'height', areaheight);
            //  style.set($topboxvisual, 'height', areaheight);
            //  $imgtoshow = $topboxvisual.children[( areawidth > areaheight )? 0 : 1];
            //  $imgtohide = $topboxvisual.children[( areawidth > areaheight )? 1 : 0];
            //  $imgtoshow.style.display = '';
            //  $imgtohide.style.display = 'none';
            //  fillimage($imgtoshow, areawidth, areaheight);
            //  } else {
            //  classname.remove($topboxvisual, 'full');
            //  height = $topboxvisual.children[0].offsetWidth * 0.6;
            //  style.set($topbox, 'height', ( sizemode != 'mini' )? height : 'auto');
            //  style.set($topboxvisual, 'height', height);
            //  }
            // }

            resettopboxtextposition();

            //prev | next
            prevnext.set('prev');
            prevnext.set('next');

            //modules
            for (i = 0, max = modules.length; i < max; i++) {
                modules[i].resize();
            }

            //column content
            columns.resize();

            control && control.resize();

            //background-size cover for old browsers
            if (!cssbackgroundsize && $coverimgs && $coverimgs.length) {
                for (i = 0, max = $coverimgs.length; i < max; i++) {
                    coverimgresize($coverimgs[i]);
                }
            }

            functions.call('resize');

            updown.resize();

        }

        function coverimgresize($img) {
            if (data.get($img, 'width')) {
                fillimage($img,
                    $img.parentNode.offsetWidth, $img.parentNode.offsetHeight,
                    data.get($img, 'width'), data.get($img, 'height')
                );
            }
        }

        function coverimgloaded() {
            var parent = this.parentNode;
            document.body.appendChild(this);
            this.style.display = 'block';
            data.set(this, 'width', this.width);
            data.set(this, 'height', this.height);
            parent.appendChild(this);
            coverimgresize(this);
        }

        //wheel indicator control
        scrollidc = (function() {

            return;

            var
            $idc = create('<p class="wheel"><img id="asdfasdf" src="' + imgroot + 'icn_wheels.png" alt=""></p>'),
                $idcimg = $idc.children[0],
                totalframes = 6,
                spriteanicontrol = F.spriteani($idcimg, totalframes, 'marginLeft', 0.75, true),
                added = false;

            event.add($idc, 'click', function() {
                F.scroll.to($topboxvisual.offsetHeight)
            });

            return {

                up: function() {},

                down: function() {},

                resize: function() {}

            }

        })();

        //set column content
        columns = (function() {

            var
            $columns,
                columners,
                i, max;

            return {
                resize: function() {
                    if ($columns) {
                        for (i = 0, max = $columns.length; i < max; i++) {
                            columners[i].resize();
                        }
                    }
                },
                reset: function() {
                    $columns = find('.column2', $content);
                    columners = [];
                    for (i = 0, max = $columns.length; i < max; i++) {
                        columners[i] = F.column($columns[i]);
                    }
                }
            }

        })();

        banners = (function() {

            var $items = {
                meettheteam: createitem('meettheteam', '/people'),
                contactus: createitem('contactus', '/contact'),
                theoffice: createitem('theoffice', '/office'),
                joinus: createitem('joinus', '/career'),
                request: createitem('request', '/request'),
                facebook: createitem('fblikes', dfysns.facebook)
            },
                i, max;

            find('p.type1', $items.facebook)[0].id = 'fblikescount';
            find('p.link a', $items.facebook)[0].target = '_blank';

            find('p.link', $items.request)[0].innerHTML = '<a href="/request" class="button" data-icon="&#x27A1;"><span></span></a>';
            F.button.set($items.request);

            function createitem(name, link) {
                return create([
                    '<div class="box filled ', name, '">',
                    '<div class="vabox">',
                    '<h4></h4>',
                    '<p class="type1"></p>',
                    '<p class="link"><a href="', link, '" class="wi big right"><span></span></a></p>',
                    '</div>',
                    '</div>'
                ].join(''));
            }

            return {

                set: function() {
                    var cases = bannercases[mode + ((viewmode) ? 'view' : '')];
                    for (i in $items) {
                        removeme.call($items[i]);
                    }
                    if (cases) {
                        for (i = 0, max = cases.length; i < max; i++) {
                            if ($items[cases[i]]) {
                                setlinks($items[cases[i]]);
                                $bottombannerbox.appendChild($items[cases[i]]);
                            }
                        }
                        this.langset();
                        $content.appendChild($bottombannerbox);
                        printFbLikesCount();
                    }

                },

                langset: function() {
                    for (var key in $items) {
                        if ($items[key].parentNode) {
                            find('h4', $items[key])[0].innerHTML = F.keepallwords(labels[lang].banner[key].title);
                            if (key != 'facebook') {
                                find('p.type1', $items[key])[0].innerHTML = F.keepallwords(labels[lang].banner[key].ment);
                            }
                            find('p.link span', $items[key])[0].innerHTML = F.keepallwords(labels[lang].banner[key].linktxt);
                        }
                    }
                }

            }

        })();

        function aftergetdata(data) {

            functions.empty();

            content.change(data);

            if (sidemode) {
                aside.expand(sidemode, true);
                if (sidemode == 'career' && sidemodeid != -1) {
                    sidecontent.careeropen(sidemodeid, true);
                }
            }

            if (!firstdataloaded) {
                // #140915-1
                // if ( isfulllayout || topvisualvideocontrol ) {
                //display page after load top visual image
                // if ( topvisualvideocontrol ) {
                topimageload(function() {
                    aftertopimageload();
                    coverblock.hide(function() {
                        classname.add($body, 'displayed');
                        scroll();
                    });
                });
                // }
                classname.add($body, 'loaded');
                firstdataloaded = true;
                updown.wait(false);
            } else {
                style.set($topboxvisual, 'opacity', 0);
                // #140915-1
                // if ( !isfulllayout && !topvisualvideocontrol ) {
                //display page after load top visual image
                // if ( !topvisualvideocontrol ) {
                topimageload(aftertopimageload);
                // }
                aside.close(true);
                coverblock.hide(true);
                content.restoring();
                if (fromviewtolist) {
                    $scrolltarget.scrollTop = areaheight;
                } else {
                    $scrolltarget.scrollTop = 0;
                }
                fromviewtolist = false;
                setTimeout(function() {
                    updown.wait(false);
                }, 0);
            }

        }

        function topimageload(callback) {
            if ($topvisualimage) {
                loadimage($topvisualimage.src, callback);
            } else {
                callback();
            }
        }

        function aftertopimageload() {
            if (!topvisualvideocontrol) {
                style.set($topboxvisual, 'opacity', 1);
            }
            if (!isfulllayout) {
                removeme.call($topboxdimmed);
            }
            // animate($topboxvisual, { opacity: 1 }, { time: 0.25, easing: 'easeInQuad' });
        }

        function checknarrowheight() {
            var isnarrow;
            classname.remove($wrap, 'narrow');
            isnarrow = $aside.offsetHeight > areaheight;
            classname.decide($wrap, 'narrow', isnarrow);
            if (ismobile) {
                event.remove($aside, 'touchmove', event.cancel);
                if (!isnarrow) {
                    event.add($aside, 'touchmove', event.cancel);
                }
            }
        }

        return {

            change: change,
            langset: langset,
            back: back,
            settitle: settitle,

            getdata: function() {

                var name = mode;

                if (mode == 'project') {
                    name = (viewmode) ? 'projectview.' + viewmodeid : 'projectlist';
                } else if (mode == 'news') {
                    name = (viewmode) ? 'newsview.' + viewmodeid : 'newslist';
                } else if (mode == 'people') {
                    name = (viewmode) ? 'peopleview.' + viewmodeid : 'peoplelist';
                }

                updown.wait(true);

                //use cached data
                if (datacaches[name]) {
                    aftergetdata(datacaches[name]);
                } else {
                    coverblock.show(function() {
                        D.load.script(getdataurl(name), function(data) {
                            data = window[mode + 'data'];
                            datacaches[name] = data;
                            aftergetdata(data);
                        });
                    });
                }

            },

            //set content top by scroll
            masking: function() {
                var scrolltop;
                if (!masked) {
                    masked = true;
                    if (!isios) {
                        scrolltop = style.get($scrolltarget, 'scrollTop');
                        style.set($content, 'top', -scrolltop);
                        style.set($footer, 'top', -scrolltop);
                        $scrolltarget.scrollTop = 0;
                    }
                    classname.add($wrap, 'split');
                    checknarrowheight();
                }
            },
            unmasking: function() {
                var scrolltop;
                if (masked) {
                    masked = false;
                    if (!isios) {
                        scrolltop = -style.get($content, 'top');
                        style.set($content, 'top', '');
                        style.set($footer, 'top', '');
                    }
                    classname.remove($wrap, 'split');
                    if (!isios) {
                        $scrolltarget.scrollTop = scrolltop;
                    }
                    if (csstransform) {
                        $contentwrap.style[csstransform] = '';
                    }
                }
            },
            restoring: function() {
                if (masked) {
                    if (!ismobile) {
                        style.set($content, 'top', '');
                        style.set($footer, 'top', '');
                    }
                    scroll(0);
                }
            },

            ismasked: function() {
                return masked;
            },

            scroll: scroll,
            resize: resize

        };

        //D.publish(element, D.FY.EVENTS.SHOW);
        //D.publish(element, D.FY.EVENTS.HIDE);
        //D.publish(element, D.FY.EVENTS.SCROLL, { scrollTop:120 });

    })();


    //prev next button control
    prevnext = (function() {

        var $linkbox = {
            prev: create('<p class="beside pnn c2"><a href="#" class="r1">&nbsp;</a><span><span><img src="" alt=""></span></span></p>'),
            next: create('<p class="beside pnn c1"><a href="#" class="r3">&nbsp;</a><span><span><img src="" alt=""></span></span></p>')
        },
            $link = {
                prev: F.hidefocus(find('a', $linkbox.prev)[0]),
                next: F.hidefocus(find('a', $linkbox.next)[0])
            },
            $thumbbox = {
                prev: find('span', $linkbox.prev)[0],
                next: find('span', $linkbox.next)[0]
            },
            $thumb = {
                prev: find('img', $linkbox.prev)[0],
                next: find('img', $linkbox.next)[0]
            },
            added = {},
            btndata = {},
            offproperty = {
                prev: {
                    marginRight: -30,
                    opacity: 0
                },
                next: {
                    marginLeft: -30,
                    opacity: 0
                }
            },
            onproperty = {
                marginLeft: 0,
                marginRight: 0,
                opacity: 1
            },
            anioption = {
                hover: {
                    time: 0.5,
                    easing: 'easeOutCubic'
                },
                leave: {
                    time: 0.5,
                    easing: 'easeOutCubic',
                    onend: function() {
                        this.style.display = 'none';
                    }
                }
            };

        function hover() {
            var flag = data.get(this, 'flag');
            if (btndata[flag].image) {
                style.set($thumbbox[flag], 'display', 'block');
                animate($thumbbox[flag], onproperty, anioption.hover);
            }
        }

        function leave() {
            var flag = data.get(this, 'flag');
            if (btndata[flag].image) {
                animate($thumbbox[flag], offproperty[flag], anioption.leave);
            }
        }

        style.set($thumbbox.prev, offproperty.prev);
        style.set($thumbbox.next, offproperty.next);
        data.set($linkbox.prev, 'flag', 'prev');
        data.set($linkbox.next, 'flag', 'next');
        event.add($linkbox.prev, {
            mouseenter: hover,
            mouseleave: leave
        });
        event.add($linkbox.next, {
            mouseenter: hover,
            mouseleave: leave
        });

        return {

            add: function(flag, $target, _btndata, onclick) {
                btndata[flag] = _btndata;
                $link[flag].href = '/' + ((mode == 'index') ? 'page' : mode) + '/' + btndata[flag].id;
                $thumb[flag].src = (btndata[flag].image) ? btndata[flag].image : '';
                $target.appendChild($linkbox[flag]);
                added[flag] = true;
                $link[flag].onclick = (onclick) ? onclick : null;
                if (mode !== 'index') {
                    header.setpn('add', flag, _btndata);
                }
            },

            remove: function(flag) {
                F.removeme.call($linkbox[flag]);
                added[flag] = false;
                header.setpn('remove', flag);
            },

            set: function(flag, withtext) {
                var size;
                if (added[flag]) {
                    if (withtext) {
                        if (mode == 'project' || mode == 'news') {
                            $link[flag].innerHTML = labels[lang].button[flag + mode];
                        } else {
                            $link[flag].innerHTML = btndata[flag].name[lang];
                        }
                    }
                    size = (9 > browser.ie) ? $link[flag].offsetHeight : $link[flag].offsetWidth;
                    style.set($linkbox[flag], {
                        height: size,
                        marginTop: -size / 2
                    });
                }
            },

            setposition: function() {
                // #140915-1
                // if ( isfulllayout ) {
                //  $linkbox.prev.className = 'beside pnn c1';
                //  $linkbox.next.className = 'beside pnn c2';
                //  $link.prev.className = 'r3';
                //  $link.next.className = 'r1';
                // } else {
                $linkbox.prev.className = 'beside pnn c2';
                $linkbox.next.className = 'beside pnn c1';
                $link.prev.className = 'r1';
                $link.next.className = 'r3';
                // }
            }

        }

    })();


    //contacus module

    function contactusset($box, $outbox) {

        var
        $infobox = create([
            '<div class="info" />',
            '<h3></h3>',
            '<p class="address"></p>',
            '<ul class="touch">',
            '<li><span class="icon">&#x1F4DE;</span><span class="tel"></span></li>',
            '<li><span class="icon">&#x1F4E0;</span><span class="fax"></span></li>',
            '<li><span class="icon">&#x2709;</span><a href="mailto:' + dfyinfo.email + '">' + dfyinfo.email + '</a></li>',
            '</ul>',
            '</div>'
        ].join(''), $box),

            $formbox = create('<div class="message"><h3></h3></div>', $box),
            $form = create('<div class="forms bright" />', $formbox),
            $inputs = [],

            $followbox = create([
                '<div class="info followus" />',
                '<h3></h3>',
                '<p class="type1 follow"></p>',
                '</div>'
            ].join(''), $box),

            $looksides = create([
                '<div class="looksides">',
                '<p class="type1"></p>',
                '<a href="/request" class="wi g right"><span></span></a>',
                '<a href="/career" class="wi g right"><span></span></a>',
                '</div>'
            ].join('')),

            $agreement, $submitbutton,

            formkeys = ['name', 'email', 'phone', 'message'],
            formicons = ['&#xE407;', '&#x2709;', '&#xEA02;', '&#x270E;'],
            formrequireds = [1, 1, 0, 1],
            formtypes = ['', 'email', 'tel', ''],

            i, max;


        for (i = 0, max = formkeys.length; i < max; i++) {
            $inputs[i] = form.createitem($form, formtypes[i], formicons[i], '', (formkeys[i] == 'message'));
        }
        $form.appendChild($looksides);
        form.createitem($form, 'agree', 'contactusprivacypolicy');
        $agreement = find('p.agree label', $form)[0];

        create('<p class="submit"><button type="button" class="button g" data-icon="&#x27A1;"></button></p>', $form);
        $submitbutton = find('p.submit button', $form)[0];
        event.add($submitbutton, 'click', sendform);

        $followbox.appendChild(F.getdfysnsbox());

        function sendform() {
            form.send('contactus', $inputs, $agreement, formkeys, formrequireds, formtypes, sendformsuccess);
        }

        function sendformsuccess() {
            form.reset($form);
            alert(labels[lang].contactus.form.success);
        }

        function langset() {

            var contactuslabels = labels[lang].contactus,
                numhead = (lang == 'kr') ? '02.' : '+82 2 ';

            find('p', $infobox)[0].innerHTML = dfyinfo.address[lang];
            find('span.tel', $infobox)[0].innerHTML = numhead + dfyinfo.tel;
            find('span.fax', $infobox)[0].innerHTML = numhead + dfyinfo.fax;

            find('h3', $followbox)[0].innerHTML = contactuslabels.title3;
            find('p', $followbox)[0].innerHTML = contactuslabels.followment;

            find('h3', $infobox)[0].innerHTML = contactuslabels.title1;
            find('h3', $formbox)[0].innerHTML = contactuslabels.title2;
            find('h3 span', $formbox)[0].innerHTML += (lang == 'en') ? '&nbsp; ' + requiredhtml + labels[lang].required : '&nbsp; ( ' + requiredhtml + labels[lang].required + ')';

            for (i = 0, max = formkeys.length; i < max; i++) {
                find('label', $inputs[i])[0].innerHTML = contactuslabels[formkeys[i]] + ' ' + ((formrequireds[i]) ? requiredhtml : '');
            }

            find('p', $looksides)[0].innerHTML = F.keepallwords(contactuslabels.looksides);
            find('a span', $looksides)[0].innerHTML = contactuslabels.requestform;
            find('a span', $looksides)[1].innerHTML = contactuslabels.careerform;

            $agreement.innerHTML = labels[lang].privacypolicy + requiredhtml;

            $submitbutton.innerHTML = contactuslabels.submit;

            form.button.set($form);

            fulllayer.privacypolicy();

        }

        function scroll(scrolltop) {}

        function resize() {}

        form.set($form);

        return {
            box: $box,
            outbox: $outbox,
            langset: langset,
            scroll: scroll,
            resize: resize
        }

    }


    sethead = (function() {

        var ognames = ['title', 'description', 'url', 'image'],
            $ogs = {}, $head = find('head')[0],
            $firstlink = find('link', $head)[0],
            i = 0,
            max = ognames.length;

        for (; i < max; i++) {
            $ogs[ognames[i]] = $doc.createElement('meta');
            $ogs[ognames[i]].setAttribute('property', 'og:' + ognames[i]);
            $head.insertBefore($ogs[ognames[i]], $firstlink);
        }

        return function(title, ment, thumb) {
            var locationhref = location.href;
            $doc.title =
                $ogs['title'].content = title + ' | D.FY';
            $ogs['description'].content = ment || dfyinfo.introduce[lang];
            $ogs['url'].content = dfyinfo.url + ((locationhref.indexOf('#!/') == -1) ? '' : '#!/' + locationhref.split('#!/')[1]);
            $ogs['image'].content = dfyinfo.url + ((thumb) ? thumb.replace(/^\//, '') : dfyinfo.logo);
        }

    })();


    path = (function() {

        var
        pushstateable = false, //browser.support.pushstate && !islocal,
            reghttp = /^(file|ftp|https?):/,
            regslash = /^\//,
            prevviewmodeid,
            prevsidemodeid,
            preventaction;

        function modecheck() {

            var check = location.href.match(regexp.mode),
                locationhref = location.href;

            sidemode = false;
            sidemodeid = -1;

            check = locationhref.match(regexp.mode);
            if (check) {
                mode = check[1];
                if (check[2]) {
                    viewmodeid = parseInt(check[2].replace('/', ''));
                } else {
                    viewmodeid = -1;
                }
            }
            sidemode = locationhref.match(regexp.sidemenu);
            if (sidemode) {
                if (sidemode[2]) {
                    sidemodeid = parseInt(sidemode[2].replace('/', ''));
                }
                sidemode = sidemode[1];
            } else if (!check) {
                viewmodeid = -1;
                check = locationhref.split(/#!\/(?:kr|en|jp)?\/?/i);
                if (check.length && check[1]) { //404
                    push('/404');
                    return;
                }
                mode = 'index';
            }

            /*
if ( check && check[1] != 'index' ) {
mode = pagemode = check[1];
if ( check[2] ) {
viewmodeid = parseInt( check[2].replace('/', '') );
}
} else {
console.log(check[1]);
mode = pagemode = 'index';
sidemode = location.href.match(regexp.sidemenu);
if ( sidemode ) {
sidemodeid = ( sidemode[2] )? parseInt( sidemode[2].replace('/', '') ) : -1;
sidemode = sidemode[1];
}
}
console.log(mode, sidemode, sidemodeid);
*/

            viewmode = viewmodeid !== -1;
            isindex = mode === 'index';
            isfulllayout = mode === 'index' || mode === '404';
            // style.set($scrolltarget, 'overflow', ( isfulllayout )? 'hidden' : '');

            classname[(viewmode) ? 'add' : 'remove']($body, 'viewmode');
            classname[(viewmode && mode != 'people') ? 'add' : 'remove']($body, 'viewmode-a');

            event[(isfulllayout) ? 'add' : 'remove']($contentwrap, 'touchmove', event.cancel);

        }

        function push(link, _preventaction) {

            var test;

            if (link === false) {
                link = '/';
                if (sidemode) {
                    link += sidemode;
                    if (sidemodeid != -1) {
                        link += '/' + sidemodeid;
                    }
                } else if (!isindex) {
                    link += mode;
                    if (viewmodeid != -1) {
                        link += '/' + viewmodeid;
                    }
                }
            } else if (typeof(link) == 'string') {
                if (!(reghttp).test(link) && !(regslash).test(link)) {
                    link = '/' + link;
                }
            } else {
                link = this.getAttribute('href');
            }

            link = '/' + lang + link;

            if (pushstateable) {
                window.history.pushState('', '', link);
                change();
            } else {
                location.href = link.replace('/', '#!/');
            }

            preventaction = _preventaction;

        }

        function backtopage(isreduce) {
            preventaction = true;
            if (!isreduce) {
                push((mode == 'index') ? '/' : (viewmode) ? mode + '/' + viewmodeid : mode);
            }
        }

        function change() {

            var urllang,
                prevpagemode = mode,
                previssidemode = sidemode;

            prevviewmodeid = viewmodeid;
            prevsidemodeid = sidemodeid;

            modecheck();

            if ((!sidemode && !previssidemode && prevpagemode == mode && prevviewmodeid == viewmodeid) ||
                (sidemode && previssidemode && previssidemode == sidemode && prevsidemodeid == sidemodeid)) {
                urllang = F.getlangfromurl();
                if (!urllang) {
                    push(false);
                } else if (urllang != lang) {
                    aside.alllangset();
                }
                return;
            }

            if (preventaction) {
                preventaction = false;
                return;
            }

            if (sidemode) {
                if (!aside.isexpanded()) {
                    $scrolltarget.scrollTop = 0;
                    scroll(0);
                    aside.expand(sidemode);
                } else if (previssidemode) {
                    if (previssidemode != sidemode) {
                        aside.expand(sidemode);
                        // sidecontent.swap(sidemode);
                    } else if (sidemode == 'career') {
                        if (sidemodeid == -1) {
                            sidecontent.careercloseall();
                        } else {
                            sidecontent.careeropen(sidemodeid);
                        }
                    }
                }
            } else if (previssidemode && prevpagemode == mode) {
                content.settitle();
                aside.close();
            } else {
                content.getdata();
            }

        }

        event.add(window, (pushstateable) ? 'popstate' : 'hashchange', change);

        return {
            push: push,
            modecheck: modecheck,
            sethead: sethead,
            backtopage: backtopage
        }

    })();


    setlinks = (function() {

        var $atags, $atag,
            regexpgeticon = /[^a-z]?(down|up|left|right|plus|minus)[^a-z]?/,
            i, max,
            anioption = {
                time: 0.25,
                easing: 'easeOutCubic'
            };

        function hover() {
            var icon = data.get(this, 'icon'),
                property =
                    (icon == 'left') ? {
                    marginRight: 5
                } :
                    (icon == 'right') ? {
                    marginRight: -5
                } :
                    (icon == 'up') ? {
                    marginTop: -5
                } :
                    (icon == 'down') ? {
                    marginTop: 5
                } :
                    '';
            if (property) {
                animate(find('img', this)[0], property, anioption);
            }
        }

        function leave() {
            animate(find('img', this)[0], {
                marginRight: 0,
                marginTop: 0
            }, anioption);
        }

        function menulink(e) {
            path.push.call(this);
            return event.cancel(e);
        }

        return function($context) {

            var icon;

            $atags = find('a', $context);

            for (i = 0, max = $atags.length; i < max; i++) {
                $atag = $atags[i];
                if (regexp.mode.test($atag.href) || $atag.getAttribute('href') == '/') {
                    event.add($atag, 'click', menulink);
                } else if (regexp.sidemenu.test($atag.href)) {
                    event.add($atag, 'click', aside.expand);
                }
                if (classname.has($atag, 'wi') && !data.get($atag, 'icon')) {
                    icon = $atag.className.match(regexpgeticon);
                    if (icon) {
                        $atag.appendChild(create('<img src="' + imgroot + 'bg_link' + icon[1] + '.png" alt="">'));
                        data.set($atag, 'icon', icon[1]);
                        // event.add($atag, { mouseenter: hover, mouseleave: leave });
                    }
                }
            }

        }

    })();


    updown = (function() {

        var $up = create('<p class="updown up hide">&#x2B06;</p>', $body),
            $down = create('<p class="updown down">&#xF501;</p>', $content),
            lastscrolltop = -1,
            upshow = false,
            upclicked = false,
            wait = false;

        event.add($up, 'click', goup);
        event.add($down, 'click', godown);

        function goup() {
            if (upshow) {
                F.scroll.to(0, 1, goupafter);
                upclicked = true;
                uphide();
            }
        }

        function goupafter() {
            upclicked = false;
        }

        function uphide(noani) {
            classname.add($up, 'hide');
            if (noani === true) {
                style.set($up, 'opacity', 0);
            } else {
                animate($up, {
                    opacity: 0
                }, {
                    time: 0.35
                });
            }
            upshow = false;
        }

        function godown() {
            F.scroll.to(areaheight, 1);
        }

        return {
            wait: function(_boolean) {
                wait = _boolean;
                if (wait && upshow) {
                    uphide(true);
                }
            },
            setcolor: function(color, theme) {
                $down.style.color = (classname.has($header, 'bright')) ? '#ffe000' : '';
                $up.style.color = color || '';
                $up.style.backgroundColor = (theme) ? (theme == 'bright') ? '#626262' : '#fff' : '';
            },
            movewith: function(v) {
                style.set($up, 'marginRight', -v);
            },
            scroll: function(scrolltop) {
                if (lastscrolltop != scrolltop) {
                    if (!isindex && scrolltop > areaheight && (lastscrolltop > scrolltop || scrolltop >= maxscrolltop)) {
                        if (!wait && !upshow && !upclicked) {
                            classname.remove($up, 'hide');
                            animate($up, {
                                opacity: 1
                            }, {
                                time: 0.35
                            });
                            upshow = true;
                        }
                    } else if (upshow) {
                        uphide();
                    }
                    lastscrolltop = scrolltop;
                }
            },
            resize: function() {
                var base = ((mode == 'project' || mode == 'people') && !viewmode) ? 1920 : 1280;
                style.set($up, 'right', (areawidth > base) ? (areawidth - base) / 2 + 40 : '');
                style.set($down, 'top', areaheight - $down.offsetHeight);
            }
        }

    })();


    footer = function() {

        var
        $tels = D.find('div.group1 p span', $footer)[0],
            $address = D.find('div.group1 address', $footer)[0],
            $copyright = D.find('p.copyright', $footer)[0];

        F.setsnsicons($footer);

        function langset() {
            $tels.innerHTML = labels[lang].footer.tel;
            $address.innerHTML = dfyinfo.address[lang];
            $copyright.innerHTML = labels[lang].footer.copyright;
        }
        langset();

        return {
            langset: langset
        }

    }


    coverblock = (function() {

        var $box = find('#cover')[0],
            propertyto,
            anioption = {
                show: {
                    time: 0.3,
                    easing: 'easeOutQuad'
                },
                hide: {
                    time: 0.3,
                    easing: 'easeOutQuad',
                    onend: removeme
                },
                flash: {
                    time: 0.5,
                    easing: 'easeOutQuad',
                    onend: removeme
                }
            };

        return {

            show: function(noani) {
                $body.appendChild($box);
                propertyto = {
                    opacity: 0.2
                };
                if (noani === true) {
                    style.set($box, propertyto);
                } else {
                    classname.add($box, 'loading');
                    anioption.show.onend = noani;
                    animate($box, propertyto, anioption.show);
                }
            },

            hide: function(noani) {
                propertyto = {
                    opacity: 0
                };
                if (noani === true) {
                    style.set($box, propertyto, 0);
                    removeme.call($box);
                } else {
                    anioption.hide.onend = (typeof(noani) != 'function') ? removeme : function() {
                        noani();
                        removeme.call(this);
                    };
                    animate($box, propertyto, anioption.hide);
                }
            },

            flash: function() {
                return; //140717 remove cover block (loading)
                $body.appendChild($box);
                classname.remove($box, 'loading');
                style.set($box, {
                    opacity: 1
                });
                animate($box, {
                    opacity: 0
                }, anioption.flash);
            }

        }

    })();


    form = (function() {

        var setted,
            checktarget = /(email|number|tel|url)/;


        //file upload
        var fileuploadorder = 1;
        window.fileuploaded = function(order, id, name) {
            var $targetlabel = find('#fileuploadlabel-' + sidemode)[0];
            $targetlabel.innerHTML = name;
            data.set($targetlabel, 'uploaded', id);
        }
        window.fileuploaderror = function(order, reason) {
            if (reason == 'exceed') {
                alert(labels[lang].error.fileuploadexceed);
            } else if (reason == 'extension') {
                alert(labels[lang].error.fileuploadextension);
            }
        }

        //select box
        var selectbox = (function() {

            var
            $selectboxs = [],
                $titles = [],
                $options = [],
                $optionlist, $option,
                id = 0,
                opened = [],
                i, max, j, jmax;

            function set($parent) {

                var $selects = find('span.ipselect select', $parent),
                    i = 0,
                    max = $selects.length;

                for (; i < max; i++) {
                    setted = data.get($selects[i], 'setted');
                    if (!setted) {

                        $titles[id] = create('<span class="title" />');
                        data.set($titles[id], 'index', id);
                        event.add($titles[id], 'click', toggleoptions);

                        data.set($selects[i], 'index', id);
                        $selects[i].parentNode.appendChild(create('<span class="arrow">&#xF501;</span>'));
                        $selects[i].parentNode.appendChild($titles[id]);
                        event.add($selects[i], {
                            change: change,
                            focus: focus,
                            blur: blur
                        });

                        $options[id] = create('<div class="selectoptions"><ul></ul></div>');
                        $optionlist = $options[id].children[0];
                        for (j = 0, jmax = $selects[i].options.length; j < jmax; j++) {
                            $option = create('<li>' + $selects[i].options[j].text + '</li>');
                            data.set($option, {
                                index: j,
                                pindex: i
                            });
                            event.add($option, 'click', optionclick);
                            $optionlist.appendChild($option);
                        }

                        change.call($selects[i]);
                        setted = data.get($selects[i], 'setted');

                        $selectboxs[id] = $selects[i];

                        id++;

                    }
                }

            }

            function reset() {
                for (var i = 0, max = $selectboxs.length; i < max; i++) {
                    $selectboxs[i].selectedIndex = 0;
                    change.call($selectboxs[i]);
                }
                closeoptions();
            }

            function refresh() {
                var $optionlist, $fakeoptionlist,
                    i = 0,
                    max = $selectboxs.length;
                for (; i < max; i++) {
                    $optionlist = find('option', $selectboxs[i]);
                    $fakeoptionlist = find('li', $options[i]);
                    for (j = 0, jmax = $optionlist.length; j < jmax; j++) {
                        $fakeoptionlist[j].innerHTML = $optionlist[j].text;
                    }
                    change.call($selectboxs[i]);
                }
            }

            function change() {
                var index = data.get(this, 'index'),
                    $optionitems = find('li', $options[index]);
                for (i = 0, max = $optionitems.length; i < max; i++) {
                    classname.decide($optionitems[i], 'selected', i == this.selectedIndex);
                }
                $titles[index].innerHTML = this.options[this.selectedIndex].text;
            }

            function focus() {
                classname.add(this.parentNode, 'focus');
            }

            function blur() {
                classname.remove(this.parentNode, 'focus');
            }

            function toggleoptions(ignore) {

                var index = data.get(this, 'index'),
                    $myoption = $options[index],
                    $parent = this.parentNode.parentNode.parentNode.parentNode,
                    info;

                if (opened[index] || ignore === true) {
                    animate($myoption, {
                        height: 0
                    }, {
                        time: 0.15,
                        easing: 'linear',
                        onend: removeme
                    });
                    classname.remove($selectboxs[index].parentNode, 'focus');
                    opened[index] = false;
                } else {
                    info = D.offset(this.parentNode, $parent);
                    $parent.appendChild($myoption);
                    style.set($myoption, {
                        left: info.left,
                        top: info.top + info.height,
                        width: info.width,
                        height: 0
                    });
                    animate($myoption, {
                        height: $myoption.children[0].offsetHeight
                    }, {
                        time: 0.35,
                        easing: 'easeOutQuart'
                    });
                    classname.add($selectboxs[index].parentNode, 'focus');
                    opened[index] = true;
                    closeoptions(this);
                }

            }

            function closeoptions($clicked) {
                var index = ($clicked && $clicked.nodeType) ? data.get($clicked, 'index') : -1;
                for (i = 0, max = $titles.length; i < max; i++) {
                    if (i != index) {
                        if (opened[i]) {
                            toggleoptions.call($titles[i], true);
                        }
                    }
                }
            }

            function optionclick() {
                var index = data.get(this, 'pindex');
                $selectboxs[index].selectedIndex = data.get(this, 'index');
                toggleoptions.call($titles[index]);
                change.call($selectboxs[index]);
            }

            event.add($body, 'click', function(e) {
                var $etarget = e.target || e.srcElement;
                while ($etarget && $etarget != $body) {
                    if (classname.has($etarget, 'ipselect')) {
                        return;
                    }
                    $etarget = $etarget.parentNode;
                }
                closeoptions();
            });

            event.add($win, 'resize', closeoptions);

            return {
                set: set,
                reset: reset,
                refresh: refresh
            }

        })();



        //add pseudo element to buttons for ie7(not supported) and ie8(font-size bug)
        /*
var button = (function() {
var $buttons;
return {
set: function($parent) {
if ( 9 > browser.ie ) {
$buttons = find('.button', $parent);
for ( i = 0, max = $buttons.length; i < max; i++ ) {
if ( !find('span.after', $buttons[i]).length ) {
$buttons[i].appendChild( create('<span class="after">'+ data.get($buttons[i], 'icon') +'</span>') );
}
}
}
}
}
})();
*/


        function textinputfocus() {
            var $error;
            classname.add(this.parentNode, 'focus');
            classname.remove(this.parentNode, 'error');
            //if ( data.get(this, 'type') == 'email' ) {
            $error = find('span.error', this.parentNode)[0];
            $error && classname.remove($error, 'show');
            //}
            if (browser.firefox) { // firefox korean bug
                classname.add(this.parentNode, 'active');
            }
        }

        function textinputblur() {

            var value = striptags(this),
                type = data.get(this, 'type');

            if (checktarget.test(type)) {
                if (value && !regexp[type].test(value)) {
                    classname.add(this.parentNode, 'error');
                    classname.add(find('span.error', this.parentNode)[0], 'show');
                }
            } else if (classname.has(this.parentNode, 'error')) {
                classname.remove(this.parentNode, 'error');
                classname.remove(find('span.error', this.parentNode)[0], 'show');
            }

            classname.remove(this.parentNode, 'focus');

            if (browser.firefox && !value) { // firefox korean bug
                classname.remove(this.parentNode, 'active');
            }

            //this[( useinput )? 'value' : 'innerHTML' ] = value;
            this.innerHTML = value;

        }

        function textinputcheck() {
            var value = striptags(this),
                type = data.get(this, 'type');
            if (checktarget.test(type)) {
                classname.decide(this.parentNode, 'invalid', value && !regexp[type].test(value));
            }
            if (!browser.firefox) { // firefox korean bug
                classname.decide(this.parentNode, 'active', value);
            }
            if (classname.has(this.parentNode, 'error')) {
                classname.remove(this.parentNode, 'error');
                classname.remove(find('span.error', this.parentNode)[0], 'show');
            }
        }

        function textinputerror() {
            var $target = this;
            find((useinput) ? 'input, textarea' : 'span.edit', this)[0].focus();
            setTimeout(function() { // ie bug
                classname.add($target, 'error');
                classname.add(find('span.error', $target)[0], 'show');
            }, 0);
        }

        var setmultilineeditable = (function() {

            var pasteaction = false;

            function formatblock(e) {
                (e.keyCode == 13) && formatblock();
            }

            function onblur() {
                this.innerHTML = replacevalues(this.innerHTML);
            }

            function onpaste() {
                formatblock();
                pasteaction = true;
            }

            function onkeyup() {
                if (pasteaction) {
                    onblur.call(this);
                    pasteaction = false;
                }
            }

            function formatblock() {
                document.execCommand('formatBlock', false, 'p');
            }

            //replace contenteditable tags

            function replacevalues(v) {
                var savebr = '7425196380';
                return v.replace(/<p>(<br[^>]*>|&nbsp;)<\/p>/ig, savebr) //new line blocks to savebr
                .replace(/<br[^>]*>/ig, savebr) //save brs
                .replace(/^([^<]*)<p[^>]*>/i, '$1') //remove first start p tag string
                .replace(/<p[^>]*>/ig, savebr) //replace all start p tag strings to br
                .replace(/(<[^>]+>|\n)/g, '') //remove all tags & new lines(for old ie)
                .replace(/&nbsp;/g, ' ') //replace all &nbsp; to space
                .replace(new RegExp(savebr, 'g'), '<br>') //savebr to newline
                ;
            }

            return function(target) {
                event.add(target, {
                    keypress: formatblock,
                    keyup: onkeyup,
                    blur: onblur,
                    paste: onpaste
                });
            }

        })();

        function ismultilineeditable($target) {
            return !useinput && classname.has($target.parentNode, 'multiline');
        }

        function striptags($target) {
            var value = ($target.value !== undefined) ? $target.value : $target.innerHTML;
            return (ismultilineeditable($target)) ? value : D.striptags(value);
        }

        function checkboxnradioinputcheck() {
            classname.decide(this.parentNode, 'checked', this.checked);
        }

        function getlabeltext($target) {
            return D.striptags(find('label', $target)[0].innerHTML).replace(' *', '');
        }

        return {

            button: F.button,

            send: function(type, $inputs, $agreement, keys, requireds, types, formdata, onsuccess) {

                var value, datas = {},
                    i = 0,
                    max = $inputs.length,
                    $checks, url, j, jmax;


                if (!onsuccess && typeof(formdata) == 'function') {
                    onsuccess = formdata;
                }

                for (; i < max; i++) {
                    if (types[i] == 'checkbox') {
                        $checks = find('input', $inputs[i]);
                        value = [];
                        for (j = 0, jmax = $checks.length; j < jmax; j++) {
                            if ($checks[j].checked) {
                                value.push($checks[j].value);
                            }
                        }
                        value = value.join(',');
                        if (requireds[i] && !value) {
                            if (sidemode == 'request') {
                                $checks[0].focus();
                                alert(labels[lang].request.interestederror);
                                return false;
                            }
                        }
                    } else if (types[i] == 'select') {
                        value = find('select', $inputs[i])[0];
                        value = value.options[value.selectedIndex].text;
                    } else if (types[i] == 'file') {
                        value = data.get(find('label', $inputs[i])[0], 'uploaded');
                    } else {
                        value = (useinput) ? find('input, textarea', $inputs[i])[0].value : find('span.edit', $inputs[i])[0].innerHTML;
                        if (value == '<br>') {
                            value = '';
                        }
                        if (requireds[i] && !value) {
                            textinputerror.call($inputs[i].children[0]);
                            return false;
                        }
                        if (value && checktarget.test(types[i]) && !regexp[types[i]].test(value)) {
                            textinputerror.call($inputs[i].children[0]);
                            return false;
                        }
                    }
                    datas[keys[i]] = value || '';
                }

                if (typeof(formdata) == 'object') {
                    for (i in formdata) {
                        datas[i] = formdata[i];
                    }
                }

                if ($agreement) {
                    value = find('input', $agreement.parentNode)[0];
                    if (!value.checked) {
                        value.focus();
                        alert(labels[lang].privacypolicyerror);
                        return false;
                    }
                    datas.agree = true;
                }

                if (type == 'contactus') {
                    url = 'contactSave';
                    datas.tel = datas.phone;
                    delete datas.phone;
                } else if (type == 'career') {
                    url = 'careerSave';
                } else if (type == 'requestproject') {
                    url = 'estimationSave';
                } else {
                    return;
                }

                if (islocal) {
                    onsuccess && onsuccess();
                    return;
                }

                D.ajax({
                    method: 'POST',
                    url: url,
                    data: datas,
                    datatype: 'json',
                    success: function(result) {
                        if (result.result == 'ok') {
                            onsuccess && onsuccess();
                        } else {
                            ajaxerror();
                        }
                    },
                    error: ajaxerror
                });

            },

            refresh: function($parent) {
                selectbox.refresh();
            },

            set: function($parent) {

                var i, max;

                if (!$parent) {
                    $parent = $body;
                }

                //input text
                (function() {

                    var $iptexts = find('span.iptext span.edit, span.iptext input, span.iptext textarea', $parent);

                    for (i = 0, max = $iptexts.length; i < max; i++) {
                        setted = data.get($iptexts[i], 'setted');
                        if (!setted) {

                            if (ismultilineeditable($iptexts[i])) {
                                setmultilineeditable($iptexts[i]);
                            }
                            event.add($iptexts[i], {
                                keydown: textinputcheck,
                                keyup: textinputcheck,
                                focus: textinputfocus,
                                blur: textinputblur
                            });

                            //use errorbox all input boxes
                            //if ( data.get($iptexts[i], 'type') == 'email' ) {
                            $iptexts[i].parentNode.appendChild(create('<span class="error" />'));
                            //}
                            textinputcheck.call($iptexts[i]);
                            textinputblur.call($iptexts[i]);

                            //add pseudo element for ie7(not supported) and ie8(font-size bug)
                            if (9 > browser.ie) {
                                $iptexts[i].parentNode.insertBefore(
                                    create('<span class="before">' + data.get($iptexts[i].parentNode, 'icon') + '</span>'),
                                    $iptexts[i].parentNode.firstChild
                                );
                            }

                            data.set($iptexts[i], 'setted', true);

                        }
                    }

                    $iptexts = find('span.iptext iframe', $parent);

                    for (i = 0, max = $iptexts.length; i < max; i++) {
                        if (!setted) {
                            //add pseudo element for ie7(not supported) and ie8(font-size bug)
                            if (9 > browser.ie) {
                                $iptexts[i].parentNode.insertBefore(
                                    create('<span class="before">' + data.get($iptexts[i].parentNode, 'icon') + '</span>'),
                                    $iptexts[i].parentNode.firstChild
                                );
                            }
                            data.set($iptexts[i], 'setted', true);
                        }
                    }

                })();

                //input checkbox|radio
                (function() {

                    var $ipchecks = find('span.ipcheck input', $parent);

                    for (i = 0, max = $ipchecks.length; i < max; i++) {
                        setted = data.get($ipchecks[i], 'setted');
                        if (!setted) {
                            event.add($ipchecks[i], {
                                focus: focus,
                                blur: focus
                            });
                            event.add($ipchecks[i], (9 > browser.ie) ? 'propertychange' : 'change', checkboxnradioinputcheck);
                            checkboxnradioinputcheck.call($ipchecks[i]);
                            data.set($ipchecks[i], 'setted', true);
                        }
                    }

                    function focus(e) {
                        classname.decide(this.parentNode, 'focus', e.type == 'focus');
                    }

                })();

                //button icons
                F.button.set($parent);

                //select box
                selectbox.set($parent);

            },

            reset: function($parent) {

                var $inputs, i, max;

                if (!$parent) {
                    $parent = $body;
                }

                //input text
                $inputs = find('span.iptext ' + ((useinput) ? '.edit' : 'span.edit'), $parent);
                for (i = 0, max = $inputs.length; i < max; i++) {
                    $inputs[i][(useinput) ? 'value' : 'innerHTML'] = '';
                    textinputfocus.call($inputs[i]);
                    textinputblur.call($inputs[i]);
                    textinputcheck.call($inputs[i]);
                }

                //input checkbox|radio
                $inputs = find('span.ipcheck input', $parent);
                for (i = 0, max = $inputs.length; i < max; i++) {
                    $inputs[i].checked = false;
                    checkboxnradioinputcheck.call($inputs[i]);
                }

                selectbox.reset($parent);

            },

            createitem: function($parent, type, icon, classname, ismultiline) {
                var html, i, max;
                if (type == 'select') {
                    html = [
                        '<p class="item ', classname, '">',
                        '<span class="type1"></span>',
                        '<span class="ipselect">',
                        '<select>'
                    ];
                    for (i = 0, max = icon.length; i < max; i++) { //icon = option list
                        html.push('<option></option>');
                    }
                    html.push(
                        '</select>',
                        '</span>',
                        '</p>'
                    );
                } else if (type == 'agree') {
                    html = [
                        '<p class="item agree">',
                        '<span class="ipcheck">',
                        '<span class="before">&#x2713;</span>',
                        '<input type="checkbox" id="', icon, '" value="0">',
                        '<label for="', icon, '"></label>',
                        '</span>',
                        '</p>'
                    ];
                } else {
                    html = [
                        '<p class="item ', classname, (ismobile && type == 'file') ? 'disabled' : '', '">',
                        '<span class="', (ismultiline) ? 'iptext multiline' : 'iptext', '" data-icon="', icon, '">'
                    ];
                    if (type == 'file') {
                        html.push('<label id="fileuploadlabel-', ($parent.parentNode && $parent.parentNode.id == 'requests') ? 'request' : 'career', '"></label>');
                        if (ismobile) {
                            html.push('<span class="edit"></span>');
                        } else {
                            html.push('<iframe src="', ((islocal) ? './' : '/'), 'upload.html?order=', fileuploadorder, '" class="edit" frameborder="0" scrolling="0" allowTransparency="1"></iframe>');
                        }
                        fileuploadorder++;
                    } else {
                        html.push('<label></label>');
                        if (useinput) {
                            html.push(
                                (ismultiline) ? '<textarea class="edit"></textarea>' : '<input type="text" class="edit" data-type="' + type + '" />'
                            );
                        } else {
                            html.push(
                                '<span class="edit" data-type="', type, '" contentEditable="true"></span>'
                            );
                        }
                    }
                    html.push(
                        '</span>',
                        '</p>'
                    );
                }
                return create(html.join(''), $parent);
            }

        }

    })();

    function ajaxerror() {
        alert(labels[lang].error.ajax);
    }

    function getdataurl(name) {
        // return dataroot + name + ( ( islocal )? '.js' : '.json' );
        return dataroot + name + ((islocal || mode == 'office') ? '.js' : '.json');
    }

    /*
//test
var asdfasdf = create('<button>Masking</button>');
style.set(asdfasdf, { position: 'fixed', left: 0, top: 0, zIndex: 10000 } );
event.add(asdfasdf, 'click', content.masking);
$body.appendChild(asdfasdf);
*/

    //check font loaded

    function checkfont(callback) {

        var $checker = create('<p class="fontchecker">ABCDEabcde12345</p>', $body),
            classes = ['f1', 'f2', 'f3', 'f4', 'f5'],
            basewidth, i, max = classes.length;

        basewidth = $checker.offsetWidth;

        if (style.get($checker, 'top') == -2000) {
            isretina = true;
        }

        function check() {
            for (i = 0; i < max; i++) {
                $checker.className = 'fontchecker ' + classes[i];
                if (basewidth != $checker.offsetWidth) {
                    classes.splice(i, 1);
                    i--;
                    max--;
                }
            }
            if (classes.length) {
                setTimeout(check, 500);
            } else {
                $body.removeChild($checker);
                callback && callback();
            }
        }
        check();

    }

    //set body font size

    function resizefont() {

        //size mode. 'wide'(1920~), desktop'(1280~), 'notebook'(961~1280), 'tablet'(641~960), 'mobile'(401~640), 'mini'(~400)
        var defaultfontsize = 16,
            basewidth = (sizemode == 'mini') ? 400 : (sizemode == 'mobile') ? 640 : (sizemode == 'tablet') ? 960 : 1280,
            fontsize = (sizemode == 'mini') ? defaultfontsize : Math.min(defaultfontsize, defaultfontsize * areawidth / basewidth);

        // style.set($wrap, 'scale', areawidth/basewidth);
        // style.set($wrap, 'zoom', areawidth/basewidth);
        // style.set($body, 'fontSize', 16);
        // return;

        //avoid ie font size rounding.
        if (browser.ie) {
            $body.style.fontSize = fontsize / defaultfontsize + 'em';
        } else {
            style.set($body, 'fontSize', fontsize);
        }

    }


    //on scrolling

    function scroll(scrolltop) {

        maxscrolltop = $scrolltarget.scrollHeight - areaheight;

        scrolltop = Math.min(maxscrolltop, scrolltop);

        if (scrollcanceled) {
            scrollcanceled = false;
            return;
        }

        if (content.ismasked && !content.ismasked()) {
            header.scroll(scrolltop);
            content.scroll(scrolltop);
            updown.scroll(scrolltop);
        } else {
            // aside.scroll && aside.scroll(scrolltop);
        }

    }

    function scrollfix(isup) {
        var scrolltop = $scrolltarget.scrollTop,
            scrollto = Math.max(0, (isup) ? scrolltop - 50 : scrolltop + 50);
        if (scrolltop != scrollto) {
            scroll(scrollto);
            scrollcanceled = true;
            $scrolltarget.scrollTop = scrollto;
        }
    }

    function iseditable($target) {
        return $target && $target.nodeName && ((/(input|select|textarea)/i).test($target.nodeName) || $target.contentEditable == 'true');
    }

    //capture wheel & arrow keys action for parallax scroll
    if (browser.os == 'win' && browser.ie && browser.ie > 8) {
        event.add($docel, 'mousewheel', function(e) {
            scrollfix((e.wheelDelta || e.detail) > 0);
            return event.cancel(e);
        });
        event.add($docel, 'keydown', function(e) {
            var keycode = e.keyCode;
            if ((keycode == 38 || keycode == 40) && !iseditable(e.target || e.srcElement)) {
                scrollfix(keycode == 38);
                return event.cancel(e);
            }
        });
    }

    event.add($win, 'scroll', function() {
        scroll($scrolltarget.scrollTop);
    });

    //resizing

    function resize(ignore) {

        var i, max;

        areawidth = $body.offsetWidth;
        areaheight = window.innerHeight || $docel.clientHeight;

        if (ignore !== true && ismobile && areaprevwidth == areawidth) {
            return;
        }
        areaprevwidth = areawidth;

        //size mode. 'wide'(1920~), desktop'(1280~), 'notebook'(961~1280), 'tablet'(641~960), 'mobile'(401~640), 'mini'(~400)
        prevsizemode = sizemode;
        if (401 > areawidth) {
            sizemode = 'mini';
        } else if (areawidth > 400 && 641 > areawidth) {
            sizemode = 'mobile';
        } else if (areawidth > 640 && 961 > areawidth) {
            sizemode = 'tablet';
        } else if (areawidth > 960 && 1281 > areawidth) {
            sizemode = 'notebook';
        } else if (areawidth > 1280 && 1921 > areawidth) {
            sizemode = 'desktop';
        } else {
            sizemode = 'wide';
        }

        classname[(areawidth > 1280) ? 'add' : 'remove']($body, 'keep');

        setcssie();

        // console.log(areawidth, sizemode);

        issmallsize = sizemode == 'mini' || sizemode == 'mobile';

        resizefont();

        if (!initialized) {
            return;
        }

        header && header.resize();
        aside && aside.resize();
        sidecontent && sidecontent.resize();
        content && content.resize();

        return;

        //generate font media query css
        //size mode. 'wide'(1920~), desktop'(1280~), 'notebook'(961~1280), 'tablet'(641~960), 'mobile'(401~640), 'mini'(~400)
        for (var aa, txt = [], i = 0, maxfontsize = 16,
                //maxwidth = 1280, minwidth = 961, minfontsize = 12.01,//notebook~
                //maxwidth = 960, minwidth = 641, minfontsize = 10.68,//tablet
                //maxwidth = 640, minwidth = 401, minfontsize = 8.03,//mobile
                maxwidth = 320, minwidth = 200, minfontsize = 10, //mini
                splitnum = 5, gap = maxwidth - minwidth, sgap = gap / splitnum, fgap = maxfontsize - minfontsize; i <= splitnum; i++
        ) {
            if (!i) {
                aa = maxwidth;
                txt[i] = '@media (min-width:' + maxwidth + 'px) {\n' + '\tbody { font-size:' + maxfontsize + 'px; }\n' + '}';
            } else {
                txt[i] = 'px) and (max-width:' + (aa - 1) + 'px) {\n';
                aa = Math.round(maxwidth - sgap * i);
                txt[i] = '@media (min-width:' + aa + txt[i] + '\tbody { font-size:' + (maxfontsize - ((maxwidth - aa) / gap * fgap)) + 'px; }\n' + '}';
            }
            txt[i] += '\n';
        }
        console.log(txt.reverse().join(''));

        //console.clear();
        //console.log(areawidth, sizemode);

    }
    event.add(window, 'resize', resize);

    // event.add(window, 'load', function() {
    (function() {

        var i;

        if (browser.android && browser.webkitversion) {
            if (537 > parseInt(browser.webkitversion)) {
                browser.support.translate3d = false;
            }
        }

        //add client environment class to html
        classname.add($docel, browser.os);
        classname.add($docel, (ismobile) ? 'mobile' : 'desktop');
        for (i in browser) {
            if (browser[i] === true) {
                classname.add($docel, i);
            } else if (i == 'ie') {
                classname.add($docel, i + ' ' + i + browser[i]);
                if (isoldie) {
                    classname.add($docel, 'oldie');
                    (browser.ie === 8) && classname.add($docel, 'ie8');
                }
            }
        }

        path.modecheck();

        //create sns icons
        (function() {
            var i = 0,
                snsboxs = D.find('.snsicons');
            for (; i < snsboxs.length; i++) {
                snsboxs[i].parentNode.replaceChild(F.getdfysnsbox(), snsboxs[i]);
            }
        })();

        //set common objects
        header = ($header) ? header() : null;
        aside = ($aside) ? aside() : null;
        footer = ($footer) ? footer() : null;
        sidecontent = ($sidecontent) ? sidecontent() : null;

        fulllayer.initialize();

        form.set();

        // content.masking();

        initialized = true;

        resize();

        D.load.script(getdataurl('sidecontent'), function(data) {

            //set side content(career&request) data.
            sidecontent.setdata(sidecontentdata); //sidecontent.setdata(data);

            content.getdata();

            setcssskr();
            setcssie();

            printFbLikesCount('0000');

            if (!islocal) {
                D.ajax({
                    url: 'http://graph.facebook.com/thedfy',
                    datatype: 'jsonp',
                    callback: function(data) {
                        facebooklikes = parseInt(data.likes);
                        printFbLikesCount(data.likes);
                    }
                });
            }

        });

        //resize after font load
        checkfont(function() {
            resize(true);
        });

    })();

    var printFbLikesCount = function(likes) {
        facebooklikes = likes || facebooklikes;
        if (facebooklikes > -1) {
            var fblikescount = document.getElementById('fblikescount');
            if (fblikescount) {
                var c = '' + facebooklikes,
                    n;
                var s = '';
                s += '<strong><img src="' + imgroot + 'btn_fblike.gif" alt="Like us on Facebook"></strong>';
                s += '<em title="' + facebooklikes + '">';
                for (var i = 0; i < c.length; i++) {
                    n = c.charAt(i);
                    s += '<span><img src="' + imgroot + 'txt_fblike' + n + '.gif" alt=""></span>';
                }
                s += '</em>';
                fblikescount.innerHTML = s;
            }
        }
    };

    if (browser.chrome) {
        console.log('%cDefy the Current - D.FY.', 'font-family:verdana;font-size:15px;color:#fff;line-height:1.35;padding:1px 5px 2px;border-radius:3px;background:#ffe000;');
    } else {
        console.log('Defy the Current - D.FY')
    }

})(window, document, document.documentElement, document.body);
