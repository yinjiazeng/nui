Nui.define(function(require){
    var util = require('../core/util');
    var json = require('./json');
    var loading = require('../components/layer/loading');
    var ajax = $.ajax;

    var defaults = {
        //参数配置
        data:{},        
        //接口扩展名 .do .php
        ext:'',
        //响应成功字段名
        name:'result',
        //响应成功字段值
        value:'success',
        //拦截器
        intercept:null
    }

    var request = function(options, text, under){
        
        if(typeof options === 'string'){
            options = {
                url:options,
                type:'GET'
            }
        }

        if(!options.url){
            return
        }

        if(
            options.contentType && 
            options.contentType.indexOf('application/json') !== -1 && 
            options.data && 
            typeof options.data !== 'string'
        ){
            options.dataType = 'json';
            options.data = json.stringify(options.data);
        }

        var _loading;
        
        if(text !== null){
            var opts = {
                content:text||'正在加载数据...'
            }
            if(under){
                opts.under = under
            }
            _loading = loading(opts)
        }

        var success = options.success || $.ajaxSettings.success || $.noop;
        var error = options.error || $.ajaxSettings.error || $.noop;

        //登录拦截器
        var intercept = function(){
            if(typeof defaults.intercept === 'function'){
                defaults.intercept.apply(this, arguments)
            }
        }

        options.success = function(res, status, xhr){
            if(_loading){
                _loading.destroy()
            }

            if(res && options.intercept !== false && intercept.call(this, res, status, xhr) === false){
                return false
            }

            success.call(this, res, status, xhr)
        }

        options.error = function(xhr){
            if(_loading){
                _loading.destroy()
            }
            error.apply(this, arguments)
        }

        var paramIndex = options.url.indexOf('?');
        var params = '?';

        if(paramIndex !== -1){
            params = options.url.substr(paramIndex);
            options.url = options.url.substr(0, paramIndex).replace(/\/+$/, '');
        }

        if(options.url && !/^https?:\/\//.test(options.url) && Nui.domain){
            options.url = Nui.domain+options.url;
        }

        if(options.ext !== false && defaults.ext && !/\.\w+$/.test(options.url)){
            options.url += defaults.ext
        }

        if(options.cache !== true){
            params = util.setParam('_', new Date().getTime(), params);
            delete options.cache
        }

        if(options.data && (options.type === 'PUT' || options.type === 'DELETE')){
            params = util.setParam(options.data, params);
            delete options.data
        }

        if(params !== '?'){
            options.url += params
        }

        return ajax($.extend(true, {}, {
            dataType:'json',
            data:(function(data){
                if(typeof data === 'function'){
                    return data()
                }
                return data
            })(defaults.data)
        }, options))
    }

    request.config = function(){
        var args = arguments, len = args.length;
        var defs = {};
        if(len === 1){
            if(typeof args[0] === 'object'){
                defs = args[0]
            }
            else if(typeof args[0] === 'string'){
                return defaults[args[0]]
            }
        }
        else if(len > 1){
            defs[args[0]] = defs[args[1]]
        }
        return $.extend(true, defaults, defs)
    }

    var method = function(options, msg){
        return function(url, data, callback, text, under){

            if(typeof data === 'function'){
                under = text;
                text = callback;
                callback = data;
                data = undefined;
            }
            else if(typeof data === 'string' || data === null){
                under = callback;
                text = data;
                data = callback = undefined;
            }

            if(typeof callback === 'object'){
                if(callback === null){
                    under = text;
                    text = callback;
                    callback = undefined;
                }
                else{
                    var object = callback;
                    callback = function(res, status, xhr){
                        if(res && res[defaults.name]){
                            Nui.each(object, function(_callback, key){
                                if((key === 'other' && res[defaults.name] != defaults.value) || res[defaults.name] == key){
                                    _callback.call(object, res, status, xhr)
                                    return false
                                }
                            })
                        }
                    }
                }
            }

            if(text && typeof text === 'object'){
                under = text;
                text = undefined;
            }

            if(msg && !text && text !== null){
                text = msg
            }

            return request($.extend({
                url:url,
                data:data,
                success:callback
            }, options), text, under)
        }
    }

    request.get = method({
        type:'GET'
    });

    request.sync = method({
        type:'GET',
        async:false
    });

    request.update = method({
        type:'GET'
    }, '正在保存数据...');

    request.jsonp = method({
        type:'GET',
        dataType:'jsonp'
    });

    request.del = method({
        type:'DELETE'
    }, '正在删除数据...');

    request.delSync = method({
        type:'DELETE',
        async:false
    }, '正在删除数据...');

    request.put = method({
        type:'PUT'
    }, '正在保存数据...');

    request.putSync = method({
        type:'PUT',
        async:false
    }, '正在保存数据...');

    request.post = method({
        type:'POST'
    });

    request.postSync = method({
        type:'POST',
        async:false
    });

    request.postUpdate = method({
        type:'POST'
    }, '正在保存数据...');

    request.postJSON = method({
        type:'POST',
        contentType:'application/json;charset=utf-8'
    }, '正在保存数据...');

    return request
})