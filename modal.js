;(function() {
  "use strict";
  
		/**
		 * 모달 클래스
		 * @class
		 * @name Modal
		 * @extends View
		 */
		var Modal = Class({
			name: 'Modal',
			$extend: View,
			$statics: {
				active: null,

				/**
				 * 다이얼로그창이 표시되기 전에 호출(이벤트 핸들러 내부에서 e.preventDefault()를 실행하면 다이얼로그창이 열리지 않는다.)
				 * @static
				 */
				ON_BEFORE_SHOW: 'beforeshow',
				/**
				 * 다이얼로그창이 표시된 후 발생
				 * @static
				 */
				ON_SHOW: 'show',
				/**
				 * 모달창이 열릴 때 발생
				 * @static
				 */
				ON_MODAL_OPEN: 'modalopen',
				/**
				 * 다이얼로그창이 닫히기 전에 발생(이벤트 핸들러 내부에서 e.preventDefault()를 실행하면 다이얼로그창이 닫히지 않는다.)
				 * @static
				 */
				ON_BEFORE_HIDE: 'beforehide',
				/**
				 * 모달창이 숨겨질 때 발생
				 * @static
				 */
				ON_HIDE: 'hide',
				/**
				 * 모달창이 닫힐 때 발생
				 * @static
				 */
				ON_CLOSE: 'modalclose'
			},
			/**
			* 옵션 
			* @property {JSON}
			* @name Modal#defaults
			*/
			defaults: {
				targetOnClose: null,						// 닫힐 때 포커스를 줄 타겟
				mask: true,									// 오버레이 표시 여부
				containerId: 'melonModal',			// 모달창 id
				containerCss: {},							// 모달창 css
				overlayId: 'melonOverlay',				// 오버레이 id
				overlayOpacity: 0.6,						// 오버레이 투명도
				overlayCss: {},								// 오버레이 css
				overlayClose: false,						// 오버레이를 클릭했을 때 모달창이 닫히게 할것인지 여부
				draggable: true,							// 모달창 드래그 여부
				dragHandle: '.box_layerwrap>h1',	// 드래그될 대상 셀렉터
				zindex: 9999,								// 모달창의 zindex
				autoResize: false,							// 내부내용에 따라 자동 리사이징 여부
				autoPosition: true,						// 자동으로 화면가운데에 위치시킬 것인지 여부
				preventScroll: true,						// 모달창이 떠있는 상태에서의 페이지스크롤링 여부
				clone: false,									// 모달 대상을 복제시켜서 뛰울 것인지 여부
				minWidth: 150,							// 모달창의 최소너비
				minHeight: 100,							// 모달창의 최소두께

				buttons: [
					{
						text: '취소',
						className: 'd_close',
						role: 'cancel'
					}
				]
			},
			/**
			* 템플릿 
			* @property {String} 모달창의 컨테이너 템플릿
			* @name Modal#template
			*/
			template: [
				'<div class="melon-modal container-modal" style="background-color:transparent;width:200px;height:auto;">',
				'</div>'
			].join(''),
			/**
			* 이벤트 핸들러 
			* @property {JSON}
			* @name Modal#events
			*/
			events: {
				'click button[data-role]': function (e) {
					var me = this,
						$btn = $(e.currentTarget),
						role = ($btn.attr('data-role') || ''),
						e;
					
					if (role) {
						me.trigger(e = $.Event(role), [me]);
						if(e.isDefaultPrevented()){
							return;
						}
					}
					
					this.close();
				}
			},
			/**
			 * 생성자
			 * @function
			 * @name Modal#initialize
			 * @param {String|Element|jQuery} el
			 * @param {Object} options
			 */
			initialize: function (el, options) {
				Modal.close();
				Modal.active = this;

				var me = this,
					target,
					con = $(me.template).appendTo('body').addClass('d_modal');

				me.supr(con, options);
				me.isShown = false;

				me._appendContent($(el));
				me._initModal(); // reposition by resize
				me._layout(me.options);
				me.trigger('created');
				me.open();
			},

			/**
			 * 컨텐츠 로드
			 * @function
			 * @private
			 * @name Modal#_appendContent
			 * @param {String|Element|jQuery} el
			 */
			_appendContent: function(el) {
				var me = this;

				if ( me.options.clone ) {
					me.$content = el.clone(true).appendTo(me.$el).show();					
				} else {
					me._oriDisplay = el.css('display');
					if(!el.hasClass('d_temp_modal')) {
						me._placeholder = $('<span style="display:none"></span>').insertBefore(el);
					}
					me.$content = el.css('display', '').appendTo(me.$el);
				}
				me.$content.addClass('d_modal_popup');
			},

			/**
			 * 초기화 작업
			 * @function
			 * @private
			 * @name Modal#_initModal
			 */
			_initModal: function () {
				var me = this,
					buttons = me.options.buttons || {},
					html = '';

				if(me.options.title){
					me.setTitle(me.options.title);
				}

				me.on('click.modal', '.d_close', function(e) {
					e.stopPropagation();

					me.close();
				});
			},

			/**
			 * 제목 설정
			 * @function
			 * @name Modal#setTitle
			 * @param {String} title 제목
			 */
			setTitle: function(title) {
				var me = this;

				me.$el.find('h1:first').html(title);
			},

			/**
			 * 레이아웃 관련 처리
			 * @function
			 * @private
			 * @name Modal#_layout
			 * @param {JSON} options 모달 옵션
			 */
			_layout: function (options) {
				var me = this,
					css = options.containerCss;

				me._width || (me._width = me.$content.width());
				me._height || (me._height = me.$content.height());

				css['width'] = Math.max(options.width || me._width, options.minWidth);
				css['height'] = Math.max(options.height || me._height, options.minHeight);

				if ('left' in options) {
					me.autoPosition = false;
					css['left'] = options.left;
				}

				if ('top' in options) {
					me.autoPosition = false;
					css['top'] = options.top;
				}

				css.zIndex = 9999; //me.options.zIndex;
				//console.log(css);
				me.$el.css(css);

				if (options.draggable && options.dragHandle && !me.draggabled) {
					me.draggabled = true;
					me.draggable(options.dragHandle);
				} else {
					me.draggable('cancel');
				}

				if (WEBSVC.isIE6 && !me.bgframed) {
					me.bgframed = true;
					me._createIFrame();
				}

				me.options.autoPosition && $win.on('resizeend.melonModal', function (e) {
					if (!me.isShown) return;
					me.center();
				});

				me.options.mask && $win.on('resize.melonModal', function() {
					if (!me.isShown) return;
					me.$overlay.css({'height': $doc.height(), 'width': $doc.width()});
				});
			},

			/**
			 * 모달창 표시, 오버레이 생성, 포커싱 이벤트 바인딩
			 * @function
			 * @name Modal#open
			 */
			open: function () {
				var me = this;

				me.overlay();
				me.show();
				me._enforceFocus();

				me.trigger('modalopen');
			},

			/**
			 * 모달창 닫기
			 * @function
			 * @name Modal#close
			 */
			close: function () {
				var me = this,
					e;

				me.trigger(e = $.Event('modalclose'));
				if(e.isDefaultPrevented()) {
					return;
				}

				if(me._closed){ return; }
				me._closed = true;

				me.hide();

				// 기본위치로 복구
				if (!me.options.clone && me._placeholder){
					me.$content
						.removeData(this.name.replace(/^[a-z]/i, function(s){ return s.toLowerCase(); }))
						.css('display', me._oriDisplay)
						.insertBefore(me._placeholder);
					me._placeholder.remove();
					me._placeholder = null;
				} else {
					me.$content.remove();
					me.$content = null;
				};

				Modal.superclass.destroy.call(me);
				me.$overlay.add(me.$el).off().remove();
				$doc.off('.modal');
				$win.off('.melonModal');
			},

			/**
			 * 오버레이 생성
			 * @function
			 * @name Modal#overlay
			 */
			overlay: function () {
				var me = this,
					options = me.options;

				if (!options.mask) {
					me.$overlay = $();
					return;
				}

				if(!('opacity' in options)) {
					options.opacity = "0.6";
				}

				me.$overlay = $('<div class="melon-overlay"></div>').css({
					"z-index": 9998,
					"filter": "alpha(opacity=" + ((options.opacity) * 100) + ")",
					"opacity": options.opacity,
					"-moz-opacity": options.opacity,
					"position": "absolute",
					"top": 0,
					"left": 0,
					'width': $doc.width(),
					'height': $doc.height(),
					"background-color": "#fff",
					"display": "none"
				}).appendTo('body');

				if (options.overlayClose) {
					me.$overlay.on('click.modal', function () {
						me.close();
					});
				}
			},

			/**
			 * 모달창 표시
			 * @function
			 * @name Modal#show
			 */
			show: function () {
				var me = this,
					e = $.Event('beforeshow');

				me.trigger(e);
				if (me.isShown || e.isDefaultPrevented()) return;

				WEBSVC.PubSub.trigger('hide:modal');

				me.isShown = true;
				me._escape();

				//
				//$('body>div:first').attr('aria-hidden', 'true');
				me._scrolling(false);
				me.$overlay.show();
				me.$el.show();
				me.center();
				me.$el.find(':focusable:first').focus();
				me.trigger('show');
			},

			/**
			 * 모달창 숨기기
			 * @function
			 * @name Modal#hide
			 */
			hide: function () {
				var me = this,
					e = $.Event('hide');

				me.trigger(e);
				if (!me.isShown || e.isDefaultPrevented()) return;


				me.isShown = false;
				me.$overlay.hide();
				me.$el.hide();
				me._escape();
				me._scrolling(true);
				//$('body>div').removeAttr('aria-hidden');
				
				if(me.options.targetOnClose) {
					$(me.options.targetOnClose).focus();
				}
			},
			
			/**
			 * 토글링
			 * @function
			 * @name Modal#toggle
			 */
			toggle: function () {
				return this[!this.isShown ? 'show' : 'hide'];
			},

			/**
			 * 드래그 이벤트 바인딩
			 * @function
			 * @name Modal#draggable
			 * @param {String} handler 드래그 핸들러 셀렉터
			 */
			draggable: function (handler) {
				var me = this;

				me.$el.find(handler).css('cursor', 'move');
				me.$el.draggable({
					handle: handler,
					containment: "body"
				});
			},

			/**
			 * 모달창을 화면 가운데에 위치
			 * @function
			 * @name Modal#center
			 */
			center: function () {
				var me = this,
					options = me.options;

				if (!options.autoPosition) {
					return;
				}
				
				var $content = me.$el.find('.d_modal_popup');
				var width = Math.max($content.width(), options.minWidth),
					height = Math.max($content.height(), options.minHeight);

				me.$el.css({
					'position': 'fixed',
					'width': width,
					'height': height,
					'left': options.left || (($win.innerWidth() - width) >> 1),
					'top': options.top || (($win.innerHeight() - height) >> 1)
				});
			},

			/**
			 * 페이지 스크롤링 방지
			 * @function
			 * @private
			 * @name Modal#_scrolling
			 * @param {Boolean} scroll 스크롤링 허용 여부
			 */
			_scrolling: function (scroll) {
				var me = this;
				if (!me.options.preventScroll) {
					return;
				}
			},

			/**
			 * 아이프레임 생성(레이어가 플래쉬 밑에 가려지는 현상으로 인해...ie6)
			 * @function
			 * @private
			 * @name Modal#_createIFrame
			 */
			_createIFrame: function () {
				var me = this;

				if (WEBSVC.isIE6) {
					$('<iframe></iframe>').attr({
						'src': 'javascript:;',
						'scrolling': 'no',
						'frameborder': '0',
						'allowTransparency': 'true'
					}).css({
						'border': 'none',
						'width': '100%',
						'display': 'block',
						'height': '100%',
						'overflow': 'hidden'
					}).appendTo(me.$el);
				}
			},
			/**
			 * 포커싱 강제 이동: 모달창이 뜬 상태에서는 포커스가 모달내에서만 움직이도록 포커스이벤트 바인딩
			 * @function
			 * @private
			 * @name Modal#_enforceFocus
			 */
			_enforceFocus: function () {
				var me = this;

				$doc.on('focusin.modal', function (e) {
					if (me.$el[0] !== e.target && !me.$el.has(e.target).length) {
						me.$el.attr('tabindex', 0).focus();
					}
				});
			},

			/**
			 * ESCAPE키를 눌렀을 때 모달창이 닫히도록 키이벤트 바인딩
			 * @function
			 * @private
			 * @name Modal#_escape
			 */
			_escape: function () {
				var me = this;
				if (me.isShown) {
					$doc.on('keyup.modal', function (e) {
						e.which == 27 && me.close();
					})
				} else if (!me.isShown) {
					$doc.off('keyup.modal');
				}
			}
		});

		Modal.close = function (e) {
			if (!Modal.active) return;
			if (e) e.preventDefault();
			Modal.active.close();
			Modal.active = null;
		};
		
})();
