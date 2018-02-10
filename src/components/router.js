/**
 * @author Aniu[2017-02-27 23:46]
 * @update Aniu[2018-01-02 21:25]
 * @version 1.0.2
 * @description 路由
 */

Nui.define(['../core/component', '../core/template', '../core/events'], function(component, template, events){
    var statics = {
        _paths:{},
        _init:function(){
            var self = this;
            Nui.doc.on('click', '.nui-router-back', function(){
                return self.back()
            }).on('click', '.nui-router-forward', function(){
                return self.forward()
            })
        },
        _setpaths:function(rule, paths){
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
            var self = this;
            delete self._active;
            if(!$.isEmptyObject(self._paths)){
                var _hash = location.hash, ret = this._split(_hash), hash = self._replace(ret.url), query = ret.params;
                Nui.each(self._paths, function(v){
                    if(hash === v.path || hash.indexOf(v.path) === 0){
                        var params = hash.replace(v.path, '').replace(/^\//, '');
                        var object = self.__instances[v.id], opts = object._options, param = {};
                        params = params ? params.split('/') : [];
                        if(params.length === v.params.length){
                            var isRender = object._isRender === true;
                            var unWrapper = object._isRender !== false && !object._wrapper;
                            var _isRender = !object.loaded || isRender || unWrapper;
                            delete object._isRender;

                            if(unWrapper || (object._wrapper && isRender)){
                                opts.data = $.extend(true, {}, object._defaultOptions.data);
                            }

                            Nui.each(v.params, function(val, key){
                                param[val] = params[key]
                            })

                            Nui.each(query, function(val, key){
                                param[val] = query[key]
                            })

                            self._active = {
                                path:v.path+'/',
                                url:hash+'/',
                                params:param,
                                query:query
                            }

                            opts.data = $.extend(true, opts.data, self._active);

                            if(object._send && object._send.data && typeof opts.onData === 'function'){
                                opts.onData.call(opts, object._send.data, object);
                                delete object._send;
                            }

                            if(_isRender){
                                if(opts.wrapper && !object._wrapper){
                                    if(typeof opts.wrapper !== 'boolean'){
                                        object._wrapper = object.container.children(opts.wrapper)
                                    }
                                    else{
                                        object._wrapper = self._getWrapper(object.container)
                                    }
                                }
                                else if(!self._wrapper){
                                    self._wrapper = self._getWrapper(object.container)
                                }
                            }

                            var wrapper = opts.element = object._wrapper || self._wrapper;
                            
                            if(typeof opts.onChange === 'function' && opts.onChange.call(opts, object) === false){
                                return false
                            }
                                
                            if(_isRender){
                                wrapper.off();
                                object.render.call(object);
                                if(typeof opts.onInit === 'function'){
                                    opts.onInit.call(opts, object);
                                }
                                events.call(opts);
                                object.loaded = true;
                            }

                            wrapper.show().siblings('.nui-router-wrapper').hide();

                            if(typeof opts.onAfter === 'function'){
                                opts.onAfter.call(opts, object)
                            }

                            if(Nui.bsie7){
                                self._setHistory(_hash);
                            }

                            self._initialize = true;
                            
                            return false
                        }
                    }
                })

                if(!self._initialize){
                    Nui.each(self.__instances, function(v){
                        if(!self._isEntry && v._options.entry === true){
                            self._isEntry = true;
                            if(v.target){
                                v._render(v.target.eq(0));
                            }
                            else if(v.path){
                                v._render(v.path);
                            }
                            self._initialize = true;
                            return false
                        }
                    })
                }
            }
            self._oldhash = _hash;
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
        start:function(){
            if(!this._initialize){
                this._change();
            }
        },
        location:function(url, data, render){
            var self = this;
            if(url){
                if(arguments.length <=2 && typeof data === 'boolean'){
                    render = data;
                    data = null;
                }
                var temp, _router, query = '';
                var match = url.match(/\?[^\/\s]+$/);
                if(match){
                    query = match[0]
                }
                url = this._replace(url.replace(/\?[^\/\s]+$/, ''));
                Nui.each(this._paths, function(val, rule){
                    if(rule === url || (url.indexOf(val.path) === 0 &&
                                        (temp = url.replace(new RegExp('^'+val.path), '').replace(/^\//, '')) && 
                                        temp.split('/').length === val.params.length)){
                        _router = self.__instances[val.id];
                        return false
                    }
                })
                if(_router){
                    _router._send = {
                        data:data
                    }
                    _router._isRender = render;
                    _router._render(url + query)
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
                Nui.each(this._history, function(val){
                    val.active = false
                });
                this._history.push({
                    hash:hash,
                    active:true
                })
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
            var self = this, opts = self._options, router = self.constructor;
            if(opts.path && (self.container = self._jquery(opts.container))){
                self.path = router._replace(opts.path);
                var paths = self._getpath();
                var len = paths.params.length;
                if((!len && opts.level === 1) || opts.level !== 1){
                    router._setpaths(paths.rule, paths)
                }
                if(len && opts.level > 0){
                    var params = [], split = '/:', param, sub;
                    while(param = paths.params.shift()){
                        params.push(param);
                        sub = params.join(split);
                        router._setpaths(paths.rule+split+sub, $.extend({}, paths, {
                            params:sub.split(split)
                        }))
                    }
                }
                if(self._getTarget()){
                    self._event()
                }
                return self
            }
        },
        _getpath:function(){
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
            var self = this, opts = self._options, href = url instanceof jQuery ? url.attr('href') : url;
            if(href){
                var trigger = false;
                var change = function(callback){
                    trigger = true;
                    var hash = '#!'+self.constructor._replace(href);
                    if(typeof callback === 'function'){
                        hash = callback(hash) || hash;
                    }
                    location.hash = hash
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
        destroy:null
    })
})