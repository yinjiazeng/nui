/**
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
        // Nui.type('nui', 'String') => true
        // Nui.type(['nui'], ['Object', 'Array']) => true
        type:function(obj, type){
            if(obj === null || obj === undefined){
                return false
            }
            if(isType('Array')(type)){
                var ret = false;
                Nui.each(type, function(v){
                    if(isType(v)(obj)){
                        ret = true;
                        return false
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
                    if(callback(obj[i], i) === false){
                        break;
                    }
                }
            }
            else{
                for(i in obj){
                    if(callback(obj[i], i) === false){
                        break;
                    }
                }
            }
        },
        trim:function(str){
            return (str || '').replace(/^\s+|\s+$/g, '')
        },
        // Nui.unique(['1', '2', '1']) => ['1', '2']
        unique:function(arr){
            var newarr = [];
            var temp = {};
            Nui.each(arr, function(val){
                if(!temp[val]){
                    temp[val] = true
                    newarr.push(val)
                }
            })
            return newarr
        },
        //jquery1.9之后就移除了该方法，以插件形式存在
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

    Nui.bsie6 = Nui.browser.msie && Nui.browser.version <= 6;
    Nui.bsie7 = Nui.browser.msie && Nui.browser.version <= 7;

    //防止IE6-IE7鼠标hover以及position:fixed时背景图片闪烁
    if(Nui.bsie7){
        document.execCommand('BackgroundImageCache', false, true);
    }

    if(typeof jQuery !== 'undefined'){
        Nui.win = jQuery(window);
        Nui.doc = jQuery(document);
    }

    var isType = function(type){
        return function(obj){
            return {}.toString.call(obj) === '[object ' + type + ']'
        }
    }

    var extend = function(){
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if(typeof target === 'boolean'){
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        if(typeof target !== 'object' && !Nui.type(target, 'Function')){
            target = {};
        }
        if(length === i){
            target = {};
            --i;
        }
        for( ; i < length; i++){
            if((options = arguments[i]) != null){
                for(name in options){
                    src = target[name];
                    copy = options[name];
                    if(target === copy){
                        continue;
                    }
                    if(deep && copy && (isObject(copy) || (copyIsArray = Nui.type(copy, 'Array')))){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && Nui.type(src, 'Array') ? src : [];
                        }
                        else{
                            clone = src && isObject(src) ? src : {};
                        }
                        target[name] = extend(deep, clone, copy);
                    }
                    else if(copy !== undefined){
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }

    var isObject = function(obj){
        if(!obj || !Nui.type(obj, 'Object') || obj.nodeType){
            return false;
        }
        return true
    }

    var isEmptyObject = function(obj){
        var name;
        for(name in obj){
            return false;
        }
        return true;
    }

    var noop = function(){}

    //防止不支持该对象的浏览器报错
    if(typeof console === 'undefined'){
        window.console = {
            log:noop,
            debug:noop,
            error:noop,
            info:noop
        }
    }

    var domain = location.protocol+'//'+location.host;
    //获取当前页面的uri
    var getPath = function(){
        var url = (domain+location.pathname).replace(/\\/g, '/');
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

    var cacheStyles = {};

    var roots = [];

    var config = {
        paths:{},
        alias:{}
    }

    //讲道理说，文件在被加载完毕后会立即执行define方法，在onload(onreadystatechange IE9-)事件中得到moduleData，这个过程是同步的
    //但是在IE9-中，高概率出现不同步情况，就是在onreadystatechange事件中得到moduleData值不是当前文件数据，原因在于执行onload时，其它模块刚好被加载，被重新赋值了
    //IE9-中文件被加载会有5个状态 uninitialized > loading > loaded > interactive > complete
    //脚本被执行时可以通过dom节点获取到node.readyState值为interactive，而该节点一定是当前加载的脚本节点
    //小概率出现节点被添加到dom后会立即执行define，可能是由于IE的缓存原因
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
            Nui.each(head.getElementsByTagName('script'), function(script){
                if(script.readyState === 'interactive'){
                    interactiveScript = script
                    return false
                }
            })
            return interactiveScript
        }
    }

    var Module = function(attrs, deps){
        var mod = this;
        //define实参中依赖模块名
        mod.deps = deps||[];
        //所有依赖模块名
        mod.alldeps = mod.deps;
        //所有依赖模块
        mod.depmodules = {};
        //模块唯一id
        mod.id = attrs[0];
        //模块名
        mod.name = attrs[1];
        //模块url参数
        mod.parameter = '';
        //文件后缀 -debug和-min
        mod.suffix = attrs[2];
        //所在目录
        mod.uri = mod.id.substr(0, mod.id.lastIndexOf('/')+1);
    }

    Module.prototype.load = function(){
        var mod = this;
        if(!mod.loaded && !/_module_\d+$/.test(mod.id)){
            var node = document.createElement('script');
            mod.url = mod.id+mod.suffix+'.js'+mod.parameter;
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
        if(mod.alldeps.length && isEmptyObject(mod.depmodules)){
            Nui.each(mod.alldeps, function(val){
                var module = Module.getModule(val, [], mod.uri);
                module.parameter = mod.parameter;
                mod.depmodules[val] = module.loaded ? module : module.load()
            })
        }
        return mod
    }

    Module.prototype.onload = function(node){
        var mod = this;
        if(node){
            return (function(){
                moduleData = node.moduleData || moduleData;
                node.onload = node.onerror = node.onreadystatechange = null;
                head.removeChild(node);
                node = null;
                mod.loaded = true;
                if(moduleData){
                    Nui.each(moduleData, function(val, key){
                        val && (mod[key] = val)
                    })
                    moduleData = null;
                    return mod.resolve().runcallback()
                }
            })
        }
        else{
            mod.loaded = true;
            return mod.resolve().runcallback()
        }
    }

    Module.prototype.runcallback = function(){
        var mod = this;
        var loadedModule = mod.getloaded();
        if(loadedModule){
            Nui.each(loadedModule, function(val){
                if(val.root.callback){
                    val.root.callback(val.modules)
                }
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
            Nui.each(mod.depmodules, function(val){
                modules = val.getModules(modules)
            })
        }
        return modules
    }

    Module.prototype.getloaded = function(){
        var loadedModule = [];
        var allmodules = [];
        Nui.each(roots, function(root){
            var modules = Nui.unique(root.getModules());
            allmodules = allmodules.concat(modules);
            loadedModule.push({
                root:root,
                modules:modules
            })
        })
        allmodules = Nui.unique(allmodules);
        var module;
        while(module = allmodules.shift()){
            if(!cacheModules[module].loaded){
                return false
            }
        }
        return loadedModule
    }

    Module.prototype.setFactory = function(){
        var mod = this;
        var factory = mod.factory;

        factory.require = function(id, options){
            return Module.require(mod.depmodules[id], options)
        }

        factory.extends = function(module, members, inserts){
            var exports;

            if(!module){
                return
            }

            if(typeof module === 'string'){
                var _mod = factory.require(module);
                if(_mod === undefined){
                    return module
                }
                module = _mod
            }

            if(Nui.type(module, 'Array')){
                exports = extend(true, [], module)
                if(inserts === true){
                    if(!Nui.type(members, 'Array')){
                        exports.push(members)
                    }
                    else{
                        exports = exports.concat(members)
                    }
                }
            }
            else if(Nui.type(module, 'Function')){
                if(module.exports){
                    exports = extend(true, {}, module.exports, members)
                }
                else{
                    exports = extend(true, noop, module, members)
                }
            }
            else if(Nui.type(module, 'Object')){
                exports = extend(true, {}, module, members)
            }
            else{
                exports = module
            }

            if(Nui.type(inserts, 'Array') && Nui.type(exports, ['Object', 'Function'])){
                Nui.each(inserts, function(val){
                    if(val.method && val.content){
                        var arr = val.method.split('->');
                        var lastkey = arr[arr.length-1];
                        var object, key;
                        while(key = arr.shift()){
                            object = object || exports;
                            if(key === lastkey){
                                break;
                            }
                            object = object[key]
                        }
                        var func = object[lastkey];
                        if(Nui.type(func, 'Function')){
                            var code = func.toString().replace(/(\})$/, ';'+val.content+'$1');
                            func = new Function('return '+code);
                            object[lastkey] = func();
                        }
                    }
                })
            }

            return exports
        }

        factory.imports = noop;

        /*
            Nui.define(function(){
                return this.renders(%
                    <div>{{if ...}}...{{/if}}</div>
                %)
            })
        */
        factory.renders = function(tpl){
            return tpl
        }

        return factory
    }

    Module.prototype.exec = function(){
        var mod = this;
        if(!mod.module && Nui.type(mod.factory, 'Function')){
            var factory = mod.setFactory();
            var modules = [];
            Nui.each(mod.deps, function(val){
                modules.push(factory.require(val))
            })
            var exports = factory.apply(factory, modules);
            if(mod.name !== 'component' && Nui.type(exports, 'Object') && Nui.type(exports._init, 'Function')){
                var obj = {
                    static:{},
                    attr:{},
                    proto:{}
                }
                Nui.each(exports, function(val, key){
                    if(key === 'static'){
                        obj[key] = val
                    }
                    else if(Nui.type(val, 'Function')){
                        obj.proto[key] = val
                    }
                    else{
                        obj.attr[key] = val
                    }
                })
                var name = mod.name.substr(mod.name.lastIndexOf('/')+1).replace(/\{[^\{\}]+\}/g, '');
                obj.static._componentname_ = name;
                var module = mod.module = Module.createClass(mod, obj);
                module.exports = exports;
                Nui.each(['$', '$fn', '$ready'], function(v){
                    module(v, name, module)
                })
            }
            else{
                mod.module = exports;
            }
        }
        return mod
    }

    Module.prototype.loadcss = function(){
        var mod = this;
        if(mod.styles && mod.styles.length){
            Nui.each(mod.styles, function(val){
                var path = Module.getAttrs(val, mod.uri)[0];
                if(!cacheStyles[path]){
                    cacheStyles[path] = true;
                    path = path+'.css'+mod.parameter;
                    var node = document.createElement('link');
                    node.rel = 'stylesheet';
                    node.href = path;
                    head.appendChild(node);
                }
            })
        }
        return mod;
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
        var Class = function(options){
            var that = this;
            extend(true, that, object.attr, {
                index:Class._index++,
                _eventArray:[]
            });
            that.options = extend(true, {}, that.options, Class._options, options||{})
            that.optionsCache = extend(that.options);
            Class._instances[that.index] = that;
            that.static = null;
            that._init()
        }
        extend(true, Class, object.static);
        extend(true, Class.prototype, object.proto);
        return (function(){
            var args = arguments;
            var options = args[0];
            if(typeof options === 'string'){
                if(options.indexOf('_') !== 0){
                    var attr = Class[options];
                    if(typeof attr === 'function'){
                        return attr.apply(Class, Array.prototype.slice.call(args, 1))
                    }
                    return attr
                }
            }
            else{
                return new Class(options)
            }
        })
    }

    Module.require = function(mod, options){
        if(mod){
            var module = mod.module;
            if(Nui.type(options, 'Object')){
                return module(factory)
            }
            else if(Nui.type(options, 'String')){
                return module[factory]
            }
            //因为对象和数组是引用的，使用时需拷贝
            if(Nui.type(module, 'Object')){
                return extend(module)
            }
            else if(Nui.type(module, 'Array')){
                return extend([], module)
            }
            return module
        }
    }

    Module.setPath = function(id){
        var pathMatch = /\{([^\{\}]+)\}/.exec(id);
        if(pathMatch){
            var path = config.paths[pathMatch[1]];
            if(path){
                id = id.replace(pathMatch[0], path).replace(/(\.(js|css))?(\?[\s\S]*)?$/g, '');
            }
        }
        return id
    }

    Module.getAttrs = function(id, uri){
        // xxx.js?v=1.1.1 => xxx
        // xxx.css?v=1.1.1 => xxx
        var name = id.replace(/(\.(js|css))?(\?[\s\S]*)?$/g, '');
        var match = name.match(/(-debug|-min)$/g);
        var suffix = '';
        var dirid;
        if(match){
            name = name.replace(/(-debug|-min)$/g, '');
            suffix = match[0]
        }
        id = Module.setPath(config.alias[name] || name);
        if(!/^(https?|file):\/\//.test(id)){
            dirid = Module.replacePath(dirname + id);
            id = (uri || dirname) + id;
        }
        id = Module.replacePath(id);
        return [id, name, suffix, dirid]
    }

    Module.getModule = function(name, deps, uri){
        var attrs = Module.getAttrs(name, uri);
        var id = attrs[0];
        return cacheModules[attrs[1]] || cacheModules[id] || cacheModules[attrs[3]] || (cacheModules[id] = new Module(attrs, deps))
    }

    Module.load = function(id, callback, _module_){
        if(Nui.type(id, 'String') && Nui.trim(id)){
            //截取入口文件参数，依赖的文件加载时都会带上该参数
            var match = id.match(/(\?[\s\S]+)$/);
            var mod = cacheModules[Module.getAttrs(id)[0]] || Module.getModule(_module_, [id]);
            if(match){
                mod.parameter = match[0]
            }
            roots.push(mod);
            mod.callback = function(modules){
                var _module = mod;
                var suffix = mod.suffix;
                if(mod.name === _module_){
                    Nui.each(mod.depmodules, function(val){
                        _module = val;
                        suffix = val.suffix;
                    })
                }
                Nui.each(modules, function(val){
                    var _mod = cacheModules[val].exec();
                    if(!suffix){
                        _mod.loadcss()
                    }
                })
                if(Nui.type(callback, 'Function')){
                    callback.call(Nui, _module.module)
                }
                delete mod.callback
            }
            mod.load()
        }
    }

    Module.getdeps = function(str){
        var deps = [];
        var styles = [];
        var match = str.match(/(require|extends|imports)\(('|")[^'"]+\2/g);
        if(match){
            Nui.each(match, function(val){
                if(/^(require|extends)/.test(val)){
                    deps.push(val.replace(/^(require|extends)|[\('"]/g, ''))
                }
                else{
                    styles.push(val.replace(/^imports|[\('"]/g, ''))
                }

            })
        }
        return [Nui.unique(deps), Nui.unique(styles)]
    }

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

        var arrs = Module.getdeps(factory.toString());
        var alldeps = deps.concat(arrs[0]);
        var styles = arrs[1];

        if(id && !cacheModules[id] && !cacheModules[Module.getAttrs(id)[0]]){
            var mod = Module.getModule(id, alldeps);
            mod.deps = deps;
            mod.styles = styles;
            mod.factory = factory;
            mod.loaded = true;
            mod.load()
        }

        moduleData = {
            name:id,
            deps:deps,
            styles:styles,
            alldeps:alldeps,
            factory:factory
        }

        if(typeof getCurrentScript !== 'undefined'){
            var script = getCurrentScript();
            if(script){
                script.moduleData = moduleData
            }
        }
    }

    Nui.load = function(id, callback){
        Module.load(id, callback, getModuleid())
        return Nui
    }

    Nui.define = function(){
        var args = arguments;
        var len = args.length;
        var params = [];

        //Nui.define()
        //Nui.define('')
        //Nui.define([])
        //Nui.define({})
        if(!len || (len === 1 && !Nui.type(args[0], 'Function'))){
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
            extend(true, config, key)
        }
        else if(Nui.type(key, 'String') && value){
            extend(true, config[key], value)
        }
        var base = config.paths.base || '';
        if(!/^(https?|file):\/\//.test(base)){
            base = config.paths.base = domain+base
        }
        Nui.each(config.paths, function(v, k){
            if(k !== 'base' && !/^(https?|file):\/\//.test(v)){
                config.paths[k] = base+'/' + v
            }
        })
    }

})(this, document)
