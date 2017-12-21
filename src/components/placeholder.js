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
        _events:{
            'click b':'_focus',
            'focus :input':'_indent',
            'blur :input':'_blur _control',
            'keyup:change :input':'_control'
        },
        _data:{},
        _focus:function(){
            this.target.focus()
        },
        _blur:function(){
            delete this.constructor._active;
        },
        _indent:function(){
            var _class = this.constructor;
            if(this._options.animate && this.$text){
                _class._active = this.target;
                this.$text.stop(true, false).animate({left:this._pLeft+10, opacity:'0.5'});
            }
        },
        _control:function(){
            var val = this.target.val(), _class = this.constructor;
            if((!this._options.equal && val === this._text) || !val){
                this.target.val('');
                if(this.$text){
                    this.$text.show();
                    if(this._options.animate){
                        if(_class._active){
                            this.$text.css({left:this._pLeft+10, opacity:'0.5'})
                        }
                        else{
                            this.$text.stop(true, false).animate({left:this._pLeft, opacity:'1'})
                        }
                    }
                }
            }
            else if(this.$text){
                this.$text.hide()
            }
        },
        _exec:function(){
            var self = this, opts = self._options, target = self._getTarget();
            if(target){
                var text = self._deftext = target.attr('placeholder');
                if(!self._deftext && opts.text){
                    target.attr('placeholder', text = opts.text)
                }
                self._val = target.val();
                if(self._defaultValue === undefined){
                    self._defaultValue = self._val;
                }
                self._text = Nui.trim(text || '');
                self._setData();
                self._create()
            }
        },
        _setData:function(){
            var self = this, _class = self.constructor;
            var isText = self.target.is('textarea');
            var height = self.target.height();
            self._data = {
                top:_class._getSize(self.target, 't', 'padding')+_class._getSize(self.target, 't')+'px',
                height:isText ? 'auto' : height+'px',
                position:'absolute',
                'line-height':isText ? 'normal' : height+'px'
            }
        },
        _create:function(){
            var self = this, opts = self._options, _class = self.constructor;
            if(self._condition()){
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
                if(!self.element){
                    self.element = self.target.wrap(self._tpl2html('wrap', data)).parent();
                }
                self._setPLeft();
                self._createElems();
                self._event()
            }
            else if(self._text && opts.color){
                self._setStyle()
            }
        },
        _condition:function(){
            var opts = this._options;
            return opts.animate || (!opts.animate && !('placeholder' in document.createElement('input')))
        },
        _createElems:function(){
            if(this._text){
                this._createText();
            }
        },
        _createText:function(){
            var self = this, opts = self._options, _class = self.constructor;
            self.$text = $(self._tpl2html('elem', {
                text:self._text,
                style:Nui.extend({
                    left:_class._getSize(self.target, 'l', 'padding')+_class._getSize(self.target, 'l')+'px',
                    color:opts.color,
                    display:self._val ? 'none' : 'inline'
                }, self._data)
            })).appendTo(self.element)
        },
        _setStyle:function(){
            var self = this, opts = self._options;
            self.className = '_nui_'+ self.constructor.__component_name +'_'+self.__id;
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
        _setPLeft:function(){
            var _class = this.constructor;
            this._pLeft = _class._getSize(this.target, 'l', 'padding') + _class._getSize(this.target, 'l');
        },
        _reset:function(){
            var self = this;
            self._off();
            if(self.$text){
                self.$text.remove()
            }
            if(self.target){
                self.target.removeClass(self.className);
                if(self.element){
                    self.target.unwrap();
                    delete self.element
                }
                if(self._options.restore === true){
                    self.target.val(self._defaultValue)
                }
                if(self._deftext){
                    self.target.attr('placeholder', self._deftext)
                }
                else{
                    self.target.removeAttr('placeholder')
                }
            }
        },
        value:function(val){
            var _class = this.constructor, target = this.target;
            if(arguments.length){
                target.val(val)
            }
            target.keyup();
            this._callback('Change');
        }
    })
})
