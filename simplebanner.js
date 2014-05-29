	core.define('ui.SimpleBanner', function() {
		var SimpleBanner = Class({
			name: 'SimpleBanner',
			$extend: rockjs.ui.View,
			$statics: {
				ON_SLIDE_END: 'slideend'
			},
			defaults: {
				start: 0,
				interval: 3000,
				useFade: true,
				autoStart: true
			},
			selectors: {
				items: 'li',
				indicators: 'a.d_indicator'
			},
			events: {
				'click .d_btn_ctrl': function(e) {
					e.preventDefault();
					var me = this,
						$this = $(e.currentTarget);

					if($this.hasClass('pre')){
						me.prev();
					} else if($this.hasClass('stop')){
						me.stop();
					} else if($this.hasClass('play')){
						me.play();
					} else if($this.hasClass('next')){
						me.next();
					}
				}
			},
			initialize: function(el, options) {
				var me = this;
				if(me.callParent(el, options) === false) { me.destroy(); return; }
				me._current = 0;
				me._count = me.$items.length;

				if(me._count === 0) { me.destroy(); eturn; }

				me.$indicators.on('click', function(e) {
					e.preventDefault();
					me.select($(this).parent().index());
				});

				me.select(me.options.start);
				me.options.autoStart && me.play();
			},
			select: function(index) {
				var me = this;
				if (index < 0) { index = me._count - 1; }
				else if(index >= me._count) { index = 0; }

				me.$items.removeClass('on').eq(index).addClass('on');
				me.$indicators.removeClass('on').eq(index).addClass('on');
				me._current = index;

				me.trigger('slideend', [index]);
			},
			play: function() {
				var me = this;
				if(me.timer) { return; }

				me.timer = setInterval(function() {
					me.next();
				}, me.options.interval);

				me.$el.find('.d_btn_ctrl.play').replaceClass('play', 'stop').children().html('정지');
				me.trigger('play');
			},
			stop: function() {
				var me = this;
				if(me.timer) { 
					clearInterval(me.timer);
					me.timer = null;
				}

				me.$el.find('.d_btn_ctrl.stop').replaceClass('stop', 'play').children().html('재생');
				me.trigger('stop');
			},
			prev: function() {
				var me = this;
				
				me.select(me._current - 1);
			},
			next: function() {
				var me = this;

				me.select(me._current + 1);
			}
		});

		core.bindjQuery(SimpleBanner, 'simpleBanner');

		return SimpleBanner;
	});
