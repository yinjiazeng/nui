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
        // Nui.type('nui', 'String') => true
        // Nui.type(['nui'], ['Object', 'Array']) => true
        type:function(obj, type){
            if(obj === null || obj === undefined){
                return false
            }
            if(type === 'PlainObject'){
                return isPlainObject(obj)
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
        extend:function(){
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
        		target = this;
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
        				if(deep && copy && (Nui.type(copy, 'PlainObject') || (copyIsArray = Nui.type(copy, 'Array')))){
        					if(copyIsArray){
        						copyIsArray = false;
        						clone = src && Nui.type(src, 'Array') ? src : [];
        					}
                            else{
        						clone = src && Nui.type(src, 'PlainObject') ? src : {};
        					}
        					target[name] = Nui.extend(deep, clone, copy);
        				}
                        else if(copy !== undefined){
        					target[name] = copy;
        				}
        			}
        		}
        	}
        	return target;
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

    if(typeof jQuery !== 'undefined'){
        Nui.win = jQuery(window);
        Nui.doc = jQuery(document);
    }

    var isType = function(type){
        return function(obj){
            return {}.toString.call(obj) === '[object ' + type + ']'
        }
    }

    var core_hasOwn = Object.prototype.hasOwnProperty;

    var isPlainObject = function(obj){
        if(!obj || !Nui.type(obj, 'Object') || obj.nodeType || obj == obj.window){
			return false;
		}
		try{
			if(obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')){
				return false;
			}
		}
        catch(e){
			return false;
		}
		var key;
		for(key in obj){}
		return key === undefined || core_hasOwn.call(obj, key);
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

    //修复 IE7-hover以及fixed时背景图片闪烁
    if(Nui.browser.msie && Nui.browser.version <= 7){
        document.execCommand('BackgroundImageCache', false, true);
    }

    //获取当前页面的uri
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
        paths:{},
        alias:{}
    }

    //讲道理说，文件在被加载完毕后会立即执行define方法，在onload(onreadystatechange IE9-)事件中得到moduleData，这个过程是同步的
    //但是在IE9-中，高概率出现不同步情况，就是在onreadystatechange事件中得到moduleData值不是当前文件数据，原因在于执行onload时，其它模块刚好被加载，被重新赋值了
    //IE9-中文件被加载会有5个状态 uninitialized > loading > loaded > interactive > complete
    //脚本被执行时可以通过dom节点获取到node.readyState值为interactive，而该节点一定是当前加载的脚本节点
    //小概率出现节点被添加到dom后会立即执行define，可能是由于IE的缓存原因，利用它可以降低性能的消耗
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

    var Module = function(name, id, suffix, deps){
        var mod = this;
        //define实参中依赖模块名
        mod.deps = deps||[];
        //所有依赖模块名
        mod.alldeps = mod.deps;
        //所有依赖模块
        mod.depmodules = {};
        //模块名
        mod.name = name;
        //模块唯一id
        mod.id = id;
        //模块url参数
        mod.parameter = '';
        //文件后缀 -debug和-min
        mod.suffix = suffix;
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
        if(isEmptyObject(mod.depmodules)){
            Nui.each(mod.alldeps, function(val){
                var module = Module.getModule(val, [], mod.uri);
                module.parameter = mod.parameter;
                mod.depmodules[val] = module.loaded ? module : module.load()
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
            Nui.each(roots, function(root){
                if(root.callback){
                    root.callback()
                }
            })
        }
        return mod
    }

    //判断所有依赖是否加载完毕
    Module.prototype.alload = function(){
        var mod = this;
        var modules = [];
        Nui.each(roots, function(root){
            modules = modules.concat(Nui.unique(root.getModules()))
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

    Module.prototype.setFactory = function(){
        var mod = this;
        var factory = mod.factory;

        factory.require = function(id, options){
            return Module.require(mod.depmodules[id], options)
        }

        factory.exports = function(module, options){
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
                return Nui.extend(true, [], module, options)
            }
            else if(Nui.type(module, 'Function')){
                if(module.exports){
                    return Nui.extend(true, {}, module.exports, options)
                }
                return Nui.extend(true, noop, module, options)
            }
            else if(Nui.type(module, 'Object')){
                return Nui.extend(true, {}, module, options)
            }
            else{
                return module
            }
        }

        return factory
    }

    Module.prototype.exec = function(){
        var mod = this;
        if(!mod.module && Nui.type(mod.factory, 'Function')){
            var factory = mod.setFactory();
            var modules = [];
            Nui.each(mod.deps, function(val){
                if(val !== 'component'){
                    modules.push(factory.require(val))
                }
            })
            var exports = factory.apply(factory, modules);
            if(Nui.type(exports, 'Object') && Nui.type(exports._init, 'Function')){
                var obj = {
                    attr:{},
                    proto:{}
                }
                Nui.each(exports, function(val, key){
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
                mod.module.exports = exports;
                if(mod.name !== 'component'){
                    var name = mod.name;
                    var index = name.lastIndexOf('/');
                    name = name.substr(index+1).replace(/\{[^\{\}]+\}/g, '');
                    Nui.each(['$', '$fn', '$ready'], function(v){
                        if(Nui.type(module[v], 'Function')){
                            module[v](name, module)
                        }
                    })
                }
            }
            else{
                mod.module = exports;
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
                delete that.static;
                that._init()
            }
        }
        Nui.extend(true, Class, module, object.static);
        Nui.extend(true, Class.prototype, module.prototype, object.proto);
        Class.prototype.constructor = Class.prototype._self = Class;
        return Class
    }

    Module.require = function(mod, factory){
        if(mod){
            var module = mod.module;
            if(Nui.type(factory, 'Object')){
                return new module(factory)
            }
            else if(Nui.type(factory, 'String')){
                return module[factory]
            }
            //因为对象和数组是引用的，使用时需拷贝
            if(Nui.type(module, 'Object')){
                return Nui.extend({}, module)
            }
            else if(Nui.type(module, 'Array')){
                return Nui.extend([], module)
            }
            return module
        }
    }

    Module.setPath = function(id){
        var pathMatch = /\{([^\{\}]+)\}/.exec(id);
        if(pathMatch){
            var path = config.paths[pathMatch[1]];
            if(path){
                id = id.replace(pathMatch[0], path).replace(/(\.js)?(\?[\s\S]*)?$/g, '');
            }
        }
        return id
    }

    Module.setId = function(id, retname, uri){
        // xxx.js?v=1.1.1 => xxx
        var name = id.replace(/(\.js)?(\?[\s\S]*)?$/g, '');
        var match = name.match(/(-debug|-min)$/g);
        var suffix = '';
        if(match){
            name = name.replace(/(-debug|-min)$/g, '');
            suffix = match[0]
        }
        var urid;
        id = Module.setPath(config.alias[name] || name);
        if(!/^(http|https|file):\/\//.test(id)){
            urid = Module.replacePath(dirname + id);
            id = (uri||dirname) + id;
        }
        id = Module.replacePath(id);
        if(retname){
            return [id, name, urid, suffix]
        }
        return id
    }

    Module.getModule = function(name, deps, uri){
        var arr = Module.setId(name, true, uri);
        var id = arr[0];
        var name = arr[1];
        var urid = arr[2];
        var suffix = arr[3];
        arr = null;
        return cacheModules[name] || cacheModules[id] || cacheModules[urid] || (cacheModules[id] = new Module(name, id, suffix, deps))
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
                console.log(cacheModules)
                var modules = Nui.unique(mod.getModules());
                var module;
                Nui.each(modules, function(val){
                    var _mod = cacheModules[val].exec();
                    if(!!_mod.module && (mod.id === _mod.id || (mod.depmodules[id] && mod.depmodules[id].id === _mod.id))){
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
        var match = str.match(/(require|exports)\(('|")[^'"]+\2/g);
        if(match){
            Nui.each(match, function(val){
                deps.push(val.replace(/^(require|exports)|[\('"]/g, ''))
            })
        }
        return deps
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

        var alldeps = Nui.unique(deps.concat(Module.getdeps(factory.toString())))

        if(id && !cacheModules[id] && !cacheModules[Module.setId(id)]){
            var mod = Module.getModule(id, alldeps);
            mod.deps = deps;
            mod.factory = factory;
            mod.loaded = true;
            mod.load()
        }

        moduleData = {
            name:id,
            deps:deps,
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
            Nui.extend(true, config, key)
        }
        else if(Nui.type(key, 'String') && value){
            Nui.extend(true, config[key], value)
        }
        if(config.paths.base){
            Nui.each(config.paths, function(v, k){
                if(k !== 'base' && !/^(http|https|file):\/\//.test(v)){
                    config.paths[k] = config.paths.base+'/' + v
                }
            })
        }
    }

})(this, document)

/**
 * @filename util.js
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
            if($.browser.msie && $.browser.version == '8.0'){
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
    },
    getSize:function(selector, dir, attr){
        var size = 0;
        attr = attr || 'border';
        dir = dir || 'tb';
        if(attr === 'all'){
            return this.getSize(selector, dir) + this.getSize(selector, dir, 'padding')
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
    }
})

/**
 * @filename template.js
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎
 */

Nui.define('template', ['util'], function(util){
    var template = function(tplid, source){
        var ele = document.getElementById(tplid);
        if(ele && ele.nodeName==='SCRIPT'){
            source = source||{};
            return render(ele.innerHTML, source)
        }
        return ''
    }

    var methods = {
        'each':Nui.each,
        'trim':Nui.trim,
        'format':util.formatDate,
        'seturl':util.setParam
    }

    template.method = function(method, callback){
        if(!methods[method]){
            methods[method] = callback
        }
    }

    template.config = {
        startTag:'{{',
        endTag:'}}'
    }

    var render = function(tpl, source){
        var start = template.config.startTag, end = template.config.endTag, code = '';
        Nui.each(Nui.trim(tpl).split(start), function(val, key){
            val = Nui.trim(val).split(end);
            if(key >= 1){
                code += compile(Nui.trim(val[0]), true)
            }
            else{
                val[1] = val[0];
            }
            code += compile(val[1].replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/[\n\r]+/g, ''))
        });
        code = 'var that=this, code=""; with(data){'+code;
        code += '};that.echo=function(){return code;}';
        var Result = new Function('data', code);
        Result.prototype = methods;
        return new Result(source).echo()
    }

    var compile = function(code, logic){
        var modle, echo;
        if(logic){
            if((modle = match(code, 'if')) !== false){
                echo = 'if('+modle+'){'
            }
            else if((modle = match(code, 'elseif')) !== false){
                echo = '}else if('+modle+'){'
            }
            else if((modle = match(code, 'else')) !== false){
                echo = '}else{'
            }
            else if(match(code, '/if') !== false){
                echo = '}'
            }
            else if((modle = match(code, 'each')) !== false){
                modle = modle.split(/\s+/);
                echo = 'that.each('+ modle[0] +', function('+modle[1];
                if(modle[2]){
                    echo += ', '+modle[2]
                }
                echo += '){'
            }
            else if(match(code, '/each') !== false){
                echo = '});'
            }
            else if((modle = match(code, '|')) !== false){
                modle = modle.split(/\s+/);
                echo = 'code+=that.'+modle[0]+'('+ modle.slice(1).toString() +');'
            }
            else{
                echo = 'code+='+code+';'
            }
        }
        else{
            echo = 'code+=\''+code+'\';'
        }
        return echo
    }

    var match = function(string, filter){
        if(string.indexOf(filter) === 0 || (filter === '|' && string.indexOf(filter) > 0)){
            return Nui.trim(string.replace(filter, ''))
        }
        return false
    }

    template.render = render;

    return template
})

/**
 * @filename component.js
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

Nui.define('component', ['template'], function(tpl){
    
    return ({
        static:{
            index:0,
            box:{},
            options:{},
            config:function(key, value){
                if(Nui.type(key, 'Object')){
                    Nui.extend(true, this.options, key)
                }
                else if(Nui.type(key, 'String')){
                    this.options[key] = value
                }
            },
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
            $ready:function(name, module){
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
            delete that._self.box[that.index]
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.elem){
                that.elem.remove();
            }
        },
        _tpl2html:function(html, data){
            return tpl.render(html, data)
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
})
