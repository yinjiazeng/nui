/**
 * @author Aniu[2017-02-27 23:46]
 * @update Aniu[2017-02-27 23:46]
 * @version 1.0.1
 * @description 路由
 */

Nui.define('{cpns}/router',function(){
    return this.extend('component', {
        static:{
            _trigger:false,
            _routers:{},
            _alias:{},
            _replace:function(hash){
                return hash.replace(/^\#\!?/, '').replace(/\/{2,}/g, '//').replace(/^\/*|\/*$/g, '')
            },
            alias:function(val){
                this._alias = val
            },
            _change:function(){
                var that = this, hash = that._replace(location.hash);
                var routers = that._routers;
                if(!$.isEmptyObject(routers)){
                    Nui.each(routers, function(v){
                        if(hash.indexOf(v.path) === 0){
                            var params = hash.replace(v.path, '').replace(/^\//, '');
                            params = params ? params.split('/') : [];
                            if(params.length === v.params.length){
                                var param = {};
                                Nui.each(v.params, function(val, key){
                                   param[val] = params[key]
                                })
                                v.render(v.target, {
                                    path:v.path,
                                    param:param
                                })
                                that._trigger = true;
                                return false
                            }
                        }
                    })
                    if(!that._trigger){
                        Nui.each(that._instances, function(v){
                            if(v.options.enter === true){
                                v.target.eq(0).trigger('click');
                                that._trigger = true;
                                return false
                            }
                        })
                    }
                }
            },
            _bindHashchange:function(){
                var that = this;
                if('onhashchange' in window){
                    Nui.win.on('hashchange', function(){
                        that._change()
                    })
                }
                else{
                    var hashchange = function(ret){
                        var hash = location.hash;
                        if(that._oldhash !== hash){
                            that._oldhash = hash;
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
            },
            $ready:null
        },
        options:{
            path:'',
            enter:false,
            onBefore:null,
            onRender:null
        },
        _init:function(){
            var that = this, router = that.constructor;
            that._exec();
            if(!router._trigger){
                if(!router._bind){
                    router._bind = true;
                    router._bindHashchange();
                }
                router._change();
            }
        },
        _exec:function(){
            var that = this, opts = that.options, router = that.constructor;
            that.path = that._setpath(opts.path);
            that.target = that._getTarget();
            if(opts.path && that.target){
                router._routers[that.path] = that._getpath();
                that._event()
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
                target:that.target,
                params:[]
            }
            if(index !== -1){
                paths.params = path.substr(index+2).split('/:');
                paths.path = path.substr(0, index);
            }
            else{
                paths.path = path
            }
            paths.render = typeof opts.onRender === 'function' ? opts.onRender : $.noop
            return paths
        },
        _sethash:function(hash){
            hash = this.constructor._replace(hash);
            location.hash = '#!'+hash;
        },
        _event:function(){
            var that = this, opts = that.options;
            that._on('click', that.target, function(e){
                if(typeof opts.onBefore === 'function' && opts.onBefore() === false){
                    return false
                }
                var me = $(this);
                that._sethash(me.attr('href'));
                return false
            })
        },
        _reset:function(){
            var that = this;
            that._off();
            delete that.constructor._routers[that.path]
            return that
        }
    })
})

Nui.define('./script/page',['{cpns}/router', 'util', 'template'], function(router, util, tpl){
    var renders = this.renders;

    var render = function(target, data){
        data.text = target.text();
        $('.content').html(tpl.render(renders(''+''
            +'这是<% text %> ，页面url是<% path %>，传递的参数是 <% each param %><% $index %>：<% $value %>，<% /each %>'+''
        +''), data))
    }

    router({
        target:'#home',
        path:'/home/',
        enter:true,
        onRender:render
    })

    router({
        target:'#news',
        path:'/news/:newsid/',
        onRender:render
    })

    router({
        target:'#photo',
        path:'/photo/:pid/:type/',
        onRender:render
    })

    router({
        target:'#about',
        path:'/about/:id/',
        onRender:render
    })

})
