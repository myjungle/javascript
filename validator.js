;(function(){
  "use strict";
  
		var ruleRegex = /^(.+?)\(([^\)]+)\)?$/,
			numericRegex = /^[0-9]+$/,
			integerRegex = /^\-?[0-9]+$/,
			floatRegex = /^\-?[0-9]*\.?[0-9]+$/,
			emailRegex = /[\S]+@[\w-]+(.[\w-]+)+/,
			alphaRegex = /^[a-z]+$/i,
			alphaNumericRegex = /^[a-z0-9]+$/i,
			alphaDashRegex = /^[a-z0-9_\-]+$/i,
			numberRegex = /^[1-9][0-9]+$/i,
			numericDashRegex = /^[0-9\-]+$/,
			urlRegex = /^(http|https|ftp)\:\/\/[a-z0-9\-\.]+\.[a-z]{2,3}(:[0-9]*)?\/?[a-z0-9\-\._\?\,\'\/+&amp;%\$#\=~]*$/i,
			phoneRegex = /^[0-9]{2,4}\-?[0-9]{3,4}\-?[0-9]{4}$/i,
			korRegex = /^[가-힝]+$/;

		var messages = {
			required: '필수입력 항목입니다.',
			match:'동일한 값이어야 합니다.',
			email: '이메일 형식이 잘못 되엇습니다.',
			url: 'URL 형식이 잘못 되었습니다.',
			min_chars: '유효하지 않은 길이입니다.',
			max_chars: '유효하지 않은 길이입니다.',
			exact_chars: '유효하지 않은 길이입니다.',
			alpha: '유효하지 않은 값입니다.',
			alpha_numeric: '유효하지 않은 값입니다.',
			numeric: '유효하지 않은 값입니다.',
			integer: '유효하지 않은 값입니다.',
			decimal: '유효하지 않은 값입니다.(예: -0.2)',
			kor: '한글만 입력해 주세요.',
			file_exts: '유효하지 않은 확장자입니다.',
			ssn: '잘못된 주민등록번호입니다.'
		};

		/**
		 * 폼밸리데이터
		 * @class
		 * @name MELON.WEBSVC.FormValidator
		 */
		var FormValidator = Class({
			name: 'Validator',
			defaults:{},
			/**
			 * 생성자
			 * @function
			 * @MELON.PBPGN.FormValidator#initialize
			 * @param {jQuery} el 노드
			 * @param {Object} options 옵션
			 */
			initialize: function(el, options) {
				var me = this;
				
				me.$el = el instanceof jQuery ? el : $(el);
				me.options = $.extend({}, me.defaults, options);
				me.messages = me.handlers = {};
				me.fields = me.errors = {};

				// ready
				$.each(me.$el[0].elements, function(i, eitem) {
					var $item = $(eitem),
						rules;
					if (!$item.is(':disabled, :hidden') && (rules = $item.attr('data-valid-rules'))) {
						me.fields[$item.attr('name')] = rules;
					}
				});
				me.fields = $.extend(me.fields, me.options.fields || {});
			},

			_clearPlaceholder: function() {
				var me = this,
					elems = me.$el[0].elements,
					ph;

				for(var i = 0, el; el = elements[i++]; ){
					if((ph = el.getAttribute('placeholder')) && ph === el.value) {
						el.value = '';
					}
				}
			},

			_generateRule: function(rule) {
					var pairs = ruleRegex.exec(rule);
					
					return {
						name: pairs && pairs[1] || rule,
						params: (pairs && pairs[2] && pairs[2].replace(/\s/g, '').split(',')) || []
					};
			},

			/**
			 * 실행
			 * @function
			 * @MELON.PBPGN.FormValidator#run
			 */
			run: function() {
				return this._validate();
			},

			_validate: function(e) {
				var me = this,
					fields = me.fields,
					els = me.$el[0].elements,
					rules, rule, el;

				for(var name in fields) { if (fields.hasOwnProperty(name)) {
					rules = fields[name].split('|');
					for(var i = 0, len = rules.length; i < len; i++) {
						rule = me._generateRule(rules[i]), el = els[name];
						if (me._valid[rule.name] && (me._valid[rule.name].apply(me, [el].concat(rule.params)) === false)) {
							messages[rule.name] && alert(messages[rule.name]);
							el.focus(); el.select();
							return false;
						}
					}
				}}
			},

			_valid: {
				required: function(el) {
					var val = el.value,
						form = el.form;

					if (el.type === 'checkbox' || el.type === 'radio') {
						return el.checked === true;
					}

					return !!val;
				},
				match: function(el, targetName) {
					var target = el.form[targetName];
					if (target) {
						return el.value === target.value;
					}
					return false;
				},
				email: function(el) {
					return emailRegex.test(el.value);
				},
				url: function(el) {
					return urlRegex.test(el.value);
				},
				min_chars: function(el, len) {
					return el.value.length >= parseInt(len, 10);
				},
				max_chars: function(el, len) {
					return el.value.length <= parseInt(len, 10);
				},
				exact_chars: function(el, len) {
					return el.value.length === parseInt(len, 10);
				},
				alpha: function(el) {
					return alphaRegex.test(el.value);
				},
				alpha_numeric: function(el) {
					return alphaNumericRegex.test(el.value);
				},
				numeric: function(el) {
					return numericRegex.test(el.value);
				},
				integer: function(el) {
					return integerRegex.test(el.value);
				},
				decimal: function(el) {
					return decimalRegex.test(el.value);
				},
				kor: function(el) {
					return korRegex.test(el.value);
				},
				file_exts: function(el, exts) {
					var types = exts.split('|'),
						ext = el.value.substr(el.value.lastIndexOf('.') + 1);
					for(var i = 0, len = types.length; i < len; i++) {
						if(ext === types[i]) {
							return true;
						}
					}
					return false;
				},
				ssn: function(el, other) {
					var val = el.value + (other && other.value);
					return WEBSVC.valid.SSN(val);
				}
			}
		});

})();
