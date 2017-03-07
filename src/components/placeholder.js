/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description 输入框占位符
 */

Nui.define(['util'], function(util){
    var support = util.supportHtml5('placeholder', 'input');
    return this.extands('component', {
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
        _tpl:{
            wrap:'<strong \
                    class="nui-placeholder{{if theme}} t-placeholder-{{theme}}{{/if}}" style="\
                    {{each style val key}}\
                        {{key}}:{{val}};\
                    {{/each}}\
                    " />',
            elem:'<b style="\
                    {{each style val key}}\
                        {{key}}:{{val}};\
                    {{/each}}\
                    ">{{text}}</b>'
        },
        _init:function(){
            var that = this;
            that.target = that._getTarget();
            if(that.target){
                that._exec();
            }
        },
        _exec:function(){
            var that = this;
            var text = that.deftext = that.target.attr('placeholder');
            if(!that.deftext && that.options.text){
                that.target.attr('placeholder', text = that.options.text)
            }
            that.text = $.trim(text);
            if(that.text){
                that._create()
            }
        },
        _create:function(){
            var that = this, opts = that.options, self = that.constructor;
            if(opts.animate){
                that.target.removeAttr('placeholder')
            }
            if(opts.animate || (!opts.animate && !support)){
                that.target.wrap(that._tpl2html(that._tpl.wrap, {
                        theme:opts.theme,
                        style:{
                            'position':'relative',
                            'display':'inline-block',
                            'width':that.target.outerWidth()+'px',
                            'overflow':'hidden',
                            'cursor':'text'
                        }
                    }))
                that.elem = $(that._tpl2html(that._tpl.elem, {
                        text:that.text,
                        style:(function(){
                            var height = that.target.outerHeight();
                            var isText = that.target.is('textarea');
                            return ({
                                'position':'absolute',
                                'left':self.getSize(that.target, 'l', 'padding')+self.getSize(that.target, 'l')+'px',
                                'top':self.getSize(that.target, 't', 'padding')+self.getSize(that.target, 't')+'px',
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
            $.each(['::-webkit-input-placeholder', ':-ms-input-placeholder', '::-moz-placeholder'], function(k, v){
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
            var pleft = self.getSize(that.target, 'l', 'padding') + self.getSize(that.target, 'l');
            that._on('click', that.elem, function(){
                that.target.focus()
            })

            that._on('focus', that.target, function(){
                opts.animate && that.elem.stop(true, false).animate({left:pleft+10, opacity:'0.5'});
            })

            that._on('blur change', that.target, function(){
                var val = $.trim(that.target.val());
                if((!opts.equal && val == that.text) || !val){
                    that.target.val('');
                    that.elem.show();
                    opts.animate && that.elem.stop(true, false).animate({left:pleft, opacity:'1'})
                }
                else{
                    that.elem.hide()
                }
            })

            that._on('keyup keydown', that.target, function(){
                $.trim(that.target.val()) ? that.elem.hide() : that.elem.show()
            })

            that.target.blur()
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
