/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description 输入框占位符
 */

Nui.define('{cpns}/placeholder',['util'], function(util){
    var module = this;
    var support = util.supportHtml5('placeholder', 'input');
    return module.extend('component', {
        options:{
            /**
             * @func 输入框占位提示文本，若元素上含有placeholder属性将会覆盖该值
             * @type <String>
             */
            text:'',
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
        _tpllist:module.renders(''+''
            +'<%each style%><%$index%>:<%$value%>;<%/each%>'+''
        +''),
        _tplwrap:module.renders(''+''
            +'<strong class="ui-placeholder<%if theme%> t-placeholder-<%theme%><%/if%>" style="<%include \'_tpllist\'%>" />'+''
        +''),
        _tplelem:module.renders(''+''
            +'<b style="<%include \'_tpllist\'%>"><%text%></b>'+''
        +''),
        _init:function(){
            this._exec();
        },
        _exec:function(){
            var that = this;
            that.target = that._getTarget();
            if(that.target){
                var text = that.deftext = that.target.attr('placeholder');
                if(!that.deftext && that.options.text){
                    that.target.attr('placeholder', text = that.options.text)
                }
                that.text = Nui.trim(text);
                if(that.text){
                    that._create()
                }
            }
        },
        _create:function(){
            var that = this, opts = that.options, self = that.constructor;
            if(opts.animate || (!opts.animate && !support)){
                if(opts.animate){
                    that.target.removeAttr('placeholder')
                }
                that.target.wrap(that._tpl2html(that._tplwrap, {
                        theme:opts.theme,
                        style:{
                            'position':'relative',
                            'display':'inline-block',
                            'width':that.target.outerWidth()+'px',
                            'overflow':'hidden',
                            'cursor':'text'
                        }
                    }))
                that.elem = $(that._tpl2html(that._tplelem, {
                        text:that.text,
                        style:(function(){
                            var height = that.target.outerHeight();
                            var isText = that.target.is('textarea');
                            return ({
                                'display':Nui.trim(that.target.val()) ? 'none' : 'inline',
                                'position':'absolute',
                                'left':self._getSize(that.target, 'l', 'padding')+self._getSize(that.target, 'l')+'px',
                                'top':self._getSize(that.target, 't', 'padding')+self._getSize(that.target, 't')+'px',
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
        },
        _setStyle:function(){
            var that = this, opts = that.options;
            that.className = 'nui-placeholder-'+that.index;
            that.target.addClass(that.className);
            if(!that.constructor.style){
                that._createStyle()
            }
            that._createRules()
        },
        _createStyle:function(){
            var that = this;
            var style = document.createElement('style');
            document.head.appendChild(style);
            that.constructor.style = style.sheet
        },
        _createRules:function(){
            var that = this;
            var sheet = that.constructor.style;
            var index = that.index;
            try{
                sheet.deleteRule(index)
            }
            catch(e){}
            Nui.each(['::-webkit-input-placeholder', ':-ms-input-placeholder', '::-moz-placeholder'], function(v){
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
            var that = this, opts = that.options, self = that.constructor;
            var pleft = self._getSize(that.target, 'l', 'padding') + self._getSize(that.target, 'l');
            that._on('click', that.elem, function(){
                that.target.focus()
            })

            that._on('focus', that.target, function(){
                opts.animate && that.elem.stop(true, false).animate({left:pleft+10, opacity:'0.5'});
            })

            that._on('blur change', that.target, function(e, elem){
                var val = Nui.trim(elem.val());
                if((!opts.equal && val === that.text) || !val){
                    elem.val('');
                    that.elem.show();
                    opts.animate && that.elem.stop(true, false).animate({left:pleft, opacity:'1'})
                }
                else{
                    that.elem.hide()
                }
            })

            that._on('keyup keydown', that.target, function(e, elem){
                Nui.trim(elem.val()) ? that.elem.hide() : that.elem.show()
            })
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.elem){
                that.elem.remove();
                that.target.unwrap();
            }
            that.target.removeClass(that.className);
            if(that.deftext){
                that.target.attr('placeholder', that.deftext)
            }
            else{
                that.target.removeAttr('placeholder')
            }
        }
    })
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
                                    var param = {};
                                    Nui.each(v.params, function(val, key){
                                        param[val] = params[key]
                                    })
                                    that._cacheContainer[_hash] = v.container;
                                    var cache = that._cache[_hash];
                                    v.render(v.target, v.container, {
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
                            if(v.options.enter === true){
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
            var that = this, opts = that.options, router = that.constructor;
            that.path = that._setpath(opts.path);
            that.target = that._getTarget();
            that.container = $(opts.container);
            if(opts.path && that.target){
                var paths = that._getpath();
                if(paths.params.length){
                    var params = [];
                    Nui.each(paths.params, function(v){
                        params.push(v);
                        var split = '/:';
                        var subs = params.join(split);
                        router._params[paths.path+split+subs] = $.extend({}, paths, {
                            params:subs.split(split)
                        })
                    })
                    router._params[that.path] = paths
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

Nui.define('./script/page',['{cpns}/router', '{cpns}/placeholder'], function(router, placeholder){
    
})
