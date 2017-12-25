/**
 * @author Aniu[2017-12-23 16:50]
 * @update Aniu[2017-12-23 16:50]
 * @version 1.0.1
 * @description 搜索下拉
 */

Nui.define(['../core/component'], function(component){
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
             * @func 搜索没有结果时提示信息
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param value <String> 文本框输入值
             * @return <String> 自定义搜索结果字符串
             */
            empty:'',
            /**
             * @func 底部信息
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 自定义底部信息字符串
             */
            foot:'',
            /**
             * @func 是否在文本框获取焦点时展示下拉
             * @type <Blloean>
             * @desc 如果组件本身是在focus事件时初始化的，不得设置该参数
             */
            focus:false,
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
             * @func 过滤数据
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <Array> 返回过滤后的数组
             */
            filter:null,
            /**
             * @func 渲染行
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 
             */
            render:null,
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
        _template:{
            wrap:
                '<div class="<% className %>"<%if style%> style="<%include \'style\'%>"<%/if%>></div>',
            inner:
                '<div class="suggest-body">'+
                    '<%if data && data.length%>'+
                        '<%include "list"%>'+
                    '<%elseif empty%>'+
                        '<div class="suggest-empty"><%empty%></div>'+
                    '<%/if%>'+
                '</div>'+
                '<%if foot%>'+
                    '<div class="suggest-foot"><%foot%></div>'+
                '<%/if%>',
            list:
                '<ul class="suggest-list">'+
                    '<%each data%>'+
                    '<%include "item"%>'+
                    '<%/each%>'+
                '</ul>'
        },
        _events:{
            
        },
        _filter:function(){
            
        },
        _setData:function(data){
            if(!Nui.type(data, 'Array')){
                data = []
            }
            self.data = data
        },
        _bindEvent:function(){
            var self = this, opts = self._options, req = !!opts.url, data = opts.data;
            if(!req){
                if(typeof data === 'function'){
                    data = opts.data.call(opts, self)
                }
                self._setData(data);
            }
            self._on('keydown', self.target, function(e, elem){
                self.value = Nui.trim(elem.val());
                if(req){
                    self._request()
                }
                else if(opts.data){
                    self._filter()
                }
            })
            self._on('focus', self.target, function(e, elem){
                self.show()
            })
        },
        _request:function(){
            var self = this, opts = self._options, data = {};
            if(opts.query && typeof opts.query === 'string'){
                data[opts.query] = value
            }
            else if(typeof opts.query === 'function'){
                var ret = opts.query.call(opts, self, self.value);
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
                self._ajax.abart()
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
                        self._setData(_data);
                        self._filter()
                    }
                }, opts.ajax||{}))
            }, 50)
        },
        _create:function(){
            var self = this;
            var data = self._tplData();
            data.style = self._options.style || {};
            data.style.display = 'none';
            self.element = $(self._tpl2html('wrap', data)).appendTo(self._container);
            self._event()
        },
        _render:function(data){
            self.element.html(self._tpl2html('inner', data))
        },
        _exec:function(){
            var self = this, opts = self._options, _class = self.constructor;
            self._container = _class._jquery(opts.container);
            if(self._getTarget() && (self._container = _class._jquery(opts.container))){
                self.value = self.target.val();
                self._bindEvent();
            }
        },
        show:function(){
            var self = this, opts = self._options;
            if(!self.element){
                self._create()
            }
            self.element.show()
        },
        hide:function(){

        }
    })
}); 