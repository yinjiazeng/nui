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
            if(type === 'PlainObject'){
                return isPlainObject(obj)
            }
            if(isType('Array')(type)){
                var ret = false;
                Nui.each(type, function(k, v){
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
        // Nui.unique(['1', '2', '1']) => ['1', '2']
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
            var src, copyIsArray, copy, name, options, clone,
        		target = arguments[0] || {},
        		i = 1,
        		length = arguments.length,
        		deep = false;
        	if(Nui.type(target, 'Boolean')){
        		deep = target;
        		target = arguments[1] || {};
        		i = 2;
        	}
        	if(!Nui.type(target, 'Object') && !Nui.type(target, 'Function')){
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

    var isType = function(type){
        return function(obj){
            return {}.toString.call(obj) == '[object ' + type + ']'
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
        base:'',
        paths:{},
        alias:{}
    }

    //paths的完整路径是base+path
    //将别名值中的{name}替换为paths中对应的值
    var compileAlias = function(){
        Nui.each(config.alias, function(key, val){
            Nui.each(config.paths, function(k, path){
                if(config.base && !/^(http|https|file):\/\//.test(path)){
                    path = config.base + path
                }
                config.alias[key] = val.replace(new RegExp('{'+ k +'}', 'g'), path).replace(/(\.js)?(\?[\s\S]*)?$/g, '')
            })
        })
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
        moduleData = null
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
            Nui.each(mod.alldeps, function(key, val){
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
            Nui.each(mod.depmodules, function(key, val){
                modules = val.getModules(modules)
            })
        }
        return modules
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

    //判断所有依赖是否加载完毕
    Module.prototype.alload = function(){
        var mod = this;
        var modules = [];
        Nui.each(roots, function(k, root){
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

    Module.prototype.exec = function(){
        var mod = this;
        if(!mod.module && Nui.type(mod.factory, 'Function')){
            var require = function(id, factory){
                return Module.require(mod.depmodules[id], factory)
            }
            var modules = [require];
            Nui.each(mod.deps, function(key, val){
                if(val !== 'component'){
                    modules.push(require(val))
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
                    Nui.each(['$', '$fn', '$ready'], function(k, v){
                        if(Nui.type(module[v], 'Function')){
                            module[v](name, module)
                        }
                    })
                }
            }
            else{
                mod.module = exports
            }
            mod.module.exports = exports
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

    Module.require = function(mod, factory){
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
        id = config.alias[name] || name;
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
                var modules = Nui.unique(mod.getModules());
                var module;
                Nui.each(modules, function(key, val){
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
        var match = str.match(/require\(('|")[^'"]+\1\)/g);
        if(match){
            Nui.each(match, function(key, val){
                deps.push(val.replace(/(require)|[\(\)'"]/g, ''))
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

        var alldeps = deps.concat(Module.getdeps(factory.toString()))

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
                var mod = Module.getModule(script.id);
                if(mod){
                    mod.onload(script, function(){
                        return moduleData
                    })()
                }
            }
        }
    }

    Nui.copy = function(module){
        return Nui.extend({}, module.exports)
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

Nui.define('template', function(require){
    var template = function(tplid, source){
        var ele = document.getElementById(tplid);
        if(ele && ele.nodeName==='SCRIPT'){
            source = source||{};
            return render(ele.innerHTML, source)
        }
        return ''
    }

    var methods = {}

    var trim = function(str){
        return str.replace(/(^\s*)|(\s*$)/g, '')
    }

    template.config = {
        startTag:'{{',
        endTag:'}}'
    }

    template.method = function(method, fn){
        if(methods[method] && method === 'each'){
            return
        }
        methods[method] = fn
    }

    template.method('each', function(data, fn){
        for(i in data){
            fn.call(data, data[i], i)
        }
    })

    template.method('trim', function(str){
        return trim(str)
    })

    var render = function(tpl, source){
        var start = template.config.startTag, end = template.config.endTag, code = '';
        methods.each(trim(tpl).split(start), function(val, key){
            val = trim(val).split(end);
            if(key >= 1){
                code += compile(trim(val[0]), true)
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
            return trim(string.replace(filter, ''))
        }
        return false
    }

    template.render = render;

    return template
})

/**
 * @filename tpl.ext.js
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎扩展
 */

Nui.define('template.ext', ['util', 'template'], function(require, util, tpl){
    //格式化日期
    tpl.method('format', function(timestamp, format){
        return util.formatDate(timestamp, format)
    })
    //设置url参数
    tpl.method('seturl', function(name, value, url){
        return util.setParam(name, value, url)
    })
    return tpl
})

/**
 * @filename component.js
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

Nui.define('component', ['template'], function(require, tpl){
    Nui.win = $(window);
    Nui.doc = $(document);

    return ({
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

/**
 * @filename placeholder.js
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description 输入框占位符
 */

Nui.define('placeholder', ['component', 'util'], function(require, util){
    return ({
        static:{
            support:function(){
                return util.supportHtml5('placeholder', 'input')
            }
        },
        options:{
            /**
             * @func 是否启用动画显示展示
             * @type <Boolean>
             */
            animate:false,
            /**
             * @func 输入框值是否可以和占位符相同
             * @type <Boolean>
             */
            equal:false,
            /**
             * @func 占位符文本颜色
             * @type <String>
             */
            color:'#ccc'
        },
        tpl:{
            wrap:'<strong \
                    class="nui-placeholder{{if theme}} t-placeholder-{{theme}}{{/if}}" style="\
                    {{each style val key}}\
                        {{key}}:{{val}};\
                    {{/each}}\
                    " />',
            elem:'<b style="\
                    {{each style val key}}\
                        {{key}}:{{val}};\
                    {{/each}}\
                    ">{{text}}</b>'
        },
        _init:function(){
            var that = this;
            that.target = that._getTarget();
            that.text = $.trim(that.target.attr('placeholder'));
            return that._create()
        },
        _create:function(){
            var that = this, opts = that.options;
            if(opts.animate){
                that.target.removeAttr('placeholder')
            }
            if(opts.animate || (!opts.animate && !that._self.support())){
                that.target.wrap(that._tpl2html(that.tpl.wrap, {
                        theme:opts.theme,
                        style:{
                            'position':'relative',
                            'display':'inline-block',
                            'width':that.target.outerWidth()+'px',
                            'overflow':'hidden',
                            'cursor':'text'
                        }
                    }))
                that.elem = $(that._tpl2html(that.tpl.elem, {
                        text:that.text,
                        style:(function(){
                            var height = that.target.outerHeight();
                            var isText = that.target.is('textarea');
                            return ({
                                'position':'absolute',
                                'left':util.getSize(that.target, 'l', 'padding')+util.getSize(that.target, 'l')+'px',
                                'top':util.getSize(that.target, 't', 'padding')+util.getSize(that.target, 't')+'px',
                                'height':isText ? 'auto' : height+'px',
                                'line-height':isText ? 'normal' : height+'px',
                                'color':opts.color
                            })
                        })()
                    })).insertAfter(that.target)

                that._event()
            }
            else{
                that._setStyle()
            }
            return that
        },
        _setStyle:function(){
            var that = this, opts = that.options;
            that.className = 'nui-placeholder-'+that.index;
            that.target.addClass(that.className);
            if(!that._self.style){
                that._createStyle()
            }
            that._createRules()
        },
        _createStyle:function(){
            var that = this;
            var style = document.createElement('style');
            document.head.appendChild(style);
            that._self.style = style.sheet
        },
        _createRules:function(){
            var that = this;
            var sheet = that._self.style;
            var index = that.index;
            try{
                sheet.deleteRule(index)
            }
            catch(e){}
            $.each(['::-webkit-input-placeholder', ':-ms-input-placeholder', '::-moz-placeholder'], function(k, v){
                var selector = '.'+that.className+v;
                var rules = 'opacity:1; color:'+(that.options.color||'');
                try{
                    if('addRule' in sheet){
                        sheet.addRule(selector, rules, index)
                    }
                    else if('insertRule' in sheet){
                        sheet.insertRule(selector + '{' + rules + '}', index)
                    }
                }
                catch(e){}
            })
        },
        _event:function(){
            var that = this, opts = that.options;
            var pleft = util.getSize(that.target, 'l', 'padding') + util.getSize(that.target, 'l');
            that._on('click', that.elem, function(){
                that.target.focus()
            })

            that._on('focus', that.target, function(){
                opts.animate && that.elem.stop(true, false).animate({left:pleft+10, opacity:'0.5'});
            })

            that._on('blur change', that.target, function(){
                var val = $.trim(that.target.val());
                if((!opts.equal && val == that.text) || !val){
                    that.target.val('');
                    that.elem.show();
                    opts.animate && that.elem.stop(true, false).animate({left:pleft, opacity:'1'})
                }
                else{
                    that.elem.hide()
                }
            })

            that._on('keyup keydown', that.target, function(){
                $.trim(that.target.val()) ? that.elem.hide() : that.elem.show()
            })

            that.target.blur()
        },
        _reset:function(){
            var that = this;
            if(that.elem){
                that.elem.remove();
                that.target.unwrap();
                that.target.attr('placeholder', that.text)
            }
        }
    })
})

/**
 * @filename layer.js
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer弹出层
 */

 Nui.define('layer', {
     static:{
         zIndex:10000,
         mask:null
     },
     options:{
         //宽度, 整数
         width:0,
         //高度，整数或者auto
         height:'auto',
         //最大高度，height设置为auto时可以使用
         maxHeight:0,
         //内容，字符串或者jQuery对象
         content:'',
         //1.自定义皮肤主题；2.layer标识，隐藏特定的layer：layerHide(theme);
         theme:'',
         //最大尺寸距离窗口边界边距
         padding:50,
         //弹出层容器，默认为body
         container:'body',
         //定时关闭时间，单位/毫秒
         timer:0,
         //是否淡入方式显示
         isFadein:true,
         //是否开启弹出层动画
         isAnimate:true,
         //是否可以移动
         isMove:true,
         //是否有遮罩层
         isMask:true,
         //点击遮罩层是否关闭弹出层
         isClickMask:false,
         //是否有移动遮罩层
         isMoveMask:false,
         //是否能被laierHide()方法关闭，不传参数
         isClose:true,
         //是否居中
         isCenter:false,
         //是否自适应最大尺寸显示
         isMaxSize:false,
         //是否是ui提示层
         isTips:false,
         //点击layer是否置顶
         isSticky:false,
         //是否固定弹出层
         isFixed:false,
         //是否显示滚动条
         scrollbar:true,
         //标题
         title:{
             enable:true,
             text:''
         },
         //载入浮动框架
         iframe:{
             enable:false,
             cache:false,
             //跨域无法自适应高度
             src:''
         },
         //显示位置
         offset:{
             //是否基于前一个层进行偏移
             isBasedPrev:false,
             top:null,
             left:null
         },
         //小箭头，方向：top right bottom left
         arrow:{
             enable:false,
             dir:'top'
         },
         close:{
             enable:true,
             text:'×',
             /**
              * @func 弹出层关闭前执行函数，
              * @param main:$('.ui-layer-main')
              * @param index:弹出层索引
              * @param event 事件对象
              */
             callback:null
         },
         //确认按钮，回调函数return true才会关闭弹层
         confirm:{
             enable:false,
             text:'确定',
             /**
              * @func 回调函数
              * @param main:$('.ui-layer-main')
              * @param index:弹出层索引
              * @param button:当前触发按钮
              * @param event:事件对象
              */
             callback:null
         },
         //取消按钮
         cancel:{
             enable:false,
             text:'取消',
             /**
              * @func 回调函数
              * @param main:$('.ui-layer-main')
              * @param index:弹出层索引
              * @param event 事件对象
              */
             callback:null
         },
         //按钮配置，会覆盖confirm和cancel
         button:null,
         /**
          * @func 弹出层显示时执行
          * @param main:$('.ui-layer-main')
          * @param index:弹出层索引
          */
         onShow:null,
         /**
          * @func 弹出层关闭时执行
          * @param main:$('.ui-layer-main')
          * @param index:弹出层索引
          */
         onHide:null,
         /**
          * @func 弹出层大小、位置改变后执行函数
          * @param main:$('.ui-layer-main')
          * @param index:弹出层索引
          */
         onResize:null,
         /**
          * @func window窗口改变大小时执行函数
          * @param layer:$('.ui-layer')
          * @param width:窗口宽度
          * @param height:窗口高度
          * @param event 事件对象
          */
         onWinRisize:null,
         /**
          * @func window窗口滚动时执行函数
          * @param layer:$('.ui-layer')
          * @param scrollTop:窗口滚动高度
          * @param event 事件对象
          */
         onWinScroll:null,
         /**
          * @func 遮罩层点击回调函数
          * @param layer:$('.ui-layer')
          * @param mask 遮罩层选择器
          * @param event 事件对象
          */
         onMaskClick:null
     },
     size:{
         width:0,
         height:0
     },
     offset:{
         top:0,
         left:0
     },
     width:410,
     height:220,
     title:'温馨提示',
     _init:function(){
         var that = this, options = that.options;
         that.wrap = Nui.window;
         if(typeof options.container === 'string'){
             options.container = $(options.container||'body')
         }
         if(options.container.get(0) === undefined){
             options.container = $('body')
         }
         if(options.container.get(0).tagName !== 'BODY'){
             options.isFixed = false;
             that.wrap = options.container.css({position:'relative'})
         }
         that.createHtml().show().bindClick();
         if(options.isMove === true && options.title.enable === true){
             that._move()
         }
         if(typeof options.onWinRisize === 'function'){
             that.on(Nui.window, 'resize', function(e){
                 options.onWinRisize(that.layer, that.wrap.width(), that.wrap.height(), e)
             })
         }
         if(typeof options.onWinScroll === 'function'){
             that.on(Nui.window, 'scroll', function(){
                 options.onWinScroll(that.layer, Nui.window.scrollTop(), e)
             })
         }
         return that
     }
 })

/**
 * @filename layer.ext.js
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer扩展
 */

Nui.define('layer.ext', ['layer'], function(require, Layer){
    $.layer.alert = function(){
        return new Layer({

        })
    }
    return $.layer
})
