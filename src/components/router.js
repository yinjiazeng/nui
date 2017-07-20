/**
 * @author Aniu[2017-02-27 23:46]
 * @update Aniu[2017-02-27 23:46]
 * @version 1.0.1
 * @description 路由
 */

Nui.define(['component'], function(component){
    var statics = {
        _paths:{},
        _alias:{},
        _cache:{},
        _cacheContent:{},
        _init:function(){
            var that = this;
            Nui.doc.on('click', '.nui-router-back', function(){
                return that.back()
            }).on('click', '.nui-router-forward', function(){
                return that.forward()
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
        _setCache:function(){
            var that = this, hash = that._oldhash;
            if(hash && that._wrapper && that._cacheContent[hash]){
                that._cache[hash] = that._wrapper.html()
            }
        },
        _getWrapper:function(container){
            return $('<div class="wrapper"></div>').appendTo(container)
        },
        _change:function(){
            var that = this, _hash = location.hash, hash = that._replace(_hash);
            if(!$.isEmptyObject(that._paths)){
                that._setCache();
                Nui.each(that._paths, function(v){
                    if(hash === v.path || hash.indexOf(v.path) === 0){
                        var params = hash.replace(v.path, '').replace(/^\//, '');
                        var object = that.__instances[v.id], opts = object.options, param;
                        params = params ? params.split('/') : [];
                        var change = opts.onChange;
                        if(typeof change === 'function' && params.length === v.params.length){
                            Nui.each(v.params, function(val, key){
                                if(!param){
                                    param = {};
                                }
                                param[val] = params[key]
                            })

                            if(object._send && object._send.data && typeof opts.onData === 'function'){
                                opts.onData.call(opts, object._send.data)
                                delete object._send;
                            }

                            if(object._reload === true || !object._wrapper){
                                if(opts.wrapper && !object._wrapper){
                                    object._wrapper = that._getWrapper(object.container)
                                }
                                else if(!that._wrapper){
                                    that._wrapper = that._getWrapper(object.container)
                                }
                                if(object._reload || !object._wrapper){
                                    component.destroy((object._wrapper||that._wrapper).off());
                                    if(object.options.cache === true){
                                        that._cacheContent[_hash] = true;
                                    }
                                }
                                var wrapper = object._wrapper || that._wrapper;
                                var cache = that._cache[_hash];
                                change.call(opts, object.target, wrapper, {
                                    path:v.path+'/',
                                    url:hash+'/',
                                    param:param,
                                    cache:cache
                                });
                                component.init(wrapper);
                                delete object._reload;
                            }
                            var wrapper = object._wrapper || that._wrapper;
                            wrapper.show().siblings('.wrapper').hide();
                            if(typeof opts.onAfter === 'function'){
                                opts.onAfter.call(opts, object.target, wrapper)
                            }
                            that._initialize = match = true;
                            if(Nui.bsie7){
                                that._setHistory(_hash);
                            }
                            return false
                        }
                    }
                })

                if(!that._initialize){
                    Nui.each(that.__instances, function(v){
                        if(!that._isEntry && v.options.entry === true){
                            that._isEntry= true;
                            if(v.target){
                                v._render(v.target.eq(0));
                            }
                            that._initialize = true;
                            return false
                        }
                    })
                }
            }
            that._oldhash = _hash;
        },
        _bindHashchange:function(){
            var that = this;
            if(Nui.bsie7){
                var hashchange = function(ret){
                    var hash = location.hash;
                    if(that._oldhash !== hash){
                        return !ret
                    }
                    return false
                }
                setInterval(function(){
                    if(hashchange()){
                        that._change()
                    }
                }, 100);
                hashchange(true)
            }
            else{
                Nui.win.on('hashchange', function(){
                    that._change()
                })
            }
        },
        _$ready:null,
        _$fn:null,
        start:function(){
            if(!this._initialize){
                this._change();
            }
        },
        href:function(url, data, reload){
            var that = this;
            if(url){
                if(arguments.length <=2 && typeof data === 'boolean'){
                    reload = data;
                    data = null;
                }
                var temp, _router;
                url = this._replace(url);
                Nui.each(this._paths, function(val, rule){
                    if(rule === url || (url.indexOf(val.path) === 0 &&
                                        (temp = url.replace(val.path+'/', '')) && 
                                        temp.split('/').length === val.params.length)){
                        _router = that.__instances[val.id];
                        return false
                    }
                })
                if(_router){
                    _router._send = {
                        data:data
                    }
                    _router._reload = reload;
                    _router._render(_router.target, url)
                }
            }
            else{
                that.start()
            }
        },
        alias:function(val){
            return $.extend(this._alias, val||{})
        },
        forward:function(){
            history.forward();
            return false
        },
        back:function(){
            history.back();
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
        },
        Nui.each(['forward', 'back'], function(v){
            var value = v==='forward' ? 1 : -1;
            statics[v] = function(){
                var that = this, len = that._history.length;
                statics._isHistory = true;
                Nui.each(that._history, function(val, i){
                    var index = i + value;
                    if(val.active){
                        //历史记录在起始或者末尾时，调用原生的记录
                        if(index === -1 || index === len){
                            window.history[v]();
                            return false
                        }
                        var _history = that._history[index];
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
        static:statics,
        options:{
            path:'',
            delegate:null,
            container:null,
            entry:false,
            wrapper:false,
            cache:false,
            level:1,
            onBefore:null,
            onChange:null,
            onAfter:null,
            onData:null
        },
        _init:function(){
            var that = this, router = that.constructor;
            if(that._exec() && !router._bind){
                router._bind = true;
                router._bindHashchange();
            }
        },
        _exec:function(){
            var that = this, opts = that.options, router = that.constructor, target = that._getTarget();
            that.container = router._jquery(opts.container);
            if(opts.path && that.container){
                that.path = that._setpath(opts.path);
                var paths = that._getpath();
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
                if(target){
                    return that._event()
                }
            }
        },
        _setpath:function(path){
            var router = this.constructor;
            if(path = Nui.trim(path)){
                Nui.each(router._alias, function(val, key){
                    path = path.replace(new RegExp('{'+ key +'}', 'g'), val)
                })
            }
            return router._replace(path)
        },
        _getpath:function(){
            var that = this, path = that.path, opts = that.options, index = path.indexOf('/:');
            var paths = {
                id:that.__id,
                params:[],
                rule:path,
                path:path
            }
            if(index !== -1){
                paths.params = path.substr(index+2).split('/:');
                paths.path = path.substr(0, index);
                if(opts.level > 0){
                    paths.rule = paths.path;
                }
            }
            return paths
        },
        _render:function(elem, url){
            var that = this, opts = that.options, href = url || elem.attr('href');
            if(href){
                var trigger = false;
                var render = function(){
                    trigger = true;
                    location.hash = '#!'+that.constructor._replace(href)
                }
                if(typeof opts.onBefore === 'function' && opts.onBefore(elem, render) === false){
                    return false
                }
                if(!trigger){
                    render()
                }
            }
        },
        _event:function(){
            var that = this, opts = that.options;
            that._on('click', opts.delegate, that.target, function(e, elem){
                that._render(elem);
                return false
            })
            return that
        },
        _reset:function(){
            var that = this, router = that.constructor;
            that._off();
            Nui.each(router._paths, function(val, i){
                if(val.id === that.__id){
                    delete router._paths[i];
                }
            })
            return that
        }
    })
})