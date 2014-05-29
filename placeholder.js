;(function() {
  "use strict";
  
		/**
		 * placeholder를 지원하지 않는 IE7~8상에서 placeholder효과를 처리하는 클래스
		 * @class
		 * @name Placeholder
		 * @example
		 * new Placeholder( $('input[placeholder]'), {});
		 * // 혹은 jquery 플러그인 방식으로도 호출 가능
		 * $('input[placeholder]').placeholder({});
		 */
		var Placeholder = Class({
			name: 'Placeholder',
			$extend: View,
			/**
			 * 생성자 
			 * @function
			 * @name Placeholder#initialize
			 * @param {String|Element|jQuery} el 해당 엘리먼트(노드, id, jQuery 어떤 형식이든 상관없다)
			 * @param {Object} options 옵션값
			 */
			initialize: function (el, options) {
				var me = this,
					is = 'placeholder' in tmpInput;

				if ( is ) { return; }

				if(me.supr(el, options) === false) { return; }
				me.placeholder = me.$el.attr('placeholder');
				me.$el.trimVal() === '' && me.$el.val(me.placeholder);
				me.on('focusin click', function () {
					var $this = $(this);

					if ($this.val() === me.placeholder) {
						this.value = '';
					}
				}).on('focusout', function () {
					var $this = $(this);
					if ($this.trimVal() === '') {
						this.value = me.placeholder;
					}
				});
			},

			/**
			 * 파괴자 : 자동으로 호출되지 않으므로, 직접 호출해주어야 한다.
			 * @function
			 * @name Placeholder#destroy
			 */
			destroy: function () {
				var me = this;

				me.$el.removeData();
				me.supr();
			}
		});

		if(!('placeholder' in tmpInput)) {
			$doc.on('submit.plaeholder', 'form', function(e) {
				$('input[placeholder], textarea[placeholder]').each(function() {
					if ($(this).attr('placeholder') === this.value) {
						this.value = '';
					}
				});
			});
		}

  
})();
