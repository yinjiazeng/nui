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
        // Nui.type('nui', 'String') => true
        // Nui.type(['nui'], ['Object', 'Array']) => true
        type:function(obj, type){
            if(obj === null || obj === undefined){
                return false
            }
            if(isArray(type)){
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
            if(isArray(obj)){
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

    var isType = function(type){
        return function(obj){
            return {}.toString.call(obj) === '[object ' + type + ']'
        }
    }

    var isArray = Nui.isArray = Array.isArray || isType('Array');

    Nui.each({
        trim:/^\s+|\s+$/g,
        trimLeft:/^\s+/g,
        trimRight:/\s+$/g
    }, function(v, k){
        Nui[k] = (function(){
            if(!String.prototype[k]){
                return function(str){
                    return str.replace(v, '')
                }
            }
            return function(str){
                return str[k]()
            }
        })()
    })

    var noop = function(){}

    //防止不支持该对象的浏览器报错
    window.console = window.console || {
        log:noop,
        debug:noop,
        error:noop,
        info:noop
    }

    Nui.bsie6 = Nui.browser.msie && Nui.browser.version <= 6;
    Nui.bsie7 = Nui.browser.msie && Nui.browser.version <= 7;

    //防止IE6-IE7鼠标hover以及position:fixed时背景图片闪烁
    if(Nui.bsie7){
        document.execCommand('BackgroundImageCache', false, true);
    }

    if(typeof jQuery !== 'undefined'){
        var jqueryCache = {};
        Nui.$ = function(selector){
            if(typeof selector === 'string'){
                return jqueryCache[selector] || (jqueryCache[selector] = jQuery(selector))
            }
            return jQuery(selector)
        }
        Nui.win = jQuery(window);
        Nui.doc = jQuery(document);
    }

    // unique(['1', '2', '1']) => ['1', '2']
    var unique = function(arr){
        var newarr = [];
        var temp = {};
        Nui.each(arr, function(val){
            if(!temp[val]){
                temp[val] = true
                newarr.push(val)
            }
        })
        return newarr
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
                    if(deep && copy && (isObject(copy) || (copyIsArray = isArray(copy)))){
                        if(copyIsArray){
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
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
            var modules = unique(root.getModules());
            allmodules = allmodules.concat(modules);
            loadedModule.push({
                root:root,
                modules:modules
            })
        })
        allmodules = unique(allmodules);
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

        factory.extend = function(module, members, inserts){
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

            if(isArray(module)){
                exports = extend(true, [], module)
                if(inserts === true){
                    if(!isArray(members)){
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

            if(isArray(inserts) && Nui.type(exports, ['Object', 'Function'])){
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
            /*if(Nui.type(module, 'Object')){
                return extend(module)
            }
            else if(Nui.type(module, 'Array')){
                return extend([], module)
            }*/
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
        var match = str.match(/(require|extend|imports)\(('|")[^'"]+\2/g);
        if(match){
            Nui.each(match, function(val){
                if(/^(require|extend)/.test(val)){
                    deps.push(val.replace(/^(require|extend)|[\('"]/g, ''))
                }
                else{
                    styles.push(val.replace(/^imports|[\('"]/g, ''))
                }

            })
        }
        return [unique(deps), unique(styles)]
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
        else if(len === 3 && !isArray(args[1]) && Nui.type(args[2], 'Function')){
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

/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 工具类
 */

Nui.define('util', {
    /**
     * @func 常用正则表达式
     */
    regex:{
        //手机
        mobile:/^0?(13|14|15|17|18)[0-9]{9}$/,
        //电话
        tel:/^[0-9-()（）]{7,18}$/,
        //邮箱
        email:/^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
        //身份证
        idcard:/^\d{17}[\d|x]|\d{15}$/,
        //中文
        cn:/^[\u4e00-\u9fa5]+$/,
        //税号
        taxnum:/^[a-zA-Z0-9]{15,20}$/
    },
    /**
     * @func 获取url参数值
     * @return <String, Object>
     * @param name <String, Undefined> 参数名，不传则以对象形式返回全部参数
     * @param urls <String, Undefined> url地址，默认为当前访问地址
     */
    getParam:function(name, urls){
        var url = decodeURI(urls||location.href), value = {};
        startIndex = url.indexOf('?');
        if(startIndex++ > 0){
            var param = url.substr(startIndex).split('&'), temp;
            $.each(param, function(key, val){
                temp = val.split('=');
                value[temp[0]] = temp[1];
            });
        }
        if(typeof name === 'string' && name){
            value = (temp = value[name]) !== undefined ? temp : '';
        }
        return value;
    },
    /**
     * @func 设置url参数值
     * @return <String> 设置后的url
     * @param name <String, Object> 参数名或者{key:value, ...}参数集合
     * @param value <String> 参数值或者url
     * @param urls <String, Undefined> url，没有则获取浏览器url
     */
    setParam:function(name, value, urls){
        var url;
        if($.isPlainObject(name)){
            url = value||location.href;
            $.each(name, function(key, val){
                if(val){
                    if($.isPlainObject(val)){
                        val = tools.getJSON(val);
                    }
                    url = tools.setParam(key, val, url);
                }
            });
        }
        else{
            url = urls||location.href;
            if(url.indexOf('?') === -1){
                url += '?';
            }
            if($.isPlainObject(value)){
                value = tools.getJSON(value);
            }
            if(url.indexOf(name+'=') !== -1){
                var reg = new RegExp('('+name+'=)[^&]*');
                url = url.replace(reg, '$1'+value);
            }
            else{
                var and = '';
                if(url.indexOf('=') !== -1){
                    and = '&';
                }
                url += and+name+'='+value;
            }
        }
        return url;
    },
    /**
     * @func 检测浏览器是否支持CSS3属性
     * @return <Boolean>
     * @param style <String> 样式属性
     */
    supportCss3:function(style){
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i, humpString = [],
            htmlStyle = document.documentElement.style,
            _toHumb = function (string) {
                return string.replace(/-(\w)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            };
        for (i in prefix)
            humpString.push(_toHumb(prefix[i] + '-' + style));
        humpString.push(_toHumb(style));
        for (i in humpString)
            if (humpString[i] in htmlStyle) return true;
        return false;
    },
    /**
     * @func 检测浏览器是否支持Html5属性
     * @return <Boolean>
     * @param attr <String> 属性
     * @param element <String> DOM元素标签
     */
    supportHtml5:function(attr, element){
        return attr in document.createElement(element);
    },
    /**
     * @func 模拟location.href跳转，前者IE下有问题
     * @return <Undefined>
     * @param url <String> 跳转的url
     * @param target <String> 跳转类型，默认为_self
     */
    jumpUrl:function(url, target){
        if(url){
            $('<a href="'+ url +'"'+ (target ? 'target="'+ (target||'_self') +'"' : '' ) +'><span></span></a>')
                .appendTo('body').children().click().end().remove();
        }
    },
    /**
     * @func 格式化日期
     * @return <String>
     * @param timestamp <String, Number> 时间戳，为空返回横杠“-”
     * @param format <String, Undefined> 输出格式，为空则返回时间戳
     */
    formatDate:function(timestamp, format){
        if(timestamp = parseInt(timestamp)){
            if(!format){
                return timestamp;
            }
            var date = new Date(timestamp);
            var map = {
                'M':date.getMonth()+1,
                'd':date.getDate(),
                'h':date.getHours(),
                'm':date.getMinutes(),
                's':date.getSeconds()
            }
            format = format.replace(/([yMdhms])+/g, function(all, single){
                var value = map[single];
                if(value !== undefined){
                    if(all.length > 1){
                       value = '0' + value;
                       value = value.substr(value.length-2);
                   }
                   return value;
                }
                else if(single === 'y'){
                    return (date.getFullYear() + '').substr(4-all.length);
                }
                return all;
            });
            return format;
        }
        return '-';
    },
    /**
     * @func 格式化json
     * @return <JSON String>
     * @param data <Array, Object> 数组或者对象
     */
    getJSON:function(data){
        if(typeof JSON !== 'undefined'){
            var jsonstr = JSON.stringify(data);
            if(Nui.browser.msie && Nui.browser.version == '8.0'){
                return jsonstr.replace(/\\u([0-9a-fA-F]{2,4})/g,function(str, matched){
                    return String.fromCharCode(parseInt(matched,16))
                })
            }
            return jsonstr;
        }
        else{
            if($.isArray(data)){
                var arr = [];
                $.each(data, function(key, val){
                    arr.push(tools.getJSON(val));
                });
                return '[' + arr.join(',') + ']';
            }
            else if($.isPlainObject(data)){
                var temp = [];
                $.each(data, function(key, val){
                    temp.push('"'+ key +'":'+ tools.getJSON(val));
                });
                return '{' + temp.join(',') + '}';
            }
            else{
                return '"'+data+'"';
            }
        }
    },
    /**
     * @func 返回form数据对象
     * @param form <Object> form 元素
     */
    getData:function(form){
        var data = {
            result:{},
            total:0,
            voidTotal:0
        }, arr = form.serializeArray(), len = arr.length, i = 0;
        for(i; i<len; i++){
            var val = $.trim(arr[i].value)
            data.all++;
            if(!val){
                data.voidTotal++
            }
            data.result[arr[i].name] = val;
        }
        return data;
    }
})

/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎
 */

Nui.define('template', ['util'], function(util){

    var template = function(tplid, data, opts){
        if(this.tplid = tplid){
            if(caches[tplid]){
                return render.call(this, caches[tplid], data, opts)
            }
            var ele = document.getElementById(tplid);
            if(ele && ele.nodeName==='SCRIPT' && ele.type === 'text/html'){
                return render.call(this, caches[tplid] = ele.innerHTML, data, opts)
            }
        }
        return ''
    }

    var caches = {};

    var options = {
        openTag:'{{',
        closeTag:'}}'
    }

    var methods = {
        trim:Nui.trim,
        formatDate:util.formatDate,
        setParam:util.setParam
    }

    var isstr = !!''.trim;

    var snippet = ';that.out = function(){return code';

    //低版本IE用push拼接字符串效率更高
    snippet = (isstr ? '""'+snippet : '[]'+snippet+'.join("")')+'}';

    var join = function(iscode){
        if(isstr){
            if(iscode){
                return function(code){
                    return 'code += '+code+';'
                }
            }
            return function(code, snippet){
                return code += snippet
            }
        }
        if(iscode){
            return function(code){
                return 'code.push('+code+');'
            }
        }
        return function(code, snippet){
            code.push(snippet);
            return code
        }
    }

    var joinCode = join(true);

    var joinSnippet = join();

    var replaceInclude = function(tpl, openTag, closeTag, opts){
        var that = this;
        var regs = openTag.replace(/([^\s])/g, '\\$1');
        var rege = closeTag.replace(/([^\s])/g, '\\$1');
        return tpl.replace(new RegExp(regs+'\\s*include\\s+[\'\"]([^\'\"]*)[\'\"]\\s*'+rege, 'g'), function(str, tid){
            if(tid){
                var tmp = that[tid];
                if(typeof tmp === 'function'){
                    tmp = tmp();
                }
                if(typeof tmp === 'string'){
                    return render.call(that, tmp, null, opts)
                }
                else{
                    return template(tid, null, opts)
                }
            }
            return ''
        })
    }

    var render = function(tpl, data, opts){
        var that = this;
        if(typeof tpl === 'string'){
            opts = opts || {};
            var openTag = opts.openTag || options.openTag, closeTag = opts.closeTag || options.closeTag;
            tpl = replaceInclude.call(that, tpl, openTag, closeTag);
            if(data && typeof data === 'object'){
                if(Nui.isArray(data)){
                    data = {
                        $list:data
                    }
                }
                var code = isstr ? '' : [];
                tpl = tpl.replace(/[\r\n]+/g, '');
                Nui.each(tpl.split(openTag), function(val, key){
                    val = val.split(closeTag);
                    if(key >= 1){
                       code = joinSnippet(code, compile(Nui.trim(val[0]), true))
                    }
                    else{
                        val[1] = val[0];
                    }
                    code = joinSnippet(code, compile(val[1].replace(/'/g, "\\'").replace(/"/g, '\\"')))
                });

                if(!isstr){
                    code = code.join('')
                }

                Nui.each(data, function(v, k){
                    code = code.replace(new RegExp('([^\\w\\.\'\"]+)'+k.replace(/\$/g, '\\$'), 'g'), '$1data.'+k)
                })
                
                try{
                    var Func = new Function('data', 'var that=this, line=1, code='+ snippet +';try{' + code + ';}catch(e){that.error(e, line)};');
                    Func.prototype.methods = methods;
                    Func.prototype.error = error(code, data, that.tplid);
                    tpl = new Func(data).out();
                    Func = null;
                }
                catch(e){
                    error(code, data, that.tplid)(e)
                }
                
            }
            return tpl
        }
        return ''
    }

    var error = function(code, data, tplid){
        return function(e, line){
            var msg = '\n';
            var codes = [];
            code = code.split('\n');
            Nui.each(code, function(v, k){
                codes.push((k+1)+ '      ' +v.replace('line += 1;', ''))
            })
            msg += 'code\n';
            msg += codes.join('\n')+'\n\n';
            if(typeof JSON !== undefined){
                msg += 'data\n';
                msg += JSON.stringify(data)+'\n\n';
            }
            if(tplid){
                msg += 'templateid\n';
                msg += tplid+'\n\n';
            }
            if(line){
                msg += 'line\n';
                msg += line+'\n\n';
            }
            msg += 'message\n';
            msg += e.message;
            console.error(msg);
        }
    }

    var compile = function(tpl, logic){
        var code, res;
        if(!tpl){
            return ''
        }
        if(logic){
            if((res = match(tpl, 'if')) !== false){
                code = 'if('+res+'){'
            }
            else if((res = match(tpl, 'elseif')) !== false){
                code = '\n}\nelse if('+res+'){'
            }
            else if(tpl.indexOf('else ') !== -1){
                code = '\n}\nelse{'
            }
            else if(tpl.indexOf('/if') !== -1){
                code = '}'
            }
            else if((res = match(tpl, 'each ', /\s+/)) !== false){
                code = 'Nui.each('+ res[0] +', function('+(res[1]||'$value')+','+(res[2]||'$index')+'){'
            }
            else if(tpl.indexOf('/each') !== -1){
                code = '});'
            }
            else if((res = match(tpl, ' | ', /\s*,\s*/)) !== false){
                code = joinCode('that.methods.'+res[0]+'('+ res.slice(1).toString() +')')
            }
            else if(tpl.indexOf('var ') === 0){
                code = tpl+';'
            }
            else{
                code = joinCode(tpl)
            }
        }
        else{
            code = joinCode('\''+tpl+'\'')
        }
        return code + '\n' + 'line += 1;'
    }

    var match = function(str, filter, reg){
        if(str.indexOf(filter) === 0 || (filter === ' | ' && str.indexOf(filter) > 0)){
            var rep = '';
            if(filter === ' | '){
                rep = ','
            }
            str = str.replace(filter, rep).replace(/^\s+/, '');
            if(reg){
                return str.split(reg)
            }
            return str
        }
        return false
    }

    template.method = function(method, callback){
        if(!methods[method]){
            methods[method] = callback
        }
    }

    template.config = function(){
        var args = arguments;
        if(Nui.type(args[0], 'Object')){
            Nui.each(args[0], function(v, k){
                options[k] = v
            })
        }
        else if(args.length > 1 && typeof args[0] === 'string'){
            options[args[0]] = args[1]
        }
    }

    template.render = render;

    return template
})

/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

Nui.define('component', ['template'], function(tpl){
    return ({
        static:{
            _index:0,
            _instances:{},
            _options:{},
            _getSize:function(selector, dir, attr){
                var size = 0;
                attr = attr || 'border';
                dir = dir || 'tb';
                if(attr === 'all'){
                    return this._getSize(selector, dir) + this._getSize(selector, dir, 'padding')
                }
                var group = {
                    l:['Left'],
                    r:['Right'],
                    lr:['Left', 'Right'],
                    t:['Top'],
                    b:['Bottom'],
                    tb:['Top', 'Bottom']
                }
                var arr = [{
                    border:{
                        l:['LeftWidth'],
                        r:['RightWidth'],
                        lr:['LeftWidth', 'RightWidth'],
                        t:['TopWidth'],
                        b:['BottomWidth'],
                        tb:['TopWidth', 'BottomWidth']
                    }
                }, {
                    padding:group
                }, {
                    margin:group
                }];
                $.each(arr, function(key, val){
                    if(val[attr]){
                        $.each(val[attr][dir], function(k, v){
                            var value = parseInt(selector.css(attr+v));
                            size += isNaN(value) ? 0 : value
                        });
                    }
                });
                return size
            },
            $:function(name, module){
                $[name] = function(options){
                    if(options){
                        return module(options)
                    }
                }
            },
            $fn:function(name, module){
                $.fn[name] = function(){
                    var args = arguments;
                    var options = args[0];
                    return this.each(function(){
                        var that = this;
                        if(!that.nui){
                            that.nui = {}
                        }
                        var me = $(that);
                        var obj = that.nui[name];
                        if(!obj){
                            var opts = options;
                            if(Nui.type(opts, 'Object')){
                                options.target = that
                            }
                            else{
                                opts = {
                                    target:that
                                }
                            }
                            obj = that.nui[name] = module(opts)
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
                                    var attr = obj[options];
                                    if(typeof attr === 'function'){
                                        attr.apply(obj, Array.prototype.slice.call(args, 1))
                                    }
                                }
                            }
                        }
                    })
                }
            },
            $ready:function(name, module){
                var attr = 'options-'+name;
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
                    else{
                        module(options)
                    }
                })
            },
            options:function(key, value){
                if(Nui.type(key, 'Object')){
                    $.extend(true, this._options, key)
                }
                else if(Nui.type(key, 'String')){
                    this._options[key] = value
                }
            }
        },
        options:{
            target:null,
            theme:''
        },
        _init:$.noop,
        _exec:$.noop,
        _getTarget:function(){
            return this.target || (this.options.target ? $(this.options.target) : null)
        },
        _on:function(type, target, callback, trigger){
            var that = this;
            target.on(type, callback);
            trigger === true && target[type]();
            that._eventArray.push({
                target:target,
                type:type,
                callback:callback
            });
            return that
        },
        _off:function(){
            var that = this;
            $.each(that._eventArray, function(key, val){
                val && val.target.off(val.type, val.callback)
            });
            that._eventArray = [];
            return that
        },
        _delete:function(){
            var that = this;
            var self = that.constructor;
            var dom = that.target[0];
            if(dom && dom.nui){
                dom.nui[that.constructor._componentname_] = null;
                delete dom.nui[that.constructor._componentname_];
            }
            self._instances[that.index] = null;
            delete self._instances[that.index]
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.elem){
                that.elem.remove();
            }
            return that
        },
        _tpl2html:function(tpls, data){
            return tpl.render.call(this, tpls, data)
        },
        set:function(name, value){
            var that = this;
            that._reset();
            if(name || value){
                if($.isPlainObject(name)){
                    that.options = $.extend(true, that.options, name)
                }
                else{
                    that.options[name] = value
                }
                that._exec()
            }
            return that
        },
        get:function(key){
            var that = this;
            if(!key){
                return that.options
            }
            else{
                return that.options[key]
            }
        },
        reset:function(){
            return this.set(that.optionsCache)
        },
        destroy:function(){
            var that = this;
            that._reset();
            that._delete();
        }
    })
})
