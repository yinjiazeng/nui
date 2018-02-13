/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description NUI框架加载器
 */

;!(function(global, factory){
    if(typeof exports === 'object' && typeof module !== 'undefined'){
        module.exports = factory(global)
    }
    else{
        factory(global)
    }
})(window, function(global){

    if(global.Nui){
        return global.Nui
    }
    
    var Nui = global.Nui = {};

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

    var isComponent = function(exports, name){
        var _static = exports._static;
        var _init = exports._init;
        return (
            (_static && _init && /\/?component$/.test(name)) ||
            (_static && _static.__parent instanceof Module.ComponentParent)
        )
    }

    var domain = location.protocol+'//'+location.host;
    //获取当前页面的uri
    var getPath = function(){
        var url = (domain+location.pathname.replace(/\/+/g, '/'));
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

    var mid = 0;

    var async_mid = 0;

    var getModuleid = function(async){
        var name = '_module_';
        if(!async){
            ++mid;
            name = name + mid;
        }
        else{
            ++async_mid;
            name = name + async + async_mid;
        }
        return name
    }

    var replaceExt = function(str){
        return str.replace(/(\.(js|css))?(\?[\s\S]*)?$/i, '')
    }

    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

    var support = 'onload' in document.createElement('script');

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
    global.console = global.console || {
        log:noop,
        debug:noop,
        error:noop,
        info:noop
    }

    //防止IE6-IE7鼠标hover以及position:fixed时背景图片闪烁
    if(Nui.bsie7){
        document.execCommand('BackgroundImageCache', false, true);
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
    Module.prototype.load = function(callback){
        var mod = this;
        if(!mod.loaded && !/_module_(async_)?\d+/.test(mod.name)){
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
                if(mod.callback){
                    return mod
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
    Module.prototype.resolve = function(callback){
        var mod = this;
        if(mod.alldeps.length && isEmptyObject(mod.depmodules)){
            each(mod.alldeps, function(val){
                var module = Module.getModule(val, [], mod.uri);
                if(callback){
                    mod.loaded = true;
                    module.callback = callback;
                }
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
                if(mod.callback){
                    mod.callback();
                    return mod
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
        methods.require = function(id, data){
            var _mod;
            if(id){
                id = replaceExt(id);
                if(_mod = (mod.depmodules[id] || cacheModules[id] || cacheModules[dirname+id])){
                    if(data){
                        return _mod
                    }
                    return _mod.module || _mod.exports
                }
            }
        }

        methods.require.async = function(id, callback){
            Module.load(id, callback, getModuleid('async_'), mod.uri)
        }

        //继承模块
        methods.extend = function(){
            var module = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);

            if(typeof module === 'string'){
                var _mod = methods.require(module);
                if(_mod === undefined){
                    return module
                }
                module = _mod
            }

            args.unshift(module);

            return Module.getExports.apply(Module, args)
        }

        //导入资源
        methods.imports = function(id){
            return (config.paths.base || '') + id
        }

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
                modules = [
                    methods.require, 
                    methods.imports, 
                    methods.renders, 
                    methods.extend,
                    methods.exports
                ]
            }
            var exports = mod.factory.apply(methods, modules);
            //优先使用return接口
            if(typeof exports === 'undefined'){
                exports = methods.exports
            }
            //组件
            if(isComponent(exports, mod.name)){
                //文件名作为组件名
                var name = mod.name.substr(mod.name.lastIndexOf('/')+1).replace(/\W/g, '');
                if(components[name]){
                    mod.module = components[name]
                }
                else{
                    mod.module = Module.Class(exports, name)
                    mod.exports = mod.module.exports = exports;
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
        //忽略https:// file:/// ....
        path = path.replace(/^(([^:]+:)?\/+)?.+/i, function(str, protocol){
            if(protocol){
                return protocol + str.replace(protocol, '').replace(/\/{2,}/g, '/')
            }
            return str.replace(/\/{2,}/g, '/')
        })

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

    Module.getExports = function(module, members, inserts){
        var exports;

        if(!module && members){
            exports = members
        }
        else if(isArray(module)){
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
                exports._static.__parent = new Module.ComponentParent(module);
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

        return exports
    }

    //创建组件类
    Module.Class = function(exports, name){
        var props = Module.getComponentProps(exports);
        
        var Class = function(options){
            var that = this;
            extend(true, that, props.propertys, {
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

        extend(true, Class, props.statics, {
            __component_name:name
        });

        delete exports._static.__parent;

        extend(true, Class.prototype, props.methods);

        Class.__setMethod(props.apis, components);

        if(typeof Class._init === 'function'){
            Class._init()
        }

        var module = components[name] = function(options){
            return new Class(options)
        }

        module.constructor = Class;

        each(Class, function(v, k){
            if(typeof v === 'function'){
                if(!/^_/.test(k) && k !== 'constructor'){
                    module[k] = function(){
                        return Class[k].apply(Class, arguments)
                    }
                }
                else if(k === '_$fn' || k === '_$ready'){
                    v.call(Class, name, module)
                }
            }
        })

        return module
    }

    Module.getComponentProps = function(exports){
        var props = {
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
                props['statics'] = val
            }
            //实例方法
            else if(typeof val === 'function'){
                props.methods[key] = val;
                if(!/^_/.test(key)){
                    props.apis[key] = true
                }
            }
            //实例属性
            else{
                props.propertys[key] = val
            }
        })

        return props
    }

    Module.ComponentParent = function(module){
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
            id = (typeof uri === 'string' ? uri : dirname) + id;
        }
        id = Module.normalize(id);
        return [id, name, suffix, dirid]
    }

    Module.getModule = function(name, deps, uri){
        var attrs = Module.getAttrs(name, uri);
        var id = attrs[0];
        return cacheModules[attrs[1]] || cacheModules[id] || cacheModules[attrs[3]] || (cacheModules[id] = new Module(attrs, deps))
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
                    var url = val.replace(/^imports|[\('"]/g, '');
                    if(!(/\.[a-zA-Z]$/i).test(url) || (/\.css$/i).test(url)){
                        styles.push(url)
                    }
                }
            })
        }
        return [unique(deps), unique(styles)]
    }

    Module.load = function(id, callback, _module_, isMin){
        //截取入口文件参数，依赖的文件加载时都会带上该参数
        var match = id.match(/(\?[\s\S]*)$/);
        
        if(config.min === true && isMin === true){
            id = replaceExt(id);
            if(!/-min$/.test(id)){
                id += '-min'
            }
        }

        var mod = rootModules[_module_] = Module.getModule(_module_, [id], isMin);

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

        var _callback = function(){
            var _module = mod.depmodules[depname];
            if(type(callback, 'Function')){
                callback.call(Nui, _module.module || _module.exports)
            }
        }

        if(isMin === true){
            Nui[_module_ + '_define'] = function(){
                Module.init.call(Module, arguments, 'pack', _module_)
            }
            mod.modules = [];
            mod.resolve(function(){
                each(mod.modules, function(v){
                    v.exec();
                })
                _callback();
            })
        }
        else{
            mod.callback = function(ids){
                each(ids, function(id){
                    var module = cacheModules[id].exec();
                    if(!isMin){
                        module.loadcss()
                    }
                })
                _callback();
                delete rootModules[_module_];
                delete mod.callback
            }
            mod.load()
        }
    }

    Module.define = function(id, deps, factory){
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

    Module.pack = function(id, deps, factory, _module_){
        var mod = Module.getModule(id, []);
        mod.factory = factory;
        mod.deps = deps;
        mod.loaded = true;
        rootModules[_module_].modules.push(mod);
    }

    Module.init = function(args, name, _module_){
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

        //Nui.define(function(){})
        if(type(params[0], 'Function')){
            params[2] = params[0];
            params[0] = undefined;
            params[1] = [];
        }
        else if(type(params[1], 'Function')){
            params[2] = params[1];
            //Nui.define('id', function(){})
            if(type(params[0], 'String')){
                params[1] = [];
            }
            //Nui.define(['mod1', 'mod2', ..], function(){})
            else{
                params[1] = params[0];
                params[0] = undefined;
            }
        }

        Module[name](params[0], params[1], params[2], _module_)
    }

    Module.loader = function(isMin){
        return function(id, callback){
            if(id && typeof id === 'string'){
                Module.load(id, callback, getModuleid(), isMin)
            }
            return Nui
        }
    }

    Nui.__moduleExtend = function(){
        var name = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        var exports = Module.getExports.apply(Module, args);
        if(isComponent(exports, name)){
            if(components[name]){
                exports = components[name]
            }
            else{
                var _exports = exports;
                exports = Module.Class(exports, name);
                exports.exports = _exports
            }
        }
        return exports
    }

    Nui.load = Module.loader(true);

    //不会生成压缩文件
    Nui.use = Module.loader();

    Nui.define = function(){
        Module.init.call(Module, arguments, 'define')
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

    return Nui
})