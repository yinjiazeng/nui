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
        +'<a id="aaa">aaaaaaaaaaa</a> '+''
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

Nui.define('{cpns}/placeholder',['util'], function(util){
    var support = util.supportHtml5('placeholder', 'input');
    return this.extend('component', {
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
        _tpllist:'<%each style%><%$index%>:<%$value%>;<%/each%>',
        _tplwrap:'<strong class="nui-placeholder<%if skin%> placeholder-<%skin%><%/if%>" style="<%include \'_tpllist\'%>" />',
        _tplelem:'<b style="<%include \'_tpllist\'%>"><%text%></b>',
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
                        skin:opts.skin,
                        style:{
                            'position':'relative',
                            'display':'inline-block',
                            'width':that.target.outerWidth()+'px',
                            'overflow':'hidden',
                            'cursor':'text'
                        }
                    }))
                that.element = $(that._tpl2html(that._tplelem, {
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
        _event:function(){
            var that = this, opts = that.options, self = that.constructor;
            var pleft = self._getSize(that.target, 'l', 'padding') + self._getSize(that.target, 'l');
            that._on('click', that.element, function(){
                that.target.focus()
            })

            that._on('focus', that.target, function(){
                opts.animate && that.element.stop(true, false).animate({left:pleft+10, opacity:'0.5'});
            })

            that._on('blur change', that.target, function(e, elem){
                var val = Nui.trim(elem.val());
                if((!opts.equal && val === that.text) || !val){
                    elem.val('');
                    that.element.show();
                    opts.animate && that.element.stop(true, false).animate({left:pleft, opacity:'1'})
                }
                else{
                    that.element.hide()
                }
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
            //是否显示title
            isTitle:false,
            //点击代码那一行高亮
            isLight:true,
            //是否显示行号
            isLine:false
        },
        _type:'',
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
        _tpl:'<div class="nui-highlight<%if type%> nui-highlight-<%type%><%/if%><%if skin%> highlight-<%skin%><%/if%>">'
                +'<%if isTitle%>'
                +'<div class="title">'
                    +'<em class="type"><%type%></em>'
                +'</div>'
                +'<%/if%>'
                +'<div class="inner">'
                    +'<table>'
                        +'<%each list val key%>'
                            +'<tr>'
                                +'<%if isLine === true%><td class="line" number="<%key+1%>"><%if bsie7%><%key+1%><%/if%></td><%/if%>'
                                +'<td class="code"><%val%></td>'
                            +'</tr>'
                        +'<%/each%>'
                    +'</table>'
                +'<div>'
            +'</div>',
        _create:function(){
            var that = this;
            var opts = that.options;
            var data = $.extend({
                bsie7:Nui.bsie7,
                list:that._list(),
                type:that._type
            }, that.options||{})
            var html = that._tpl2html.call(that, that._tpl, data);
            that.element = $(html).insertAfter(that.target);
        },
        _list:function(){
            var that = this;
            if(that._type){
                return that['_'+that._type](that.code).split('\n')
            }
            return that.code.split('\n')
        },
        _event:function(){
            var that = this;
            that._on('click', that.element, 'tr', function(e, elem){
                that.constructor._active = that._active = true;
                elem.addClass('s-crt').siblings().removeClass('s-crt');
                e.stopPropagation()
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
        _type:'js',
        _js:function(code){
            var that = this;
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
        +'<input type="text" placeholder="aaaaaaaaaaa" data-placeholder-options=\'{"color":"#f60", "animate":true}\' />'+''
        +'<script type="text/highlight" data-javascript-options="{id:\'b\'}">'+''
        +'var a = 1;'+''
        +'var b = 2;'+''
        +'</script> '+''
        +'<div class="box">a1</div>'+''
        +'<a id="aaa">aaaaaaaaaaa</a>'+''
    +'')
})
Nui.define('pages/components/router/script/modules/recordVoucher',['component', 'pages/components/router/script/tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(component, tmpl, tpl, js){
    var module = this;
    return function(target, wrapper, request){

        wrapper.html(tpl.render(tmpl, request))
       
        wrapper.on('click', 'b', function(){
            alert()
        })

         wrapper.find('a').click(function(){
             alert()
            js('destroy', wrapper, 'b')
            //component.static.trigger(null, 'destroy');
            setTimeout(function(){
                js('init', wrapper)
                js('set', wrapper, {
                    isLine:true
                }) 
            }, 2000)
            //js('trigger', container, 'destroy')
        })
    }
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
                    +'<a href="<% $value.path %>" id="<% $value.id %>Index">'+''
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
    module.imports('../../style/index')
    return function(target, wrapper, request){
        wrapper.html(tpl.render(tmpl, menu))
    }
})
/**
 * @author Aniu[2017-02-27 23:46]
 * @update Aniu[2017-02-27 23:46]
 * @version 1.0.1
 * @description 路由
 */

Nui.define('{cpns}/router',['component'], function(component){
    return this.extend(component, {
        static:{
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
                                    wrapper.show().siblings('.wrapper').hide();
                                    if(typeof opts.onAfter === 'function'){
                                        opts.onAfter(object.target, wrapper)
                                    }
                                    that._initialize = match = true;
                                    return false
                                }
                            }
                        })
                        if(match){
                            return false
                        }
                    })
                    if(!that._initialize){
                        Nui.each(that._instances, function(v){
                            if(!that._hasEnter && v.options.enter === true){
                                that._hasEnter = true;
                                v._render(v.target.eq(0));
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
            init:function(){
                if(!this._initialize){
                    this._change();
                }
            },
            $ready:null,
            $fn:null
        },
        options:{
            path:null,
            container:null,
            enter:false,
            wrapper:false,
            splitLevel:1,
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
                    location.hash = '#!'+that.constructor._replace(href);
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

Nui.define('pages/components/router/script/router',['{cpns}/router'], function(router){
    var module = this;

    return function(){
        router('alias', {
            'list':'/voucher/list/:nickname/:career'
        })

        router('options', {
            container:'.g-main',
            //wrapper:true,
            onAfter:function(elem){
                $('.m-menu-item a.s-crt').removeClass('s-crt');
                elem.addClass('s-crt');
            }
        })

        router({
            target:'#index',
            enter:true,
            path:'/index',
            onRender:module.require('pages/components/router/script/modules/index')
        })

        router({
            target:'#recordVoucher, #recordVoucherIndex',
            path:'/voucher/record',
            wrapper:false,
            onBefore:function(target, render){
                console.log(target.attr('href'))
                /*if(confirm('点击取消不会切换页面')){
                    render()
                }
                return false;*/
            },
            onRender:module.require('pages/components/router/script/modules/recordVoucher')
        })

        router({
            target:'#seeVoucher, #seeVoucherIndex',
            path:'{list}',
            wrapper:false,
            splitLevel:2,
            onRender:module.require('pages/components/router/script/modules/seeVoucher')
        })

        router('init')
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
