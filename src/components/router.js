/**
 * @author Aniu[2017-02-27 23:46]
 * @update Aniu[2018-01-02 21:25]
 * @version 1.0.2
 * @description 路由
 */

Nui.define(function(require){
    var component = require('../core/component');
    var template = require('../core/template');
    var events = require('../core/events');
    var request = require('../core/request');

    var statics = {
        _paths:{},
        _request:{},
        _init:function(){
            var self = this;
            Nui.doc.on('click', '.nui-router-back', function(){
                return self.back()
            }).on('click', '.nui-router-forward', function(){
                return self.forward()
            })
        },
        _setPaths:function(rule, paths){
            if(!this._paths[rule]){
                this._paths[rule] = paths
            }
        },
        _replace:function(hash){
                        //IE8-中 A标签href属性会被添加上域名，将其移除
            return hash.replace(location.protocol+'//'+location.host, '')
                        //移除空白
                       .replace(/\s+/g, '')
                       //移除 #!前缀
                       .replace(/^\#\!?/, '')
                       //开头添加斜杠
                       .replace(/^([^\/])/, '/$1')
                       //移除末尾斜杠
                       .replace(/\/$/, '');
        },
        _getWrapper:function(container){
            return $('<div class="nui-router-wrapper"></div>').appendTo(container)
        },
        _split:function(url){
            var ret = {
                url:url,
                params:{}
            }
            var match = url.match(/\?[^\/\s]+$/);
            if(match){
                var params = match[0];
                ret.url = url.replace(params, '');
                params = params.replace('?', '').split('&');
                Nui.each(params, function(v, k){
                    var arr = v.split('=');
                    ret.params[arr[0]] = arr[1]
                })
            }
            return ret;
        },
        _change:function(){
            var self = this, hashTemp = location.hash, 
                ret = this._split(hashTemp), hash = self._replace(ret.url), 
                query = ret.params;
            self.isRender = false;
            Nui.each(self._paths, function(v){
                if(hash === v.path || hash.indexOf(v.path + '/') === 0){
                    var _hash = hash.replace(v.path, '').replace(/^\//, '');
                    var params = _hash ? _hash.split('/') : [];
                    var object = self.__instances[v.id], opts = object._options;
                    var match = params.length === v.params.length;
                    if(match){
                        //router.location强制刷新或者公共容器才会重新渲染
                        var isRender = object._isRender === true || !object._wrapper;
                        var changed;
                        delete object._isRender;

                        if(opts.wrapper && !object._wrapper){
                            if(typeof opts.wrapper !== 'boolean'){
                                object._wrapper = object.container.children(opts.wrapper)
                            }
                            else{
                                object._wrapper = self._getWrapper(object.container)
                            }
                        }
                        else if(!opts.wrapper && !self._wrapper){
                            self._wrapper = self._getWrapper(object.container)
                        }

                        if(isRender){
                            if(object.rendered){
                                opts.data = Nui.extend(true, {}, object._defaultOptions.data)
                            }
                            
                            //取消前一个页面的所有请求
                            Nui.each(self._request, function(v, i){
                                var obj = self.__instances[i];
                                if(!obj._options.wrapper || obj === object){
                                    Nui.each(v, function(xhr, url){
                                        xhr.abort()
                                    })
                                    delete self._request[i]
                                }
                            })
                        }

                        self._active = {
                            path:v.path+'/',
                            url:hash+'/',
                            params:{},
                            query:query
                        }

                        Nui.each(v.params, function(val, key){
                            self._active.params[val] = params[key]
                        })

                        Nui.each(query, function(val, key){
                            self._active.params[val] = query[key]
                        })

                        opts.data = Nui.extend(true, opts.data, self._active)

                        var wrapper = opts.element = object._wrapper || self._wrapper
                        
                        var callback = function(){
                            wrapper.show().siblings('.nui-router-wrapper').hide()

                            if(typeof opts.onAfter === 'function'){
                                opts.onAfter.call(opts, object)
                            }

                            if(Nui.bsie7){
                                self._setHistory(hashTemp)
                            }

                            self.isRender = true
                        }

                        if(object._sendData && typeof opts.onData === 'function'){
                            opts.onData.call(opts, object._sendData.data, object);
                            delete object._sendData;
                        }
                        
                        if(typeof opts.onChange === 'function'){
                            changed = opts.onChange.call(opts, object)
                        }

                        //true不渲染，但是执行onAfter
                        if(typeof changed === 'boolean'){
                            if(changed === true){
                                callback()
                            }
                            else{
                                self.isRender = true
                            }
                            return false
                        }
                            
                        if(isRender){
                            wrapper.off();
                            object.render.call(object);
                            if(typeof opts.onInit === 'function'){
                                opts.onInit.call(opts, object);
                            }
                            events.call(opts);
                            object.rendered = true;
                        }

                        callback()
                        return false
                    }
                }
            })

            if(!self.isRender){
                //检测当前路由地址是否存在，不存在则跳转到入口页面
                Nui.each(self.__instances, function(v){
                    if(v._options.entry === true){
                        if(v.target){
                            v._render(v.target.eq(0));
                        }
                        else if(v.path){
                            v._render(v.path);
                        }
                        return false
                    }
                })
            }
            
            self._oldhash = hashTemp;
        },
        _bindHashchange:function(){
            var self = this;
            if(Nui.bsie7){
                var hashchange = function(ret){
                    var hash = location.hash;
                    if(self._oldhash !== hash){
                        return !ret
                    }
                    return false
                }
                setInterval(function(){
                    if(hashchange()){
                        self._change()
                    }
                }, 100);
                hashchange(true)
            }
            else{
                Nui.win.on('hashchange', function(){
                    self._change()
                })
            }
        },
        _$ready:null,
        _$fn:null,
        init:null,
        start:function(value){
            this._change()
        },
        location:function(url, data, render){
            var self = this;
            if(url){
                if(arguments.length <=2 && typeof data === 'boolean'){
                    render = data;
                    data = null;
                }
                var temp, object, query = '';
                var match = url.match(/\?[^\/\s]+$/);
                if(match){
                    query = match[0]
                }
                url = this._replace(url.replace(/\?[^\/\s]+$/, ''));
                Nui.each(this._paths, function(val, rule){
                    if(rule === url || (url.indexOf(val.path) === 0 &&
                                        (temp = url.replace(new RegExp('^'+val.path), '').replace(/^\//, '')) && 
                                        temp.split('/').length === val.params.length)){
                                            object = self.__instances[val.id];
                        return false
                    }
                })
                if(object){
                    object._sendData = {
                        data:data
                    }
                    object._isRender = render;
                    object._render(url + query)
                }
            }
            else{
                self.start()
            }
        },
        active:function(){
            return this._active
        },
        forward:function(index){
            history.forward(index);
            return false
        },
        back:function(index){
            history.back(index);
            return false
        }
    }

    if(Nui.bsie7){
        statics._history = [];
        statics._setHistory = function(hash){
            if(!this._isHistory){
                var last = this._history.slice(-1);
                if(!last.length || last[0].hash !== hash){
                    Nui.each(this._history, function(val){
                        val.active = false
                    });
                    this._history.push({
                        hash:hash,
                        active:true
                    })
                }
            }
            this._isHistory = false;
        }
        Nui.each(['forward', 'back'], function(v){
            var value = v==='forward' ? 1 : -1;
            statics[v] = function(){
                var self = this, len = self._history.length;
                statics._isHistory = true;
                Nui.each(self._history, function(val, i){
                    var index = i + value;
                    if(val.active){
                        //历史记录在起始或者末尾时，调用原生的记录
                        if(index === -1 || index === len){
                            window.history[v]();
                            return false
                        }
                        var _history = self._history[index];
                        if(_history){
                            location.hash = _history.hash;
                            _history.active = true;
                        }
                        val.active = false;
                        return false
                    }
                })
                return false
            }
        })
    }

    return this.extend(component, {
        _static:statics,
        _options:{
            path:'',
            template:'',
            container:null,
            data:{},
            entry:false,
            wrapper:false,
            level:2,
            onBefore:null,
            onChange:null,
            onData:null,
            onRender:null,
            onInit:null,
            onAfter:null
        },
        _init:function(){
            var self = this, router = self.constructor;
            if(self._exec() && !router._bind){
                router._bind = true;
                router._bindHashchange();
            }
        },
        _exec:function(){
            var self = this, opts = self._options;
            if(opts.path && (self.container = self._jquery(opts.container))){
                self._initPath();
                self._setPaths();
                if(self._getTarget()){
                    self._event()
                }
                return self
            }
        },
        _setPaths:function(){
            var self = this, opts = self._options, router = self.constructor;
            var paths = self._getPathData();
            var len = paths.params.length;
            if((!len && opts.level === 1) || opts.level !== 1){
                router._setPaths(paths.rule, paths)
            }
            if(len && opts.level > 0){
                var params = [], split = '/:', param, sub;
                while(param = paths.params.shift()){
                    params.push(param);
                    sub = params.join(split);
                    router._setPaths(paths.rule+split+sub, Nui.extend({}, paths, {
                        params:sub.split(split)
                    }))
                }
            }
        },
        _initPath:function(){
            var self = this, opts = self._options, router = self.constructor;
            self.path = router._replace(opts.path)
        },
        _getPathData:function(){
            var self = this, path = self.path, opts = self._options, index = path.indexOf('/:');
            var paths = {
                id:self.__id,
                params:[],
                rule:path,
                path:path
            }
            if(index !== -1){
                paths.params = path.substr(index+2).split('/:');
                self.path = paths.path = path.substr(0, index);
                if(opts.level > 0){
                    paths.rule = paths.path;
                }
            }
            return paths
        },
        _render:function(url){
            var self = this, opts = self._options, href = url instanceof jQuery ? url.attr('href') : url, router = self.constructor;
            if(href){
                var trigger = false;
                var change = function(callback){
                    trigger = true;
                    var hash = '#!'+router._replace(href);
                    var _hash = location.hash;
                    if(typeof callback === 'function'){
                        hash = callback(hash) || hash;
                    }
                    if(_hash === hash && self._isRender === true){
                        router._change()
                    }
                    else{
                        location.hash = hash
                    }
                }
                if(typeof opts.onBefore === 'function' && opts.onBefore.call(opts, change) === false){
                    return false
                }
                if(!trigger){
                    change()
                }
            }
        },
        _event:function(){
            var self = this, opts = self._options;
            self._on('click', Nui.doc, self.target, function(e, elem){
                self._render(elem);
                e.preventDefault()
            })
            return self
        },
        _reset:function(){
            var self = this, router = self.constructor;
            self._off();
            Nui.each(router._paths, function(val, i){
                if(val.id === self.__id){
                    delete router._paths[i];
                    delete router._request[i];
                }
            })
            return self
        },
        render:function(){
            var self = this, opts = self._options, tmpl = opts.template, wrapper = self._wrapper || self.constructor._wrapper;
            if(wrapper){
                component.destroy(wrapper);
                if(tmpl){
                    if(typeof tmpl === 'string'){
                        wrapper.html(template.render(tmpl, opts.data));
                    }
                    else{
                        wrapper.html(template.render.call(tmpl, tmpl.main, opts.data));
                    }
                }
                component.init(wrapper);
                self._callback('Render')
            }
        },
        request:function(){
            var self = this, 
                _class = self.constructor, 
                args = arguments, 
                type = args[0], 
                method, url;
            if(type){
                if(typeof type === 'string' && request[type]){
                    args = Array.prototype.slice.call(arguments, 1);
                    url = args[0];
                    method = request[type]
                }
                else if(typeof type === 'object'){
                    url = type.url;
                    method = request
                }
                var _request = _class._request[self.__id];
                if(!_request){
                    _request = _class._request[self.__id] = {}
                }
                if(method && url){
                    var xhr = method.apply(request, args);
                    var callback = function(){
                        delete _request[url]
                    }
                    _request[url] = xhr;
                    xhr.then(callback, callback);
                    return xhr
                }
            }
        }
    })
})