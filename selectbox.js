;(function() {
  "use strict";
  
		var $dropdown = $();
		
		/**
		 * 커스텀 셀렉트박스
		 * @class
		 * @name Selectbox
		 * @extends View
		 */
		var Selectbox = Class({
			name: 'Selectbox',
			$extend: View,
			/**
			* 옵션 
			* @property {JSON}
			* @name Selectbox#defaults
			*/
			defaults: {
				wrapClasses: '', 
				disabledClass: 'disabled',
				bottomClass: 'bottomHover'
			},
			initialize: function(el, options) {
				var me = this;
				me.supr(el, options);

				me._create();
			},
			_create: function() {
				var me = this;
				
				me.width = me.$el.width();
				me.$el.hide().wrap($('<div class="select_wrap"></div>').addClass(me.options.wrapClasses));
				me.label = $('<span class="select_box"><span class="sel_r" style="width:190px;">&nbsp;</span></span>').insertBefore(me.$el).on('click', '.sel_r', function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					if(me.list != $dropdown) {
						$dropdown.hide();
					} 
					if (!me.label.hasClass(me.options.disabledClass)) {
						$dropdown = me.list.toggle();
						$dropdown.find(':focusable:first').focus();
					}
				});
				me.label.find('.sel_r').css('width', me.width);


				me.list = $('<div class="select_open" style="position:absolute;"><ul></ul><div class="select_bottom"><span></span></div></div>').hide().insertBefore(me.$el).on('click', 'li>a', function(e) {
					e.preventDefault();
					me.selectedIndex($(this).parent().index());
					me.list.toggle();
				}).on('keydown', 'li a', function(e) {
					var index = $(this).parent().index(),
						items = me.list.find('li'),
						count = items.length;

					switch(e.keyCode){
					case $.ui.keyCode.UP:						
						e.stopPropagation();
						e.preventDefault();
						items.eq(Math.max(0, index - 1)).children().focus();
						break;
					case $.ui.keyCode.DOWN:
						e.stopPropagation();
						e.preventDefault();
						items.eq(Math.min(count - 1, index + 1)).children().focus();
						break;
					}
				}).on('keydown', function(e) {
					if(e.keyCode === $.ui.keyCode.ESCAPE) {
						me.list.hide();	
					}
				});

				me.$el.on('change.selectbox', function(e) {
					me.selectedIndex(this.selectedIndex, false);
				});
				
				me.update();
			},

			selectedIndex: function(index, trigger) {
				if (arguments.length === 0) {
					return this.$el[0].selectedIndex;
				}

				var me = this,
					item = me.$el.find('option')
						.prop('selected', false)
						.eq(index).prop('selected', true);

				if (trigger !== false) {
					me.$el.trigger('change', [index]);
				}

				me.list.find('li').removeClass('on').eq(index).addClass('on');
				me.label.children().text(item.text());
			},

			value: function(_value) {
				var me = this;

				if (arguments.length === 0) {
					return me.$el[0].options[me.$el[0].selectedIndex].value;
				} else {
					$.each(me.$el[0].options, function(i, item) {
						if (item.value == _value) {
							me.selectedIndex(i);
							return false;
						}
					});
				}
			},

			update: function() {
				var me = this,
					html = '',
					index = -1,
					text = '';

				$.each(me.$el[0].options, function(i, item) {
					if ($(item).prop('selected')) {
						index = i;
						text = item.text;
					}
					html += '<li><a href="#" data-value="' + item.value + '" data-text="' + item.text + '">' + item.text + '</a></li>';
				});
				me.list.find('ul').empty().html(html).find('li:eq(' + index + ')').addClass('on');
				me.label.children().text(text);

				if (me.$el.prop(me.options.disabledClass)) {
					me.label.addClass(me.options.disabledClass);
				} else {
					me.label.removeClass(me.options.disabledClass);
				}
			},

			destroy: function() {
			  var me = this;

			  me.label.remove();
			  me.list.remove();
			  me.$el.unwrap('<div></div>');
			  me.$el.off('change.selectbox').show();
			}
		});

		$(document).on('click', function(e) {
			$dropdown.hide();
		});
		
})();
