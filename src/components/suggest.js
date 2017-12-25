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
             * @func 选择前触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <Boolean> 返回false则不会触发onSelect
             */
            onBefore:null,
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
        _bindEvent:function(){
            var self = this, opts = self._options;
            self._on('keydown', self.target, function(e, elem){
                clearTimeout(self._timer);
                self._timer = setTimeout(function(){
                    self.value = elem.val();
                    
                }, 50)
            })
            self._on('focus', self.target, function(e, elem){
                self.show()
            })
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