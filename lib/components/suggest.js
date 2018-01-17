/**
 * @author Aniu[2017-12-23 16:50]
 * @update Aniu[2017-12-23 16:50]
 * @version 1.0.1
 * @description 搜索下拉
 */

Nui.define(['../core/component'], function(component){
    this.imports('../style/components/suggest/index');
    return this.extend(component, {
        _options:{
            /**
             * @func 请求url
             * @type <String>
             */
            url:'',
            /**
             * @func 查询参数
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param value <String> 文本框输入值
             * @return <Object> 查询参数对象集合
             */
            query:'keyword',
            /**
             * @func 定义列表模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回列表模版
             * @desc 模版中可以使用<%$data%>获取当前行数据，<%$index%>获取当前行索引
             */
            item:'',
            /**
             * @func 定义空数据模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回空数据模版
             * @desc 模版中可以使用<%value%>获取当前输入值
             */
            empty:'',
            /**
             * @func 定义顶部模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回顶部模版
             */
            head:'',
            /**
             * @func 定义底部模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回底部模版
             */
            foot:'',
            /**
             * @func 列表内容字段名
             * @type <String>
             */
            field:'',
            /**
             * @func 是否在文本获取焦点时展示下拉
             * @type <Boolean>
             * @desc 设置true后组件内部会绑定focus事件，因此不建议手动绑定focus事件调用组件的同时将该参数设置为true，那样会导致事件重复绑定
             */
            focus:false,
            /**
             * @func 是否允许文本框内容为空时展示下拉
             * @type <Boolean> 
             */
            nullable:false,
            /**
             * @func 异步请求数据时，是否缓存
             * @type <Boolean>
             */
            cache:false,
            /**
             * @func 生成html容器
             * @type <String> 字符串选择器
             * @type <Object> dom、jQuery对象
             */
            container:'body',
            /**
             * @func 下拉列表的数量，超过出现滚动条
             * @type <Number>
             */
            limit:5,
            /**
             * @func 设置高宽
             * @type <Object>
             */
            size:null,
            /**
             * @func 设置位置偏移
             * @type <Object>
             */
            offset:null,
            /**
             * @func 设置样式
             * @type <Object>
             */
            style:null,
            /**
             * @func jQuery ajax配置
             * @type <Object>
             */
            ajax:null,
            /**
             * @func 列表原始数据
             * @type <Array>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <Array> 返回原始数据
             */
            data:null,
            /**
             * @func 设置多标签
             * @type <Array>
             */
            tabs:null,
            /**
             * @func 
             * @type <Object>
             * {
             *     field:'name',
             *     like:/^\d/
             * }
             * @type <Array>
             * [{
             *     field:'name',
             *     like:/^\d/,
             *     like:'^{value}',
             *     like:function(data, value){
             *          return data.indexOf(value)
             *     }
             * }]
             */
            match:null,
            /**
             * @func 自定义选中项目后的文本框内容
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Object> 当前选中数据
             * @return <String> 返回自定义填充值
             * @desc 未设置该值时，默认取field中的数据
             */
            value:null,
            /**
             * @func 过滤数据
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <Array> 返回过滤后的数组
             */
            filter:null,
            /**
             * @func 请求返回数据时触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param response <Anything> 接口返回数据
             * @return <Array> 返回列表数据
             */
            onRequest:null,
            /**
             * @func 选择前触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <Boolean> 返回false则不会触发onSelect
             */
            onSelectBefore:null,
            /**
             * @func 选择后触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             */
            onSelect:null
        },
        _caches:{},
        queryData:[],
        data:[],
        _template:{
            wrap:
                '<div class="<% className %>"<%if style%> style="<%include \'style\'%>"<%/if%>>'+
                    '<%include "head"%>'+
                    '<div class="suggest-body">'+
                        '<%include "tabs"%>'+
                        '<div class="suggest-inner">'+
                            '<%each tabs%>'+
                                '<div class="suggest-content<%if $index === 0%> suggest-result<%/if%>" style="display:none;"></div>'+
                            '<%/each%>'+
                        '</div>'+
                    '</div>'+
                    '<%include "foot"%>'+
                '</div>',
            result:
                '<%if data && data.length%>'+
                    '<%include "list"%>'+
                '<%elseif value%>'+
                    '<%include "empty"%>'+
                '<%/if%>',
            list:
                '<ul class="suggest-list">'+
                    '<%each data $data $index%>'+
                    '<li class="suggest-item" data-index="<%$index%>">'+
                        '<%include "item"%>'+
                    '</li>'+
                    '<%/each%>'+
                '</ul>',
            tabs:
                '<%if tabs.length > 1%>'+
                    '<div class="suggest-tabs">'+
                        '<%each tabs tab%>'+
                            '<span class="suggest-tab"<%if $index === 0%> style="display:none;"<%/if%>><%tab.title%></span>'+
                        '<%/each%>'+
                    '</div>'+
                '<%/if%>'
        },
        _events:{
            'mouseenter':'_suggestMouseover',
            'mouseleave':'_suggestMouseout',
            'mouseenter .suggest-item':'_suggestMouseover _itemMouseover',
            'mouseleave .suggest-item':'_itemMouseout',
            'click .suggest-item':'_select',
            'click .suggest-tab':'_toggle'
        },
        _toggle:function(e, elem){
            var self = this, opts = self._options, index = elem.index(), data = self._elemData[index];
            var container = data.$container;
            if(!container.is(':visible')){
                if(index !== 0){
                    if(container.is(':empty') && data.content){
                        var content = '';
                        if(typeof data.content === 'function'){
                            content = data.onShow.call(opts, self, index, elem, container)
                        }
                        else{
                            content = data.content
                        }
                        if(content === false){
                            return
                        }
                        else if(typeof content === 'string'){
                            container.html(content)
                        }
                    }
                }
                elem.addClass('s-crt');
                container.show();
                Nui.each(self._elemData, function(v, i){
                    if(i !== index){
                        v.$elem.removeClass('s-crt')
                        v.$container.hide()
                    }
                })
                if(typeof data.onShow === 'function'){
                    data.onShow.call(opts, self, index, elem, container)
                }
            }
        },
        _suggestMouseover:function(e, elem){
            this._hover = true
        },
        _suggestMouseout:function(e, elem){
            delete this._hover;
        },
        _itemMouseover:function(e, elem){
            this._activeItem = elem.addClass('s-hover');
            this._activeIndex = this._activeItem.data('index');
        },
        _itemMouseout:function(e, elem){
            elem.removeClass('s-hover')
        },
        _select:function(e){
            var self = this, opts = self._options, data = self.queryData[self._activeIndex], args = [data, e, this._activeItem], value = '';
            if(self._callback('SelectBefore', args) === false){
                return false
            }

            if(typeof opts.value === 'function'){
                value = opts.value.call(opts, self, data)
            }
            else if(opts.field){
                value = data[opts.field]
            }

            if(typeof value === 'string'){
                self.value(value)
            }

            self.hide();
            
            self._callback('Select', args);
        },
        _match:function(data){
            var self = this, opts = self._options, match = false;
            Nui.each(self._matchs, function(val){
                var field = val.field, like = val.like, fieldValue;
                if(field && like && (fieldValue = data[field])){
                    if(Nui.type(like, 'RegExp') && fieldValue.match(like)){
                        match = true
                    }
                    else if(typeof like === 'string'){
                        like = like.replace(/\{value\}/g, self.val);
                        if(fieldValue.match(new RegExp(like))){
                            match = true
                        }
                    }
                    else if(typeof like === 'function'){
                        match = !!like(fieldValue, self.val)
                    }
                    if(match){
                        return false
                    }
                }
            })
            return match
        },
        _storage:function(data){
            var self = this, opts = self._options;
            if(!Nui.type(data, 'Array')){
                data = []
            }
            if(opts.cache === true){
                self._caches[self.val] = data
            }
            self.queryData = data;
            self.show(true)
        },
        _filter:function(){
            var self = this, opts = self._options, data = [], _data = self._data();
            if(typeof opts.filter === 'function'){
                data = opts.filter.call(opts, self, self.val, _data);
            }
            else if(_data.length && self._matchs && self._matchs.length){
                Nui.each(_data, function(val){
                    if(self._match(val)){
                        data.push(val)
                    }
                })
            }
            else{
                data = _data
            }
            self._storage(data)
        },
        _request:function(){
            var self = this, opts = self._options, data = {}, value = self.val;
            if(opts.query && typeof opts.query === 'string'){
                data[opts.query] = value
            }
            else if(typeof opts.query === 'function'){
                var ret = opts.query.call(opts, self, value);
                if(ret){
                    if(typeof ret === 'object'){
                        data = ret
                    }
                    else if(typeof ret === 'string'){
                        data[ret] = value
                    }
                }
            }
            
            var success;
            if(typeof opts.ajax === 'function'){
                success = opts.ajax.success;
                delete opts.ajax.success
            }

            clearTimeout(self._timer);

            if(self._ajax){
                self._ajax.abort()
            }

            self._timer = setTimeout(function(){
                self._ajax = jQuery.ajax(jQuery.extend(true, {
                    url:opts.url,
                    data:data,
                    type:'get',
                    dataType:'json',
                    cache:false,
                    async:true,
                    success:function(res, status, xhr){
                        var _data = res;
                        if(typeof success === 'function'){
                            success.call(this, res, status, xhr)
                        }
                        if(typeof opts.onRequest === 'function'){
                            _data = opts.onRequest.call(opts, self, res)
                        }
                        self._storage(_data);
                    }
                }, opts.ajax||{}))
            }, 50)
        },
        //按上
        _code38:function(){

        },
        //按下
        _code40:function(){
            
        },
        //回车
        _code13:function(e){
            this._select(e)
        },
        _bindEvent:function(){
            var self = this, opts = self._options;
            self._on('keyup', self.target, function(e, elem){
                if(self.val = Nui.trim(elem.val())){
                    var cache;
                    if(self.val && opts.cache === true && (cache = self._caches[self.val])){
                        self._storage(cache);
                    }
                    else if(opts.url){
                        self._request()
                    }
                    else{
                        self._filter()
                    }
                }
                else{
                    self.show(true)
                }
            })

            self._on('click', self.target, function(e, elem){
                if(!self._show){
                    self.target.focus()
                }
            })

            self._on('blur', self.target, function(e, elem){
                if(!self._hover){
                    self._callback('Blur', [elem])
                    self.hide()
                }
                else{
                    elem.focus()
                }
            })

            if(opts.focus === true){
                self._on('focus', self.target, function(e, elem){
                    self.show()
                })
            }

            self._on('keyup', self.target, function(e, elem){
                if(self._show === true){
                    var method = self['_code'+e.keyCode];
                    if(typeof method === 'function'){
                        method.call(self, e);
                        e.stopPropagation()
                    }
                }
            })
        },
        _create:function(){
            var self = this, data = self._tplData(), opts = self._options;
            data.style = opts.style || {};
            data.style.display = 'none';
            self._elemData = [{
                title:'结果'
            }];
            self._isTab = false;
            self._activeTab = null;
            if(Nui.isArray(opts.tabs) && opts.tabs.length){
                self._isTab = true;
                self._elemData = self._elemData.concat(opts.tabs);
            }
            data.tabs = self._elemData;
            self.element = $(self._tpl2html('wrap', data)).appendTo(self._container);
            self.$body = self.element.children();
            self.$inner = self.$body.children('.suggest-inner');
            self.$result = self.$inner.children('.suggest-result');

            self._elemData[0].$elem = $();
            self._elemData[0].$container = self.$result;
            
            if(self._isTab){
                var tabs = self.$body.children('.suggest-tabs').children();
                var containers = self.$inner.children();
                Nui.each(self._elemData, function(v, i){
                    v.$elem = tabs.eq(i);
                    v.$container = containers.eq(i);
                    if(!self._activeTab && v.active === true){
                        self._activeTab = v
                    }
                })
                //没有设置默认显示标签则取第一个
                if(!self._activeTab){
                    self._activeTab = self._elemData[1]
                }
                self._toggle(null, self._activeTab.$elem)
            }

            self._event()
        },
        _initTemplate:function(name){
            var self = this, opts = self._options, content = opts[name];
            if(typeof content === 'function'){
                content = content.call(opts, self)
            }

            if(!content || typeof content !== 'string'){
                if(name === 'item' && opts.field){
                    content = '<%$data["'+ opts.field +'"]??%>'
                }
                else{
                    content = ''
                }
            }

            if(name !== 'item' && content){
                content = '<div class="suggest-'+ name +'">'+ content +'</div>'
            }

            self._template[name] = content;
        },
        _data:function(){
            var self = this, opts = self._options, data = opts.data;
            if(typeof opts.data === 'function'){
                data = opts.data.call(opts, self)
            }

            if(!Nui.type(data, 'Array')){
                data = []
            }

            return self.data = data
        },
        _initData:function(){
            var self = this, opts = self._options, data = opts.data, match = opts.match;

            Nui.each(['item', 'empty', 'head', 'foot'], function(name){
                self._initTemplate(name);
            })

            if(match && Nui.type(match, 'Object')){
                match = [match]
            }

            if(Nui.type(match, 'Array')){
                self._matchs = match
            }
        },
        _render:function(input){
            var self = this, opts = self._options, _class = self.constructor, result = self._elemData[0];
            result.$elem.hide();
            result.$container.hide();
            _class._active = self;
            //输入的时候才会显示
            if((!self._isTab || (self._isTab && self.val)) && input){
                self.$result.html(self._tpl2html('result', {
                    data:self.queryData,
                    value:self.val
                }));
                result.$elem.show();
                if(self._activeTab){
                    self._activeTab.$elem.hide()
                }
                self._toggle(null, result.$elem)
            }
            else if(self._activeTab){
                self._toggle(null, self._activeTab.$elem.show())
            }
            self.element.show();
            self._show = true;
            self.resize()
        },
        _exec:function(){
            var self = this, opts = self._options, _class = self.constructor;
            self._container = _class._jquery(opts.container);
            if(self._getTarget() && (self._container = _class._jquery(opts.container))){
                self.val = Nui.trim(self.target.val());
                self._initData();
                self._bindEvent();
            }
        },
        resize:function(){
            var self = this, width = self.target.outerWidth(), height = self.target.outerHeight();
            //self.element.css({})
        },
        show:function(input){
            var self = this, opts = self._options, _class = self.constructor;
            if(self._hover){
                return
            }
            if(_class._active && _class._active !== self){
                _class._active.hide()
            }
            else if(opts.nullable !== true && !self.val){
                self.hide()
            }
            else{
                if(!self.element){
                    self._create()
                }
                //文本框没内容，还原默认数据
                if(!self.val && opts.nullable === true){
                    if(!opts.url){
                        self.queryData = self._data()
                    }
                    else{
                        self.queryData = []
                    }
                }
                self._render(input);
            }
        },
        hide:function(){
            var self = this, _class = self.constructor;
            delete self._hover;
            delete self._show;
            if(_class._active === self){
                delete _class._active
            }
            if(self.element){
                self.element.hide()
            }
        },
        value:function(val){
            var self = this, target = self.target, name = self.constructor.__component_name;
            if(target){
                var dom = target.get(0), obj;
                if(dom && dom.nui){
                    Nui.each(dom.nui, function(v, k){
                        if(k !== name && typeof v.value === 'function' && v._setStyle && v._createRules){
                            obj = v;
                            return false
                        }
                    })
                }
                if(obj){
                    obj.value(val)
                }
                else{
                    target.val('')
                }
            }
        }
    })
}); 