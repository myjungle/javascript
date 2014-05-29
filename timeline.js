;(function(){
  "use strict";
  
		var Timeline = Class({
			name: 'Timeline',
			$extend: View,
			defaults: {
			},
			selectors: {
				items: 'li'
			},

			/**
			 * 생성자
			 * @function
			 * @name Timeline#initialize
			 */
			initialize: function(el, options) {
				var me = this;

				if(me.supr(el, options) === false) { return; }

				me.update();
				me.on('update', me.update.bind(me));
			},

			/**
			 * 각 아이템의 위치를 시간순으로 좌우에 배치
			 * @function
			 * @name Timeline#update
			 */
			update: function() {
				var me = this,
					$items = me.$items,
					arr = [],
					data = {
						left: 0,
						right: 0,
						center: 0
					},
					arrowHeight = 20;

				function calcPosition(i, height, min, max) {
					var top = data[min] <= data.center ? (data.center - data[min]) : 0;

					arr[i] = {
						className: min,
						marginTop: 0, 
						height: height, 
						top: top
					};

					data.center = data[min] + arrowHeight + top;
					data[min] += height;

					if (data.center >= data[min]) {
						arr[i].top -= (arr[i].marginTop = data.center - data[min]);
						data[max] += arr[i].marginTop;
						data.center -= arr[i].marginTop;
					}
				}

				$items.each(function(i){
					var $li = $(this).css({'height': 'auto', 'marginTop': ''}).removeClass('left right'),
						$span = $li.find('span'),
						height = $li[0].offsetHeight;

					if (data.left <= data.right) {
						calcPosition(i, height, 'left', 'right');
					} else {
						calcPosition(i, height, 'right', 'left');
					}
				});
				data = null;

				$items.each(function(i){
					var item = arr[i];
					$(this).addClass(item.className).css({'marginTop': item.marginTop, 'height': item.height}).find('span').css({'top': item.top});
				});
			}
		});


})();  
