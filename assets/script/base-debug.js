/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description 语法高亮组件
 */

Nui.define('highlight',function(){
    var renders = this.renders;
    return this.extend('component', {
        static:{
            _getcode:function(type, text){
                return '<code class="'+ type +'">'+ text +'</code>'
            },
            _getarr:function(match, code){
                var array = [];
                if(!match){
                    array.push(code)
                }
                else{
                    $.each(match, function(k, v){
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
            var that = this;
            that.target = that._getTarget();
            if(that.target){
                var dom = that.target.get(0);
                if(dom.tagName === 'SCRIPT' && dom.type == 'text/highlight'){
                    that.code = that.target.html()
                                .replace(/^[\r\n]+|[\r\n]+$/g, '')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;');
                    if(that.elem){
                        that.elem.remove();
                    }
                    that._create();
                    if(that.options.isLight){
                        that._event();
                    }
                }
            }
        },
        _tpl:renders(''+''
            +'<div class="ui-highlight<%if type%> ui-highlight-<%type%><%/if%><%if theme%> t-highlight-<%theme%><%/if%>">'+''
                +'<%if isTitle%>'+''
                +'<div class="title">'+''
                    +'<em class="type"><%type%></em>'+''
                +'</div>'+''
                +'<%/if%>'+''
                +'<div class="inner">'+''
                    +'<table>'+''
                        +'<%each list val key%>'+''
                            +'<tr>'+''
                                +'<%if isLine === true%><td class="line" number="<%key+1%>"><%if bsie7%><%key+1%><%/if%></td><%/if%>'+''
                                +'<td class="code"><%val%></td>'+''
                            +'</tr>'+''
                        +'<%/each%>'+''
                    +'</table>'+''
                +'<div>'+''
            +'</div>'+''
        +''),
        _create:function(){
            var that = this;
            var opts = that.options;
            var data = $.extend({
                bsie7:Nui.bsie7,
                list:that._list(),
                type:that._type
            }, that.options||{})
            var html = that._tpl2html.call(that, that._tpl, data);
            that.elem = $(html).insertAfter(that.target);
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
            that._on('click', that.elem.find('tr'), function(e){
                $(this).addClass('s-crt').siblings().removeClass('s-crt');
            })
            that._on('click', that.elem, function(e){
                e.stopPropagation()
            })
            that._on('click', Nui.doc, function(e){
                that.elem.find('tr.s-crt').removeClass('s-crt')
            })
        }
    })
})

/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description css语法高亮组件
 */

Nui.define('./style',function(){
    return this.extend('highlight', {
        _type:'css',
        _css:function(code){
            var that = this;
            var self = that.constructor;
            var str = '';
            var match = code.match(/(\/\*(.|\s)*?\*\/)|(\{[^\{\}\/]*\})/g);
            var array = self._getarr(match, code);
            $.each(array, function(k, v){
                if($.trim(v)){
                    //多行注释
                    if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, self._getcode('comment', '$1'))
                    }
                    else{
                        //匹配属性
                        if(/\}\s*$/.test(v)){
                            v = v.replace(/(\s*)([^:;\{\}\/\*]+)(:)([^:;\{\}\/\*]+)/g, '$1'+self._getcode('attr', '$2')+'$3'+self._getcode('string', '$4'))
                                .replace(/([\:\;\{\}])/g, self._getcode('symbol', '$1'));
                        }
                        //选择器
                        else{
                            v = v.replace(/([^\:\{\}\@\#\s\.]+)/g, self._getcode('selector', '$1'))
                                .replace(/([\:\{\}\@\#\.])/g, self._getcode('symbol', '$1'));
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

Nui.define('./javascript',function(){
    return this.extend('highlight', {
        _type:'js',
        _js:function(code){
            var that = this;
            var self = that.constructor;
            var str = '';
            var kws = 'abstract|arguments|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|elseif|enum|eval|export|'+
                      'extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|'+
                      'package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var';
            var symbol = '&lt;|&gt;|;|!|%|\\\|\\\[|\\\]|\\\(|\\\)|\\\{|\\\}|\\\=|\\\/|-|\\\+|,|\\\.|\\\:|\\\?|~|\\\*|&';
            var match = code.match(/(\/\/.*)|(\/\*(.|\s)*?\*\/)|('[^']*')|("[^"]*")/g);
            var array = self._getarr(match, code);
            $.each(array, function(k, v){
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

/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description xml语法高亮组件
 */

Nui.define('{light}/xml',['./javascript', './style'],function(js, css){
    return this.extend('highlight', {
        _type:'xml',
        _xml:function(code){
            var that = this;
            var self = that.constructor;
            var str = '';
            code = code.replace(/&lt;\s*![^!]+-\s*&gt;/g, function(res){
                return res.replace(/&lt;/g, '<<').replace(/&gt;/g, '>>')
            });
            $.each(code.split('&lt;'), function(k1, v1){
                v1 = v1.split('&gt;');
                var length = v1.length;
                $.each(v1, function(k2, v2){
                    if($.trim(v2)){
                        if(k2 == 0){
                            var istag = false;
                            if(/^\s*\//.test(v2)){
                                v2 = v2.replace(/([^\r\n\/]+)/g, self._getcode('tag', '$1'))
                                       .replace(/^(\s*\/+)/, self._getcode('symbol', '$1'))
                            }
                            else{
                                var preBlank = v2.match(/^\s+/)||'';
                                if(/\=\s*['"]$/.test(v2)){
                                    istag = true
                                }
                                v2 = v2.replace(/^\s+/, '')
                                       .replace(/(\s+)([^'"\/\s\=]+)((\s*=\s*)(['"]?[^'"]*['"]?))?/g, '$1'+self._getcode('attr', '$2')+self._getcode('symbol', '$4')+self._getcode('string', '$5'))
                                       .replace(/<code class="\w+">(\s*((<<\s*![-\s]+)|([-\s]+>>))?)<\/code>/g, '$1')
                                       .replace(/^([^\s]+)/, self._getcode('tag', '$1'))
                                       .replace(/(\/+\s*)$/, self._getcode('symbol', '$1'))
                                v2 = preBlank + v2;
                            }
                            v2 = self._getcode('symbol', '&lt;') + v2;
                            if(!istag){
                                v2 += self._getcode('symbol', '&gt;');
                            }
                        }
                        else{
                            //闭合标签
                            if(length === 3 && k2 === 1 && /\s*['"]\s*/.test(v2)){
                                v2 = v2.replace(/(\s*['"]\s*)/, self._getcode('symbol', '$1')) + self._getcode('symbol', '&gt;');
                            }
                            //内容
                            else{
                                var tagname = $.trim(v1[0]).toLowerCase();
                                if(tagname == 'style'){
                                    v2 = css.exports._css.call(that, v2)
                                }
                                else if(tagname == 'script'){
                                    v2 = js.exports._js.call(that, v2)
                                }
                                else{
                                    v2 = v2.replace(/(.+)/g, self._getcode('text', '$1'))
                                }
                            }
                        }
                        //注释
                        v2 = v2.replace(/<<\s*![^!]+-\s*>>/g, function(res){
                            return res.replace(/([^\r\n]+)/g, self._getcode('comment', '$1')).replace(/<</g, '&lt;').replace(/>>/g, '&gt;')
                        })
                    }
                    str += v2
                })
            })

            return str
        }
    })
})

Nui.define('{script}/base',['{light}/xml'], function(xml){
    this.imports('../style/base');
    var hash = location.hash.replace('#', '');
    var main = $('.g-main');
    var items = main.find('h2');
    var length = items.length;
    var menus = $('.m-menu ul');

    return ({
        init:function(){
            this.setYear();
            this.event();
            this.position();
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
        }
    })
})

