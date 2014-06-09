;(function($, core, ui, undefined){
   "use strict";
   
  	ui('FixedBottom', {
		bindjQuery: 'fixedBottom',
		defaults: {
			minWidth: 1000,
			offsetTarget: ''
		},
		initialize: function(el, options) {
			var me = this;
			if(me.callParent(el, options) === false){ return; }

			if(me.options.offsetTarget){
				me.$offsetTarget = $(me.options.offsetTarget);
			}

			me.winHeight = core.util.getWinHeight();
			me.winWidth = core.util.getWinWidth();
			me.scrollTop = core.$win.scrollTop();
			me.scrollLeft = core.$win.scrollLeft();
			me._bindEvents();
			me._reposition();
		},
		_bindEvents: function() {
			var me = this,
				$win = core.$win,
				util = core.util;

			$win.on('resize.'+me.cid, function() {
				me.winHeight = $win.innerHeight(); //util.getWinHeight();
				me.winWidth = $win.innerWidth(); //util.getWinWidth();
				me._reposition();
			}).on('scroll.'+me.cid, function() {				
				me.scrollTop = $win.scrollTop();
				me.scrollLeft = $win.scrollLeft();
				me._reposition();
			}).triggerHandler('resize.'+me.cid);
		},

		_reposition: function() {
			var me = this,
				$win = core.$win,
				util = core.util,
				opts = me.options,

				docHeight = util.getDocHeight(),
				scrollHeight = me.scrollTop + me.winHeight, //docHeight - footerHeight,
				contentHeight = me.$offsetTarget ? me.$offsetTarget.offset().top : docHeight;

			me.$el.css({
				left: -me.scrollLeft,
				bottom: contentHeight >= scrollHeight ? 0 :  (scrollHeight - contentHeight),
				width: Math.max(opts.minWidth, me.winWidth)
			});
		}
	});

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui); 
