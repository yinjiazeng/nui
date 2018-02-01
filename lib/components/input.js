/**
 * @author Aniu[2017-12-21 15:12]
 * @update Aniu[2017-12-22 10:17]
 * @version 1.0.1
 * @description input增强
 */

Nui.define(function(require, imports){
    imports('../assets/components/input/index');

    var placeholder = require('./placeholder');

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
            button:null,
            /**
             * @func 最大长度
             * @type <Boolean,Number,Object>
             */
            limit:null
        },
        _template:{
            'button':
                '<span class="con-input-wrap<%if textarea%> con-input-wrap-textarea<%/if%>" style="<%include \'style\'%>">'+
                '<%each button%>'+
                    '<%var style = $value.style%>'+
                    '<i style="<%include \'style\'%>" class="con-input-button con-input-<%$value.id%> con-input-type-<%type%>'+
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
                '<%/if%>',
            'limit':
                '<span class="con-input-limit"<%if style%> style="<%include \'style\'%>"<%/if%>><b><%count%></b>/<%max%></span>'
        },
        _events:{
            'click .con-input-clear':'_clear',
            'click .con-input-reveal':'_reveal',
            'mouseenter':'_mouseover',
            'mouseleave':'_mouseout'
        },
        _input:function(e, elem, data){
            var self = this;
            placeholder.exports._input.call(self);
            if(self._hideElem){
                var opts = this._options, val = self._val;
                var isHide = (!opts.equal && val === self._text) || !val;
                var type = !isHide ? 'show' : 'hide';
                self._hideElem[type]();
                if(data && !self._hover && self._hoverElem){
                    self._hoverElem.hide()
                }
            }
            if(!!self.$limit){
                self._count()
            }
        },
        _mouseover:function(){
            var target = this.target, elems = this._hoverElem;
            this._hover = true;
            if(elems && !target.prop('readonly') && !target.prop('disabled') && target.val()){
                elems.show()
            }
        },
        _mouseout:function(){
            var elems = this._hoverElem;
            if(elems){
                delete this._hover;
                elems.hide()
            }
        },
        _condition:function(){
            var opts = this._options;
            if(
                placeholder.exports._condition.call(this) || 
                opts.clear || 
                opts.reveal ||
                opts.button ||
                opts.limit
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
                    hides.push('.con-input-'+btn.id)
                    if(btn.hover === true){
                        hovers.push('.con-input-'+btn.id)
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
                var methods = self._events['click .con-input-'+btn.id];
                if(methods){
                    method = Nui.trim(methods.split(method)[0]) + ' ' + method
                }
                self._events['click .con-input-'+btn.id] = method;
            }
        },
        _count:function(){
            var self = this, count = self._getCount(), limit = self._limit, max = limit.max, val = self._val, value = '';
            if(count > max){
                if(limit.cn){
                    count = 0;
                    for(var i=0; i<max; i++){
                        var code = val.charCodeAt(i);
                        var _val = val.charAt(i);
                        var num = 2;
                        if(code >= 0 && code <= 128){
                            num = 1;
                        }
                        count += num;
                        if(count > max){
                            count -= num;
                            break;
                        }
                        else{
                            value += _val
                        }
                    }
                }
                else{
                    count = max;
                    value = self._val.substr(0, count)
                }
                self.target.val(value)
            }
            self.$count.html(count)
        },
        _getCount:function(){
            var self = this, val = self._val||'', len = val.length, count = 0;
            if(val){
                if(!self._limit.cn){
                    count = len
                }
                else{
                    for(var i=0; i<len; i++){
                        var code = val.charCodeAt(i);
                        if(code >= 0 && code <= 128){
                            count += 1
                        }
                        else{
                            count += 2
                        }
                    }
                }
            }
            return count
        },
        _createLimit:function(){
            var self = this, opts = self._options, limit = opts.limit, _limit, max, _class = self.constructor;
            if(limit === true){
                _limit = {}
            }
            else if(limit > 0){
                _limit = {
                    max:limit
                }
            }
            else if(typeof limit === 'object'){
                _limit = limit
            }
            if(_limit){
                if(!_limit.max && (max = self.target.attr('maxlength')) > 0){
                    _limit.max = max
                }
                if(_limit.max > 0){
                    self._limit = _limit;
                    if(!self.$limit){
                        self.$limit = $(self._tpl2html('limit', {
                            count:self._getCount(),
                            max:_limit.max,
                            style:_limit.style
                        })).appendTo(self.element);
                        self.$count = self.$limit.children('b');
                    }
                }
            }
        },
        _createElems:function(){
            var self = this, opts = self._options, _class = self.constructor, hides = [], hovers = [];
            placeholder.exports._createElems.call(self);
            if(opts.limit){
                self._createLimit()
            }
            var buttons = self._createButton(hides, hovers);
            if(buttons.length){
                self.$button = $(self._tpl2html('button', {
                    button:buttons,
                    iconfont:opts.iconfont,
                    textarea:self._textarea,
                    type:self.target.attr('type') === 'password' ? 'password' : 'text',
                    style:Nui.extend({
                        right:_class._getSize(self.target, 'r')+'px'
                    }, self._data)
                })).appendTo(self.element);
                self._hideElem = self.element.find(hides.toString());
                self._hoverElem = self.element.find(hovers.toString());
            }
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
            this._focus();
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
            elem.removeClass('con-input-type-text con-input-type-password').addClass('con-input-type-' + type);
            if(data.content && typeof data.content === 'object'){
                elem.html(data.content[type]||'')
            }
            if(data.title && typeof data.title === 'object'){
                elem.attr('title', data.title[type]||'')
            }
        },
        _reset:function(){
            if(this.$button){
                this.$button.remove();
                delete this.$button
            }
            if(this.$limit){
                this.$limit.remove();
                delete this.$count;
                delete this.$limit
            }
            placeholder.exports._reset.call(this)
        }
    })
}); 