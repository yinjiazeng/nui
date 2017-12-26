/**
 * @author Aniu[2017-12-21 15:12]
 * @update Aniu[2017-12-22 10:17]
 * @version 1.0.1
 * @description input增强
 */

Nui.define(['./placeholder'], function(placeholder){
    return this.extend(placeholder, {
        _options:{
            /**
             * @func 按钮文本是否是图标编码
             * @type <Boolean,String>
             */
            iconfont:false,
            /**
             * @func 是否默认隐藏，鼠标悬停时才显示
             * @type <Boolean>
             */
            hover:false,
            /**
             * @func 按钮始终显示
             * @type <Boolean>
             */
            show:false,
            /**
             * @func 是否显示查看密码按钮
             * @type <Boolean,String,Object>
             */
            reveal:null,
            /**
             * @func 是否显示清除按钮
             * @type <Boolean,String,Object>
             */
            clear:null,
            /**
             * @func 按钮集合
             * @type <Array>
             */
            button:null
        },
        _template:{
            'button':
                '<span style="<%include \'style\'%>">'+
                '<%each button%>'+
                    '<%var style = $value.style%>'+
                    '<i style="<%include \'style\'%>" class="input-button input-<%$value.id%> input-button-<%type%>'+
                    '<%if $value.iconfont%> '+
                    '<%$value.iconfont === true ? "iconfont" : $value.iconfont%>'+
                    '<%/if%>'+
                    '"'+
                    '<%if $value.title%> title="'+
                        '<%if $value.title === true%>'+
                            '<%include \'content\'%>'+
                        '<%elseif typeof $value.title === "object"%>'+
                            '<%$value.title[type]||""%>'+
                        '<%else%>'+
                            '<%$value.title%>'+
                        '<%/if%>"'+
                    '<%/if%>'+
                    '>'+
                    '<%include \'content\'%>'+
                    '</i>'+
                '<%/each%>'+
                '</span>',
            'content':
                '<%if $value.content && typeof $value.content === "object"%>'+
                '<%$value.content[type]||""%>'+
                '<%else%>'+
                '<%$value.content||""%>'+
                '<%/if%>'
        },
        _events:{
            'click .input-clear':'_clear',
            'click .input-reveal':'_reveal',
            'keyup :input':'_input',
            'mouseenter':'_mouseover',
            'mouseleave':'_mouseout'
        },
        _input:function(){
            placeholder.exports._input.call(this);
            var self = this, opts = this._options, val = self.target.val();
            var isHide = (!opts.equal && val === self._text) || !val;
            var type = !isHide ? 'show' : 'hide';
            self._hideElem[type]()
        },
        _mouseover:function(){
            var target = this.target;
            if(!target.prop('readonly') && !target.prop('disabled') && target.val()){
                this._hoverElem.show()
            }
        },
        _mouseout:function(){
            this._hoverElem.hide()
        },
        _condition:function(){
            var opts = this._options;
            if(
                placeholder.exports._condition.call(this) || 
                opts.clear || 
                opts.reveal ||
                opts.button
            ){
                return true
            }
        },
        _createButton:function(hides, hovers){
            var self = this, opts = self._options, button = [], defaults = {}, buttons = {}, caches = {};
            var readonly = self.target.prop('readonly') || self.target.prop('disabled');

            Nui.each(['reveal', 'clear'], function(id){
                var btn = opts[id];
                if(btn){
                    if(typeof btn === 'boolean'){
                        btn = {}
                    }
                    else if(typeof btn === 'string'){
                        btn = {
                            content:btn
                        }
                    }
                    defaults[id] = Nui.extend(true, {}, btn, {id:id})
                }
            })

            if(Nui.type(opts.button, 'Array')){
                Nui.each(opts.button, function(val){
                    if(val){
                        if(typeof val === 'string'){
                            val = {
                                id:val
                            }
                        }
                        var id = val.id, btn = val, def;
                        if(!caches[id]){
                            caches[id] = true;
                            if(def = defaults[id]){
                                btn = $.extend(true, {}, def, val);
                                delete defaults[id]
                            }
                            button.push(btn)
                        }
                    }
                })
            }

            Nui.each(defaults, function(val, id){
                button.push(val)
            })

            Nui.each(button, function(btn){
                if(btn.iconfont === undefined){
                    btn.iconfont = opts.iconfont
                }
                if(btn.hover === undefined){
                    btn.hover = opts.hover
                }
                if(btn.show === undefined){
                    btn.show = opts.show
                }
                if(!btn.style){
                    btn.style = {}
                }
                delete btn.style.display;
                btn.style.display = btn.show === true || (self._val && !readonly) ? 'inline' : 'none';
                if(btn.show !== true){
                    hides.push('.input-'+btn.id)
                    if(btn.hover === true){
                        hovers.push('.input-'+btn.id)
                    }
                }
                self._bindEvent(btn)
            })

            return self._button = button
        },
        _bindEvent:function(btn){
            var self = this, opts = self._options;
            if(typeof btn.callback === 'function'){
                var method = '_callback_'+btn.id;
                self[method] = function(e, elem){
                    btn.callback.call(opts, self, e, elem)
                }
                var methods = self._events['click .input-'+btn.id];
                if(methods){
                    method = Nui.trim(methods.split(method)[0]) + ' ' + method
                }
                self._events['click .input-'+btn.id] = method;
            }
        },
        _createElems:function(){
            var self = this, opts = self._options, _class = self.constructor, hides = [], hovers = [];
            placeholder.exports._createElems.call(self);
            self.$button = $(self._tpl2html('button', {
                button:self._createButton(hides, hovers),
                iconfont:opts.iconfont,
                type:self.target.attr('type') === 'password' ? 'password' : 'text',
                style:Nui.extend({
                    right:_class._getSize(self.target, 'r')+'px'
                }, self._data)
            })).appendTo(self.element);
            self._hideElem = self.element.find(hides.toString());
            self._hoverElem = self.element.find(hovers.toString());
        },
        _option:function(type){
            var data = {};
            Nui.each(this._button, function(v){
                if(v.id === type){
                    data = v;
                    return false
                }
            })
            return data
        },
        _clear:function(e, elem){
            this.value('');
            this.target.focus();
            if(this._option('clear').show !== true){
                elem.hide();
            }
        },
        _reveal:function(e, elem){
            var self = this, type = 'text', data = this._option('reveal');
            if(this.target.attr('type') === 'text'){
                type = 'password'
            }
            //IE8-不允许修改type，因此重新创建新元素
            if(Nui.browser.msie && Nui.browser.version <= 8){
                var html = self.target.prop('outerHTML');
                var regexp = /(type=['"]?)(text|password)(['"]?)/i;
                //IE6下input没有type="text"属性
                if(!regexp.test(html)){
                    html = html.replace(/^(<input)/i, '$1 type="'+ type +'"')
                }   
                else{
                    html = html.replace(regexp, '$1'+type+'$3')
                }
                var newInput = $(html).insertAfter(self.target);
                newInput.val(self.target.val());
                self.target.remove();
                self.target = newInput;
            }
            else{
                this.target.attr('type', type);
            }
            elem.removeClass('input-button-text input-button-password').addClass('input-button-' + type);
            if(data.content && typeof data.content === 'object'){
                elem.html(data.content[type]||'')
            }
            if(data.title && typeof data.title === 'object'){
                elem.attr('title', data.title[type]||'')
            }
        },
        _reset:function(){
            if(this.$button){
                this.$button.remove()
            }
            placeholder.exports._reset.call(this)
        }
    })
}); 