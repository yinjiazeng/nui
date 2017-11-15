/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description 输入框占位符
 */

Nui.define(['../core/component'], function(component){
    return this.extend(component, {
        _options:{
            /**
             * @func 输入框占位提示文本，若元素上含有placeholder属性将会覆盖该值
             * @type <String>
             */
            text:'',
            /**
             * @func 是否启用动画形式展示
             * @type <Boolean>
             */
            animate:false,
            /**
             * @func 输入框值是否可以和占位符相同
             * @type <Boolean>
             */
            equal:false,
            /**
             * @func 销毁或者重置组件是否还原默认值
             * @type <Boolean>
             */
            restore:true,
            /**
             * @func 占位符文本颜色
             * @type <String>
             */
            color:'#ccc',
            /**
             * @func 调用value方法后执行回调
             * @type <Function>
             */
            onChange:null
        },
        _template:{
            list:'<%each style%><%$index%>:<%$value%>;<%/each%>',
            wrap:'<strong class="<% className %>" style="<%include \'list\'%>" />',
            elem:'<b style="<%include \'list\'%>"><%text%></b>'
        },
        _exec:function(){
            var self = this, opts = self._options, target = self._getTarget();
            if(target){
                var text = self._deftext = target.attr('placeholder');
                if(!self._deftext && opts.text){
                    target.attr('placeholder', text = opts.text)
                }
                if(self._val === undefined){
                    self._val = Nui.trim(target.val());
                }
                if(self._text = Nui.trim(text)){
                    self._create()
                }
            }
        },
        _create:function(){
            var self = this, opts = self._options, _class = self.constructor;
            if(opts.animate || (!opts.animate && !('placeholder' in document.createElement('input')))){
                if(opts.animate){
                    self.target.removeAttr('placeholder')
                }
                var data = self._tplData();
                data.style = {
                    'position':'relative',
                    'display':'inline-block',
                    'width':self.target.outerWidth()+'px',
                    'overflow':'hidden',
                    'cursor':'text'
                }
                self.target.wrap(self._tpl2html('wrap', data))
                self.element = $(self._tpl2html('elem', {
                        text:self._text,
                        style:(function(){
                            var height = self.target.outerHeight();
                            var isText = self.target.is('textarea');
                            return ({
                                'display':Nui.trim(self.target.val()) ? 'none' : 'inline',
                                'position':'absolute',
                                'left':_class._getSize(self.target, 'l', 'padding')+_class._getSize(self.target, 'l')+'px',
                                'top':_class._getSize(self.target, 't', 'padding')+_class._getSize(self.target, 't')+'px',
                                'height':isText ? 'auto' : height+'px',
                                'line-height':isText ? 'normal' : height+'px',
                                'color':opts.color
                            })
                        })()
                    })).insertAfter(self.target)

                self._events()
            }
            else{
                self._setStyle()
            }
        },
        _setStyle:function(){
            var self = this, opts = self._options;
            self.className = '_placeholder-'+self.__id;
            self.target.addClass(self.className);
            if(!self.constructor.style){
                self._createStyle()
            }
            self._createRules()
        },
        _createStyle:function(){
            var self = this;
            var style = document.createElement('style');
            document.head.appendChild(style);
            self.constructor.style = style.sheet
        },
        _createRules:function(){
            var self = this;
            var sheet = self.constructor.style;
            var id = self.__id;
            try{
                sheet.deleteRule(id)
            }
            catch(e){}
            Nui.each(['::-webkit-input-placeholder', ':-ms-input-placeholder', '::-moz-placeholder'], function(v){
                var selector = '.'+self.className+v;
                var rules = 'opacity:1; color:'+(self._options.color||'');
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
            var self = this, opts = self._options, _class = self.constructor;
            var pleft = _class._getSize(self.target, 'l', 'padding') + _class._getSize(self.target, 'l');
            self._on('click', self.element, function(){
                self.target.focus()
            })

            self._on('focus', self.target, function(){
                opts.animate && self.element.stop(true, false).animate({left:pleft+10, opacity:'0.5'});
            })

            self._on('blur change', self.target, function(e, elem){
                self.value();
            })

            self._on('keyup keydown', self.target, function(e, elem){
                Nui.trim(elem.val()) ? self.element.hide() : self.element.show()
            })
        },
        _reset:function(){
            var self = this;
            self._off();
            if(self.element){
                self.element.remove();
                self.target.unwrap();
            }
            if(self._options.restore === true){
                self.target.val(self._val)
            }
            self.target.removeClass(self.className);
            if(self._deftext){
                self.target.attr('placeholder', self._deftext)
            }
            else{
                self.target.removeAttr('placeholder')
            }
        },
        value:function(val){
            var _class = this.constructor, target = this.target;
            var pleft = _class._getSize(target, 'l', 'padding') + _class._getSize(target, 'l');
            var v = Nui.trim(!arguments.length ? target.val() : target.val(val).val());
            if((!this._options.equal && v === this.text) || !v){
                target.val('');
                this.element && this.element.show();
                if(this._options.animate){
                    this.element.stop(true, false).animate({left:pleft, opacity:'1'})
                }
            }
            else if(this.element){
                this.element.hide()
            }
            this._callback('Change');
        }
    })
})
