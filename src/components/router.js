/**
 * @author Aniu[2017-02-27 23:46]
 * @update Aniu[2017-02-27 23:46]
 * @version 1.0.1
 * @description 路由
 */

Nui.define(['component'], function(component){
    return this.extend(component, {
        static:{
            _init:false,
            _paths:{},
            _params:{},
            _alias:{},
            _cache:{},
            _cacheContent:{},
            _replace:function(hash){
                return hash.replace(location.protocol+'//'+location.host, '').replace(/^\#\!?/, '').replace(/^([^\/])/, '/$1').replace(/\/$/g, '')
            },
            alias:function(val){
                return $.extend(this._alias, val||{})
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
                if(!$.isEmptyObject(that._paths) || !$.isEmptyObject(that._params)){
                    that._setCache();
                    Nui.each([that._paths, that._params], function(val, key){
                        var match = false;
                        Nui.each(val, function(v){
                            if((key === 0 && hash === v.path) || (key === 1 && hash.indexOf(v.path) === 0)){
                                var params = hash.replace(v.path, '').replace(/^\//, '');
                                var object = that._instances[v.index], opts = object.options, param;
                                params = params ? params.split('/') : [];
                                if(typeof opts.onRender === 'function' && params.length === v.params.length){
                                    Nui.each(v.params, function(val, key){
                                        if(!param){
                                            param = {};
                                        }
                                        param[val] = params[key]
                                    })
                                    if(!object._wrapper){
                                        if(opts.wrapper && !object._wrapper){
                                            object._wrapper = that._getWrapper(object.container)
                                        }
                                        else if(!that._wrapper){
                                            that._wrapper = that._getWrapper(object.container)
                                        }
                                        if(!object._wrapper){
                                            component.static.destroy(that._wrapper.off());
                                            that._cacheContent[_hash] = true;
                                        }
                                        var wrapper = object._wrapper || that._wrapper;
                                        var cache = that._cache[_hash];
                                        opts.onRender(object.target, wrapper, {
                                            path:v.path,
                                            url:hash,
                                            param:param,
                                            cache:cache
                                        })
                                        component.static.init(wrapper);
                                    }
                                    var wrapper = object._wrapper || that._wrapper;
                                    wrapper.show().siblings().hide();
                                    if(typeof opts.onAfter === 'function'){
                                        opts.onAfter(object.target, wrapper)
                                    }
                                    that._init = match = true;
                                    return false
                                }
                            }
                        })
                        if(match){
                            return false
                        }
                    })
                    if(!that._init){
                        Nui.each(that._instances, function(v){
                            if(!that._hasEnter && v.options.enter === true){
                                that._hasEnter = true;
                                v._render(v.target.eq(0));
                                that._init = true;
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
            init:function(){
                if(!this._init){
                    this._change();
                }
            },
            $ready:null
        },
        options:{
            path:null,
            container:null,
            enter:false,
            wrapper:false,
            splitLevel:1,
            onBefore:null,
            onRender:null
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
            if(opts.path && target && that.container){
                that.path = that._setpath(opts.path);
                var paths = that._getpath();
                if(paths.params.length){
                    if(!opts.splitLevel){
                        router._params[that.path] = paths
                    }
                    else{
                        if(opts.splitLevel <= 2){
                            var params = [], split = '/:', param, sub;
                            while(param = paths.params.shift()){
                                params.push(param);
                                subs = params.join(split);
                                router._params[paths.path+split+subs] = $.extend({}, paths, {
                                    params:subs.split(split)
                                })
                            }
                        }
                        if(opts.splitLevel === 2){
                            router._paths[paths.path] = paths
                        }
                    }
                }
                else{
                    router._paths[that.path] = paths
                }
                return that._event()
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
                index:that._index,
                params:[]
            }
            if(index !== -1){
                paths.params = path.substr(index+2).split('/:');
                paths.path = path.substr(0, index);
            }
            else{
                paths.path = path
            }
            return paths
        },
        _render:function(elem){
            var that = this, opts = that.options, href = elem.attr('href');
            if(href){
                var trigger = false;
                var render = function(){
                    trigger = true;
                    location.hash = '#!'+that.constructor._replace(elem.attr('href'));
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
            that._on('click', Nui.doc, that.target, function(e, elem){
                that._render(elem);
                return false
            })
            return that
        },
        _reset:function(){
            var that = this, router = that.constructor;
            that._off();
            delete router._paths[that.path];
            delete router._params[that.path];
            return that
        }
    })
})
