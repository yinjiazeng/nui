Nui.define(function(require){
    this.imports('../assets/components/checkradio/index');

    var component = require('../core/component');

    $.fn.checkradio = function(attr, value){
		if(!attr || $.isPlainObject(attr)){
			var o = $.extend({
				/**
				 * @func 配置开关按钮
				 * @type <Object>
				 */
				switches:{
					off:'',
					on:''
				},
				/**
				 * @func 点击元素状态改变前回调，如返回值为false则将阻止状态改变
				 * @type <Function>
				 * @return <undefined, Boolean>
				 */
				beforeCallback:$.noop,
				/**
				 * @func 点击元素状态改变后回调
				 * @type <Function>
				 */
				callback:$.noop
			}, attr||{});
			return this.each(function(){
				var me = $(this);
				var checkradio = me.closest('.ui-checkradio');
				if(!checkradio.length){
					return;
				}
				var checked = me.prop('checked') ? ' s-checked' : '';
				var disabled = me.prop('disabled') || me.prop('readonly') ? ' s-dis' : '';
				var name = me.attr('name');
				var switches = $.extend({}, o.switches, me.data()||{});
				var switchElem = checkradio.find('.text');
				var type = 'radio';
				if(me.is(':checkbox')){
					type = 'checkbox';
				}
				if(checkradio.children().attr('checkname')){
					checkradio.children().attr('class', 'ui-'+ type + checked + disabled);
				}
				else{
					if(switches.off && switches.on){
						checkradio.addClass('ui-switches');
						switchElem = $('<s class="text">'+ (me.prop('checked') ? switches.on : switches.off) +'</s>').insertBefore(me);
					}
					me.css({position:'absolute', top:'-999em', left:'-999em', opacity:0}).wrap('<i></i>');
					checkradio.wrapInner('<em class="ui-'+ type + checked + disabled +'" checkname="'+ name +'"></em>')
					.children().click(function(e){
						var ele = $(this);
						if(me.prop('disabled') || me.prop('readonly') || o.beforeCallback(me, e) === false){
							return;
						}
						if(me.is(':checkbox')){
							var checked = me.prop('checked');
							me.prop('checked', !checked);
							ele[(checked ? 'remove' : 'add') + 'Class']('s-checked');
							if(switchElem.length){
								switchElem.text(checked ? switches.off : switches.on);
							}
						}
						else{
							if(me.prop('checked')){
								return
							}
							me.prop('checked', true);
							$('.ui-radio[checkname="'+ name +'"]').removeClass('s-checked');
							ele.addClass('s-checked');
						}
						o.callback(me, e)
					});
				}
				if(o.init && !me.prop('disabled') && !me.prop('readonly') && o.beforeCallback(me) !== false){
					o.callback(me, 'init')
				}
			});
		}
		else{
			return $(this).prop(attr, value == true).checkradio();
		}
    }
})