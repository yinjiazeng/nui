Nui.define('./b','sdfsddfsdf')

/**
 * @filename placeholder.js
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description 输入框占位符
 */

Nui.define('placeholder', ['component', 'util'], function(util){
    return ({
        static:{
            support:function(){
                return util.supportHtml5('placeholder', 'input')
            }
        },
        options:{
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
        tpl:{
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
            that.text = $.trim(that.target.attr('placeholder'));
            return that._create()
        },
        _create:function(){
            var that = this, opts = that.options;
            if(opts.animate){
                that.target.removeAttr('placeholder')
            }
            if(opts.animate || (!opts.animate && !that._self.support())){
                that.target.wrap(that._tpl2html(that.tpl.wrap, {
                        theme:opts.theme,
                        style:{
                            'position':'relative',
                            'display':'inline-block',
                            'width':that.target.outerWidth()+'px',
                            'overflow':'hidden',
                            'cursor':'text'
                        }
                    }))
                that.elem = $(that._tpl2html(that.tpl.elem, {
                        text:that.text,
                        style:(function(){
                            var height = that.target.outerHeight();
                            var isText = that.target.is('textarea');
                            return ({
                                'position':'absolute',
                                'left':util.getSize(that.target, 'l', 'padding')+util.getSize(that.target, 'l')+'px',
                                'top':util.getSize(that.target, 't', 'padding')+util.getSize(that.target, 't')+'px',
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
            return that
        },
        _setStyle:function(){
            var that = this, opts = that.options;
            that.className = 'nui-placeholder-'+that.index;
            that.target.addClass(that.className);
            if(!that._self.style){
                that._createStyle()
            }
            that._createRules()
        },
        _createStyle:function(){
            var that = this;
            var style = document.createElement('style');
            document.head.appendChild(style);
            that._self.style = style.sheet
        },
        _createRules:function(){
            var that = this;
            var sheet = that._self.style;
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
            var that = this, opts = that.options;
            var pleft = util.getSize(that.target, 'l', 'padding') + util.getSize(that.target, 'l');
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
            if(that.elem){
                that.elem.remove();
                that.target.unwrap();
                that.target.attr('placeholder', that.text)
            }
        }
    })
})

Nui.define('{base}demo/placeholder/page',['placeholder'], function(p){
    var require = this.require;
    var b = require('./b');
    return this.exports('./b', {

    })
})
