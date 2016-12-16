/**
 * @filename nui.js
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description NUI框架核心
 */

;!(function(window, document, $, undefined){
        
    //存储组件类
    var Modules = {}

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
        use:function(name, funcname, options){
            var module = Modules[name];
            if(name !== 'Base' && module){
                if(typeof funcname === 'function'){
                    return funcname(module)
                }
                else if(typeof funcname === 'object'){
                    return new module(funcname)
                }
                else if(typeof funcname === 'string'){
                    if(funcname === 'options'){
                        return $.extend(true, module.options, options||{})
                    }
                    return module[funcname]
                }
                return module
            }
        },
        define:function(name, modules, object){
            if(name && !Modules[name] && modules){
                if(typeof modules === 'function'){
                    object = modules;
                    modules = null
                }
                else if($.isPlainObject(modules)){
                    object = modules
                }
                if(typeof object === 'function'){
                    if($.isArray(modules) && modules.length){
                        $.each(modules, function(i, n){
                            var m = Modules[n];
                            if(n !== 'Base' && m){
                                modules[i] = m
                            }
                        })
                    }
                    object = object.apply(Nui, modules||[])
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
        _tpl2html:function(tpl, data){
            return Nui.use('tpl', 'render')(tpl, data)
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