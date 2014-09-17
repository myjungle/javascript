//d.fy modules
var module = (function() {

    'use strict';

    var
    //get utilities from D
    create = D.create,
        classname = D.classname,
        style = D.style,
        find = D.find,

        regiscomp = /^comp\-/,

        html,
        i, max;


    function addcompthemeclass($box, theme) {
        $box.className = $box.className.replace('box', 'box ' + (theme || 'dark'));
    }

    function blankfunction() {}

    return {

        'default': function($box, $outbox, name, data, subdata) {

            var $h3, $h4, $h5, $p;

            if (F.getlanguagedata(data.h3)) {
                $h3 = create('<h3 />', $box);
                if (data.colorset) {
                    $h3.style.color = data.colorset[0];
                }
            }
            if (F.getlanguagedata(data.h4)) {
                $h4 = create('<h4 />', $box);
                if (data.colorset) {
                    $h4.style.color = data.colorset[0];
                }
            }
            if (F.getlanguagedata(data.h5)) {
                $h5 = create('<h5 />', $box);
                if (data.colorset) {
                    $h5.style.color = data.colorset[0];
                }
            }
            if (F.getlanguagedata(data.p)) {
                $p = create('<p class="type1" />', $box);
                if (data.colorset) {
                    $p.style.color = data.colorset[1] || data.colorset[0];
                }
            }

            if (regiscomp.test(data.module)) {
                addcompthemeclass($outbox, data.theme);
            }

            function langset() {
                if ($h3) {
                    $h3.innerHTML = F.getlanguagedata(data.h3);
                }
                if ($h4) {
                    $h4.innerHTML = F.getlanguagedata(data.h4);
                }
                if ($h5) {
                    $h5.innerHTML = F.getlanguagedata(data.h5);
                }
                if ($p) {
                    if (subdata && name == 'peoplement') {
                        $p.innerHTML = F.getlanguagedata(data.p, {
                            'number of members': subdata
                        });
                    } else {
                        $p.innerHTML = F.getlanguagedata(data.p);
                    }
                }
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },


        //project - view components
        'comp-basic': function($box, $outbox, name, data, subdata) {
            classname.remove($outbox, 'comp-basic');
            return this['default']($box, $outbox, name, data, subdata);
        },

        //project - view components
        'comp-image': function($box, $outbox, name, data, subdata) {

            $box.className = 'imgbox';
            create('<img src="' + F.getimagesrc(data.image) + '" alt="">', $box);

            return {
                box: $box,
                outbox: $outbox,
                langset: blankfunction,
                scroll: blankfunction,
                resize: blankfunction
            }

        },

        'comp-basic-t': function($box, $outbox, name, data, subdata) {

            var base = this['default']($box, $outbox, name, data, subdata),
                $image = create('<div class="imgbox"><img src="' + F.getimagesrc(data.image) + '" alt=""></div>');

            $outbox.insertBefore($image, $box);

            return {
                box: $box,
                outbox: $outbox,
                langset: base.langset,
                scroll: base.scroll,
                resize: base.resize
            }

        },

        'comp-basic-m': function($box, $outbox, name, data, subdata) {

            var base = this['default']($box, $outbox, name, data, subdata),
                $topbox = create('<div class="inbox" />', $box),
                $image = create('<img src="' + F.getimagesrc(data.image) + '" alt="">', $box),
                $bottombox = create('<div class="inbox" />', $box);

            $box.className = 'imgbox';
            $outbox.insertBefore($topbox, $box);
            $outbox.appendChild($bottombox);

            $topbox.appendChild(find('h4', $box)[0]);
            $bottombox.appendChild(find('p.type1', $box)[0]);

            return {
                box: $box,
                outbox: $outbox,
                langset: base.langset,
                scroll: base.scroll,
                resize: base.resize
            }

        },

        'comp-basic-b': function($box, $outbox, name, data, subdata) {
            var base = this['comp-basic-t']($box, $outbox, name, data, subdata);
            $outbox.appendChild(find('.imgbox', $outbox)[0]);
            return {
                box: $box,
                outbox: $outbox,
                langset: base.langset,
                scroll: base.scroll,
                resize: base.resize
            }
        },

        'comp-basic-l': function($box, $outbox, name, data, subdata) {

            data.h4 = data.h5;
            delete data.h5;

            var base = this['default']($box, $outbox, name, data, subdata),
                $image = create('<div class="imgbox imgboxl"><img src="' + F.getimagesrc(data.image) + '" alt=""></div>', $outbox);

            $outbox.insertBefore($image, $box);

            return {
                box: $box,
                outbox: $outbox,
                langset: base.langset,
                scroll: base.scroll,
                resize: base.resize
            }

        },

        'comp-basic-r': function($box, $outbox, name, data, subdata) {
            var base = this['comp-basic-l']($box, $outbox, name, data, subdata);
            $outbox.appendChild(find('.imgboxl', $outbox)[0]);
            find('.imgboxl', $outbox)[0].className = 'imgbox imgboxr';
            return {
                box: $box,
                outbox: $outbox,
                langset: base.langset,
                scroll: base.scroll,
                resize: base.resize
            }
        },

        'comp-images': function($box, $outbox, name, data, subdata) {

            var $images = [],
                i = 0,
                max = data.list.length;

            for (; i < max; i++) {
                $images[i] = create('<div class="imgbox imgbox' + ((i % 2 == 0) ? 'l' : 'r') + '"><img src="' + F.getimagesrc(data.list[i]) + '" alt=""></div>', $outbox);
            }
            $outbox.removeChild($box);
            classname.add($outbox, 'comp-images-' + max);

            return {
                box: $box,
                outbox: $outbox,
                langset: blankfunction,
                scroll: blankfunction,
                resize: blankfunction
            }

        },

        'comp-movie': function($box, $outbox, name, data, subdata) {
            var control, html = ['<p>'];
            data.url += '?title=0&portrait=0&byline=0';
            if (data.cover) {
                html.push('<img src="', F.getimagesrc(data.cover), '" class="cover" alt="" />');
                html.push('<img src="', imgroot, 'btn_play.png" class="btn" alt="Play Movie" />');
                html.push('<iframe src="about:blank" width="100%" height="100%" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', '</p>');
                control = true;
            } else {
                html.push('<img src="', imgroot, 'blank17x10.gif" alt="" />');
                html.push('<iframe src="', data.url, '" width="100%" height="100%" frameborder="0" scrolling="no" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', '</p>');
            }
            create(html.join(''), $box);
            if (control) {
                control = F.playmovie($box, data.url);
            }
            return {
                box: $box,
                outbox: $outbox,
                langset: blankfunction,
                scroll: blankfunction,
                resize: blankfunction
            };
        },

        'comp-mix': function($box, $outbox, name, data, subdata) {

            var
            $box1, $h4, $p1, $image, $box2, $p2, $p3, $listbox, $list, $listitems,
                notopment, nomiddlement,
                i, max;

            $outbox.removeChild($box);

            if (F.getlanguagedata(data.h4) || F.getlanguagedata(data.p)) {
                $box1 = create('<div class="inbox" />', $outbox);
                if (F.getlanguagedata(data.h4)) {
                    $h4 = create('<h4 />', $box1);
                    if (data.colorset) {
                        $h4.style.color = data.colorset[0];
                    }
                }
                if (F.getlanguagedata(data.p)) {
                    $p1 = create('<p class="type1" />', $box1);
                    if (data.colorset) {
                        $p1.style.color = data.colorset[1] || data.colorset[0];
                    }
                }
            } else {
                notopment = true;
            }

            if (data.image && data.image != "") {
                $image = create('<div class="imgbox"><img src="' + F.getimagesrc(data.image) + '" alt=""></div>', $outbox);
            }

            if (F.getlanguagedata(data.p2) || F.getlanguagedata(data.p3)) {
                $box2 = create('<div class="inbox" />', $outbox);
                if (F.getlanguagedata(data.p2)) {
                    $p2 = create('<h5 />', $box2);
                    if (data.colorset) {
                        $p2.style.color = data.colorset[0];
                    }
                }
                if (F.getlanguagedata(data.p2)) {
                    $p3 = create('<p class="type1" />', $box2);
                    if (data.colorset) {
                        $p3.style.color = data.colorset[1] || data.colorset[0];
                    }
                }
            } else {
                nomiddlement = true;
            }

            //list only
            if (notopment && nomiddlement) {
                classname.add($outbox, 'listonly');
            }

            if (data.list && data.list.length > 0) {
                $listbox = create('<div class="inbox" />', $outbox);
                $list = create('<ul class="list" />', $listbox);
                $listitems = [];
                for (i = 0, max = data.list.length; i < max; i++) {
                    $listitems[i] = create([
                        '<li class="c', Math.floor(i % 3) + 1, ' s', Math.floor(i % 2) + 1, '" />',
                        '<img src="', F.getimagesrc(data.list[i].image), '" />',
                        '<h5></h5>',
                        '<p class="type1"></p>',
                        '</li>'
                    ].join(''), $list);
                    if (data.colorset) {
                        find('h5', $listitems[i])[0].style.color = data.colorset[0];
                        find('p', $listitems[i])[0].style.color = data.colorset[1] || data.colorset[0];
                    }
                }
                $outbox.className += ' txtgrid' + ((3 > max) ? 2 : 3);
            }

            function langset() {

                if ($h4) {
                    $h4.innerHTML = F.getlanguagedata(data.h4);
                }
                if ($p1) {
                    $p1.innerHTML = F.getlanguagedata(data.p);
                }
                if ($p2) {
                    $p2.innerHTML = F.getlanguagedata(data.p2);
                }
                if ($p3) {
                    $p3.innerHTML = F.getlanguagedata(data.p3);
                }
                if ($listitems) {
                    for (i = 0; i < max; i++) {
                        find('h5', $listitems[i])[0].innerHTML = F.getlanguagedata(data.list[i].h);
                        find('p', $listitems[i])[0].innerHTML = F.getlanguagedata(data.list[i].p);
                    }
                }

            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            }

        },

        //project info
        'project-info': function($box, $outbox, name, data, subdata) {

            var
            $info = create('<div class="info" />', $box),
                $client = create('<strong class="title" />', $info),
                $date = create('<em class="openday" />', $info),
                $keyword = create('<span class="keyword" />', $info),
                $sharetitle = create('<em class="share" />', $info),
                $share = create('<span class="shareicon" />', $info),

                $desc = create('<div class="desc" />', $box),
                $ment = create('<p class="type1" />', $desc),
                $buttons = create('<p class="type3" />', $desc),
                //140718 data.bg color to button text color - buttons = F.setlinkbuttons($buttons, data.links, data.colorset),
                buttons = F.setlinkbuttons($buttons, data.links, data.bg),

                i, max, html;

            addcompthemeclass($outbox, data.theme);

            $info.insertBefore(create('<img src="' + F.getimagesrc(data.logoimage) + '" class="logo" alt="">'), $info.children[0]);
            F.addsharebuttons($share);

            if (data.colorset) {
                $ment.style.color = data.colorset[0];
                $info.style.color = data.colorset[1];
            }

            function langset() {

                var i, max, html;

                //$client.innerHTML = data.client[lang];
                $client.innerHTML = data["client" + langCamel];
                $date.innerHTML = F.dateformat(data.date);
                $sharetitle.innerHTML = labels[lang].button.share + '.';

                if (data['tag' + langCamel]) {
                    $keyword.innerHTML = data['tag' + langCamel];
                } else if ($keyword) {
                    if (data.keyword.length) {
                        for (html = [], i = 0, max = data.keyword.length; i < max; i++) {
                            //html.push('<a href="/keyword/'+ data.keyword[i].id +'">'+ data.keyword[i][lang] +'</a>');
                            //html.push('<a href="/keyword/'+ data.keyword[i].seq +'">'+ data.keyword[i]["title"+langCamel] +'</a>');
                            html.push(data.keyword[i]["title" + langCamel]);
                        }
                        $keyword.innerHTML = html.join(', ');
                    } else {
                        $info.removeChild($keyword);
                        $keyword = null;
                    }
                }

                $ment.innerHTML = F.getlanguagedata(data.p);

                buttons.langset();

            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        //project comment
        'project-comment': function($box, $outbox, name, data, subdata) {

            var $mask = create('<div class="mask" />', $outbox),
                $list = create('<ul />', $mask),
                $paging = create('<p class="dotpage" />'),
                $items = [],
                control, i = 0,
                max = data.list.length;

            $outbox.removeChild($box);

            for (; i < max; i++) {
                $items[i] = create([
                    '<li>',
                    '<div class="inbox">',
                    '<p class="type1"></p>',
                    '<p class="by"></p>',
                    '</div>',
                    '<p class="face"><img src="', F.getimagesrc(data.list[i].image), '" alt=""></p>',
                    '</li>'
                ].join(''), $list);
            }
            $outbox.appendChild($paging);

            control = F.xlider($mask, $list, $items, $paging, {
                'default': 1
            }, {
                imagename: 'dotpage_n'
            });

            function langset() {
                for (i = 0; i < max; i++) {
                    find('p.type1', $items[i])[0].innerHTML = F.getlanguagedata(data.list[i].ment);
                    find('p.by', $items[i])[0].innerHTML = [
                        '<em>',
                        // ( data.list[i].detail )? '<a href="/people/'+ data.list[i].seq +'">' : '',
                        data.list[i].name[lang],
                        // ( data.list[i].detail )? '</a>' : '',
                        '</em> ',
                        data.list[i].position[lang]
                    ].join('');
                }
                resize();
            }

            function resize() {
                var heights = [],
                    maxheight;
                control.resize();
                for (i = 0; i < max; i++) {
                    style.set($items[i], {
                        width: Math.min(1920, areawidth),
                        height: 'auto'
                    });
                    heights.push($items[i].offsetHeight);
                }
                maxheight = Math.max.apply('', heights);
                for (i = 0; i < max; i++) {
                    style.set($items[i], 'height', maxheight);
                }
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: resize
            };

        },


        //news view
        'news-view': function($box, $outbox, name, data, subdata) {

            var
            data = data.content,
                $items = [],
                $targetitem,
                type, controls = [],
                i = 0,
                max = data.length,
                j, jmax;

            for (; i < max; i++) {
                type = data[i].type;
                if (type == 'title') {
                    $items[i] = create('<h4 />', $box);
                } else if (type == 'text') {
                    $items[i] = create('<p class="type1" />', $box);
                } else if (type == 'link') {
                    $items[i] = create('<p class="type1 outlink"><a href="' + data[i].href + '" target="_blank" class="wi g big right"><span>&nbsp;</span></a></p>', $box);
                    $items[i] = find('span', $items[i])[0];
                } else if (type == 'image') {
                    $items[i] = create('<p class="pic" />', $box);
                    for (j = 0, jmax = data[i].images.length; j < jmax; j++) {
                        create('<img src="' + F.getimagesrc(data[i].images[j].saveName) + '" alt="">', $items[i]);
                    }
                    if (data[i].images.length > 1) {
                        for (j = 0, jmax = data[i].images.length; j < jmax; j++) {
                            $items[i].children[j].className = (j % 2 == 0) ? 'pl' : 'pr';
                        }
                    }
                } else if (type == 'image-slide') {
                    $items[i] = create('<div class="slide"><div class="mask"><ul></ul></div></div>', $box);
                    $items[i] = find('ul', $items[i])[0];
                    for (j = 0, jmax = data[i].images.length; j < jmax; j++) {
                        create('<li><img src="' + F.getimagesrc(data[i].images[j].saveName) + '" alt=""></li>', $items[i]);
                    }
                    controls[i] = F.xlider($items[i].parentNode, $items[i], $items[i].children, create('<p class="dotpage" />', $items[i].parentNode.parentNode), {
                        'default': 1
                    });
                } else if (type == 'movie') {
                    $items[i] = create([
                        '<div class="movie"><p>',
                        '<img src="', imgroot, 'blank5x3.gif" alt="">',
                        '<iframe width="100%" height="100%" src="', data[i].url, '" frameborder="0" allowfullscreen></iframe>',
                        '</p></div>'
                    ].join(''), $box);
                } else if (type == 'linkbuttons') {
                    $items[i] = create('<p class="btn" />', $box);
                    controls[i] = F.setlinkbuttons($items[i], data[i].items);
                }
            }

            classname.add($outbox, 'bright');

            function langset() {
                for (i = 0; i < max; i++) {
                    type = data[i].type;
                    if (type == 'title' || type == 'text' || type == 'link') {
                        $items[i].innerHTML = F.getlanguagedata(data[i]);
                    } else if (type == 'linkbuttons') {
                        controls[i].langset();
                    }
                }
            }

            function resize() {
                for (i = 0; i < max; i++) {
                    if (controls[i]) {
                        controls[i].resize && controls[i].resize();
                    }
                }
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: resize
            };

        },

        //news author
        'name-card': function($box, $outbox, name, data, subdata) {

            var $name, $ment, $readmore,
                data = data.author;

            $name = create('<p class="by" />', $box);
            $ment = create('<p class="type1" />', $box);
            if (data.detail) {
                $readmore = create('<p class="readmore" />', $box);
            }
            create(['<div class="face"><img src="', F.getimagesrc(data.image), '" alt=""></div>'].join(''), $outbox);

            function langset() {
                $name.innerHTML = '<em>' + data.name[lang] + '</em> ' + data.position[lang];
                $ment.innerHTML = F.getlanguagedata(data.ment);
                if (lang == 'kr' || lang == 'jp') {
                    if ($readmore) {
                        $readmore.innerHTML = '<a href="/people/' + data.id + '">' + data.name[lang] + ((lang == 'kr') ? ' 프로필</a> 보기' : ' プロフィール</a>を見る。');
                    }
                } else if (lang == 'en') {
                    if ($readmore) {
                        $readmore.innerHTML = 'Read <a href="/people/' + data.id + '">' + data.name[lang] + '\'s bio</a>';
                    }
                }
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },


        //project - featured
        featured: function($box, $outbox, name, data, subdata) {

            var
            $title = create('<h3 />'),
                $listbox = create('<ul class="list" />'),

                control,

                listdata = data.list,
                i = 0,
                max = listdata.length;

            $box.appendChild($title);
            $outbox.appendChild($listbox);

            for (html = [], i = 0, max = listdata.length; i < max; i++) {
                html.push(
                    '<li class="', (listdata[i].bgcolor || 'bright'), '">',
                    '<p class="img"><img src="', F.getimagesrc(listdata[i].image), '" alt=""></p>',
                    '<div class="text">',
                    '<h4></h4>',
                    '<p class="type1"></p>',
                    '<p class="btn"><a href="/project/', listdata[i].id, '" class="button" data-icon="&#x27A1;"></a></p>',
                    '</div>',
                    '</li>'
                );
            }
            $listbox.innerHTML = html.join('');

            control = F.featured(find('li', $listbox));

            function langset() {

                var $list = find('> li', $listbox);

                for (i = 0, max = $list.length; i < max; i++) {
                    find('h4', $list[i])[0].innerHTML = F.getlanguagedata(listdata[i].title);
                    find('p.type1', $list[i])[0].innerHTML = F.getlanguagedata(listdata[i].description);
                    find('p.btn a', $list[i])[0].innerHTML = labels[lang].list.viewdetail;
                }

                $title.innerHTML = labels[lang].list.featured;
                F.button.set($listbox);

            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: control.resize
            };

        },

        //listbox - project, new, people
        listbox: function($box, $outbox, name, data, subdata) {

            var
            isproject = (name == 'projectlist'),
                isnews = (name == 'newslist'),
                ispeople = (name == 'peoplelist'),

                $title = null,
                $listboxs = [],

                listdata = data.list.slice(),
                catedata = subdata,

                specialmembers = [],

                types = [2, 1, 1, 1, 1],
                numtypes = types.length,
                typeindex = 0,

                control, i, max;


            $box.parentNode.removeChild($box);

            if (isproject) {
                for (i = 0, max = listdata.length; i < max; i++) {
                    addlist(listdata[i].items);
                }
            } else {
                if (ispeople) {
                    for (i = 0, max = listdata.length; i < max; i++) {
                        if (listdata[i].id == 1) { // 3
                            specialmembers[0] = listdata.splice(i, 1)[0];
                            max--;
                        } else if (listdata[i].name.en == 'Park Siyoung') { // psy
                            specialmembers[1] = listdata.splice(i, 1)[0];
                            specialmembers[1].special = 'psy';
                            max--;
                        }
                    }
                    listdata.sort(F.randomsort);
                    specialmembers[0] && listdata.splice(Math.round(Math.random() * 2), 0, specialmembers[0]);
                    specialmembers[1] && listdata.push(specialmembers[1]);
                    //add prefixed item
                    if (fixeditems.people.length) {
                        for (i = 0; i < fixeditems.people.length; i++) {
                            listdata.splice(Math.round((listdata.length / (fixeditems.people.length + 1) * (i + 1))), 0, {
                                id: 1,
                                text: fixeditems.people[i]
                            });
                        }
                    }
                }
                addlist(listdata);
            }

            if (ispeople) {
                control = F.gridlist(
                    $outbox, {
                        x: [1, 2],
                        y: [1, 2]
                    }, {
                        'default': 'auto',
                        mini: 3,
                        mobile: 4,
                        tablet: 6
                    }, {
                        imagesize: [320, 384],
                        numdisplay: 1000
                    }
                );
            } else {
                control = F.gridlist(
                    $outbox, {
                        x: [2, 4],
                        y: [2, 2]
                    }, //( isfeatured )? { x: [2, 4], y: [2, 2] }: { x: [2, 2], y: [1, 2] }, 131224. featured list design change!!! 
                    {
                        'default': 'auto',
                        min: 2,
                        mini: 2,
                        mobile: 4,
                        tablet: 8,
                        notebook: 8
                    }, {
                        textlinemap: (isnews) ? {
                            'default': 5,
                            mini: 3,
                            mobile: 3,
                            tablet: 3
                        } : '',
                        viewtype: (isnews) ? 'zine' : listdefaultview,
                        imagesize: (isnews) ? [640, 383] : '',
                        numdisplay: (isnews) ? 5 : ''
                    }
                );
            }

            (!ispeople) && control.setcategory();
            (isproject) && control.settypebutton();

            function addlist(itemdata) {

                var
                $listbox = create('<ul class="list" />'),
                    i, max;

                if (isnews) {
                    for (i = 0, max = itemdata.length, html = []; i < max; i++) {
                        html.push(
                            '<li data-cate="', itemdata[i].category, '" data-image="', F.getimagesrc(itemdata[i].image), '">',
                            '<img src="', imgroot, 'blank5x3.gif" alt="">',
                            '<span class="clear"></span>',
                            '<span class="cover"></span>',
                            '<span class="txt">',
                            '<strong></strong>',
                            '<span></span>',
                            '<span class="info"></span>',
                            '</span>',
                            '<a href="/news/', itemdata[i].id, '"><span></span></a>',
                            '</li>'
                        );
                    }
                } else if (ispeople) {
                    for (i = 0, max = itemdata.length, html = []; i < max; i++) {
                        if (itemdata[i].name) {
                            html.push(
                                '<li class="type', (itemdata[i].detail) ? 2 : 1, '" data-image="', F.getimagesrc(itemdata[i].image), '"', (itemdata[i].special) ? ' data-special="' + itemdata[i].special + '"' : '', '>',
                                '<span class="clear"></span>', (itemdata[i].detail) ? '<span class="cover"></span>' : '', (itemdata[i].detail) ? '<a href="/people/' + itemdata[i].id + '">' : '<p>',
                                '<span class="txt"><strong></strong><span></span></span>', (itemdata[i].detail) ? '</a>' : '</p>',
                                '</li>'
                            );
                            //prefixed
                        } else {
                            html.push('<li class="type2 peoplefix', itemdata[i].id, '"><span class="txt"><strong></strong></span></li>');
                        }
                    }
                } else {
                    for (i = 0, max = itemdata.length, html = []; i < max; i++) {
                        if (typeindex % numtypes === 0) {
                            types.sort(F.randomsort);
                        }
                        html.push(
                            '<li data-cate="', itemdata[i].category, '" data-image="', F.getimagesrc(itemdata[i].image), '" data-image-h="', F.getimagesrc(itemdata[i].imageh), '" class="type', types[typeindex % numtypes], '">',
                            // '<li data-cate="', itemdata[i].category, '" data-image="', F.getimagesrc(itemdata[i].image), '" data-image-h="', F.getimagesrc(itemdata[i].imageh), '" class="type', Math.ceil(Math.random()*2), '">',
                            '<span class="clear"></span>',
                            '<span class="cover"></span>',
                            '<a href="/project/', itemdata[i].id, '">',
                            '<span class="txt">',
                            '<strong></strong>',
                            '<span></span>',
                            '</span>',
                            '</a>',
                            '</li>'
                        );
                        typeindex++;
                    }
                }

                $listbox.innerHTML = html.join('');
                $outbox.appendChild($listbox);
                $listboxs.push($listbox);

            }

            function getcategorynames(_cates) {
                for (var cates = _cates.split(','),
                        names = [],
                        i = 0, max = cates.length,
                        j, jmax = catedata.length; i < max; i++
                ) {
                    for (j = 0; j < jmax; j++) {
                        if (catedata[j].id == cates[i]) {
                            names.push(catedata[j].name[lang]);
                            break;
                        }
                    }
                }
                return '<kw>' + names.join(',</kw> <kw>') + '</kw>';
            }

            function langset() {

                var
                $list,
                    targetdata,
                    i, max, j, jmax;

                if ($title) {
                    $title.innerHTML = data[lang].h1;
                }

                if (isnews) {
                    $list = find('> li', $listboxs[0]);
                    for (i = 0, max = $list.length; i < max; i++) {
                        find('strong', $list[i])[0].innerHTML = F.getlanguagedata(listdata[i].title);
                        // find('strong+span', $list[i])[0].innerHTML = F.getlanguagedata(listdata[i].description);
                        D.data.set(find('strong+span', $list[i])[0], 'text', F.getlanguagedata(listdata[i].description, true));
                        find('span.info', $list[i])[0].innerHTML = [
                            F.dateformat(listdata[i].date, true), (lang == 'en') ? ' by ' : '',
                            ' <em>', listdata[i].author[lang], '</em>',
                            '<br>',
                            getcategorynames(listdata[i].category)
                        ].join('');
                        find('span.cover', $list[i])[0].innerHTML = '<span class="ssgizmo">&#x1F4F0;</span> ' + labels[lang].list.continuereading;
                    }
                    control.resize();
                } else if (ispeople) {
                    $list = find('> li', $listboxs[0]);
                    for (i = 0, max = $list.length; i < max; i++) {
                        if (listdata[i].name) {
                            find('strong', $list[i])[0].innerHTML = F.getlanguagedata(listdata[i].name, true);
                            find('strong+span', $list[i])[0].innerHTML = F.getlanguagedata(listdata[i].position, true);
                            //prefixed
                        } else {
                            find('strong', $list[i])[0].innerHTML = listdata[i].text[lang];
                        }
                    }
                } else {
                    for (i = 0, max = $listboxs.length; i < max; i++) {
                        targetdata = listdata[i].items;
                        $list = find('> li', $listboxs[i]);
                        for (j = 0, jmax = $list.length; j < jmax; j++) {
                            find('strong', $list[j])[0].innerHTML = F.getlanguagedata(targetdata[j].title);
                            find('strong+span', $list[j])[0].innerHTML = getcategorynames(targetdata[j].category) + '<span> / ' + targetdata[j].client[lang] + ' / ' + listdata[i].year + '</span>';
                        }
                    }
                }

                control.langset && control.langset();

            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: control.scroll,
                resize: control.resize
            };

        },

        listcates: function($box, $outbox, name, data, subdata) {

            var
            isnews = (/^news/).test(name),
                usetypebtn = !isnews,
                $title = create('<h3></h3>', $box),
                $togglebtn = create('<p class="catebtn"><a href="#cates" id="catebtn" class="wi g plus"><span>&nbsp;</span></a></p>', $box),
                $typebtnbox = (usetypebtn) ? create([
                    '<ul id="typebtns" class="types">',
                    '<li><button type="button" class="ssgizmo', (listdefaultview == 'grid') ? ' on' : '', '" data-type="grid"><span></span>&#xE9A3;</button></li>',
                    '<li><button type="button" class="ssgizmo', (listdefaultview == 'line') ? ' on' : '', '" data-type="line"><span></span>&#xE9A1;</button></li>',
                    '</ul>'
                ].join(''), $box) : '',
                $typegrid = find('li:first-child span')[0],
                $typeline = find('li:last-child span')[0],

                $listbox = create('<div id="cates" class="cates"><ul></ul></div>', $outbox),
                $total = create('<p class="total"><strong><span></span> ' + ((name == 'newscategory') ? 'Articles' : 'Projects') + '</strong></p>', $listbox),

                catedata = data,
                numprojects = 0;


            $listbox = $listbox.children[0];
            $total = find('span', $total)[0];

            html = [];
            for (i = 0, max = catedata.length; i < max; i++) {
                html.push(
                    '<li>',
                    '<a href="/project/?type=', catedata[i].id, '" data-cate-id="', catedata[i].id, '" data-cate-length="', catedata[i].length, '">',
                    '<span class="ico">&#xe002;</span><span class="t"></span> <em>', catedata[i].length, '</em>',
                    '</a>',
                    '</li>'
                );
                if (isnews) {
                    numprojects += catedata[i].length;
                }
            }
            if (!numprojects) {
                for (i = 0, max = subdata.length; i < max; i++) {
                    numprojects += subdata[i].items.length;
                }
            }
            html.unshift(
                '<li>',
                '<a href="/project/?type=all" data-cate-id="all" data-cate-length="', numprojects, '">',
                '<span class="ico">&#xe002;</span><span class="t"></span> <em>', numprojects, '</em>',
                '</a>',
                '</li>'
            );
            $listbox.innerHTML = html.join('');

            $total.innerHTML = numprojects;


            function langset() {

                var $names = find('span.t', $listbox);

                //category names
                for (i = 0, max = $names.length; i < max; i++) {
                    $names[i].innerHTML = (!i) ? labels[lang].list.cateall[mode] : catedata[i - 1].name[lang];
                }

                //toggle btn, list type btn
                $title.innerHTML = labels[lang].list.archive[mode];
                find('span', $togglebtn)[0].innerHTML = labels[lang].list.catebtn;
                $typegrid.innerHTML = labels[lang].list.gridview;
                $typeline.innerHTML = labels[lang].list.lineview;

            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        txtgrid2: function($box, $outbox, name, data, subdata) {

            var
            $h3 = create('<h3 />', $box),
                $h4 = create('<h4 />', $box),
                $p = create('<p class="type1" />', $box),
                $listbox = create('<ol class="list" />', $box),
                $list, $h5s, $ps,
                i = 0,
                max = data.list.length,
                html = [];

            for (; i < max; i++) {
                html.push('<li class="c', i + 1, '">');
                if (data.list[i].img) {
                    html.push('<p class="img"><img src="', F.getimagesrc(data.list[i].img), '" alt=""></p>');
                }
                html.push('<h5></h5><p class="type1"></p></li>');
            }
            $listbox.innerHTML = html.join('');
            $list = $listbox.children;
            $h5s = find('h5', $listbox);
            $ps = find('p.type1', $listbox);

            function langset() {
                var $kws;
                $h3.innerHTML = F.getlanguagedata(data.h3);
                $h4.innerHTML = F.getlanguagedata(data.h4);
                $p.innerHTML = F.getlanguagedata(data.p);
                for (i = 0, max = $list.length; i < max; i++) {
                    $h5s[i].innerHTML = F.getlanguagedata(data.list[i].h5);
                    $ps[i].innerHTML = F.getlanguagedata(data.list[i].p);
                }
            }

            if (name == 'ourprocess') {
                classname.add($outbox, 'filled');
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            }

        },

        txtgrid3: function($box, $outbox, name, data, subdata) {

            var
            $h3 = create('<h3 />', $box),
                $h4 = create('<h4 />', $box),
                $p = create('<p class="type1" />', $box),
                $listbox = create('<ul class="list" />', $box),
                $list, $h5s, $ps, $imgs,
                control,
                i = 0,
                max = data.list.length,
                html = [];

            for (; i < max; i++) {
                html.push('<li class="c', Math.floor(i % 3) + 1, ' s', Math.floor(i % 2) + 1, '">');
                if (data.list[i].img) {
                    //html.push('<p class="img"><img src="', F.getimagesrc(data.list[i].img), '" alt=""></p>');
                }
                html.push('<h5></h5><p class="type1"></p>');
                html.push('</li>');
            }
            $listbox.innerHTML = html.join('');
            $list = $listbox.children;
            $h5s = find('h5', $listbox);
            $ps = find('p.type1', $listbox);
            $imgs = find('p.img img', $listbox);

            control = F.pinstyle($listbox, $list, {
                'default': 3,
                mini: 1,
                mobile: 2,
                tablet: 2
            });

            function langset() {
                var $kws;
                $h3.innerHTML = F.getlanguagedata(data.h3);
                $h4.innerHTML = F.getlanguagedata(data.h4);
                $p.innerHTML = F.getlanguagedata(data.p);
                for (i = 0, max = $list.length; i < max; i++) {
                    $h5s[i].innerHTML = F.getlanguagedata(data.list[i].h5);
                    $ps[i].innerHTML = F.getlanguagedata(data.list[i].p);
                }
                resize();
            }

            function resize() {
                var i = 0,
                    max = $imgs.length;
                for (; i < max; i++) {
                    $imgs[i].style.width = $imgs[i].style.height = $imgs[i].parentNode.offsetWidth / 2 + 'px';
                }
                control.resize();
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: resize
            };

        },

        whatwedo: function($box, $outbox, name, data, subdata) {

            var
            $h3 = create('<h3 />', $box),
                $h4 = create('<h4 />', $box),
                $listbox = create('ul', $box),
                $list, $h5s, $ps,
                control, i, max, j, jmax, html;

            for (i = 0, max = data.list.length, html = []; i < max; i++) {
                html.push('<li class="c', Math.floor(i % 3) + 1, ' s', Math.floor(i % 2) + 1, '"><h5></h5><p class="type1"></p><ul>');
                for (j = 0, jmax = data.list[i].items[lang].length; j < jmax; j++) {
                    html.push('<li></li>');
                }
                html.push('</ul></li>');
            }
            $listbox.innerHTML = html.join('');
            $list = $listbox.children;
            $h5s = find('h5', $listbox);
            $ps = find('p', $listbox);

            classname.add($outbox, 'filled');

            function langset() {
                var $sublist;
                $h3.innerHTML = F.getlanguagedata(data.h3);
                $h4.innerHTML = F.getlanguagedata(data.h4);
                for (i = 0, max = $list.length; i < max; i++) {
                    $h5s[i].innerHTML = F.getlanguagedata(data.list[i].h5);
                    $ps[i].innerHTML = F.getlanguagedata(data.list[i].p);
                    $sublist = find('li', $list[i]);
                    for (j = 0, jmax = $sublist.length; j < jmax; j++) {
                        $sublist[j].innerHTML = '• ' + F.getlanguagedata(data.list[i].items)[j];
                    }
                }
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        teamnoffice: function($box, $outbox, name, data, subdata) {

            var
            $inboxs = [],
                $ininboxs = [],
                $h3s = [],
                $h4s = [],
                $ps = [],
                $links = [],
                i = 0;

            for (; i < 2; i++) {
                $inboxs[i] = create('<div class="box filled ' + data.list[i].id + '" />', $box);
                $ininboxs[i] = create('<div class="vabox" />', $inboxs[i]);
                $h3s[i] = create('<h3 />', $ininboxs[i]);
                $h4s[i] = create('<h4 />', $ininboxs[i]);
                $ps[i] = create('<p class="type1" />', $ininboxs[i]);
                $links[i] = create('<p class="link"><a href="' + data.list[i].link + '" class="wi big y right"><span>&nbsp;</span></a></p>', $ininboxs[i]);
            }

            function langset() {
                for (i = 0; i < 2; i++) {
                    $h3s[i].innerHTML = F.getlanguagedata(data.list[i].h3);
                    $h4s[i].innerHTML = F.getlanguagedata(data.list[i].h4);
                    $ps[i].innerHTML = F.getlanguagedata(data.list[i].p);
                    find('span', $links[i])[0].innerHTML = F.getlanguagedata(data.list[i].linktxt);
                }
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        whatwedoes: function($box, $outbox, name, data, subdata) {

            var
            $linebox = create('<div class="linebox" />', $box),
                $h3 = create('<h3 />', $linebox),
                $h4 = create('<h4 />', $linebox),
                $p = create('<p class="type1" />', $linebox),
                $img = create('<p class="img"><img src="' + imgroot + 'bg_whatwedoesin.png" alt=""></p>', $linebox);

            classname.add($outbox, 'filled');

            function langset() {
                $h3.innerHTML = F.getlanguagedata(data.h3);
                $h4.innerHTML = F.getlanguagedata(data.h4);
                $p.innerHTML = F.getlanguagedata(data.p);
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        whoiam: function($box, $outbox, name, data, subdata) {

            var
            $column = create('<p class="type1 column2" />', $box),
                $contacts = create('<div class="contactme" />', $box),
                $sitenmail = create('<p class="sitenmail" />', $contacts),
                $snsicons = create('<ul class="snsicons" />', $contacts),
                key;

            //1. create html to $box
            for (key in data.contact) {
                if (data.contact[key]) {
                    create([
                        '<span class="item"><a href="', (key == 'email') ? 'mailto:' : '', data.contact[key], '" target="_blank"><span class="ssgizmo">', icons[key].icon, '</span> <span class="t">', data.contact[key].replace(/https?:\/\//, ''), '</span></a></span>'
                    ].join(''), $sitenmail);
                }
            }
            for (key in data.sns) {
                if (data.sns[key]) {
                    create([
                        '<li><a href="', data.sns[key], '" target="_blank">',
                        '<span class="txt">', icons[key].name, '</span><span class="sssocial ', key, '"><span>', icons[key].icon, '</span><span>', icons[key].icon, '</span></span>',
                        '</a></li>'
                    ].join(''), $snsicons);
                }
            }

            function langset() {
                $column.innerHTML = F.getlanguagedata(data.ment);
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        imgslide: function($box, $outbox, name, data, subdata) {

            var $mask = create('<div class="mask" />', $outbox),
                $list = create('<ul />', $mask),
                $paging = create('<p class="dotpage" />'),
                $items = [],
                $arrows,
                control, i = 0,
                max = data.list.length;

            for (; i < max; i++) {
                $items[i] = create('<li><img src="' + F.getimagesrc(data.list[i]) + '" alt=""></li>', $list);
            }
            $mask.appendChild($paging);

            // control = F.xlider($mask, $list, $items, $paging, { 'default' : 1 }, { imagename: (data.theme=="bright") ? '' : 'dotpageiny' } );
            control = F.xlider($mask, $list, $items, $paging, {
                'default': 1
            });

            if (subdata && subdata.constructor == Array && subdata[0].indexOf('#') == 0) {
                $arrows = find('button', $outbox);
                for (i = 0, max = $arrows.length; i < max; i++) {
                    find('span.i', $arrows[i])[0].style.color = subdata[0];
                    find('span.t', $arrows[i])[0].style.backgroundColor = (subdata[1] == 'bright') ? '#626262' : '#fff';
                }
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: blankfunction,
                scroll: blankfunction,
                resize: control.resize
            };

        },

        imgslide75: function($box, $outbox, name, data, subdata) {
            var slider = this.imgslide($box, $outbox, name, data, subdata);
            $box.appendChild(find('.mask', $outbox)[0]);
            return {
                box: $box,
                outbox: $outbox,
                langset: slider.langset,
                scroll: slider.scroll,
                resize: slider.resize
            };
        },

        imgslide100: function($box, $outbox, name, data, subdata) {

            var slider = this.imgslide($box, $outbox, name, data, subdata),
                $h3;

            if (data.h3) {
                $h3 = create('<h3 />');
                $outbox.insertBefore($h3, find('div.mask', $outbox)[0]);
            }

            $outbox.removeChild($box);

            function langset() {
                if ($h3) {
                    $h3.innerHTML = data.h3[lang];
                }
                slider.langset();
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: slider.langset,
                scroll: slider.scroll,
                resize: slider.resize
            };

        },

        mycareer: function($box, $outbox, name, data, subdata) {

            var
            $profileimage = create('<p class="profileimage"><img src="' + F.getimagesrc(data.image) + '" alt=""></p>', $box),
                $h3 = create('<h3 />', $box),
                $lists = [],
                $items = [],
                i = 0,
                max = data.list.length,
                j, jmax;

            for (; i < max; i++) {
                create('<h4>' + data.list[i].year + '</h4>', $box);
                $lists[i] = create('<ul />', $box);
                for ($items[i] = [], j = 0, jmax = data.list[i].items[lang].length; j < jmax; j++) {
                    $items[i][j] = create('<li />', $lists[i]);
                }
            }

            classname.add($outbox, 'filled');
            $outbox.style.backgroundImage = 'url(\'' + F.getimagesrc(data.bg || data.bgimage) + '\')';

            function langset() {
                var idata;
                $h3.innerHTML = viewmodedata.name[lang] + ' ' + labels[lang].careers;
                for (i = 0; i < max; i++) {
                    idata = F.getlanguagedata(data.list[i].items);
                    for (j = 0, jmax = idata.length; j < jmax; j++) {
                        $items[i][j].innerHTML = idata[j];
                    }
                }
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        peoplegroup: function($box, $outbox, name, data, subdata) {

            var $h5 = create('<h5 />', $box),
                $list = create('<ul />', $box),
                $items = [],
                $p = create('<p class="type1" />', $box),
                $canvas = document.createElement('canvas'),
                graphsize = 276,
                rounded, i = 0,
                max = data.list.length;

            $canvas.width = $canvas.height = graphsize;

            for (; i < max; i++) {
                rounded = Math.round(data.list[i].percent / 5) * 5;
                $items[i] = create('<li class="c' + (i + 1) + '"><div class="graph">' + data.list[i].percent + '%<img src="' + imgroot + 'img_graph' + rounded + '.png" alt=""></div><span class="text"></span></li>', $list);
                setimagefromcanvas(find('img', $items[i])[0], data.list[i].percent);
                $items[i] = find('span', $items[i])[0];
            }

            function setimagefromcanvas($img, percent) {
                var ctx;
                if ($canvas.getContext) {
                    ctx = $canvas.getContext('2d');
                    ctx.clearRect(0, 0, graphsize, graphsize);
                    ctx.lineWidth = 52;
                    ctx.strokeStyle = 'rgba(98, 98, 98, 0.1)';
                    ctx.beginPath();
                    ctx.arc(138, 138, 112, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.strokeStyle = 'rgba(98, 98, 98, 1)';
                    ctx.beginPath();
                    ctx.arc(138, 138, 112, -Math.PI / 2, -Math.PI / 2 + ((Math.PI * 2) * percent / 100));
                    ctx.stroke();
                    $img.src = $canvas.toDataURL();
                }
            }

            function langset() {
                $h5.innerHTML = F.getlanguagedata(data.h3);
                for (i = 0; i < max; i++) {
                    $items[i].innerHTML = F.getlanguagedata(data.list[i].name);
                }
                $p.innerHTML = F.getlanguagedata(data.p);
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        workspace: function($box, $outbox, name, data, subdata) {

            var $h5 = create('<h5 />', $box),
                //$p = create('<p class="type1" />', $inbox),
                $image = create('<p class="image"><img src="' + F.getimagesrc(data.image) + '" alt=""></p>', $outbox),
                //$more = create('<p class="more"><span class="ssgizmo">&#x002B;<span>More</span></span></p>', $box),
                key;

            function langset() {
                $h5.innerHTML = F.getlanguagedata(data.h3);
                //$p.innerHTML = F.getlanguagedata(data.p);
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        googlemap: function($box, $outbox, name, data, subdata) {

            // create('<div class="text"><h3></h3><p></p></div>', $box);
            create('<div class="map"><iframe src="about:blank" frameborder="0" scrolling="no"></iframe></div>', $outbox);
            $outbox.removeChild($box);

            function langset() {
                // find('h3', $box)[0].innerHTML = F.getlanguagedata(data.h3);
                // find('p', $box)[0].innerHTML = F.getlanguagedata(data.address);
                resize();
            }

            // iframe 로딩 과부하로 최초 한번만 호출함

            function resize() {
                find('iframe', $outbox)[0].src = './map.html?lang=' + lang + '&size=' + sizemode;
            }

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: blankfunction,
                resize: blankfunction
            };

        },

        instagram: function($box, $outbox, name, data, subdata) {

            var $title = create('<h6><span class="i">&#xF641;</span><span class="t">D.Frames</span></h6>', $outbox),
                $imgbox = create('<ul />', $outbox),
                control;

            $outbox.removeChild($box);

            control = F.dframes($title, $imgbox);

            return {
                box: $box,
                outbox: $outbox,
                langset: blankfunction,
                scroll: blankfunction,
                resize: control.resize
            };

        },

        template: function($box, $outbox, name, data, subdata) {

            //console.log($box, $outbox, name, data, subdata);

            //1. create html to $box

            //2. call functions from F

            function langset() {}

            function scroll(scrolltop) {}

            function resize() {}

            return {
                box: $box,
                outbox: $outbox,
                langset: langset,
                scroll: scroll,
                resize: resize
            };

        }

    }

})();
