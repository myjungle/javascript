(function($, core, ui, undefined) {
	"use strict";

	var _map = nhn.api.map;


	ui('NaverMap', {
		defaults: {
			icon: {
				src: 'http://static.naver.com/maps2/icons/pin_spot2.png',
				size: [28, 37],
				offset: [14, 37]
			},
			map: {
				defaultPoint: [37.5675451, 126.9773356], 
				zoom : 12,
				enableWheelZoom : true,
				enableDragPan : true,
				enableDblClickZoom : false,
				mapMode : 0,
				minMaxLevel : [ 1, 14 ]	
			},
			infoWindow: {
				show: true,
				tmpl: '<div id="info<%-areaId%>" class="d-map-info" style="border:1px solid black;width:100px;height:20px;background:#fff;cursor:default;">'+
								'<%=areaId%>: <%=title%> <a href="#" class="d-close">X</a>'+
								'</div>',
				position: {right : 5, top : 20}
			},
			size: [600, 400],
			showZoomControl: true
		},
		initialize: function(el, options) {
			var me = this;
			if(me.callParent(el, options) === false) { return; }

			me.list = [];

			me._createMap();
			me._bindMapEvents();

		},

		_createMap: function() {
			var me = this,
				opts = me.options;

			_map.setDefaultPoint('LatLng');
			me.map = new _map.Map(me.$el[0], $.extend({}, 
				opts.map,
				{
					size : new _map.Size(opts.size[0], opts.size[1])		
				}
			));

			//
			me.icon =  new _map.Icon(opts.icon.src,  
				new _map.Size(opts.icon.size[0], opts.icon.size[1]), 
				new _map.Size(opts.icon.offset[0], opts.icon.offset[1]));

			//
			me.label = new _map.MarkerLabel(); // - 마커 라벨 선언.
			me.map.addOverlay(me.label); // - 마커 라벨 지도에 추가. 기본은 라벨이 보이지 않는 상태로 추가됨.

			// 
			if(opts.infoWindow.show) {
				me.infoWindow = new _map.InfoWindow();
				me.map.addOverlay(me.infoWindow);
				me.infoTmpl = core.template(opts.infoWindow.tmpl);
			}

			if(opts.showZoomControl) {
				var oSlider = new _map.ZoomControl();
				me.map.addControl(oSlider);
				oSlider.setPosition({
						top : 10,
						left : 10
				});
			}

		},

		_bindMapEvents: function() {
			var me = this,
				opts = me.options;

			me.map.attach('mouseenter', function(oCustomEvent) {
					var oTarget = oCustomEvent.target;
					// 마커위에 마우스 올라간거면
					if (oTarget instanceof _map.Marker) {
							var oMarker = oTarget;
							////me.infoWindow.setVisible(false);
							me.label.setVisible(true, oMarker); // - 특정 마커를 지정하여 해당 마커의 title을 보여준다.
					}
			});

			me.map.attach('mouseleave', function(oCustomEvent) {
					var oTarget = oCustomEvent.target;
					// 마커위에서 마우스 나간거면
					if (oTarget instanceof _map.Marker) {
							me.label.setVisible(false);
					}
			});

			if(opts.infoWindow.show) {
				me.infoWindow.attach('changeVisible', function(oCustomEvent) {
					if (oCustomEvent.visible) {
						me.label.setVisible(false);
					}
				});

				me.$el.on('click', '.d-map-info .d-close', function(e) {
					e.preventDefault();					
					me.infoWindow.setVisible(false);
				});
			}

			me.map.attach('click', function(oCustomEvent) {
					// 겹침 마커 클릭한거면
					if (oCustomEvent.clickCoveredMarker) {
						return;
					}

					var oPoint = oCustomEvent.point;
					var oTarget = oCustomEvent.target;

					// 마커를 클릭했을 때.
					if (oTarget instanceof _map.Marker) {
							// 겹침 마커를 클릭했을 때.
							//if (oCustomEvent.clickCoveredMarker) {
							//		return;
							//}
							if(opts.infoWindow.show) {
								if(me.infoWindow.getVisible()) {
									me.infoWindow.setVisible(false);
								}
								
								var data = me.find({'oMarker': oTarget});
								if(!data){ return; }
								if(me.currAreaId === data.areaId) {
									me.currAreaId = undefined;
									return;
								}

								me.currAreaId = data.areaId;
								me.infoWindow.setContent(me.infoTmpl(data));
								me.infoWindow.setPoint(oTarget.getPoint());
								me.infoWindow.setVisible(true);
								me.infoWindow.setPosition(me.options.infoWindow.position);
								me.infoWindow.autoPosition();
							}

							me.triggerHandler('clickedmarker', data);
					} else {
							if(me.infoWindow.getVisible()) {
								me.infoWindow.setVisible(false);
							}
					}
			});
		},

		find: function(obj) {
			var me = this,
				i = 0,
				code = 'var res = false; for(var i = 0; i < list.length; i++) { if(';
			core.each(obj, function(v, k) {
				if(i++ > 0) { code += ' && '; }
				code += 'obj.'+k+' === list[i].'+k;
			});
			code += '){ res = list[i]; break; }} return res;';

			var fn = new Function('obj', 'list', code);
			return fn(obj, me.list);
		},

		setCenter: function(oPoint) {
			this.map.setCenter(oPoint);
		},

		addMarkers: function(list) {
			core.each(list, function(item) {
				this.addMarker(item);
			}.bind(this));
		},

		addMarker: function(item) {		
			if(this.find({x: item.x, y: item.y})) { return; }

			var me = this,
				oPoint = new _map.LatLng(item.x, item.y),
				oMarker = new _map.Marker(me.icon, { title : item.title  });

			////oMarker.data = item;
			item.oMarker = oMarker;

			/////me.list.push(oMarker);
			me.list.push(item);
			oMarker.setPoint(oPoint);
			me.map.addOverlay(oMarker);
			if(me.list.length === 1) {
				me.map.setCenter(oPoint);
			}
		}

	});

})(jQuery, window[LIB_NAME], window[LIB_NAME].ui);

var map = new emart.ui.NaverMap('#map');
map.addMarkers([{x:37.5679451, y:126.9777356, title: '청담점', areaId: 123},
						 {x:37.5675451, y:126.9773356, title: '성수점', areaId: 623},
						 {x:37.5675451, y:126.9773356, title: '성수점', areaId: 623},
						 {x:37.5675451, y:126.9773356, title: '성수점', areaId: 623}]);
