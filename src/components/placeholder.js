/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description 输入框占位符
 */

Nui.define(['component'], function(component){
    return this.extend(component, {
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
        _template:{
            list:'<%each style%><%$index%>:<%$value%>;<%/each%>',
            wrap:'<strong class="<% className %>" style="<%include \'list\'%>" />',
            elem:'<b style="<%include \'list\'%>"><%text%></b>'
        },
        _init:function(){
            this._exec();
        },
        _exec:function(){
            var that = this, target = that._getTarget();
            if(target){
                var text = that.deftext = target.attr('placeholder');
                if(!that.deftext && that.options.text){
                    target.attr('placeholder', text = that.options.text)
                }
                that.text = Nui.trim(text);
                if(that.val === undefined){
                    that.val = Nui.trim(target.val());
                }
                if(that.text){
                    that._create()
                }
            }
        },
        _create:function(){
            var that = this, opts = that.options, self = that.constructor;
            if(opts.animate || (!opts.animate && !('placeholder' in document.createElement('input')))){
                if(opts.animate){
                    that.target.removeAttr('placeholder')
                }
                var data = that._tplData();
                data.style = {
                    'position':'relative',
                    'display':'inline-block',
                    'width':that.target.outerWidth()+'px',
                    'overflow':'hidden',
                    'cursor':'text'
                }
                that.target.wrap(that._tpl2html('wrap', data))
                that.element = $(that._tpl2html('elem', {
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

                that._events()
            }
            else{
                that._setStyle()
            }
        },
        _setStyle:function(){
            var that = this, opts = that.options;
            that.className = '_placeholder-'+that.__id;
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
            var id = that.__id;
            try{
                sheet.deleteRule(id)
            }
            catch(e){}
            Nui.each(['::-webkit-input-placeholder', ':-ms-input-placeholder', '::-moz-placeholder'], function(v){
                var selector = '.'+that.className+v;
                var rules = 'opacity:1; color:'+(that.options.color||'');
                try{
                    if('addRule' in sheet){
                        sheet.addRule(selector, rules, id)
                    }
                    else if('insertRule' in sheet){
                        sheet.insertRule(selector + '{' + rules + '}', id)
                    }
                }
                catch(e){}
            })
        },
        _events:function(){
            var that = this, opts = that.options, self = that.constructor;
            var pleft = self._getSize(that.target, 'l', 'padding') + self._getSize(that.target, 'l');
            that._on('click', that.element, function(){
                that.target.focus()
            })

            that._on('focus', that.target, function(){
                opts.animate && that.element.stop(true, false).animate({left:pleft+10, opacity:'0.5'});
            })

            that._on('blur change', that.target, function(e, elem){
                that.value();
            })

            that._on('keyup keydown', that.target, function(e, elem){
                Nui.trim(elem.val()) ? that.element.hide() : that.element.show()
            })
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.element){
                that.element.remove();
                that.target.unwrap();
            }
            that.target.val(that.val).removeClass(that.className);
            if(that.deftext){
                that.target.attr('placeholder', that.deftext)
            }
            else{
                that.target.removeAttr('placeholder')
            }
        },
        value:function(val){
            var self = this.constructor, target = this.target;
            var pleft = self._getSize(target, 'l', 'padding') + self._getSize(target, 'l');
            var v = Nui.trim(!arguments.length ? target.val() : target.val(val).val());
            if((!this.options.equal && v === this.text) || !v){
                target.val('');
                this.element && this.element.show();
                if(this.options.animate){
                    this.element.stop(true, false).animate({left:pleft, opacity:'1'})
                }
            }
            else if(this.element){
                this.element.hide()
            }
        }
    })
})
