Nui.define(['./placeholder'], function(placeholder){
    return this.extend(placeholder, {
        _options:{
            /**
             * @func 按钮文本是否是图标编码
             * @type <Boolean>
             */
            iconfont:false,
            /**
             * @func 是否默认隐藏，鼠标悬停时才显示
             * @type <Boolean>
             */
            hover:false,
            /**
             * @func 不论是否有值都显示
             * @type <Boolean>
             */
            show:false,
            /**
             * @func 是否显示查看密码按钮
             * @type <Boolean,String,Object>
             */
            reveal:false,
            /**
             * @func 是否显示清除按钮
             * @type <Boolean,String,Object>
             */
            clear:false,
            /**
             * @func 按钮集合
             * @type <Array>
             */
            button:null
        },
        _template:{
            'button':
                '<span style="<%include \'list\'%>">'+
                '<%each button%>'+
                    '<%var style = $value.style%>'+
                    '<i style="<%include \'list\'%>" class="input-button input-<%$value.id%>'+
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
            'click .input-reveal':'_reveal'
        },
        _condition:function(){
            var opts = this._options;
            if(
                placeholder.exports._condition.call(this) || 
                opts.clear || 
                opts.reveal ||
                opts.button
            ){
                this._createButton();
                return true
            }
        },
        _createButton:function(){
            var self = this, opts = self._options, button = [], defaults = {}, buttons = {}, caches = {};

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

            var value = !!self.target.val();
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
                    btn.style = {};
                }
                delete btn.style.display;
                btn.style.display = value || btn.show === true ? 'inline' : 'none';
                self._bindEvent(btn)
            })
            self._button = button
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
            if(btn.hover === true && btn.show !== true){
                
            }
        },
        _createElems:function(){
            var self = this, opts = self._options, _class = self.constructor;
            placeholder.exports._createElems.call(self);
            $(self._tpl2html('button', {
                button:self._button,
                iconfont:opts.iconfont,
                type:self.target.attr('type') === 'password' ? 'password' : 'text',
                style:Nui.extend({
                    right:_class._getSize(self.target, 'r')+'px',
                }, self._data)
            })).appendTo(self.element)
        },
        _clear:function(){
            
        },
        _reveal:function(){

        }
    })
}); 