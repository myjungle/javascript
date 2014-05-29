;(function() {
  "use strict";
  
		var browser = WEBSVC.browser,
			byteLength = WEBSVC.string.byteLength,
			charsByByte = WEBSVC.string.charsByByte;

		/**
		 * 입력제한 기능을 담당하는 클래스
		 * @class
		 * @name TextCounter
		 * @example
		 * new TextCounter( $('input.d_textcounter'), {});
		 * // 혹은 jquery 플러그인 방식으로도 호출 가능
		 * $('input.d_textcounter').textcounter({});
		 */
		var TextCounter = Class({
			name: 'TextCounter',
			$extend: View,
			defaults: {
				limit: 100 // 최대 글자 수(바이트)
			},

			/**
			 * 생성자 
			 * @function
			 * @name TextCounter#initialize
			 * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
			 * @param {Object} options 옵션값
			 */
			initialize: function(el, options) {
				this.supr(el, options);

				var me = this;

				me.currentLength = 0;
				me.placeholder = me.$el.attr('placeholder');

				if (browser.isGecko) {
					me._forceKeyup();
				}

				me.on('keydown keyup cut paste blur', function(e) {
					var isOver = me._checkLimit();

					if (e.type === 'keyup') {
						if (isOver) {
							alert('입력하신 글자 수가 초과되었습니다.');
							this.focus();
						}
					}
					me.trigger('textchange', [me.currentLength]);
				});
				me._checkLimit();
				me.trigger('textchange', [me.currentLength]);
			},

			_checkLimit: function() {
				var me = this,
					o = me.options,
					isOver = false;

				me.currentLength = byteLength(me.$el[0].value);
				if (me.currentLength > o.limit) {
					me._truncateValue();
					isOver = true;
				}
				return isOver;
			},

			/**
			 * 텍스트박스의 문자열이 제한길이를 초과했을 경우, 자르는 역할을 담당 
			 * @function
			 * @private
			 * @name TextCounter#_truncateValue
			 */
			_truncateValue: function() {
				var me = this,
					$el = me.$el,
					value = browser.isOldIE && $el[0].value === me.placeholder ? '' : $el[0].value  ,
					limit = me.options.limit,
					chars = 0;

				if (limit < me.currentLength) {
					chars = charsByByte(value, limit);
					$el[0].value = value.substring(0, chars);
					me.currentLength = limit;
				}
			},

			/**
			 * 파이어폭스에서 한글을 입력할 경우, keyup이벤트가 발생하지 않는 버그가 있어서,
			 * timeout를 이용하여 value값이 변경됐을 때 강제로 keyup를 이벤트 날려주는 로직을 설정하는 함수
			 * @function
			 * @private
			 * @name TextCounter#_forceKeyup
			 */
			_forceKeyup: function() {
				// 파이어폭스에서 한글을 입력할 때 keyup이벤트가 발생하지 않는 버그가 있어서 
				// 타이머로 value값이 변경된걸 체크해서 강제로 keyup 이벤트를 발생시켜 주어야 한다.
				var me = this,
					$el = me.$el,
					el = $el[0],
					prevValue,
					win = window,
					doc = document,

					// keyup 이벤트 발생함수: 크로스브라우징 처리
					fireEvent = (function(){
						if (doc.createEvent) {
							// anti ie
							return function(){
								var e;
								if (win.KeyEvent) {
									e = doc.createEvent('KeyEvents');
									e.initKeyEvent('keyup', true, true, win, false, false, false, false, 65, 0);
								} else {
									e = doc.createEvent('UIEvents');
									e.initUIEvent('keyup', true, true, win, 1);
									e.keyCode = 65;
								}								
								el.dispatchEvent(e);
							};
						} else {
							// ie: :(
							return function() {
								var e = doc.createEventObject();
								e.keyCode = 65;								
								el.fireEvent('onkeyup', e);
							};
						}
					})();

				me.timer = null;

				me.on('focus', function(){
					if (me.timer){ return; }
					me.timer = setInterval(function() {
						if (prevValue !== el.value) {
							prevValue = el.value;
							fireEvent();
						}
					}, 60);
				}).on('blur', function(){
					if (me.timer){ 
						clearInterval(me.timer);
						me.timer = null;
					}
				});
			},

			/**
			 * 파괴자 : 자동으로 호출되지 않으므로, 직접 호출해주어야 한다.
			 * @function
			 * @name TextCounter#destroy
			 */
			destroy: function() {
				var me = this;

				me.timer && clearInterval(me.timer);
				me.supr();
			}
		});

		bindjQuery(TextCounter, 'textCounter');
		return TextCounter;
	});

	WEBSVC.define('PBPGN.TextControl', function () {	
		/**
		 * textarea, input에서 글자수 체크 및 자동리사이징 처리를 담당하는 클래스
		 * @class
		 * @name TextControl
		 * @example
		 * new TextControl( $('textarea'), {counting: true});
		 * // or
		 * $('textarea').textControl({counting: true});
		 */	
		var TextControl = Class({
			name: 'TextControl',
			$extend: View,
			$statics: {
				ON_INIT: 'init',
				ON_UPDATE: 'update'
			},
			defaults: {
				counting: false,
				limit: 100,
				limitTarget: '',
				autoResize: false,
				allowPaste: false
			},
			/**
			 * 생성자 
			 * @function
			 * @name TextControl#initialize
			 * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
			 * @param {Object} options 옵션값
			 */
			initialize: function (el, options) {
				var me = this;

				if(me.supr(el, options) === false) { return; }

				me._initTextControl();
				me.trigger(TextControl.ON_INIT);
			},

			/**
			 * 초기화 작업
			 * @function
			 * @private
			 * @name TextControl#_initTextControl
			 */
			_initTextControl: function () {
				var me = this,
					o = me.options;

				// 붙여넣기 
				if (!o.allowPaste) {
					me.on('paste', function (e) {
						e.preventDefault();
						alert("죄송합니다. \n도배글 등을 방지하기 위해 붙여넣기를 하실 수 없습니다.");
					});
				}

				// 자동 리사이징
				if (me.$el.is('textarea') && o.autoResize) {
					me._autoResize();
				}

				// 입력글자 수 체크
				if (o.counting) {
					// subviews에다 설정하면 destroy가 호출될 때, subviews에 들어있는 컨트롤들의 destroy도 알아서 호출해준다.
					me.subviews.counter = new TextCounter(me.$el, {
						limit: o.limit,
						on: {
							'textchange': (function() {
								var $limitTarget = $(me.options.limitTarget);
								return function(e, len) {
									$limitTarget.html('<strong>' + len + '</strong> / ' + o.limit + '자');
								};
							}())
						}
					});
				}
			},

			/**
			 * 텍스트박스의 리사이징을 위한 초기화 작업 담당
			 * @function
			 * @private
			 * @name TextControl#_autoResize
			 */
			_autoResize: function() {
				var me = this,
					$clone, oriHeight, offset = 0;
				me.$el.css({overflow: 'hidden', resize: 'none'/*, height: 'auto'*/});

				$clone = me.$el.clone().val('').appendTo(me.$el.parent());
				oriHeight = $clone.height();
				$clone[0].scrollHeight; // for ie6 ~ 8

				if ($clone[0].scrollHeight !== oriHeight) {
					offset = $clone.innerHeight() - oriHeight;
				}
				$clone.hide();

				me.on('keyup change input paste', function(){ 
					this._layout(this, this.$el, $clone, oriHeight, offset);
				}.bind(me));
				me._layout(me, me.$el, $clone, oriHeight, offset);
			},

			/**
			 * 텍스트박스의 scrollHeight에 따라 height를 늘려주는 역할을 담당
			 * @function
			 * @private
			 * @name TextControl#_layout
			 */
			_layout: function(me, $el, $clone, initialHeight, offset) {
				var current = $el.val(), 
					prev = me.prevVal, 
					scrollHeight, height;

				if ( current === prev ) { return; }
				me.prevVal = current;

				$clone.val(current).show()[0].scrollHeight; // for IE6-8
				scrollHeight = $clone[0].scrollHeight;
				height = scrollHeight - offset;
				$clone.hide();

				$el.height(height = Math.max(height, initialHeight));
				me.trigger(TextControl.ON_UPDATE, [height]);
			},

			/**
			 * 파괴자 : 자동으로 호출되지 않으므로, 직접 호출해주어야 한다.
			 * @function
			 * @name TextControl#destroy
			 */
			destroy: function () {
				var me = this;

				me.supr();
			}
		});
		
})();

