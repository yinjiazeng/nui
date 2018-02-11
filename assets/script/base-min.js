;(function(__define){
    function __requireDefaultModule(module){
        if(module && module.defaults !== undefined){
            return module.defaults
        }
        return module
    }

/**
 * Nui&jQuery扩展
 */

__define('src/core/extend',function(require){
           
    Nui.win = $(window);

    Nui.doc = $(document);
    
    var prop = $.fn.prop;

    var serializeArray = $.fn.serializeArray; 

    $.fn.extend({
        /**
         * @func 添加或者移除表单属性
         * @param name <String>
         * @param value <String, Boolean>
         * @param className <String, Function> 当第二个参数为false时移除类名，否则增加类名
         */
        prop:function(){
            var args = arguments, arr = Array.prototype.slice.call(args, 0, 2), $ele = $(this), cls = args[2];
            if(typeof cls === 'function'){
                cls = cls.apply(this, arr)
            }
            if(cls){
                $ele[args[1] === false ? 'removeClass':'addClass'](cls)
            }
            return prop.apply(this, arr)
        },
        /**
         * @func 序列化表单值转成url参数形式
         * @param disabled <Boolean> 是否包含禁用元素
         */
        serialize:function(disabled){
            return $.param(this.serializeArray(disabled));
        },
        /**
         * @func 序列化表单值转为JSON数组
         * @param disabled <Boolean> 是否包含禁用元素
         */
        serializeArray:function(disabled){
            if(!disabled){
                return serializeArray.call(this)
            }
            return this.map(function(){
                var elements = $.prop(this, 'elements');
                return elements ? $.makeArray(elements) : this;
            })
            .filter(function(){
                var type = this.type;
                return this.name && this.nodeName &&
                    (/^(?:input|select|textarea|keygen)/i).test(this.nodeName) && 
                    !(/^(?:submit|button|image|reset|file)$/i).test(type) &&
                    (this.checked || !(/^(?:checkbox|radio)$/i).test(type));
            })
            .map(function(i, elem){
                var val = $(this).val();
                return val == null ?
                    null :
                    $.isArray(val) ?
                        $.map(val, function(val){
                            return {name: elem.name, value: val.replace( /\r?\n/g, "\r\n" )};
                        }) :
                        {name: elem.name, value: val.replace( /\r?\n/g, "\r\n" )};
            }).get();
        }
    })
})
__define('src/core/events',['src/core/extend'], function(){
    return function(opts){
        var self = this, that = opts || self,
            constr = that.constructor,
            isComponent = constr && constr.__component_name,
            elem = self.element || that.element || Nui.doc, 
            events = isComponent ? that._events : that.events;
        if(!elem || !events){
            return that
        }

        if(typeof events === 'function'){
            events = events.call(that)
        }

        if(!(elem instanceof jQuery)){
            elem = jQuery(elem)
        }

        var evt, ele, ret;
        var callback = function(e, elem, cbs){
            if(typeof cbs === 'function'){
                cbs.call(that, e, elem);
            }
            else{
                var _cb, _that;
                Nui.each(cbs, function(cb, i){
                    if(typeof (_cb = that[cb]) === 'function'){
                        _that = that;
                    }
                    else if(typeof (_cb = self[cb]) === 'function'){
                        _that = self;
                    }
                    if(_that){
                        return ret = _cb.call(_that, e, elem, ret);
                    }
                })
            }
        }

        Nui.each(events, function(cbs, evts){
            if(cbs && (typeof cbs === 'string' || typeof cbs === 'function')){
                if(typeof cbs === 'string'){
                    cbs = Nui.trim(cbs).split(/\s+/);
                }
                evts = Nui.trim(evts).split(/\s+/);
                // keyup:kupdown:focus a => elem.on('keyup kupdown focus', 'a', callback)
                evt = evts.shift().replace(/:/g, ' ');
                ele = evts.join(' ');
                //组件内部处理
                if(isComponent){
                    that._on(evt, elem, ele, function(e, elem){
                        callback(e, elem, cbs)
                    })
                }
                else{
                    elem.on(evt, ele, function(e){
                        callback(e, jQuery(this), cbs)
                    })
                }
            }
        })
        return that
    }
})

/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description css语法高亮组件
 */

__define('src/components/highlight/style',function(){
    return this.extend('./highlight', {
        _title:'css',
        _getCode:function(_code){
            var self = this;
            var code = _code || self.code;
            var _class = self.constructor;
            var str = '';
            var match = code.match(/(\/\*(.|\s)*?\*\/)|(\{[^\{\}\/]*\})/g);
            var array = _class._getarr(match, code);
            Nui.each(array, function(v){
                if(Nui.trim(v)){
                    //多行注释
                    if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, _class._getcode('comment', '$1'))
                    }
                    else{
                        //匹配属性
                        if(/\}\s*$/.test(v)){
                            v = v.replace(/(\s*)([^:;\{\}\/\*]+)(:)([^:;\{\}\/\*]+)/g, '$1'+_class._getcode('attr', '$2')+'$3'+_class._getcode('string', '$4'))
                                .replace(/([\:\;\{\}])/g, _class._getcode('symbol', '$1'));
                        }
                        //选择器
                        else{
                            v = v.replace(/([^\:\{\}\@\#\s\.]+)/g, _class._getcode('selector', '$1'))
                                .replace(/([\:\{\}\@\#\.])/g, _class._getcode('symbol', '$1'));
                        }
                    }
                }
                str += v;
            })
            return str
        }
    })
})

/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description javascript语法高亮组件
 */

__define('src/components/highlight/javascript',function(){
    return this.extend('./highlight', {
        _title:'js',
        _getCode:function(_code){
            var self = this;
            var code = _code || self.code;
            var _class = self.constructor;
            var str = '';
            var kws = 'abstract|arguments|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|elseif|each|enum|eval|export|'+
                      'extends|false|final|finally|float|for|function|goto|if|implements|import|from|in|instanceof|int|include|interface|let|long|native|new|null|'+
                      'package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var';
            var symbol = '&lt;|&gt;|;|!|%|\\\|\\\[|\\\]|\\\(|\\\)|\\\{|\\\}|\\\=|\\\/|-|\\\+|,|\\\.|\\\:|\\\?|~|\\\*|&';
            var match = code.match(/(\/\/.*)|(\/\*(.|\s)*?\*\/)|('[^']*')|("[^"]*")/g);
            var array = _class._getarr(match, code);
            Nui.each(array, function(v){
                if(Nui.trim(v)){
                    //单行注释
                    if(/^\s*\/\//.test(v)){
                        v = _class._getcode('comment', v);
                    }
                    //多行注释
                    else if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, _class._getcode('comment', '$1'))
                    }
                    else{
                        //字符串
                        if(/'|"/.test(v)){
                            v = v.replace(/(.+)/g, _class._getcode('string', '$1'))
                        }
                        //关键字、符号、单词
                        else{
                            v = v.replace(new RegExp('('+ symbol +')', 'g'), _class._getcode('symbol', '$1'))
                                .replace(new RegExp('('+ kws +')(\\s+|\\\<code)', 'g'), _class._getcode('keyword', '$1')+'$2')
                                .replace(/(\/code>\s*)(\d+)/g, '$1'+_class._getcode('number', '$2'))
                                .replace(/(\/code>\s*)?([^<>\s]+)(\s*<code)/g, '$1'+_class._getcode('word', '$2')+'$3')

                        }
                        v = _class._comment(v);
                    }
                }
                str += v;
            })
            return str
        }
    })
})

/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description xml语法高亮组件
 */

__define('src/components/highlight/xml',['src/components/highlight/javascript', 'src/components/highlight/style'],function(js, css){
    return this.extend('./highlight', {
        _title:'xml',
        _getCode:function(){
            var self = this;
            var code = self.code;
            var _class = self.constructor;
            var str = '';
            code = code.replace(/&lt;\s*![^!]+-\s*&gt;/g, function(res){
                return res.replace(/&lt;/g, '<<').replace(/&gt;/g, '>>')
            });
            Nui.each(code.split('&lt;'), function(v1){
                v1 = v1.split('&gt;');
                var length = v1.length;
                Nui.each(v1, function(v2, k2){
                    if(Nui.trim(v2)){
                        if(k2 == 0){
                            var istag = false;
                            if(/^\s*\//.test(v2)){
                                v2 = v2.replace(/([^\r\n\/]+)/g, _class._getcode('tag', '$1'))
                                       .replace(/^(\s*\/+)/, _class._getcode('symbol', '$1'))
                            }
                            else{
                                var preBlank = v2.match(/^\s+/)||'';
                                if(/\=\s*['"]$/.test(v2)){
                                    istag = true
                                }
                                v2 = v2.replace(/^\s+/, '')
                                       .replace(/(\s+)([^'"\/\s\=]+)((\s*=\s*)(['"]?[^'"]*['"]?))?/g, '$1'+_class._getcode('attr', '$2')+_class._getcode('symbol', '$4')+_class._getcode('string', '$5'))
                                       .replace(/<code class="\w+">(\s*((<<\s*![-\s]+)|([-\s]+>>))?)<\/code>/g, '$1')
                                       .replace(/^([^\s]+)/, _class._getcode('tag', '$1'))
                                       .replace(/(\/+\s*)$/, _class._getcode('symbol', '$1'))
                                v2 = preBlank + v2;
                            }
                            v2 = _class._getcode('symbol', '&lt;') + v2;
                            if(!istag){
                                v2 += _class._getcode('symbol', '&gt;');
                            }
                        }
                        else{
                            //闭合标签
                            if(length === 3 && k2 === 1 && /\s*['"]\s*/.test(v2)){
                                v2 = v2.replace(/(\s*['"]\s*)/, _class._getcode('symbol', '$1')) + _class._getcode('symbol', '&gt;');
                            }
                            //内容
                            else{
                                var tagname = Nui.trim(v1[0]).toLowerCase().split(/\s+/)[0];
                                if(tagname == 'style'){
                                    v2 = css.exports._getCode.call(self, v2)
                                }
                                else if(tagname == 'script'){
                                    v2 = js.exports._getCode.call(self, v2)
                                }
                                else{
                                    v2 = v2.replace(/(.+)/g, _class._getcode('text', '$1'))
                                }
                            }
                        }
                        //注释
                        v2 = v2.replace(/<<\s*![^!]+-\s*>>/g, function(res){
                            return res.replace(/([^\r\n]+)/g, _class._getcode('comment', '$1')).replace(/<</g, '&lt;').replace(/>>/g, '&gt;')
                        })
                    }
                    str += v2
                })
            })

            return str
        }
    })
})

__define('{script}/base',['src/components/highlight/xml', 'src/core/events'], function(xml, events){
    var component = this.require('component');
    this.imports('../style/base');
    var hash = location.hash ? location.hash.replace('#', '') : '';
    var main = $('.g-main');
    var items = main.find('h2');
    var length = items.length;
    var menus = $('.m-menu ul');
    component.init(Nui.doc);

    return ({
        init:function(){
            this.setYear();
            if(main.find('h2[id]').length){
                this.event();
                this.position();
            }
            if(Nui.bsie7){
                this.bsie7();
            }
        },
        setYear:function(){
            $('#nowyear').text('-'+new Date().getFullYear());
        },
        position:function(){
            if(hash){
                var elem = $('[id="'+ hash +'"]');
                elem.length && main.scrollTop(elem.position().top)
            }
        },
        event:function(){
            main.scroll(function(){
                var stop = main.scrollTop();
                items.each(function(i){
                    var item = $(this);
                    var id = this.id;
                    var itop = item.position().top - 20;
                    var ntop = 0;
                    var next = items.eq(i+1);
                    if(next.length){
                        ntop = next.position().top - 20
                    }
                    else{
                        ntop = $('.mainbox').outerHeight()
                    }
                    menus.find('a.s-crt').removeClass('s-crt');
                    if(stop >= itop && stop < ntop){
                        menus.find('a[href="#'+ id +'"]').addClass('s-crt');
                        //为了阻止设置location.hash时，浏览器会自行定位到该id的起始位置
                        item.removeAttr('id');
                        location.hash = id;
                        item.attr('id', id);
                        return false;
                    }
                })
            })
        },
        bsie7:function(){
            var box = $('.g-html .g-content');
            var height = $('.g-header').outerHeight();
            var timer = null;
            var resize = function(){
                box.height(Nui.win.height() - height)
            }
            Nui.win.resize(function(){
                clearTimeout(timer);
                timer = setTimeout(resize, 100)
            })
            resize();
        }
    })
})


})(Nui['_module_1_define']);