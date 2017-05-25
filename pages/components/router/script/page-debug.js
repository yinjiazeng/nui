Nui.define('pages/components/router/script/ajax',function(){
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
Nui.define('pages/components/router/script/tpls/seeVoucher',function(){
    return this.renders(''+''
        +'这是查凭证页面，页面完整url是：<% url %>，路径是：<% path %>'+''
        +'<% if param %>'+''
        +'<br>'+''
        +'参数分别是：'+''
        +'<% each param %>'+''
        +'<% $index %>=<% $value %>，'+''
        +'<% /each %>'+''
        +'<% /if %>'+''
        +'<a id="aaa" class="nui-router-back">返回</a> '+''
    +'')
})
Nui.define('pages/components/router/script/modules/seeVoucher',['pages/components/router/script/tpls/seeVoucher', 'template'], function(tmpl, tpl){
    var module = this;
    return function(target, wrapper, request){
        wrapper.html(tpl.render(tmpl, request))
    }
})
/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description 输入框占位符
 */

Nui.define('{cpns}/placeholder',['util', 'component'], function(util, component){
    var support = util.supportHtml5('placeholder', 'input');
    return this.extend(component, {
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
        _template:{
            list:'<%each style%><%$index%>:<%$value%>;<%/each%>',
            wrap:'<strong class="<% className %>" style="<%include \'list\'%>" />',
            elem:'<b style="<%include \'list\'%>"><%text%></b>'
        },
        _init:function(){
            this._exec();
        },
        _exec:function(){
            var that = this, target = that._getTarget();
            if(target){
                var text = that.deftext = target.attr('placeholder');
                if(!that.deftext && that.options.text){
                    target.attr('placeholder', text = that.options.text)
                }
                that.text = Nui.trim(text);
                if(that.val === undefined){
                    that.val = Nui.trim(target.val());
                }
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
                var data = that._tplData();
                data.style = {
                    'position':'relative',
                    'display':'inline-block',
                    'width':that.target.outerWidth()+'px',
                    'overflow':'hidden',
                    'cursor':'text'
                }
                that.target.wrap(that._tpl2html('wrap', data))
                that.element = $(that._tpl2html('elem', {
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
            that.className = '_placeholder-'+that._index;
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
            var index = that._index;
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
        _events:function(){
            var that = this, opts = that.options, self = that.constructor;
            var pleft = self._getSize(that.target, 'l', 'padding') + self._getSize(that.target, 'l');
            that._on('click', that.element, function(){
                that.target.focus()
            })

            that._on('focus', that.target, function(){
                opts.animate && that.element.stop(true, false).animate({left:pleft+10, opacity:'0.5'});
            })

            that._on('blur change', that.target, function(e, elem){
                that.value();
            })

            that._on('keyup keydown', that.target, function(e, elem){
                Nui.trim(elem.val()) ? that.element.hide() : that.element.show()
            })
        },
        _reset:function(){
            var that = this;
            that._off();
            if(that.element){
                that.element.remove();
                that.target.unwrap();
            }
            that.target.removeClass(that.className);
            if(that.deftext){
                that.target.attr('placeholder', that.deftext)
            }
            else{
                that.target.removeAttr('placeholder')
            }
        },
        value:function(val){
            var self = this.constructor, target = this.target;
            var pleft = self._getSize(target, 'l', 'padding') + self._getSize(target, 'l');
            var v = Nui.trim(!arguments.length ? target.val() : target.val(val === null ? this.val : val).val());
            if((!this.options.equal && v === this.text) || !v){
                target.val('');
                this.element.show();
                if(this.options.animate){
                    this.element.stop(true, false).animate({left:pleft, opacity:'1'})
                }
            }
            else{
                this.element.hide()
            }
        }
    })
})

/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description 语法高亮组件
 */

Nui.define('highlight',function(){
    return this.extend('component', {
        static:{
            _init:function(){
                var that = this;
                Nui.doc.on('click', function(){
                    if(that._active){
                        Nui.each(that._instances, function(val){
                            if(val._active){
                                val.element.find('tr.s-crt').removeClass('s-crt');
                                val._active = false;
                            }
                        })
                    }
                    that._active = false;
                })
            },
            _getcode:function(type, text){
                return '<code class="'+ type +'">'+ text +'</code>'
            },
            _getarr:function(match, code){
                var array = [];
                if(!match){
                    array.push(code)
                }
                else{
                    Nui.each(match, function(v){
                        var index = code.indexOf(v);
                        var sub = code.substr(0, index);
                        code = code.substr(index+v.length);
                        array.push(sub);
                        array.push(v);
                    })
                    array.push(code);
                }
                return array
            },
            _comment:function(code){
                //多行注释
                if(/\/\*/.test(code)){
                    code = code.replace(/(\/\*(.|\s)*?\*\/)/g, this._getcode('comment', '$1'))
                }
                //单行注释
                else if(/\/\//.test(code)){
                    code = code.replace(/(\/\/.*)$/g, this._getcode('comment', '$1'))
                }
                return code
            }
        },
        options:{
            //工具栏
            tools:{
                //复制
                copy:true
            },
            //点击代码那一行高亮
            isLight:true,
            //是否显示行号
            isLine:false,
            //是否显示语法标题
            isTitle:true
        },
        _init:function(){
            this._exec();
        },
        _exec:function(){
            var that = this, target = that._getTarget();
            if(target){
                var dom = target.get(0);
                if(dom.tagName === 'SCRIPT' && dom.type == 'text/highlight'){
                    that.code = target.html()
                                .replace(/^[\r\n]+|[\r\n]+$/g, '')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;');
                    if(that.element){
                        that.element.remove();
                    }
                    that._create();
                    if(that.options.isLight){
                        that._event();
                    }
                }
            }
        },
        _title:'',
        _template:{
            tmpl:'<div class="<% className %>">'
                +'<%if tools%>'
                +'<div class="tools">'
                    +'<%if tools.copy%>'
                    +'<em class="copy">复制</em>'
                    +'<%/if%>'
                +'</div>'
                +'<%/if%>'
                +'<div class="body">'
                    +'<table>'
                        +'<%each list val key%>'
                            +'<tr>'
                                +'<%if isLine === true%><td class="line" number="<%key+1%>"><%if bsie7%><%key+1%><%/if%></td><%/if%>'
                                +'<td class="code"><%val%></td>'
                            +'</tr>'
                        +'<%/each%>'
                    +'</table>'
                +'</div>'
                +'<%if isTitle%>'
                +'<em class="title"><%title%></em>'
                +'<%/if%>'
            +'</div>'
        },
        _create:function(){
            var that = this;
            var opts = that.options;
            var data = $.extend({
                bsie7:Nui.bsie7,
                list:that._list(),
                title:that._title,
                isLine:opts.isLine,
                tools:opts.tools,
                isTitle:opts.isTitle
            }, that._tplData())
            that.element = $(that._tpl2html('tmpl', data)).insertAfter(that.target);
        },
        _getCode:function(){
            return this.code
        },
        _list:function(){
            return this._getCode().split('\n')
        },
        _events:function(){
            var that = this;
            return ({
                elem:that.element,
                maps:{
                    'click tr':'active',
                    'click .copy':'copy'
                },
                calls:{
                    active:function(e, elem){
                        that.constructor._active = that._active = true;
                        elem.addClass('s-crt').siblings().removeClass('s-crt');
                        e.stopPropagation()
                    },
                    copy:function(){
                        alert('傻帽！逗你玩呢。')
                    }
                }
            })
        }
    })
})

/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description javascript语法高亮组件
 */

Nui.define('{light}/javascript',function(){
    return this.extend('highlight', {
        _title:'js',
        _getCode:function(){
            var that = this;
            var code = that.code;
            var self = that.constructor;
            var str = '';
            var kws = 'abstract|arguments|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|elseif|each|enum|eval|export|'+
                      'extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|include|interface|let|long|native|new|null|'+
                      'package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var';
            var symbol = '&lt;|&gt;|;|!|%|\\\|\\\[|\\\]|\\\(|\\\)|\\\{|\\\}|\\\=|\\\/|-|\\\+|,|\\\.|\\\:|\\\?|~|\\\*|&';
            var match = code.match(/(\/\/.*)|(\/\*(.|\s)*?\*\/)|('[^']*')|("[^"]*")/g);
            var array = self._getarr(match, code);
            Nui.each(array, function(v){
                if($.trim(v)){
                    //单行注释
                    if(/^\s*\/\//.test(v)){
                        v = self._getcode('comment', v);
                    }
                    //多行注释
                    else if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, self._getcode('comment', '$1'))
                    }
                    else{
                        //字符串
                        if(/'|"/.test(v)){
                            v = v.replace(/(.+)/g, self._getcode('string', '$1'))
                        }
                        //关键字、符号、单词
                        else{
                            v = v.replace(new RegExp('('+ symbol +')', 'g'), self._getcode('symbol', '$1'))
                                .replace(new RegExp('('+ kws +')(\\s+|\\\<code)', 'g'), self._getcode('keyword', '$1')+'$2')
                                .replace(/(\/code>\s*)(\d+)/g, '$1'+self._getcode('number', '$2'))
                                .replace(/(\/code>\s*)?([^<>\s]+)(\s*<code)/g, '$1'+self._getcode('word', '$2')+'$3')

                        }
                        v = self._comment(v);
                    }
                }
                str += v;
            })
            return str
        }
    })
})

Nui.define('pages/components/router/script/tpls/recordVoucher',function(){
    return this.renders(''+''
        +'<input type="text" placeholder="aaaaaaaaaaa" value="11" data-placeholder-options=\'{"color":"#f60", "animate":true}\' />'+''
        +'<input type="text" placeholder="111" data-placeholder-options=\'{"color":"#f60", "animate":true}\' />'+''
        +'<input type="text" placeholder="222" data-placeholder-options=\'{"color":"#f60", "animate":true}\' />'+''
        +'<input type="text" placeholder="333" data-placeholder-options=\'{"color":"#f60", "animate":true}\' />'+''
        +'<div class="empty">还原</div>'+''
        +'<script type="text/highlight" data-javascript-options="{id:\'b\'}">'+''
        +'var a = 1;'+''
        +'var b = 2;'+''
        +'</script> '+''
        +'<div class="box nui-router-back">返回</div>'+''
        +'<a id="aaa">aaaaaaaaaaa</a>'+''
    +'')
})
Nui.define('pages/components/router/script/modules/recordVoucher',['component', 'pages/components/router/script/tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(component, tmpl, tpl, js, ph){
    var module = this;
    var delegate = module.require('delegate');
    return function(target, wrapper, request){

        wrapper.html(tpl.render(tmpl, request))
        delegate({
            elem:wrapper,
            maps:{
                //'click b':'b',
                'click .empty':'empty'
                //'click a':'c a'
            },
            calls:{
                a:function(){
                    js('destroy', wrapper, 'b')
                    component.static.destroy(wrapper);
                    setTimeout(function(){
                        js('init', wrapper)
                        js('set', wrapper, {
                            isLine:true
                        }) 
                    }, 2000)
                },
                b:function(){
                    alert()
                },
                c:function(){
                    return confirm('哈哈')
                },
                empty:function(){
                   ph('value', wrapper, null)
                    //$('input').placeholder('value', null)
                }
            }
        })
    }
})
/**
 * @author Aniu[2017-02-27 23:46]
 * @update Aniu[2017-02-27 23:46]
 * @version 1.0.1
 * @description 路由
 */

Nui.define('{cpns}/router',['component'], function(component){
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
                                    component('destroy', that._wrapper.off());
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
                                component('init', wrapper);
                            }
                            var wrapper = object._wrapper || that._wrapper;
                            wrapper.show().siblings('.wrapper').hide();
                            if(typeof opts.onAfter === 'function'){
                                opts.onAfter(object.target, wrapper)
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
                    Nui.each(that._instances, function(v){
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
        href:function(url){
            var that = this;
            if(url){
                var temp, index, _router;
                url = this._replace(url);
                Nui.each(this._paths, function(val, rule){
                    if(rule === url || (url.indexOf(val.path) === 0 &&
                                        (temp = url.replace(val.path+'/', '')) && 
                                        temp.split('/').length === val.params.length)){
                        _router = that._instances[val.index];
                        return false
                    }
                })
                if(_router){
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
            level:1,
            onBefore:null,
            onRender:null,
            onAfter:null
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
                index:that._index,
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
                if(val.index === that.index){
                    delete router._paths[i];
                }
            })
            return that
        }
    })
})

Nui.define('pages/components/router/script/menu',[{
    id:'recordVoucher',
    name:'录凭证',
    index:true,
    icon:'',
    path:'/voucher/record/'
}, {
    id:'seeVoucher',
    name:'查凭证',
    icon:'',
    index:true,
    path:'/voucher/list/aniu/jser/'
}, {
    name:'账簿',
    icon:'',
    subs:[{
        id:'summary',
        name:'总账',
        icon:'',
        path:'/books/summary/'
    }, {
        id:'detailed',
        name:'明细账',
        icon:'',
        path:'/books/detailed/'
    }, {
        id:'accountbalance',
        name:'科目余额表',
        icon:'',
        path:'/books/accountbalance/'
    }]
}])
Nui.define('pages/components/router/script/tpls/index',function(){
    return this.renders(''+''
        +'<div class="m-main ui-bgw">'+''
            +'<h3 class="ui-bdb ui-fcb">'+''
                +'<em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run1">欢</em>'+''
                +'<em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run2">迎</em>'+''
                +'<em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run3">使</em>'+''
                +'<em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run4">用</em>'+''
                +'<em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run5">云</em>'+''
                +'<em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run6">记</em>'+''
                +'<em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run7">账</em>'+''
                +'<em class="ui-animate ui-animate-fadeInDown ui-animate-fadeInDown-run8">！</em>'+''
            +'</h3>'+''
            +'<ul>'+''
                +'<% each $list %>'+''
                +'<% if $value.index %>'+''
                +'<li>'+''
                    +'<a href="javascript:void(0)" rel="<% $value.path %>" id="<% $value.id %>Index">'+''
                        +'<em><i class="iconfont ui-animate">&#xe62a;</i></em>'+''
                        +'<span class="ui-animate"><% $value.name %></span>'+''
                    +'</a>'+''
                +'</li>'+''
                +'<% /if %>'+''
                +'<% /each %>'+''
            +'</ul>'+''
        +'</div>'+''
    +'')
})
Nui.define('pages/components/router/script/modules/index',['pages/components/router/script/tpls/index', 'template', 'pages/components/router/script/menu'], function(tmpl, tpl, menu){
    var module = this;
    var router = module.require('{cpns}/router');
    var delegate = module.require('delegate');
    module.imports('../../style/index')
    return function(target, wrapper, request){
        wrapper.html(tpl.render(tmpl, menu));
        delegate({
            elem:wrapper,
            maps:{
                'click a':'seturl'
            },
            calls:{
                seturl:function(e, elem){
                    router('href', elem.attr('rel'))
                }
            }
        })
    }
})
Nui.define('pages/components/router/script/router',['{cpns}/router'], function(router){
    var module = this;

    return function(){
        router('alias', {
            'list':'/voucher/list/:nickname/:career'
        })

        router('options', {
            container:'.g-main',
            delegate:Nui.doc,
            level:2,
            //wrapper:true,
            onAfter:function(elem){
                $('.m-menu-item a.s-crt').removeClass('s-crt');
                elem.addClass('s-crt');
            }
        })

        router({
            target:'#index',
            entry:true,
            path:'/index',
            onRender:module.require('pages/components/router/script/modules/index')
        })

        router({
            target:'#recordVoucher',
            path:'/voucher/record',
            wrapper:false,
            onBefore:function(target, render){
                if(confirm('点击取消不会切换页面')){
                    render()
                }
                return false;
            },
            onRender:module.require('pages/components/router/script/modules/recordVoucher')
        })

        router({
            target:'#seeVoucher',
            path:'{list}',
            wrapper:false,
            level:2,
            onRender:module.require('pages/components/router/script/modules/seeVoucher')
        })

        router('start')
    }
})
Nui.define('pages/components/router/script/tpls/layout',function(){
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
Nui.define('pages/components/router/script/render',['pages/components/router/script/menu', 'pages/components/router/script/tpls/layout', 'template'], function(menu, layout, tpl){
    var module = this;
    return function(data){
        $('.m-headbox').html(tpl.render(layout.head, data))
        data.menu = menu;
        $('.m-menu').html(tpl.render(layout.menu, data))
    }
})
Nui.define('./script/page',function(){
	var module=this,require=module.require,imports=module.imports,renders=module.renders,extend=module.extend;
	var render = require('pages/components/router/script/render');
	var router = require('pages/components/router/script/router');
	var ajax = require('pages/components/router/script/ajax');
	var base = imports('../style/base');
	var page = imports('../style/page');
	ajax({
	    url:'./script/data.json',
	    success:function(res){
	        render(res);
	        router()
	    }
	});
	module.exports = function(){
	    
	}
});
