/**
 * @filename nui.js
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description NUI框架核心
 */

;!(function(window, document, $, undefined){
        
    //存储组件类
    window.Modules = {}
    
    var createClass = function(name, object){
        var Base = Modules.Base||Object;
        var Class = function(options){
            var that = this;
            that.static = Class;
            if(name !== 'Base'){
                $.extend(that, object.attr, {
                    index:Class.index++,
                    eventArray:[],
                    moduleName:name
                });
                that.options = $.extend(true, {}, that.options, Class.options, options||{})
                that.optionsCache = $.extend({}, that.options);
                Class.box[that.index] = that;
                that._init()
            }
        }
        $.extend(true, Class, object.static, Base);
        $.extend(true, Class.prototype, Base.prototype, object.proto)
        Class.prototype.constructor = Class
        return Class
    }
    
    var Nui = Nui || ({
        version:'@version',
        window:$(window),
        document:$(document),
        bsie6:!!window.ActiveXObject && !window.XMLHttpRequest,
        define:function(name, modules, object){
            var args = arguments;
            var len = args.length;
            
            if(!len || (len === 1 && typeof args[0] === 'string')){
                return
            }
            if($.isPlainObject(args[0]) || typeof args[0] === 'function'){
                name = null;
                modules == null;
                object = args[0]
            }
            
            if($.isArray(args[0])){
                modules = args[0];
                name = null;
            }
            
            if(typeof args[1] === 'function' || $.isPlainObject(args[1])){
                object = args[1];
                modules = null;
            }
            
            if(name && !Modules[name]){
                
                if(typeof object === 'function'){
                    if($.isArray(modules) && modules.length){
                        $.each(modules, function(i, n){
                            var m = Modules[n];
                            if(n !== 'Base' && m){
                                modules[i] = m
                            }
                        })
                        object = object.apply(Nui, modules||[])
                    }
                    else{
                        object = object.apply(Nui)
                    }
                }

                if(typeof object === 'object' && typeof object._init === 'function'){
                    var obj = {
                        attr:{},
                        proto:{}
                    }
                    $.each(object, function(key, val){
                        if(key === 'static'){
                            obj[key] = val
                        }
                        if(typeof val === 'function'){
                            obj.proto[key] = val
                        }
                        else{
                            obj.attr[key] = val
                        }
                    })
                    var module = Modules[name] = createClass(name, obj);
                    if(name !== 'Base'){
                        $.each(['$', '$fn', '$run'], function(k, v){
                            if(typeof module[v] === 'function'){
                                module[v](name, module)
                            }
                        })
                    }
                }
                else{
                    Modules[name] = object
                }
            } 
        }
    })
    
    var REGEXP = {
        MODULE:/[\w\/\.-]+/g,
        DEFINEMODULE:/define\((\'|\")([\w\/\.-])+\1/g,
        DEFINE:/(define\()/g,
        MODULES:/(nui.import\(['"]([\w\/\.-]+))|(define\(((\'|\")([\w\/\.-])+\5\s*,\s*)?\[[\'\"\w\/\.,\s-]+\])/ig,
        BRACKET:/(\[[\'\"\w\/\.,\s-]+\])/g,
        SCRIPT:/\.js$/
    }
    
    var loadModule = function(module, callback){
        if(typeof callback === 'function' && !callback.enterModule){
            callback(module)
        }
    }
    
    Nui.loader = function(name, callback){
        if(!name || typeof name !== 'string'){
            return
        }
        var module = Modules[name];
        if(!module){
            var src = name;
            if(!REGEXP.SCRIPT.test(src)){
                src += '.js';
            }
            else{
                name = name.replace(REGEXP.SCRIPT, '')
            }
            var load = function(res){
                var cb = function(){
                    if(REGEXP.DEFINE.test(res)){
                        var arr = REGEXP.DEFINEMODULE.exec(res);
                        if(arr){
                            name = arr[2];
                        }
                        else{
                            res = 'return ('+res.replace(REGEXP.DEFINE, '$1"'+name+'",')+')';
                            (new Function(res))()
                        }
                        module = Modules[name];
                    }
                    loadModule(module, callback)
                }
                
                var enter = callback;
                //第一个loader为模块入口
                if(typeof enter !== 'function' || !enter.enterModule){
                    enter = function(){
                        cb()
                    }
                    enter.enterModule = true
                    enter.cacheModules = [];
                }
                else{
                    cb()
                }
               
                var mods = res.match(REGEXP.MODULES);
                if(mods){
                    var arr = [];
                    $.each(mods, function(key, val){
                        if(/^define/g.test(val)){
                            val = val.match(REGEXP.BRACKET)[0].replace(/[\['"\]\s]/g, '').split(',')
                            $.each(val, function(k, v){
                                v = v.replace(REGEXP.SCRIPT, '');
                                if(v && $.inArray(v, arr) === -1){
                                    arr.push(v)
                                }
                            })
                        }
                        else{
                            val = val.replace(/^nui.import\(['"]/ig, '').replace(REGEXP.SCRIPT, '')
                            if($.inArray(val, arr) === -1){
                                arr.push(val)
                            }
                        }
                    })
                    var len = arr.length-1;
                    $.each(arr, function(key, val){
                        if(key === len){
                            enter.lastModule = val;
                        }
                        //相同模块只允许加载一次
                        if($.inArray(val, enter.cacheModules) === -1){
                            enter.cacheModules.push(val);
                            Nui.loader(val, enter);
                        }
                    })
                }
                //加载最后一个模块并且该模块下没有依赖
                else if(callback && callback.lastModule === name){
                    callback()
                }
            }
            
            $.ajax({
                url:src,
                dataType:'script',
                success:function(res){
                    load(res)
                },
                error:function(res){
                    res = res.responseText
                    load(res)
                }
            })
        }
        else{
            loadModule(module, callback)
        }
    }
    
    Nui.import = function(name, callback){
        if(!name || typeof name !== 'string'){
            return
        }
        name = name.replace(REGEXP.SCRIPT, '');
        var module = Modules[name];
        if(module){
            if(typeof callback === 'function'){
                return callback(module)
            }
            else if(typeof callback === 'object'){
                return new module(callback)
            }
            else if(typeof callback === 'string'){
                if(callback === 'options'){
                    return $.extend(true, module.options, options||{})
                }
                return module[callback]
            }
            return module
        }
    }
    
    Nui.define('Base', {
        static:{
            index:0,
            box:{},
            options:{},
            $:function(name, module){
                $[name] = function(options){
                    if(options && options.target){
                        return new module(options)
                    }
                }
            },
            $fn:function(name, module){
                $.fn[name] = function(){
                    var args = arguments;
                    var param = args.length > 1 ? Array.prototype.slice.call(args, 1) : [];
                    var options = args[0]||{}
                    return this.each(function(){
                        var that = this;
                        if(!that.nui){
                            that.nui = {}
                        }
                        var me = $(that);
                        var obj = that.nui[name];
                        if(!obj){
                            var opts = options;
                            if(typeof options === 'object'){
                                options.target = that
                            }
                            else{
                                opts = {
                                    target:that
                                }
                            }
                            obj = that.nui[name] = new module(opts)
                        }
                        if(typeof options === 'string'){
                            if(options.indexOf('_') !== 0){
                                if(options === 'options'){
                                    if(typeof args[1] === 'object'){
                                        obj.set(args[1])
                                    }
                                    else if(typeof args[1] === 'string'){
                                        obj.set(args[1], args[2])
                                    }
                                }
                                else{
                                    obj[options].apply(obj, param)
                                }
                            }
                            
                        }
                    })
                }
            },
            $run:function(name, module){
                var attr = name+'-options';
                var _$fn = $.fn[name];
                var _$ = $[name];
                $('['+ attr +']').each(function(index, item){
                    var ele = $(item);
                    var options = ele.attr(attr)
                    options = options ? eval('('+ ele.attr(attr) +')') : {};
                    options.target = item;
                    if(_$fn){
                        ele[name](options)
                    }
                    else if(_$){
                        $[name](options)
                    }
                })
            }
        },
        options:{
            target:null,
            theme:''
        },
        _init:$.noop,
        _getTarget:function(){
            return $(this.options.target)
        },
        _on:function(eventType, target, callback, EventInit){
            var that = this;
            target.on(eventType, callback);
            EventInit === true && target[eventType]();
            that.eventArray.push({
                target:target,
                eventType:eventType,
                callback:callback
            })
        },
        _off:function(){
            var that = this;
            $.each(that.eventArray, function(key, val){
                val && val.target.off(val.eventType, val.callback)  
            });
            that.eventArray = []
        },
        _delete:function(){
            var nuis = that.target[0].nui;
            if(nuis){
                delete nuis[that.moduleName]
            }
            delete that.static.box[that.index]
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.elem){
                that.elem.remove();
            }
        },
        _super:function(model){
            if(model === 'static' || model === 'prototype'){
                return Modules['Base'][model]
            }
        },
        set:function(name, value){
            var that = this;
            that._reset();
            if(name || value){
                if($.isPlainObject(name)){
                    that.options = $.extend(that.options, name)
                }
                else{
                    that.options[name] = value
                }
                that._init()
            }
        },
        get:function(){
            var that = this;
        },
        reset:function(){
            var that = this;
            that.options = $.extend(that.options, that.optionsCache);
            return that
        },
        destroy:function(){
            var that = this;
            that._off();
            that._reset();
            that._delete();
        }
    })

    window.nui = window.Nui = Nui
})(this, document, jQuery)