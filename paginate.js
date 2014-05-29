/*!
 * @author 김승일
 * @email comahead@vi-nyl.com
 * @description 달력 모듈
 */
(function($, core, ui, undefined) {
    var $win = core.$win,
        $doc = core.$doc,
        strUtil = core.string,
        dateUtil = core.date,
        numberUtil = core.number;

    /**
     * @class ui.Paginate
     * @description 페이징모듈
     * @extends ui.View
     */
    ui('Paginate', /** @lends ui.Paginate# */{
        bindjQuery: 'paginate',
        $statics: /** @lends ui.Paginate */{
            ON_CLICK_PAGE: 'paginateclickpage'
        },
        defaults: {
            pageSize: 10,       // 페이지 수
            page: 1,            // 기본 페이지
            totalCount: 0,      // 전체 리스트 수
            paramName: 'page',

            ajax: false,

            firstImgSrc: 'first.gif',
            prevImgSrc: 'prev.gif',
            nextImgSrc: 'next.gif',
            lastImgSrc: 'last.gif'
        },

        events: {
            // 페이지링크 클릭
            'click a, button': function(e) {
                e.preventDefault();

                var me = this,
                    $btn = $(e.currentTarget),
                    page;

                if($btn.hasClass('d-paginate-first')) {
                    // 첫 페이지
                    page = 1;
                } else if($btn.hasClass('d-paginate-prev')) {
                    // 이전 페이지
                    page = Math.max(1, me.page - 1);
                } else if($btn.hasClass('d-paginate-next')) {
                    // 다음 페이지
                    page = Math.min(me.options.totalCount, me.page + 1);
                } else if($btn.hasClass('d-paginate-last')) {
                    // 마지막 페이지
                    page = me.options.totalCount;
                } else {
                    // 클릭한 페이지
                    page = $btn.data('page');
                }

                me.setPage(page);
            }
        },
        selectors: {
            first: '.d-paginate-first',
            prev: '.d-paginate-prev',
            next: '.d-paginate-next',
            last: '.d-paginate-last'
        },
        /**
         *
         * @param el
         * @param options
         */
        initialize: function(el, options) {
            var me = this;

            if(me.callParent(el, options) === false) { return; }

            if(!me.options.ajax){
                throw new Error('ajax 옵션을 지정해 주세요.');
            }

            me._configure();
            me._render();
            me.setPage(me.options.page);
        },

        /**
         * 멤버변수 초기화
         * @private
         */
        _configure: function() {
            var me = this;

            me.page = 1;
            me.currPage = 1;
            me.totalPage = Math.ceil(me.options.totalCount / me.options.pageSize);
        },

        /**
         * 기본 DOM 생성
         * @private
         */
        _render: function() {
            var me = this,
                opts = me.options,
                html = '';

            html += '<ul class="d-paginate-box">'
            html += '<li><button class="d-paginate-first" title="첫 페이지로 이동" ><img src="'+opts.firstImgSrc+'"/></button></li>';
            html += '<li><button href="#" class="d-paginate-prev" title="이전 페이지로 이동" ><img src="'+opts.prevImgSrc+'"/></button></li>';

            html += '<li><ul class="d-paginate-list">';
            html += '</ul></li>';

            html += '<li><button href="#" class="d-paginate-next" title="다음 페이지로 이동" ><img src="'+opts.nextImgSrc+'"/></button></li>';
            html += '<li><button href="#" class="d-paginate-last" title="마지막 페이지로 이동" ><img src="'+opts.lastImgSrc+'"/></button></li>';

            me.$el.html(html);
            me.updateSelectors();
        },

        /**
         * 페이지 번호 DOM 생성
         * @private
         */
        _renderPage: function() {
            var me = this,
                html = '',
                opts = me.options,
                total = opts.totalCount,
                nowPage, start, end;

            me.$first.prop('disabled', total === 0 || me.page === 1);
            me.$prev.prop('disabled', total === 0 || me.page <= 1);
            me.$next.prop('disabled', total === 0 || me.page >= total);
            me.$last.prop('disabled', total === 0 || me.page === total);

            if(total <= 0) {
                me.$el.find('.d-paginate-list').empty();
                me.$items = null;
                return;
            }

            nowPage = Math.floor((me.page - 1) / opts.pageSize);
            if(me.currPage !== nowPage && nowPage < me.totalPage) {
                me.currPage = nowPage;
                start = opts.pageSize * nowPage;
                end = Math.min(opts.totalCount, start + opts.pageSize);
                for (var i = start + 1; i <= end; i++) {
                    html += '<li><a href="#" class="d-paginate-page" data-page="' + i + '" title="' + i + '번째 페이지로 이동">' + i + '</a></li>';
                }

                me.$el.find('.d-paginate-list').empty().html(html);
                me.$items = me.$('.d-paginate-page');
            }

            me.$items.eq((me.page % opts.pageSize) - 1).parent().activeItem('on');
        },

        /**
         * ajax 호출
         * @param {JSON} params 추가파라미터
         * @returns {Deferred}
         * @private
         */
        _ajax: function(params) {
            var me = this,
                opts = me.options;

            if(!opts.ajax){ return; }
            opts.ajax.data = $.extend({}, opts.ajax.data, params);
            return $.ajax(opts.ajax);
        },

        /**
         * ajax 호출 및 해당 페이지번호 활성화
         * @param {Number} page 페이지
         */
        setPage: function(page) {
            var me = this,
                opts = me.options;

            if(page > 0) {
                var params = {},
                    e;

                params[opts.paramName] = page;
                me._ajax(params).done(function(data) {
                    me.page = page;
                    me._renderPage();

                    if((!opts.ajax.dataType || opts.ajax.dataType === 'html') && opts.listTarget) {
                        $(opts.listTarget).html(data);
                    }

                    me.triggerHandler(e = $.Event('paginatecomplete'), {instance: me, page: page, responseData: data});
                });
            }
        },

        /**
         * UI 새로고침
         * @param {JSON} options 변경할 옵션
         */
        update: function(options) {
            var me = this;

            me.options = $.extend({}, me.options, options);
            me._configure();
            me._renderPage();
        },

        release: function() {
            var me = this;

            me.callParent();
        }
    });

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);


