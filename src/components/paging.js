Nui.define(function(require){
    this.imports('../assets/components/paging/index');
    
    var component = require('../core/component');
    var request = require('../core/request');
    var number = require('./number');

    return this.extend(component, {
        _static:{

        },
        _options:{
            /**
             * @func 请求url
             */
            url:'',
            /**
             * @func 分页页码（当前显示第几页）
             * @type {Number}
             * @desc 值为负数则从末尾算起，-1就是显示最后一页
             */
            page:1,
            /**
             * @func 每页显示数量
             */
            amount:10,
            /**
             * @func 分页容器（页码填充容器）
             */
            target:null,
            /**
             * @func 滚动容器
             */
            container:Nui.win,
            /**
             * @func 是否滚动加载
             */
            iScroll:false,
            /**
             * @func 分页拓展按钮
             */
            button:{
                prev:'«',
                next:'»',
                start:'首页',
                end:'尾页'
            },
            /**
             * @func 请求参数
             * @type {Object} 
             * @type {Function}
             * @return {Object} 返回参数对象
             */
            query:null,
            /**
             * @func ajax配置（具体参考jQuery.ajax）
             * @type {Object} 
             * @type {Function}
             * @return {Object} 返回ajax配置对象
             */
            ajax:null,
            /**
             * @func 请求完回调
             */
            onResponse:null,
            /**
             * @func 渲染分页内容回调
             */
            onRender:null
        },
        _exec:function(){

        }
    })
})