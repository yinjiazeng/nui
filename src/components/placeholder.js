/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description 输入框占位符
 */

Nui.define(['util'], function(util){
    var module = this;
    var support = util.supportHtml5('placeholder', 'input');
    return module.extend('component', {
        options:{
            /**
             * @func 输入框占位提示文本，若元素上含有placeholder属性将会覆盖该值
             * @type <String>
             */
            text:'',
            /**
             * @func 是否启用动画显示展示
             * @type <Boolean>
             */
            animate:false,
            /**
             * @func 输入框值是否可以和占位符相同
             * @type <Boolean>
             */
            equal:false,
            /**
             * @func 占位符文本颜色
             * @type <String>
             */
            color:'#ccc'
        },
        _tpllist:module.renders({
            <%each style%><%$index%>:<%$value%>;<%/each%>
        }),
        _tplwrap:module.renders({
            <strong class="ui-placeholder<%if theme%> t-placeholder-<%theme%><%/if%>" style="<%include '_tpllist'%>" />
        }),
        _tplelem:module.renders({
            <b style="<%include '_tpllist'%>"><%text%></b>
        }),
        _init:function(){
            this._exec();
        },
        _exec:function(){
            var that = this;
            that.target = that._getTarget();
            if(that.target){
                var text = that.deftext = that.target.attr('placeholder');
                if(!that.deftext && that.options.text){
                    that.target.attr('placeholder', text = that.options.text)
                }
                that.text = Nui.trim(text);
                if(that.text){
                    that._create()
                }
            }
        },
        _create:function(){
            var that = this, opts = that.options, self = that.constructor;
            if(opts.animate || (!opts.animate && !support)){
                if(opts.animate){
                    that.target.removeAttr('placeholder')
                }
                that.target.wrap(that._tpl2html(that._tplwrap, {
                        theme:opts.theme,
                        style:{
                            'position':'relative',
                            'display':'inline-block',
                            'width':that.target.outerWidth()+'px',
                            'overflow':'hidden',
                            'cursor':'text'
                        }
                    }))
                that.elem = $(that._tpl2html(that._tplelem, {
                        text:that.text,
                        style:(function(){
                            var height = that.target.outerHeight();
                            var isText = that.target.is('textarea');
                            return ({
                                'display':Nui.trim(that.target.val()) ? 'none' : 'inline',
                                'position':'absolute',
                                'left':self._getSize(that.target, 'l', 'padding')+self._getSize(that.target, 'l')+'px',
                                'top':self._getSize(that.target, 't', 'padding')+self._getSize(that.target, 't')+'px',
                                'height':isText ? 'auto' : height+'px',
                                'line-height':isText ? 'normal' : height+'px',
                                'color':opts.color
                            })
                        })()
                    })).insertAfter(that.target)

                that._event()
            }
            else{
                that._setStyle()
            }
        },
        _setStyle:function(){
            var that = this, opts = that.options;
            that.className = 'nui-placeholder-'+that.index;
            that.target.addClass(that.className);
            if(!that.constructor.style){
                that._createStyle()
            }
            that._createRules()
        },
        _createStyle:function(){
            var that = this;
            var style = document.createElement('style');
            document.head.appendChild(style);
            that.constructor.style = style.sheet
        },
        _createRules:function(){
            var that = this;
            var sheet = that.constructor.style;
            var index = that.index;
            try{
                sheet.deleteRule(index)
            }
            catch(e){}
            Nui.each(['::-webkit-input-placeholder', ':-ms-input-placeholder', '::-moz-placeholder'], function(v){
                var selector = '.'+that.className+v;
                var rules = 'opacity:1; color:'+(that.options.color||'');
                try{
                    if('addRule' in sheet){
                        sheet.addRule(selector, rules, index)
                    }
                    else if('insertRule' in sheet){
                        sheet.insertRule(selector + '{' + rules + '}', index)
                    }
                }
                catch(e){}
            })
        },
        _event:function(){
            var that = this, opts = that.options, self = that.constructor;
            var pleft = self._getSize(that.target, 'l', 'padding') + self._getSize(that.target, 'l');
            that._on('click', that.elem, function(){
                that.target.focus()
            })

            that._on('focus', that.target, function(){
                opts.animate && that.elem.stop(true, false).animate({left:pleft+10, opacity:'0.5'});
            })

            that._on('blur change', that.target, function(e, elem){
                var val = Nui.trim(elem.val());
                if((!opts.equal && val === that.text) || !val){
                    elem.val('');
                    that.elem.show();
                    opts.animate && that.elem.stop(true, false).animate({left:pleft, opacity:'1'})
                }
                else{
                    that.elem.hide()
                }
            })

            that._on('keyup keydown', that.target, function(e, elem){
                Nui.trim(elem.val()) ? that.elem.hide() : that.elem.show()
            })
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.elem){
                that.elem.remove();
                that.target.unwrap();
            }
            that.target.removeClass(that.className);
            if(that.deftext){
                that.target.attr('placeholder', that.deftext)
            }
            else{
                that.target.removeAttr('placeholder')
            }
        }
    })
})
