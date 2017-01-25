/**
 * @filename nui.js
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description NUI框架核心
 */

;!(function(window, document, undefined){
    if(window.Nui){
        return
    }

    var Nui = window.Nui = {
        version:'1.0.1',
        doc:$(document),
        win:$(window),
        type:function(obj, type, and){
            if(isType('Array')(type)){
                var ret = true;
                Nui.each(type, function(k, v){
                    if(and){
                        if(!isType(v)(obj)){
                            return ret = false
                        }
                    }
                    else{
                        if(isType(v)(obj)){
                            ret = true;
                            return false
                        }
                        else{
                            ret = false
                        }
                    }
                })
                return ret
            }
            return isType(type)(obj)
        },
        each:function(obj, callback){
            var i;
            if(Nui.type(obj, 'Array')){
                var len = obj.length;
                for(i=0; i<len; i++){
                    if(callback(i, obj[i]) === false){
                        break;
                    }
                }
            }
            else{
                for(i in obj){
                    if(callback(i, obj[i]) === false){
                        break;
                    }
                }
            }
        },
        trim:function(str){
            return (str || '').replace(/^\s+|\s+$/g, '')
        },
        unique:function(arr){
            var newarr = [];
            var temp = {};
            Nui.each(arr, function(key, val){
                if(!temp[val]){
                    temp[val] = true
                    newarr.push(val)
                }
            })
            return newarr
        },
        extend:function(){
            var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options;
            if(target.constructor == Boolean){
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            if(Nui.type(target, 'Object') && Nui.type(target, 'Function'))
                target = {};
            if(length == i ){
                target = this;
                --i;
            }
            for( ; i < length; i++){
                if((options = arguments[ i ]) != null ){
                    for(var name in options ) {
                        var src = target[name], copy = options[name];
                        if( target === copy ){
                            continue;
                        }
                        if(deep && copy && Nui.type(copy, 'Object') && !copy.nodeType){
                            target[ name ] = Nui.extend( deep,
                                src || ( copy.length != null ? [ ] : { } )
                            , copy);
                        }
                        else if(copy !== undefined){
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        },
        browser:(function(){
            var ua = navigator.userAgent.toLowerCase();
            var match = /(edge)[ \/]([\w.]+)/.exec(ua) ||
                        /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                        /(msie) ([\w.]+)/.exec(ua) ||
                        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
            var browser = match[1] || '';
            var version = match[2] || '0';
            var ret = {}

            //IE11会伪装成firefox
            if(browser === 'mozilla' && /trident/.test(ua)){
                browser = 'msie';
                version = '11.0'
            }
            if(browser){
                ret[browser] = true;
                ret.version = version
            }
            if(ret.chrome || ret.edge){
                ret.webkit = true
            }
            else if(ret.webkit){
                ret.safari = true
            }
            return ret
        })()
    }

    var isType = function(type){
        return function(obj){
            return {}.toString.call(obj) == '[object ' + type + ']'
        }
    }

    var noop = function(){}

    if(typeof console === 'undefined'){
        window.console = {
            log:noop,
            debug:noop,
            error:noop,
            info:noop
        }
    }

    var getPath = function(){
        var url = (location.protocol+'//'+location.host+location.pathname).replace(/\\/g, '/');
        var index =  url.lastIndexOf('/');
        return url.substr(0, index+1);
    }

    var dirname = getPath();

    var getModuleid = function(){
        return '_module_'+mid++
    }

    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

    var support = 'onload' in document.createElement('script');

    var mid = 0;

    var moduleData;

    var cacheModules = {};

    var roots = [];

    var config = {
        path:'',
        alias:{
            dir:{},
            module:{}
        }
    }

    var compileAlias = function(){
        var modules = config.alias.module;
        Nui.each(modules, function(key, val){
            if(config.path && !/^(http|https|file):\/\//.test(val)){
                val = config.path + val
            }
            Nui.each(config.alias.dir, function(k, v){
                modules[key] = val.replace(new RegExp('{'+ k +'}', 'g'), v)
            })
        })
    }

    //IE6-9中
    var currentlyAddingScript;
    if(Nui.browser.msie && Nui.browser.version <= 9){
        var interactiveScript;
        var getCurrentScript = function(){
            if(currentlyAddingScript){
                return currentlyAddingScript
            }
            if(interactiveScript && interactiveScript.readyState === 'interactive'){
                return interactiveScript
            }
            interactiveScript = undefined;
            Nui.each(head.getElementsByTagName('script'), function(key, script){
                if(script.readyState === 'interactive'){
                    interactiveScript = script
                    return false
                }
            })
            return interactiveScript
        }
    }

    var Module = function(name, id, deps){
        var mod = this;
        mod.deps = deps||[];
        mod.alldeps = mod.deps;
        mod.depmodules = [];
        mod.name = name;
        mod.id = id;
        mod.parameter = '';
        moduleData = null
    }

    Module.prototype.load = function(){
        var mod = this;
        if(!mod.loaded && !/_module_\d+$/.test(mod.id)){
            var node = document.createElement('script');
            mod.url = mod.id+'.js'+mod.parameter;
            node.src = mod.url;
            node.id = mod.id;
            currentlyAddingScript = node;
            head.appendChild(node);
            currentlyAddingScript = null;
            if(support){
                node.onload = node.onerror = mod.onload(node)
            }
            else{
                node.onreadystatechange = function(){
                    if(/loaded|complete/.test(node.readyState)){
                        mod.onload(node)()
                    }
                }
            }
            return mod.resolve()
        }
        else{
            return mod.onload()
        }
    }

    Module.prototype.resolve = function(){
        var mod = this;
        if(!mod.depmodules.length){
            Nui.each(mod.alldeps, function(key, val){
                var module = Module.getModule(val);
                module.parameter = mod.parameter;
                mod.depmodules.push(module.loaded ? module : module.load())
            })
        }
        return mod
    }

    Module.prototype.getModules = function(modules){
        var mod = this;
        if(!modules){
            modules = [];
        }
        modules.unshift(mod.id);
        if(mod.alldeps.length){
            Nui.each(mod.depmodules, function(key, val){
                modules = val.getModules(modules)
            })
        }
        return Nui.unique(modules)
    }

    Module.prototype.onload = function(node, cb){
        var mod = this;
        if(node){
            return (function(){
                node.onload = node.onerror = node.onreadystatechange = null;
                head.removeChild(node);
                node = null;
                mod.loaded = true;
                if(cb){
                    moduleData = cb();
                }
                if(moduleData){
                    Nui.each(moduleData, function(key, val){
                        val && (mod[key] = val)
                    })
                    moduleData = null;
                    return mod.resolve().call()
                }
            })
        }
        else{
            mod.loaded = true;
            return mod.resolve().call()
        }
    }

    Module.prototype.call = function(){
        var mod = this;
        if(mod.alload()){
            Nui.each(roots, function(k, root){
                if(root.callback){
                    root.callback()
                }
            })
        }
        return mod
    }

    Module.prototype.alload = function(){
        var mod = this;
        var modules = [];
        Nui.each(roots, function(k, root){
            modules = modules.concat(root.getModules())
        })
        modules = Nui.unique(modules)
        var module;
        while(module = modules.shift()){
            if(!cacheModules[module].loaded){
                return false
            }
        }
        return true
    }

    Module.prototype.exec = function(){
        var mod = this;
        if(!mod.module && Nui.type(mod.factory, 'Function')){
            var modules = [];
            Nui.each(mod.deps, function(key, val){
                if(val !== 'component'){
                    modules.push(Module.require(val))
                }
            })
            var exports = mod.factory.apply(Nui, modules)
            if(Nui.type(exports, 'Object') && Nui.type(exports._init, 'Function')){
                var obj = {
                    attr:{},
                    proto:{}
                }
                Nui.each(exports, function(key, val){
                    if(key === 'static'){
                        obj[key] = val
                    }
                    if(Nui.type(val, 'Function')){
                        obj.proto[key] = val
                    }
                    else{
                        obj.attr[key] = val
                    }
                })
                var module = mod.module = Module.createClass(mod, obj);
                if(mod.name !== 'component'){
                    var name = mod.name;
                    var index = name.lastIndexOf('/');
                    name = name.substr(index+1);
                    $.each(['$', '$fn', '$ready'], function(k, v){
                        if(Nui.type(module[v], 'Function')){
                            module[v](name, module)
                        }
                    })
                }
            }
            else{
                mod.module = exports
            }
        }
        return mod
    }

    Module.replacePath = function(path){
        // a///b///c => a/b/c
        path = path.replace(/([^:])\/{2,}/g, '$1/');

        // a/b...../c => a/b../c
        path = path.replace(/\.{2,}/g, '..');

        // a/b../c => a/c
        // a/../c => c
        var replace = function(str){
            if(/([\w]+\/?)(\.\.\/)/g.test(str)){
                str = str.replace(/([\w]+\/?)(\.\.\/)/g, function(a, b, c){
                    if(a == b+c){
                        return ''
                    }
                    return a
                })
                return replace(str)
            }
            return str
        }
        path = replace(path);

        // a/b./c => a/b/c
        // a/./c => a/c
        return path.replace(/([\w]+)\/?(\.\/)+/g, '$1/')
    }

    Module.createClass = function(mod, object){
        var module;
        if(mod.name !== 'component'){

            module = Module.getModule('component').module;
        }
        else{
            module = Object
        }
        var Class = function(options){
            var that = this;
            if(mod.name !== 'component'){
                Nui.extend(that, object.attr, {
                    index:Class.index++,
                    eventArray:[]
                });
                that.options = Nui.extend(true, {}, that.options, Class.options, options||{})
                that.optionsCache = Nui.extend({}, that.options);
                Class.box[that.index] = that;
                that._init()
            }
        }

        Nui.extend(true, Class, module, object.static);
        Nui.extend(true, Class.prototype, module.prototype, object.proto);
        Class.prototype.constructor = Class.prototype._self = Class;
        return Class
    }

    Module.setId = function(id, retname){
        // xxx.js?v=1.1.1 => xxx
        var name = id.replace(/(\.js)?(\?[\s\S]*)?$/g, '')
        id = config.alias.module[name] || name;
        if(!/^(http|https|file):\/\//.test(id)){
            id = dirname + id
        }
        id = Module.replacePath(id);
        if(retname){
            return [id, name]
        }
        return id
    }

    Module.require = function(id, factory){
        if(id && Nui.type(id, 'String')){
            var mod = Module.getModule(id);
            if(mod){
                var module = mod.module;
                if(!factory){
                    return module
                }
                if(Nui.type(factory, 'Function')){
                    return factory(module)
                }
                else if(Nui.type(factory, 'Object')){
                    return new module(factory)
                }
                else if(Nui.type(factory, 'String')){
                    if(factory === 'options'){
                        return Nui.extend(true, module.options, options||{})
                    }
                    return module[factory]
                }
                return module
            }
        }
    }

    Module.getModule = function(name, deps){
        var arr = Module.setId(name, true);
        var id = arr[0];
        var name = arr[1];
        arr = null;
        return cacheModules[name] || cacheModules[id] || (cacheModules[id] = new Module(name, id, deps))
    }

    Module.load = function(id, callback, _module_){
        if(Nui.type(id, 'String') && Nui.trim(id)){
            //截取入口文件参数，依赖的文件加载时都会带上该参数
            var match = id.match(/(\?[\s\S]+)$/);
            var mod = cacheModules[Module.setId(id)] || Module.getModule(_module_, [id]);
            if(match){
                mod.parameter = match[0]
            }
            roots.push(mod);
            mod.callback = function(){
                var modules = mod.getModules();
                var module;
                Nui.each(modules, function(key, val){
                    var _mod = cacheModules[val].exec();
                    if(id === _mod.name || mod.depmodules[0].id === _mod.id){
                        module = _mod.module
                    }
                })
                if(Nui.type(callback, 'Function')){
                    callback.call(Nui, module)
                }
                delete mod.callback
            }
            mod.load()
        }
    }

    Module.getdeps = function(str){
        var deps = [];
        var match = str.match(/Nui.require\(('|")[\w\.-]+\1\)/g);
        if(match){
            Nui.each(match, function(key, val){
                deps.push(val.replace(/(Nui.require)|[\(\)'"]/g, ''))
            })
        }
        return deps
    }

    Nui.load = function(id, callback){
        Module.load(id, callback, getModuleid())
        return Nui
    }

    Nui.require = Module.require;

    Module.define = function(id, deps, factory){
        //Nui.define(function(){})
        if(Nui.type(id, 'Function')){
            factory = id;
            id = undefined;
            deps = [];
        }
        //Nui.define(['mod1', 'mod2', ..], function(){})
        //Nui.define('id', function(){})
        else if(Nui.type(deps, 'Function')){
            factory = deps;
            if(Nui.type(id, 'String')){
                deps = []
            }
            else{
                deps = id;
                id = undefined
            }
        }

        var alldeps = deps.concat(Module.getdeps(factory.toString()))

        moduleData = {
            name:id,
            deps:deps,
            alldeps:alldeps,
            factory:factory
        }
        if(id && !cacheModules[id] && !cacheModules[Module.setId(id)]){
            var mod = Module.getModule(id, alldeps);
            mod.deps = deps;
            mod.factory = factory;
            mod.loaded = true;
            mod.load()
        }
        else if(typeof getCurrentScript !== 'undefined'){
            var script = getCurrentScript();
            if(script){
                var mod = Module.getModule(script.id);
                if(mod){
                    mod.onload(script, function(){
                        return moduleData
                    })()
                }
            }
        }
    }

    Nui.define = function(){
        var args = arguments;
        var len = args.length;
        var params = [];

        //Nui.define()
        //Nui.define('id')
        if(!len || (len === 1 && Nui.type(args[0], 'String'))){
            return
        }

        //Nui.define([])
        //Nui.define({})
        if(len === 1 && !Nui.type(args[0], 'Function')){
            params.push(function(){
                return args[0]
            })
        }

        //Nui.define('id', [])
        //Nui.define('id', {})
        else if((len === 2 && !Nui.type(args[1], 'Function')) || (len == 3 && !Nui.type(args[2], 'Function'))){
            params.push(args[0]);
            params.push(function(){
                return args[1]
            })
        }

        //Nui.define({}, function(){})
        else if(len === 2 && !Nui.type(args[0], ['Array', 'String']) && Nui.type(args[1], 'Function')){
            params.push(args[1])
        }

        //Nui.define('id', {}, function(){})
        //Nui.define('id', '', function(){})
        else if(len === 3 && !Nui.type(args[1], 'Array') && Nui.type(args[2], 'Function')){
            params.push(args[0]);
            params.push(args[2]);
        }

        //Nui.define('id', [], function(){})
        else{
            params = args
        }

        Module.define.apply(Module, params)
    }

    Nui.config = function(key, value){
        if(Nui.type(key, 'Object')){
            Nui.extend(true, config, key)
        }
        else if(Nui.type(key, 'String') && value){
            config[key] = value
        }
        compileAlias()
    }

})(this, document)
