Nui.define('./ajax',function(){
    var ajax = $.ajax;
    return function(options){
        if(typeof options === 'string'){
            options = {
                url:options,
                dataType:'json'
            }
        }
        var success = options.success || $.noop;
        var error = options.error || $.noop;
        options.success = function(){
            success.apply(this, arguments)
        }
        options.error = function(){
            error.apply(this, arguments)
        }
        return ajax($.extend(true, {
            cache:false,
            dataType:'json',
            statusCode:{
                '404':function(){

                },
                '502':function(){

                }
            }
        }, options))
    }
})
Nui.define('../tpls/seeVoucher',function(){
    return this.renders(''+''
        +'这是查凭证页面，页面完整url是：<% url %>，路径是：<% path %>'+''
        +'<% if param %>'+''
        +'<br>'+''
        +'参数分别是：'+''
        +'<% each param %>'+''
        +'<% $index %>=<% $value %>，'+''
        +'<% /each %>'+''
        +'<% /if %>'+''
    +'')
})
Nui.define('./modules/seeVoucher',['../tpls/seeVoucher', 'template'], function(tmpl, tpl){
    var module = this;
    return function(target, container, data){
        $('.m-menu-item a.s-crt').removeClass('s-crt');
        target.addClass('s-crt');
        container.html(tpl.render(tmpl, data))
    }
})
Nui.define('../tpls/recordVoucher',function(){
    return this.renders(''+''
        +'这是录凭证页面，页面完整url是：<% url %>，路径是：<% path %>'+''
    +'')
})
Nui.define('./modules/recordVoucher',['../tpls/recordVoucher', 'template'], function(tmpl, tpl){
    var module = this;
    return function(target, container, data){
        $('.m-menu-item a.s-crt').removeClass('s-crt');
        target.addClass('s-crt');
        container.html(tpl.render(tmpl, data))
    }
})
Nui.define('../tpls/index',function(){
    return this.renders(''+''
        +'<% if !cache %>'+''
        +'这是首页，页面完整url是：<% url %>，路径是：<% path %>'+''
        +'<% else %>'+''
        +'这是页面缓存<br>'+''
        +'<% cache %>'+''
        +'<% /if %>'+''
    +'')
})
Nui.define('./modules/index',['../tpls/index', 'template'], function(tmpl, tpl){
    var module = this;
    return function(target, container, data){
        $('.m-menu-item a.s-crt').removeClass('s-crt');
        container.html(tpl.render(tmpl, data))
    }
})
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
            _domain:location.protocol+'//'+location.host,
            _paths:{},
            _params:{},
            _alias:{},
            _cache:{},
            _cacheContainer:{},
            _replace:function(hash){
                return hash.replace(this._domain, '').replace(/^\#\!?/, '').replace(/^([^\/])/, '/$1').replace(/\/$/g, '')
            },
            alias:function(val){
                return $.extend(this._alias, val||{})
            },
            _setCache:function(hash){
                var that = this, hash = that._oldhash;
                if(hash){
                    Nui.each(that._cacheContainer, function(v, k){
                        if(k === hash){
                            that._cache[hash] = v.html();
                            return false
                        }
                    })
                }
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
                                params = params ? params.split('/') : [];
                                if(params.length === v.params.length){
                                    var param;
                                    Nui.each(v.params, function(val, key){
                                        if(!param){
                                            param = {};
                                        }
                                        param[val] = params[key]
                                    })
                                    that._cacheContainer[_hash] = v.container;
                                    var cache = that._cache[_hash];
                                    v.render(v.target.length ? v.target : $(v.target.selector), v.container, {
                                        path:v.path,
                                        url:hash,
                                        param:param,
                                        cache:cache
                                    })
                                    that._trigger = match = true;
                                    return false
                                }
                            }
                        })
                        if(match){
                            return false
                        }
                    })
                    if(!that._trigger){
                        Nui.each(that._instances, function(v){
                            if(!that._hasEnter && v.options.enter === true){
                                that._hasEnter = true;
                                v.target.eq(0).trigger('click');
                                that._trigger = true;
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
            trigger:function(){
                if(!this._trigger){
                    this._change();
                }
            },
            $ready:null
        },
        options:{
            path:'',
            container:null,
            enter:false,
            split:false,
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
            if(opts.path && target){
                that.path = that._setpath(opts.path);
                that.container = typeof opts.container === 'string' ? Nui.$(opts.container) : $(opts.container);
                var paths = that._getpath();
                if(paths.params.length){
                    var params = [], split = '/:', param, sub;
                    while(param = paths.params.shift()){
                        params.push(param);
                        subs = params.join(split);
                        router._params[paths.path+split+subs] = $.extend({}, paths, {
                            params:subs.split(split)
                        })
                    }
                    if(opts.split === true){
                        router._paths[paths.path] = paths
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
                target:that.target,
                container:that.container,
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
            location.hash = '#!'+this.constructor._replace(hash);
        },
        _event:function(){
            var that = this, opts = that.options;
            that._on('click', Nui.doc, that.target, function(e, elem){
                var callback = function(){
                    that._sethash(elem.attr('href'));
                }
                if(typeof opts.onBefore === 'function' && opts.onBefore(elem, callback) === false){
                    return false
                }
                callback();
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

Nui.define('./router',['{cpns}/router'], function(router){
    var module = this;

    router({
        target:'#index',
        enter:true,
        path:'/index',
        container:'.g-main',
        onRender:module.require('./modules/index')
    })

    router({
        target:'#recordVoucher',
        path:'/voucher/record',
        container:'.g-main',
        onRender:module.require('./modules/recordVoucher')
    })

    router({
        target:'#seeVoucher',
        path:'/voucher/list/:nickname/:career',
        container:'.g-main',
        split:true,
        onRender:module.require('./modules/seeVoucher')
    })

    return router
})
Nui.define('./tpls/layout',function(){
    var module = this;
    return ({
        head:module.renders(''+''
            +'<div class="f-fl m-head-main">'+''
                +'<% var data = list[0] %>'+''
                +'<p class="f-fl name"><% data.buname %></p>'+''
                +'<p class="f-fl month"><% data.buaddress %></p>'+''
            +'</div>'+''
        +''),
        menu:module.renders(''+''
            +'<% each menu %>'+''
            +'<dl class="m-menu-item">'+''
                +'<dt>'+''
                    +'<a href="<% $value.path || \'javascript:void(0)\' %>"<% if $value.id %> id="<% $value.id %>"<% /if %>>'+''
                        +'<em><i class="iconfont"></i></em>'+''
                        +'<span><% $value.name %></span>   '+''
                    +'</a>'+''
                +'</dt>'+''
                +'<% if $value.subs && $value.subs.length %>'+''
                +'<dd>'+''
                    +'<% each $value.subs %>'+''
                    +'<a href="<% $value.path %>"<% if $value.id %> id="<% $value.id %>"<% /if %>>'+''
                        +'<span><% $value.name %></span>'+''
                    +'</a>'+''
                    +'<% /each %>'+''
                +'</dd>'+''
                +'<% /if %>'+''
            +'</dl>'+''
            +'<% /each %>'+''
        +'')
    })
})
Nui.define('./menu',[{
    id:'recordVoucher',
    name:'录凭证',
    icon:'',
    path:'/voucher/record'
}, {
    id:'seeVoucher',
    name:'查凭证',
    icon:'',
    path:'/voucher/list/aniu/jser'
}, {
    name:'账簿',
    icon:'',
    subs:[{
        id:'summary',
        name:'总账',
        icon:'',
        path:'/books/summary'
    }, {
        id:'detailed',
        name:'明细账',
        icon:'',
        path:'/books/detailed'
    }, {
        id:'accountbalance',
        name:'科目余额表',
        icon:'',
        path:'/books/accountbalance'
    }]
}])
Nui.define('./render',['./menu', './tpls/layout', 'template'], function(menu, layout, tpl){
    var module = this;
    return function(data){
        $('.m-headbox').html(tpl.render(layout.head, data))
        data.menu = menu;
        $('.m-menu').html(tpl.render(layout.menu, data))
    }
})
Nui.define('./script/page',['./render', './router', './ajax'], function(render, router, ajax){
    var module = this;
    module.imports('../style/base');
    module.imports('../style/index');
    ajax({
        url:'./script/data.json',
        success:function(res){
            render(res);
            router('trigger')
        }
    })
})
