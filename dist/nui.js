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

    var Nui = window.Nui = {};

    var isType = function(type){
        return function(obj){
            return {}.toString.call(obj) === '[object ' + type + ']'
        }
    }

    var isArray = Nui.isArray = Array.isArray || isType('Array');

    var each = Nui.each = function(obj, callback){
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
    }

    // type('nui', 'String') => true
    // type(['nui'], ['Object', 'Array']) => true
    var type = Nui.type = function(obj, type){
        if(obj === null || obj === undefined){
            return false
        }
        if(isArray(type)){
            var ret = false;
            each(type, function(v){
                if(isType(v)(obj)){
                    ret = true;
                    return false
                }
            })
            return ret
        }
        return isType(type)(obj)
    }

    each({
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

    var noop = Nui.noop = function(){}

    Nui.browser = (function(){
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

    Nui.bsie6 = Nui.browser.msie && Nui.browser.version <= 6;
    Nui.bsie7 = Nui.browser.msie && Nui.browser.version <= 7;

    // unique(['1', '2', '1']) => ['1', '2']
    var unique = Nui.unique = function(arr, reverse){
        var newarr = [];
        var temp = {};
        var type = 'push';
        if(reverse === true){
            type = 'unshift';
        }
        each(arr, function(val){
            if(!temp[val]){
                temp[val] = true
                newarr[type](val)
            }
        })
        return newarr
    }

    var extend = Nui.extend = function(){
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
        if(typeof target !== 'object' && !type(target, 'Function')){
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

    //判断是不是纯粹的对象
    var isObject = function(obj){
        if(!type(obj, 'Object') || obj.constructor !== Object){
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

    if(domain === 'file://'){
        domain = dirname
    }

    // http://domdin, https://domain, file://url, //domain
    var isHttp = function(url){
        if(/^((https?|file):)?\/\//i.test(url)){
            return true
        }
    }

    var getModuleid = function(){
        ++mid;
        return '_module_'+mid
    }

    var replaceExt = function(str){
        return str.replace(/(\.(js|css))?(\?[\s\S]*)?$/i, '')
    }

    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

    var support = 'onload' in document.createElement('script');

    var mid = 0;

    var moduleData;

    var cacheModules = {};

    var cacheStyles = {};

    var rootModules = {};

    var components = {};

    var config = {
        //全局设置皮肤
        skin:null,
        //是否加载后缀为-min文件
        min:true,
        //路径别名
        paths:{},
        //模块别名
        alias:{},
        //版本映射
        maps:{}
    }

    //------- 修复个别浏览器兼容性问题 begin --------

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
            each(head.getElementsByTagName('script'), function(script){
                if(script.readyState === 'interactive'){
                    interactiveScript = script
                    return false
                }
            })
            return interactiveScript
        }
    }

    //防止不支持该对象的浏览器报错
    window.console = window.console || {
        log:noop,
        debug:noop,
        error:noop,
        info:noop
    }

    //防止IE6-IE7鼠标hover以及position:fixed时背景图片闪烁
    if(Nui.bsie7){
        document.execCommand('BackgroundImageCache', false, true);
    }

    //常用jq对象
    if(typeof jQuery !== 'undefined'){
        Nui.win = jQuery(window);
        Nui.doc = jQuery(document);
    }

    //------- 修复end -------

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
        //文件参数
        mod.version = '';
        //文件后缀 -min
        mod.suffix = attrs[2];
        //所在目录
        mod.uri = mod.id.substr(0, mod.id.lastIndexOf('/')+1);
    }

    //动态加载模块
    Module.prototype.load = function(){
        var mod = this;
        if(!mod.loaded && mod.name !== '_module_'+mid){
            if(!mod.url){
                var node = document.createElement('script');
                mod.url = mod.id+mod.suffix+'.js'+mod.version;
                node.src = mod.url;
                node.async = true;
                node.id = mod.id;
                currentlyAddingScript = node;
                head.appendChild(node);
                currentlyAddingScript = null;
                if(support){
                    node.onload = node.onerror = mod.onload(node)
                }
                else{
                    //ie6/7/8
                    node.onreadystatechange = function(){
                        if(/loaded|complete/.test(node.readyState)){
                            mod.onload(node)()
                        }
                    }
                }
            }
            return mod.resolve()
        }
        else{
            return mod.onload()
        }
    }

    //动态加载css
    Module.prototype.loadcss = function(){
        var mod = this;
        if(mod.styles && mod.styles.length){
            each(mod.styles, function(val){
                var path = Module.getAttrs(val, mod.uri)[0];
                if(!cacheStyles[path]){
                    cacheStyles[path] = true;
                    var node = document.createElement('link');
                    path = path+'.css'+mod.version;
                    node.rel = 'stylesheet';
                    node.href = path;
                    head.appendChild(node);
                }
            })
        }
        return mod;
    }

    //加载模块依赖
    Module.prototype.resolve = function(){
        var mod = this;
        if(mod.alldeps.length && isEmptyObject(mod.depmodules)){
            each(mod.alldeps, function(val){
                var module = Module.getModule(val, [], mod.uri);
                module.version = mod.version;
                mod.depmodules[val] = module.loaded ? module : module.load()
            })
        }
        return mod
    }

    //因为无法知晓最后一个依赖模块，所以只要任意模块被加载完毕，就会从入口模块遍历所有依赖，当全部依赖都被加载时执行回调
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
                    each(moduleData, function(val, key){
                        val && (mod[key] = val)
                    })
                    moduleData = null;
                }
                return mod.resolve().rootCallback()
            })
        }
        else{
            mod.loaded = true;
            return mod.resolve().rootCallback()
        }
    }

    //获取入口模块的所有依赖模块id，若依赖全部被加载则执行回调
    Module.prototype.rootCallback = function(){
        each(rootModules, function(root, name){
            var data = root.getData();
            var ids = unique(data.ids);
            if(data.loaded && root.callback){
                root.callback(ids)
            }
        })
        return this
    }

    //获取模块所有依赖的id，以及依赖是否被加载完毕
    Module.prototype.getData = function(data){
        if(!data){
            data = {
                ids:[],
                loaded:true
            }
        }
        data.ids.unshift(this.id);
        if(!this.loaded){
            data.loaded = false
        }
        if(this.alldeps.length){
            each(this.depmodules, function(val){
                data = val.getData(data)
            })
        }
        return data
    }

    //设置工厂函数内部方法
    Module.prototype.methods = function(){
        var mod = this;
        var methods = {};

        //导入模块
        methods.require = function(id, all){
            var _mod;
            if(id){
                if((_mod = mod.depmodules[id]) || (_mod = cacheModules[id]) || (_mod = cacheModules[dirname+id])){
                    if(all){
                        return _mod
                    }
                    return _mod.module || _mod.exports
                }
            }
        }

        //继承模块
        methods.extend = function(module, members, inserts){
            var exports;

            if(!module){
                return
            }

            if(typeof module === 'string'){
                var _mod = methods.require(module);
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
            else if(type(module, 'Function')){
                if(module.exports){
                    exports = extend(true, {}, module.exports, members);
                    exports._static.__parent = new Module.Class.parent(module)
                }
                else{
                    exports = extend(true, noop, module, members)
                }
            }
            else if(type(module, 'Object')){
                exports = extend(true, {}, module, members)
            }
            else{
                exports = module
            }

            if(isArray(inserts) && type(exports, ['Object', 'Function'])){
                each(inserts, function(val){
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
                        if(type(func, 'Function')){
                            var code = func.toString().replace(/(\})$/, ';'+val.content+'$1');
                            func = new Function('return '+code);
                            object[lastkey] = func();
                        }
                    }
                })
            }

            return exports
        }

        //导入样式表
        methods.imports = noop;

        //渲染字符串
        methods.renders = function(tpl){
            return tpl
        }

        //导出接口
        methods.exports = {};

        return methods
    }

    //调用工厂函数，获取模块导出接口
    Module.prototype.exec = function(){
        var mod = this;
        if(!mod.module && !mod.exports && typeof mod.factory === 'function'){
            var methods = mod.methods(), modules;
            if(mod.deps.length){
                //设置工厂函数形参，也就是依赖模块的引用
                modules = [];
                each(mod.deps, function(val){
                    modules.push(methods.require(val))
                })
            }
            else{
                //将工厂函数的内部方法作为参数传递，方便调用
                modules = [methods.require, methods.imports, methods.renders, methods.extend]
            }
            var exports = mod.factory.apply(methods, modules);
            //优先使用return接口
            if(typeof exports === 'undefined'){
                exports = methods.exports
            }
            
            if(mod.name === 'component' || (exports._static && exports._static.__parent instanceof Module.Class.parent)){
                var obj = {
                    statics:{},
                    propertys:{},
                    methods:{},
                    apis:{init:true}
                }

                if(config.skin && !exports._options.skin){
                    exports._options.skin = config.skin
                }

                each(exports, function(val, key){
                    //静态属性以及方法
                    if(key === '_static'){
                        obj['statics'] = val
                    }
                    //实例方法
                    else if(typeof val === 'function'){
                        obj.methods[key] = val;
                        if(!/^_/.test(key)){
                            obj.apis[key] = true
                        }
                    }
                    //实例属性
                    else{
                        obj.propertys[key] = val
                    }
                })
                //文件名作为组件名
                var name = mod.name.substr(mod.name.lastIndexOf('/')+1).replace(/\W/g, '');
                if(components[name]){
                    mod.module = components[name]
                }
                else{
                    obj.statics.__component_name = name;
                    mod.module = components[name] = Module.Class(mod, obj);
                    delete exports._static.__parent;
                    mod.exports = mod.module.exports = exports;
                    if(mod.name !== 'component'){
                        var Class = mod.module.constructor, method;
                        each(['_$fn', '_$ready'], function(v){
                            method = Class[v];
                            if(typeof method === 'function'){
                                method.call(Class, name, mod.module)
                            }
                        })
                    }
                }
            }
            else{
                mod.exports = exports;
            }
        }
        return mod
    }

    //获取正确规范的路径
    Module.normalize = function(path){
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

    //创建组件类
    Module.Class = function(mod, object){
        var Class = function(options){
            var that = this;
            extend(true, that, object.propertys, {
                //实例对象唯一标记
                __id:Class.__id++,
                //实例对象事件集合
                __eventList:[]
            });
            that._options = extend(true, {}, that._options, Class._options, options||{});
            that._options.self = that;
            that._defaultOptions = extend(true, that._options);
            Class.__instances[that.__id] = that;
            that._init()
        }
        extend(true, Class, object.statics);
        extend(true, Class.prototype, object.methods);
        Class.__setMethod(object.apis, components);
        if(typeof Class._init === 'function'){
            Class._init()
        }
        var module = function(options){
            return new Class(options)
        }
        module.constructor = Class;
        each(Class, function(v, k){
            if(typeof v === 'function' && !/^_/.test(k) && k !== 'constructor'){
                if(typeof v === 'function'){
                    module[k] = function(){
                        return Class[k].apply(Class, arguments)
                    }
                }
            }
        })
        return module
    }

    Module.Class.parent = function(module){
        this.exports = module.exports;
        this.constructor = module.constructor;
    }

    Module.setPath = function(id){
        var pathMatch = /\{([^\{\}]+)\}/.exec(id);
        if(pathMatch){
            var path = config.paths[pathMatch[1]];
            if(path){
                id = replaceExt(id.replace(pathMatch[0], path));
            }
        }
        return id
    }

    Module.getAttrs = function(id, uri){
        // xxx.js?v=1.1.1 => xxx
        // xxx.css?v=1.1.1 => xxx
        var name = replaceExt(id);
        var match = name.match(/-min$/g);
        var suffix = '';
        var dirid;
        if(match){
            name = name.replace(/-min$/g, '');
            suffix = match[0]
        }
        id = Module.setPath(config.alias[name] || name);
        if(!isHttp(id)){
            dirid = Module.normalize(dirname + id);
            id = (uri || dirname) + id;
        }
        id = Module.normalize(id);
        return [id, name, suffix, dirid]
    }

    Module.getModule = function(name, deps, uri){
        var attrs = Module.getAttrs(name, uri);
        var id = attrs[0];
        return cacheModules[attrs[1]] || cacheModules[id] || cacheModules[attrs[3]] || (cacheModules[id] = new Module(attrs, deps))
    }

    Module.load = function(id, callback, _module_, isMin){
        if(type(id, 'String') && Nui.trim(id)){
            //截取入口文件参数，依赖的文件加载时都会带上该参数
            var match = id.match(/(\?[\s\S]*)$/);

            if(config.min === true && isMin === true){
                id = replaceExt(id);
                if(!/-min$/.test(id)){
                    id += '-min'
                }
            }

            var mod = Module.getModule(_module_, [id]);

            if(match){
                mod.version = match[0]
            }
            var depname = mod.alldeps[0];
            var version = config.maps[depname.replace(/(-min)?(\.js)?$/, '')];
            if(version){
                if(!/^\?/.test(version)){
                    version = '?v='+version
                }
                mod.version = version
            }

            mod.callback = function(ids){
                var _module = mod.depmodules[depname];
                var suffix = _module.suffix;
                each(ids, function(id){
                    var module = cacheModules[id].exec();
                    if(!suffix){
                        module.loadcss()
                    }
                })
                if(type(callback, 'Function')){
                    callback.call(Nui, _module.module || _module.exports)
                }
                delete rootModules[_module_];
                delete mod.callback
            }
            rootModules[_module_] = mod;
            mod.load()
        }
    }

    //获取工厂函数中模块的依赖
    Module.getdeps = function(str){
        var deps = [];
        var styles = [];
        var match = str.match(/(require|extend|imports)\(?('|")[^'"]+\2/g);
        if(match){
            each(match, function(val){
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
        if(type(id, 'Function')){
            factory = id;
            id = undefined;
            deps = [];
        }
        //Nui.define(['mod1', 'mod2', ..], function(){})
        //Nui.define('id', function(){})
        else if(type(deps, 'Function')){
            factory = deps;
            if(type(id, 'String')){
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
        if(id && typeof id === 'string'){
            Module.load(id, callback, getModuleid(), true)
        }
        return Nui
    }

    //不会生成压缩文件
    Nui.use = function(id, callback){
        if(id && typeof id === 'string'){
            Module.load(id, callback, getModuleid())
        }
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
        if(!len || (len === 1 && !type(args[0], 'Function'))){
            params.push(function(){
                return args[0]
            })
        }

        //Nui.define('id', [])
        //Nui.define('id', {})
        else if((len === 2 && !type(args[1], 'Function')) || (len == 3 && !type(args[2], 'Function'))){
            params.push(args[0]);
            params.push(function(){
                return args[1]
            })
        }

        //Nui.define({}, function(){})
        else if(len === 2 && !type(args[0], ['Array', 'String']) && type(args[1], 'Function')){
            params.push(args[1])
        }

        //Nui.define('id', {}, function(){})
        //Nui.define('id', '', function(){})
        else if(len === 3 && !isArray(args[1]) && type(args[2], 'Function')){
            params.push(args[0]);
            params.push(args[2]);
        }

        //Nui.define('id', [], function(){})
        else{
            params = args
        }

        Module.define.apply(Module, params)
    }

    Nui.config = function(obj, val){
        if(type(obj, 'Object')){
            config = extend({}, config, obj);
        }
        else if(val && type(obj, 'String')){
            config[obj] = val;
            if(obj !== 'paths'){
                return
            }
        }
        else{
            return
        }
        var base = config.base || config.paths.base || '';
        if(!isHttp(base)){
            base = config.paths.base = domain+base
        }
        each(config.paths, function(v, k){
            if(k !== 'base' && !isHttp(v)){
                config.paths[k] = base+'/' + v
            }
        })
    }

})(this, document)

/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 实用工具集
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
     * @func 四舍五入保留小数，原生toFixed会有精度问题
     * @return <String>
     * @param digit <String, Number> 待转换数字
     * @param decimal <Number> 保留位数
     * @param number <Number> 小数部分末尾最多显示0的数量
     */
    toFixed:function(digit, decimal, number){
        if(isNaN(digit) || digit === ''){
            return digit
        }

        //默认末尾只保留2个0
        if(number === undefined){
            number = 2
        }

        decimal = decimal || 0;

        //将数字转换为字符串，用于分割
        var value = digit.toString();

        //补零
        var mend = function(num){
            var zero = '';
            while(num > 0){
                zero += '0';
                num--
            }
            return zero
        }

        //正负数
        var pre = '';
        if(value < 0){
            value = value.replace('-', '');
            pre = '-';
        }

        //获取小数点所在位置
        var i = value.indexOf('.');
        //存在小数点
        if(i !== -1 && decimal >= 0){
            var integer = parseInt(value.substr(0, i));
            //小数部分转为0.xxxxx
            var _decimal = '0' + value.substr(i);
            var num = '1' + mend(decimal);
            _decimal = (Math.round(_decimal*num)/num).toFixed(decimal);
            //小数四舍五入后，若大于等于1，整数部分需要加1
            if(_decimal >= 1){
                integer = (integer + 1).toString()
            }
            value = pre + integer + _decimal.substr(1)
        }
        //整数就直接补零
        else if(decimal > 0){
            value = pre + value + '.' + mend(decimal)
        }

        if(number !== null && number >= 0 && number < decimal){
            value = value.replace(/0+$/, '');
            var i = value.indexOf('.'), len = 0;
            if(i !== -1){
                len = value.substr(i+1).length;
            }
            while(len < number){
                value = value + '0';
                len++;
            }
            value = value.replace(/\.$/, '');
        }
        
        return value
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
            Nui.each(param, function(val){
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
        var self = this, url;
        if(Nui.type(name, 'Object')){
            url = value||location.href;
            Nui.each(name, function(val, key){
                if(val){
                    url = self.setParam(key, val, url);
                }
            });
        }
        else{
            url = urls||location.href;
            if(url.indexOf('?') === -1){
                url += '?';
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
     * @func 模拟location.href跳转
     * @return <Undefined>
     * @param url <String> 跳转的url
     * @param target <String> 跳转类型，默认为_self
     */
    location:function(url, target){
        if(url){
            jQuery('<a href="'+ url +'"'+ (target ? 'target="'+ (target||'_self') +'"' : '' ) +'><span></span></a>')
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
     * @func 获取表单数据集合
     * @return <Object>
     * @param element <jQuery Object> 表单元素集合或者form元素
     * @param item <String> 将name相同表单元素值分隔，当设置为jquery选择器时，配合field参数使用，用于获取item中表单元素的数据集合
     * @param field <String> 字段名，配合item参数使用，返回对象中会包含该字段
     * @example
     * <form id="form">
     *  <input type="hidden" name="name0" value="0">
     * <div>
     *  <input type="hidden" name="name1" value="1">
     *  <input type="hidden" name="name2" value="2">
     * </div>
     * <div>
     *  <input type="hidden" name="name1" value="3">
     *  <input type="hidden" name="name2" value="4">
     * </div>
     * <form>
     * getData($('#form'), 'div', 'list').result => 
     * {
     *  name0:'0',
     *  list:[{
     *      name1:'1',
     *      name2:'2'
     *  }, {
     *      name1:'3',
     *      name2:'4'
     *  }]
     * }
     */
    getData:function(element, item, field){
        var that = this;
    	var data = {
    		'result':{},
    		'voids':0, //字段中空值数量
            'total':0 //总计多少个字段
    	}, arr = element.serializeArray(), div = ',';
        if(item && typeof item === 'string' && !field){
            div = item
        }
        Nui.each(arr, function(v, i){
            var val = Nui.trim(v.value)
        	data.total++;
        	if(!val){
        		data.voids++
        	}
        	var name = v.name;
        	if(!Nui.isArray(data.result[name])){
                data.result[name] = [];
            }
            data.result[name].push(val)
        })
        Nui.each(data.result, function(v, k){
            data.result[k] = v.join(div)
        })
        if(item && field){
            var once = false;
            data.result[field] = [];
            element.find(item).each(function(){
                var result = that.getData($(this).find('[name]')).result;
                if(!once){
                    Nui.each(result, function(v, k){
                        delete data.result[k];
                    });
                    once = true
                }
                data.result[field].push(result)
            })
        }
        return data;
    },
    /**
     * @func 获取输入框内光标位置
     * @return <Number>
     * @param element <DOM Object> 表单元素dom对象
     */
    getFocusIndex:function(element){
        var val = Nui.trim(element.value);
        var index = val.length;
        if(element.setSelectionRange){
            index = element.selectionStart;
        }
        else{
            //ie
            try{
                var temp = document.selection.createRange();
                var textRange = element.createTextRange();
                textRange.setEndPoint('endtoend', temp);
                index = textRange.text.length;
            }
            catch(e){}
        }
        return index;
    },
    /**
     * @func 检测页面是否有文本被选择
     * @return <Boolean>
     */
    isTextSelect:function(){
        var text = '';
        //ie10以及以下浏览器
        if(document.selection){
            text =  document.selection.createRange().text;
        }
        //火狐和ie11浏览器getSelection无法获取表单元素选中文本
        else if(navigator.userAgent.toLowerCase().indexOf('gecko') !== -1){
            var textArea = document.activeElement;
            text = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
        }
        //chrome safari opera
        else if(window.getSelection){
            text = window.getSelection().toString();
        }
        //低版本chrome
        else if(document.getSelection){
            text = document.getSelection().toString();
        }
        return !!text;
    },
    /**
     * @func 检测是否需要安装PDF阅读器
     * @return <Boolean>
     */
    isInstallPDF:function(){
        var i, len;

        var flag = true;

        if(Nui.browser.webkit || (Nui.browser.mozilla && Nui.browser.version > 19)){
            flag = false;
        }

        if(navigator.plugins && (len = navigator.plugins.length)){
            for(i = 0; i < len; i++){
                if(/Adobe Reader|Adobe PDF|Acrobat|Chrome PDF Viewer/.test(navigator.plugins[i].name)){
                    flag = false;
                    break;
                }
            }
        }
        try{
            if(window.ActiveXObject || window.ActiveXObject.prototype){
                for(i = 1; i < 10; i++){
                    try{
                        if(eval("new ActiveXObject('PDF.PdfCtrl." + i + "');")){
                            flag = false;
                            break;
                        }
                    }
                    catch(e){
                        flag = true;
                    }
                }

                var arr = ['PDF.PdfCtrl', 'AcroPDF.PDF.1', 'FoxitReader.Document', 'Adobe Acrobat', 'Adobe PDF Plug-in'];
                len = arr.length;
                for(i = 0; i < len; i++){
                    try{
                        if(new ActiveXObject(arr[i])){
                            flag = false;
                            break;
                        }

                    }
                    catch(e){
                        flag = true;
                    }
                }
            }
        }
        catch(e){}

        return flag;
    },
    /**
     * @func 检测是否需要安装flash，没有安装则返回安装路径
     * @return <Boolean, String>
     */
    isInstallFlash:function(){
        if(typeof window.ActiveXObject != 'undefined'){
            try{
                if(!!new ActiveXObject('ShockwaveFlash.ShockwaveFlash')){
                    return false
                }
            }
            catch(e){}
        }
        else{
            if(!!navigator.plugins['Shockwave Flash']){
                return false
            }
        }
        if(Nui.browser.msie){
            return 'http://rj.baidu.com/soft/detail/17153.html'
        }
        else{
            return 'http://rj.baidu.com/soft/detail/15432.html'
        }
    },
    /**
     * @func 将数字转换为逗号千分位分隔
     * @param number <String> 数字
     * @return <String>
     */
    formatNumber:function(number){
        var integer = parseInt(number);
        if(!isNaN(integer) && integer && (number = number.toString())){
            var dot = number.indexOf('.');
            var decimal = '';
            if(dot > 0){
                decimal = number.substr(dot);
            }
            return integer.toLocaleString().replace(/\.\d+$/, '') + decimal
        }
        return number
    },
    /**
     * @func 将数字转换为中文大写
     * @param number <String> 数字
     * @return <String>
     */
    numberToCN:function(number){
        //汉字的数字
        var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        var cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        var cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        var cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        var cnInteger = '整';
        //整型完以后的单位
        var cnIntLast = '元';
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        //金额整数部分
        var integerNum;
        //金额小数部分
        var decimalNum;
        //输出的中文金额字符串
        var chineseStr = '';
        //分离金额后用的数组，预定义
        var parts;
        if (number == '') { return ''; }
        var isMinus = number < 0;
        number = Math.abs(parseFloat(number));
        if (number >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (number == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        number = number.toString();
        if (number.indexOf('.') == -1) {
            integerNum = number;
            decimalNum = '';
        } else {
            parts = number.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        if(isMinus){
            chineseStr = '负' + chineseStr
        }
        return chineseStr;
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
        openTag:'<%',
        closeTag:'%>'
    }

    var methods = {
        trim:Nui.trim,
        formatDate:util.formatDate,
        formatNumber:util.formatNumber,
        setParam:util.setParam,
        toFixed:util.toFixed,
        numberToCN:util.numberToCN
    }

    var isstr = !!''.trim;

    var snippet = ';$that.out = function(){return $that.code';

    //低版本IE用push拼接字符串效率更高
    snippet = (isstr ? '""'+snippet : '[]'+snippet+'.join("")')+'}';

    var join = function(iscode){
        if(isstr){
            if(iscode){
                return function(code){
                    return '$that.code += '+code+';'
                }
            }
            return function(code, snippet){
                return code += snippet
            }
        }
        if(iscode){
            return function(code){
                return '$that.code.push('+code+');'
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

    //部分浏览器中表单对象name属性如果和模版中需要使用的变量重名，而这个变量又不存在，返回值就会变成该dom....
    var isNode = typeof HTMLElement === 'object' ? 
    function(obj){
        return obj instanceof HTMLElement;
    } : 
    function(obj){
        return obj.nodeType === 1 && typeof obj.nodeName === 'string';
    };
    var isDom = function(obj){
        if(obj && typeof obj === 'object'){
            //元素集合
            var ele = obj[0];
            if(ele){
                return isNode(ele)
            }
            //元素
            return isNode(obj)
        }
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
                tpl = tpl.replace(/\s+/g, ' ');
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

                var variables = isstr ? '' : [];
                Nui.each(data, function(v, k){
                    variables = joinSnippet(variables, k+'=$data.'+k+',')
                })

                if(!isstr){
                    code = code.join('');
                    variables = variables.join('');
                }

                code = 'var '+ variables +'$that=this; $that.line=4; $that.code='+ snippet +';\ntry{\n' + code + ';}\ncatch(e){\n$that.error(e, $that.line)\n};';
                
                try{
                    var Rander = new Function('$data', code);
                    Rander.prototype.methods = methods;
                    Rander.prototype.error = error(code, data, that.tplid);
                    Rander.prototype.dom = isDom;
                    tpl = new Rander(data).out();
                    Rander = null
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
            code = 'function anonymous($data){\n'+code+'\n}';
            code = code.split('\n');
            Nui.each(code, function(v, k){
                codes.push((k+1)+ '      ' +v.replace('$that.line++;', ''))
            })
            msg += 'code\n';
            msg += codes.join('\n')+'\n\n';
            if(typeof JSON !== undefined){
                msg += 'data\n';
                msg += JSON.stringify(data)+'\n\n'
            }
            if(tplid){
                msg += 'templateid\n';
                msg += tplid+'\n\n'
            }
            if(line){
                msg += 'line\n';
                msg += line+'\n\n'
            }
            msg += 'message\n';
            msg += e.message;
            console.error(msg)
        }
    }

    var compile = function(tpl, logic){
        if(!tpl){
            return ''
        }
        var code,res;
        if(logic){
            if((res = match(tpl, 'if')) !== undefined){
                code = 'if('+exists(res)+'){'
            }
            else if((res = match(tpl, 'elseif')) !== undefined){
                code = '\n}\nelse if('+exists(res)+'){'
            }
            else if(tpl === 'else'){
                code = '\n}\nelse{'
            }
            else if(tpl === '/if'){
                code = '}'
            }
            else if((res = match(tpl, 'each ', /\s+/)) !== undefined){
                code = 'Nui.each('+ res[0] +', function('+(res[1]||'$value')+','+(res[2]||'$index')+'){'
            }
            else if(tpl === '/each'){
                code = '});'
            }
            else if((res = match(tpl, ' | ', /\s*,\s*/)) !== undefined){
                var str = res[0];
                var i = str.lastIndexOf('(');
                var _call = '(' +exists(res.slice(1).toString()) +')';
                //赋值操作必须要用括号包裹起来
                if(i !== -1){
                    var start = str.substr(0, i);
                    var end = Nui.trimLeft(str.substr(i+1));
                    code = joinCode(start+'($that.methods.' + end + _call)
                }
                else{
                    code = joinCode('$that.methods.'+ str + _call)
                }
            }
            else if(/^(var|let|const|return|delete)\s+/.test(tpl)){
                code = exists(tpl)+';'
            }
            else{
                code = joinCode(exists(tpl, true))
            }
        }
        else{
            code = joinCode('\''+tpl+'\'')
        }
        return code + '\n' + '$that.line++;'
    }

    //判断变量是否存在
    //a.b??  a[b]??  a['b']??  a[b['c']]??
    var exists = function(code, isVal){
        return code.replace(/([\.\$\w]+\s*(\[[\'\"\[\]\w\.\$\s]+\])?)\?\?/g, function(a, b){
            var rep = '(typeof '+ b + '!=="undefined"&&'+ b +'!==null&&'+ b +'!==undefined&&!$that.dom('+ b +')';
            if(isVal){
                rep += '?' + b + ':' + '""';
            }
            return rep + ')'
        })
    }

    var match = function(str, syntax, regexp){
        var replace;
        if(str.indexOf(syntax) === 0){
            replace = ''
        }
        else if(syntax === ' | ' && str.indexOf(syntax) > 0){
            replace = ','
        }
        if(replace !== undefined){
            str = Nui.trimLeft(str.replace(syntax, replace));
            return regexp ? str.split(regexp) : str
        }
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

Nui.define('events', function(){
    return function(opts){
        var that = opts || this,
            self = that.constructor,
            isComponent = self && self.__component_name,
            elem = this.element || that.element || Nui.doc, 
            events = isComponent ? that._events : that.events;
            
        if(!elem || !events){
            return that
        }

        if(typeof events === 'function'){
            events = events.call(that)
        }

        if(!(elem instanceof jQuery)){
            elem = jQuery(elem)
        }

        var evt, ele, ret;
        var callback = function(e, elem, cbs){
            if(typeof cbs === 'function'){
                cbs.call(that, e, elem);
            }
            else{
                Nui.each(cbs, function(cb, i){
                    cb = that[cb];
                    if(typeof cb === 'function'){
                        return ret = cb.call(that, e, elem, ret);
                    }
                })
            }
        }

        Nui.each(events, function(cbs, evts){
            if(cbs && (typeof cbs === 'string' || typeof cbs === 'function')){
                if(typeof cbs === 'string'){
                    cbs = Nui.trim(cbs).split(/\s+/);
                }
                evts = Nui.trim(evts).split(/\s+/);
                // keyup:kupdown:focus a => elem.on('keyup kupdown focus', 'a', callback)
                evt = evts.shift().replace(/:/g, ' ');
                ele = evts.join(' ');
                //组件内部处理
                if(isComponent){
                    that._on(evt, elem, ele, function(e){
                        callback(e, $(this), cbs)
                    })
                }
                else{
                    elem.on(evt, ele, function(e){
                        callback(e, $(this), cbs)
                    })
                }
            }
        })
        return that
    }
})
/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

;!(function(window, undefined){
    if(typeof jQuery === 'undefined'){
        return
    }
    Nui.define('component', ['template', 'events'], function(tpl, events){
        var module = this;
        var require = this.require;
        var extend = this.extend;
        var callMethod = function(method, args, obj){
            //实参大于形参，最后一个实参表示id
            if(args.length > method.length){
                var id = args[method.length];
                if(id && obj._options.id !== id && obj.__id !== id){
                    return
                }
            }
            method.apply(obj, args)
        }
        //去除IE67按钮点击黑边
        if(Nui.bsie7){
            Nui.doc.on('focus', 'button, input[type="button"]', function(){
                this.blur()
            })
        }
        /**
         * 单和双下划线开头表示私有方法或者属性，只能在内部使用，
         * 单下划线继承后可重写或修改，双下划线为系统预置无法修改
         * 系统预置属性方法：__id, __instances, __eventList, __parent, __component_name, __setMethod
         */
        var statics = {
            //实例对象唯一标记
            __id:0,
            //实例对象容器
            __instances:{},
            /*
            * 将实例方法接口设置为静态方法，这样可以操作多个实例，
            * 默认有 init, option, reset, destroy
            * init表示初始化组件，会查询容器内包含属性为 data-组件名-options的dom元素，并调用组件
            */
            __setMethod:function(apis, components){
                var self = this;
                Nui.each(apis, function(val, methodName){
                    if(self[methodName] === undefined){
                        self[methodName] = function(){
                            var self = this, args = arguments, container = args[0], name = self.__component_name;
                            if(name && name !== 'component'){
                                if(container && container instanceof jQuery){
                                    if(methodName === 'init'){
                                        var mod = components[name];
                                        if(mod){
                                            container.find('[data-'+name+'-options]').each(function(){
                                                //不能重复调用
                                                if(this.nui && this.nui[name]){
                                                    return
                                                }
                                                var elem = jQuery(this);
                                                var options = elem.data(name+'Options');
                                                var _mod;
                                                if(options && typeof options === 'string'){
                                                    if(/^{[\s\S]*}$/.test(options)){
                                                        options = eval('('+ options +')');
                                                    }
                                                    else if(_mod = require(options, true)){
                                                        if(typeof _mod.exports === 'function'){
                                                            options = _mod.exports(elem)
                                                        }
                                                        else{
                                                            options = _mod.exports;
                                                        }
                                                    }
                                                }
                                                if(typeof options !== 'object'){
                                                    options = {};
                                                }
                                                mod(extend(options, {
                                                    target:elem
                                                }))
                                            })
                                        }
                                    }
                                    else{
                                        container.find('[nui_component_'+ name +']').each(function(){
                                            var obj, method;
                                            if(this.nui && (obj = this.nui[name]) && typeof (method = obj[methodName]) === 'function'){
                                                callMethod(method, Array.prototype.slice.call(args, 1), obj)
                                            }
                                        })
                                    }
                                }
                                else{
                                    Nui.each(self.__instances, function(obj){
                                        var method = obj[methodName];
                                        if(typeof method === 'function'){
                                            callMethod(method, args, obj)
                                        }
                                    })
                                }
                            }
                            else{
                                Nui.each(components, function(v, k){
                                    if(k !== 'component' && typeof v[methodName] === 'function'){
                                        v[methodName].apply(v, args)
                                    }
                                })
                            }
                        }
                    }
                })
                return self
            },
            //对所有实例设置默认选项
            _options:{},
            //创建组件模块时会调用一次，可用于在document上绑定事件操作实例
            _init:jQuery.noop,
            _jquery:function(elem){
                if(elem instanceof jQuery){
                    return elem
                }
                return jQuery(elem)
            },
            _getSize:function(selector, dir, attr){
                var size = 0;
                attr = attr || 'border';
                dir = dir || 'tb';
                if(attr === 'all'){
                    return (this._getSize(selector, dir) + 
                           this._getSize(selector, dir, 'padding') +
                           this._getSize(selector, dir, 'margin'))
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
                Nui.each(arr, function(val){
                    if(val[attr]){
                        Nui.each(val[attr][dir], function(v){
                            var value = parseFloat(selector.css(attr+v));
                            size += isNaN(value) ? 0 : value
                        });
                    }
                });
                return size
            },
            _$fn:function(name, mod){
                jQuery.fn[name] = function(){
                    var args = arguments;
                    var options = args[0];
                    return this.each(function(){
                        if(typeof options !== 'string'){
                            if(Nui.type(options, 'Object')){
                                options.target = this
                            }
                            else{
                                options = {
                                    target:this
                                }
                            }
                            mod(options);
                        }
                        else if(options){
                            var object;
                            if(this.nui && (object=this.nui[name]) && options.indexOf('_') !== 0){
                                if(options === 'options'){
                                    object.option(args[1], args[2])
                                }
                                else{
                                    var attr = object[options];
                                    if(typeof attr === 'function'){
                                        attr.apply(object, Array.prototype.slice.call(args, 1))
                                    }
                                }
                            }
                        }
                    })
                }
            },
            _$ready:function(name, mod){
                if(typeof this.init === 'function'){
                    this.init(Nui.doc)
                }
            },
            config:function(){
                var args = arguments;
                var len = args.length;
                var attr = args[0];
                if(Nui.type(attr, 'Object')){
                    return this._options = jQuery.extend(true, this._options, attr)
                }
                else if(Nui.type(attr, 'String')){
                    if(args.length === 1){
                        return this._options[attr]
                    }
                    return this._options[attr] = args[1]
                }
            },
            hasInstance:function(id){
                var exist = false;
                var instances = this.__instances;
                if(id){
                    Nui.each(instances, function(v){
                        if(v._options.id === id){
                            exist = true;
                            return false
                        }
                    })
                }
                else{
                    for(i in instances){
                        return true
                    }
                }
                return exist
            }
        }

        return ({
            _static:statics,
            _options:{
                target:null,
                //组件id，element会增加class 组件名-组件id
                id:'',
                //组件皮肤，element会增加class nui-组件名-皮肤名
                skin:'',
                //element增加一个或多个类
                className:'',
                onInit:null,
                onReset:null,
                onDestroy:null
            },
            _template:{},
            _init:function(){
                this._exec()
            },
            _exec:jQuery.noop,
            _getTarget:function(){
                var self = this;
                if(!self.target){
                    var target = self._options.target;
                    var _class = self.constructor;
                    if(!target){
                        return null
                    }
                    target = _class._jquery(target);
                    self.target = self._bindComponentName(target);
                }
                return self.target
            },
            _bindComponentName:function(element){
                var self = this, _class = self.constructor;
                var attr = 'nui_component_'+_class.__component_name;
                element.attr(attr, '').each(function(){
                    if(!this.nui){
                        this.nui = {};
                    }
                    this.nui[_class.__component_name] = self
                })
                return element
            },
            _tplData:function(data){
                var opts = this._options, 
                    _class = this.constructor,
                    name = 'nui-' + _class.__component_name, 
                    skin = Nui.trim(opts.skin),
                    getName = function(_class, arrs){
                        if(_class.__parent){
                            var _pclass = _class.__parent.constructor;
                            var _name = _pclass.__component_name;
                            if(_name !== 'component'){
                                if(skin){
                                    arrs.unshift('nui-'+_name+'-'+skin);
                                }
                                arrs.unshift('nui-'+_name);
                                return getName(_pclass, arrs)
                            }
                        }
                        return arrs
                    }, className = getName(_class, []);

                className.push(name);
                if(skin){
                    className.push(name+'-'+skin)
                }
                if(opts.id){
                    className.push(_class.__component_name + '-' + opts.id)
                }
                if(!data){
                    data = {}
                }
                if(opts.className){
                    className.push(opts.className)
                }
                data.className = className.join(' ');
                return data
            },
            _event:function(){
                var self = this, opts = self._options;
                if(self.element && opts.events){
                    opts.element = self.element;
                    events.call(self, opts)
                }
                return events.call(self)
            },
            _on:function(type, dalegate, selector, callback, trigger){
                var self = this;
                if(typeof selector === 'function'){
                    trigger = callback;
                    callback = selector;
                    selector = dalegate;
                    dalegate = null;
                    selector = self.constructor._jquery(selector)
                }

                var _callback = function(e){
                    return callback.call(this, e, jQuery(this))
                }

                if(dalegate){
                    if(typeof selector !== 'string'){
                        selector = selector.selector;
                        if(!selector){
                            selector = self._options.target
                        }
                    }
                    dalegate.on(type, selector, _callback);
                    if(trigger){
                        dalegate.find(selector).trigger(type)
                    }
                }
                else{
                    selector.on(type, _callback);
                    if(trigger){
                        selector.trigger(type)
                    }
                }

                self.__eventList.push({
                    dalegate:dalegate,
                    selector:selector,
                    type:type,
                    callback:_callback
                });

                return self
            },
            _off:function(){
                var self = this, _eventList = self.__eventList;
                Nui.each(_eventList, function(val, key){
                    if(val.dalegate){
                        val.dalegate.off(val.type, val.selector, val.callback)
                    }
                    else{
                        val.selector.off(val.type, val.callback)
                    }
                    _eventList[key] = null;
                    delete _eventList[key]
                });
                self.__eventList = [];
                return self
            },
            _delete:function(){
                var self = this, _class = self.constructor;
                if(self.target){
                    var attr = 'nui_component_'+_class.__component_name;
                    self.target.removeAttr(attr).each(function(){
                        if(this.nui){
                            this.nui[_class.__component_name] = null;
                            delete this.nui[_class.__component_name];
                        }
                    })
                }
                _class.__instances[self.__id] = null;
                delete _class.__instances[self.__id]
            },
            _reset:function(){
                this._off();
                if(this.element){
                    this.element.remove();
                    this.element = null;
                }
                return this
            },
            _tpl2html:function(id, data){
                var opts = {
                    openTag:'<%',
                    closeTag:'%>'
                }
                if(arguments.length === 1){
                    return tpl.render(this._template, id, opts)
                }
                return tpl.render.call(this._template, this._template[id], data, opts)
            },
            _callback:function(method, args){
                var self = this, opts = self._options;
                var callback = opts['on'+method];
                if(typeof callback === 'function'){
                    if(args){
                        Array.prototype.unshift.call(args, self);
                        return callback.apply(opts, args);
                    }
                    return callback.call(opts, self)
                }
            },
            option:function(){
                var args = arguments;
                var options;
                var defaults = false;
                if(args[0] === true){
                    defaults = true
                }
                else if(jQuery.isPlainObject(args[0])){
                    options = args[0]
                    defaults = args[1]
                }
                else if(args.length > 1 && typeof args[0] === 'string'){
                    options = {};
                    options[args[0]] = args[1]
                    defaults = args[2]
                }
                if(options||defaults){
                    this._options = jQuery.extend(true, {}, this[defaults === true ? '_defaultOptions' : '_options'], options)
                    this._reset();
                    this._exec();
                }
                return this
            },
            reset:function(){
                this.option(true);
                this._callback('Reset');
                return this;
            },
            destroy:function(){
                this._delete();
                this._reset();
                this._callback('Destroy');
            }
        })
    })
})(this);
