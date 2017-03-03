/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description 语法高亮组件
 */

Nui.define(function(){
    return this.extands('component', {
        static:{
            types:['html', 'css', 'js']
        },
        options:{
            //html css js
            type:'',
            //点击代码那一行高亮
            islight:true
        },
        _init:function(){
            var that = this;
            that.target = that._getTarget();
            if(that.target.get(0).tagName === 'SCRIPT' && that.target.attr('type') == 'text/highlight'){
                that._exec();
            }
        },
        _exec:function(){
            var that = this;
            that.code = that.target.html()
                            .replace(/^[\n\r]+|[\n\r]+$/g, '')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;');
            if(that.elem){
                that.elem.remove();
            }
            that._create();
            if(that.options.islight){
                that._event();
            }
        },
        _tpl:function(){
            return '<div class="ui-highlight{{if type}} ui-highlight-{{type}}{{/if}}{{if theme}} t-highlight-{{theme}}{{/if}}">\
                        <table>\
                            {{each list val key}}\
                                <tr>\
                                    <td class="line">{{key+1}}</td>\
                                    <td class="code">{{val}}</td>\
                                </tr>\
                            {{/each}}\
                        </table>\
                    </div>'
        },
        _create:function(){
            var that = this;
            var data = {
                theme:that.options.theme,
                type:that.options.type||'',
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
            that._on('click', that.elem.find('.cell'), function(){

            })
        },
        _getcode:function(type, text){
            return '<code class="'+ type +'">'+ text +'</code>'
        },
        _html:function(code){
            var that = this;
                       //匹配内容
            //code = code.replace(/(&gt;)([^&\s]+)(&lt;)/g, '$1<code class="plain">$2</code>$3')
                       //匹配标签
                       /*.replace(/(&lt;\s*\/?)([^!\s&]+)/g, '<code class="plain">$1</code><code class="tag">$2</code>')
                       //匹配闭合标签
                       .replace(/([^-&]+\s*)(&gt;)/g, '$1<code class="plain">$2</code>')
                       //匹配注释
                       .replace(/(&lt;\s*\!-\s*[^!\s]*\s*-\s*&gt;)/g, '<code class="comment">$1</code>')
                       //匹配属性
                       //.replace(/(\/code>\s*)([^='"]+)(=?)(['"][^'"]*['"])?(\s*<code)/g, '$1<code class="attr">$2</code><code class="plain">$3</code><code class="string">$4</code>$5')
                       console.log(code)*/
            var str = '';
            $.each(code.split('&lt;'), function(key, val){
                val = val.split('&gt;');
                $.each(val, function(k, v){

                    if($.trim(v)){
                        
                    }

                    /*if($.trim(v)){
                        if(k == 0){
                            if(/^\s*!/.test(v)){
                                v = v.replace(/([\r\n]+)([^\s]+)/g, '$1'+that._getcode('comment', '$2'))

                            }
                            else{
                                if(/^\s*\//.test(v)){
                                    v = v.replace(/(\/)+/g, that._getcode('plain', '$1')).replace(/([^\s\/\<\>]+)/g, that._getcode('tag', '$1'))
                                }
                                else{
                                    v = v.replace(/^(\s*[^\s\/]+)/, that._getcode('tag', '$1'))
                                }
                                v = that._getcode('plain', '&lt;') + v + that._getcode('plain', '&gt;')
                            }
                        }
                        else{

                        }
                    }
                    str += v;*/
                })
console.log(val)
            })

            return code
        },
        _css:function(code){
            return code
        },
        _js:function(code){
            return code
        }
    })
})
