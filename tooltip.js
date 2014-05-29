;(function() {
  "use strict";
  
		var Tooltip = Class({
			name: 'Tooltip',
			$extend: View,
			defaults: {
				interval: 300
			},
			initialize: function(el, options) {
				var me = this;

				if(me.supr(el, options) === false) { return; }
				
				me.$tooltip = ($btn.attr('data-tooltip-target') ? $($btn.attr('data-tooltip-target')) : $btn.next('.d_tooltip'));
				me.isShown = false;
				me.timer = null;

				// 마우스가 버튼위에서 .3초이상 머물었을 때만 툴팁이 표시되며, 
				// 마우스가 버튼과 툴팁박스를 완전히 벗어나서 .3초가 지났을 때만 툴팁이 사라지도록 처리 
				// 마우스가 닿을 때마다 보였다안보였다하는 건 너무 난잡해 보여서...
				me.on('focusin mouseenter', me.open.bind(me)).on('mouseleave focusout', me.close.bind(me));

				$tooltip.on('focusin mouseenter', function() {
					if(me.$tooltip.data('timer')) {
						clearTimeout(me.$tooltip.data('timer')), me.$tooltip.removeData('timer');
					}
				}).on('focusout mouseleave', function() {
					me.isShown && me.$tooltip.data('timer', setTimeout(function(){
						me.isShown = false, me.$tooltip.hide();
						if(me.$tooltip.data('timer')) {
							clearTimeout(me.$tooltip.data('timer')), me.$tooltip.removeData('timer');
						}
					}, me.options.interval));
				});
			},

			open: function() {
				var me = this,
					offset = me.$el.offset();

				offset.top += me.$el.height();

				me.timer = setTimeout(function() {
					me.$tooltip/*.css(offset)*/.fadeIn('fast');
					me.isShown = true;
				}, me.options.interval);
			},

			close: function() {
				var me = this;

				if (me.isShown) {
					me.$tooltip.data('timer', setTimeout(function(){
						me.isShown = false;
						me.$tooltip.hide();
					}, me.options.interval));
				} else {
					clearTimeout(me.timer), me.timer = null;
				}
			}
		});
		
})();
