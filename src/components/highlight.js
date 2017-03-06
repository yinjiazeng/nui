/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description 语法高亮组件
 */

Nui.define(function(){
    return this.extands('component', {
        static:{
            types:['html', 'css', 'js'],
            bsie7:Nui.browser.msie && Nui.browser.version <= 7,
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
            },
        },
        options:{
            //html css js
            type:'',
            //点击代码那一行高亮
            light:true,
            //是否显示行号
            line:true
        },
        _init:function(){
            var that = this;
            that.target = that._getTarget();
            var dom = that.target.get(0);
            if(dom.tagName === 'SCRIPT' && dom.type == 'text/highlight'){
                that._exec();
            }
        },
        _exec:function(){
            var that = this;
            that.code = that.target.html()
                            .replace(/^[\r\n]+|[\r\n]+$/g, '')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
            if(that.elem){
                that.elem.remove();
            }
            that._create();
            if(that.options.light){
                that._event();
            }
        },
        _tpl:function(){
            return '<div class="ui-highlight{{if type}} ui-highlight-{{type}}{{/if}}{{if theme}} t-highlight-{{theme}}{{/if}}">\
                        <div class="title">\
                            <em class="type">{{type}}</em>\
                        </div>\
                        <table>\
                            {{each list val key}}\
                                <tr>\
                                    {{if line === true}}<td class="line" number="{{key+1}}">{{if bsie7}}{{key+1}}{{/if}}</td>{{/if}}\
                                    <td class="code">{{val}}</td>\
                                </tr>\
                            {{/each}}\
                        </table>\
                    </div>'
        },
        _create:function(){
            var that = this;
            var opts = that.options;
            var data = {
                theme:opts.theme,
                type:opts.type||'',
                line:opts.line,
                bsie7:that._self.bsie7,
                list:that._list()
            }
            var html = that._tpl2html(that._tpl(), data);
            that.elem = $(html).insertAfter(that.target);
        },
        _list:function(){
            var that = this;
            if($.inArray(that.options.type, that._self.types) !== -1){
                return that['_'+that.options.type](that.code).split('\n')
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
        },
        _html:function(code){
            var that = this;
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
                                v2 = v2.replace(/([^\r\n\/]+)/g, that._self._getcode('tag', '$1'))
                                       .replace(/^(\s*\/+)/, that._self._getcode('symbol', '$1'))
                            }
                            else{
                                var preBlank = v2.match(/^\s+/)||'';
                                if(/\=\s*['"]$/.test(v2)){
                                    istag = true
                                }
                                v2 = v2.replace(/^\s+/, '')
                                       .replace(/(\s+)([^'"\/\s\=]+)((\s*=\s*)(['"]?[^'"]*['"]?))?/g, '$1'+that._self._getcode('attr', '$2')+that._self._getcode('symbol', '$4')+that._self._getcode('string', '$5'))
                                       .replace(/<code class="\w+">(\s*((<<\s*![-\s]+)|([-\s]+>>))?)<\/code>/g, '$1')
                                       .replace(/^([^\s]+)/, that._self._getcode('tag', '$1'))
                                       .replace(/(\/+\s*)$/, that._self._getcode('symbol', '$1'))
                                v2 = preBlank + v2;
                            }
                            v2 = that._self._getcode('symbol', '&lt;') + v2;
                            if(!istag){
                                v2 += that._self._getcode('symbol', '&gt;');
                            }
                        }
                        else{
                            //闭合标签
                            if(length === 3 && k2 === 1 && /\s*['"]\s*/.test(v2)){
                                v2 = v2.replace(/(\s*['"]\s*)/, that._self._getcode('symbol', '$1')) + that._self._getcode('symbol', '&gt;');
                            }
                            //内容
                            else{
                                var tagname = $.trim(v1[0]).toLowerCase();
                                if(tagname == 'style'){
                                    v2 = that._css(v2)
                                }
                                else if(tagname == 'script'){
                                    v2 = that._js(v2)
                                }
                                else{
                                    v2 = v2.replace(/(.+)/g, that._self._getcode('text', '$1'))
                                }
                            }
                        }
                        //注释
                        v2 = v2.replace(/<<\s*![^!]+-\s*>>/g, function(res){
                            return res.replace(/([^\r\n]+)/g, that._self._getcode('comment', '$1')).replace(/<</g, '&lt;').replace(/>>/g, '&gt;')
                        })
                    }
                    str += v2
                })
            })

            return str
        },
        _css:function(code){
            var that = this;
            var str = '';
            var match = code.match(/(\/\*(.|\s)*?\*\/)|(\{[^\{\}\/]*\})/g);
            var array = that._self._getarr(match, code);
            $.each(array, function(k, v){
                if($.trim(v)){
                    //多行注释
                    if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, that._self._getcode('comment', '$1'))
                    }
                    else{
                        //匹配属性
                        if(/^\}\s*$/.test(v)){
                            v = v.replace(/(\s*)([^:;\{\}\/\*]+)(:)([^:;\{\}\/\*]+)/g, '$1'+that._self._getcode('attr', '$2')+'$3'+that._self._getcode('string', '$4'))
                                .replace(/([\:\;\{\}])/g, that._self._getcode('symbol', '$1'));
                        }
                        //选择器
                        else{
                            v = v.replace(/([^\:\{\}\@\#\s\.]+)/g, that._self._getcode('selector', '$1'))
                                .replace(/([\:\{\}\@\#\.])/g, that._self._getcode('symbol', '$1'));
                        }
                    }
                }
                str += v;
            })
            return str
        },
        _js:function(code){
            var that = this;
            var str = '';
            var kws = 'abstract|arguments|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|eval|export|'+
                      'extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|let|long|native|new|null|'+
                      'package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var';
            var symbol = '&lt;|&gt;|;|!|%|\\\|\\\[|\\\]|\\\(|\\\)|\\\{|\\\}|\\\=|\\\/|-|\\\+|,|\\\.|\\\:|\\\?|~|\\\*|&';
            var match = code.match(/(\/\/.*)|(\/\*(.|\s)*?\*\/)|('[^']*')|("[^"]*")/g);
            var array = that._self._getarr(match, code);
            $.each(array, function(k, v){
                if($.trim(v)){
                    //单行注释
                    if(/^\s*\/\//.test(v)){
                        v = that._self._getcode('comment', v);
                    }
                    //多行注释
                    else if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, that._self._getcode('comment', '$1'))
                    }
                    else{
                        //字符串
                        if(/'|"/.test(v)){
                            v = v.replace(/(.+)/g, that._self._getcode('string', '$1'))
                        }
                        //关键字、符号、单词
                        else{
                            v = v.replace(new RegExp('('+ symbol +')', 'g'), that._self._getcode('symbol', '$1'))
                                .replace(new RegExp('('+ kws +')(\\s+)', 'g'), that._self._getcode('keyword', '$1')+'$2')
                                .replace(/(\/code>\s*)(\d+)/g, '$1'+that._self._getcode('number', '$2'))
                                .replace(/(\/code>\s*)([^<>\s]+)(\s*<code)/g, '$1'+that._self._getcode('word', '$2')+'$3')
                        }
                        v = that._self._comment(v);
                    }
                }
                str += v;
            })
            return str
        }
    })
})
