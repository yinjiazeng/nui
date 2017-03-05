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
            bsie7:Nui.browser.msie && Nui.browser.version <= 7
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
            if(that.options.islight){
                that._event();
            }
        },
        _tpl:function(){
            return '<div class="ui-highlight{{if type}} ui-highlight-{{type}}{{/if}}{{if theme}} t-highlight-{{theme}}{{/if}}">\
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
            that._on('click', that.elem.find('.cell'), function(){

            })
        },
        _getcode:function(type, text){
            return '<code class="'+ type +'">'+ text +'</code>'
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
                                v2 = v2.replace(/([^\r\n\/]+)/g, that._getcode('tag', '$1'))
                                       .replace(/^(\s*\/+)/, that._getcode('plain', '$1'))
                            }
                            else{
                                var preBlank = v2.match(/^\s+/)||'';
                                if(/\=\s*['"]$/.test(v2)){
                                    istag = true
                                }
                                v2 = v2.replace(/^\s+/, '')
                                       .replace(/(\s+)([^'"\/\s\=\<\>\-\!]+)((\s*=\s*)(['"]?[^'"]*['"]?))?/g, '$1'+that._getcode('attr', '$2')+that._getcode('plain', '$4')+that._getcode('string', '$5'))
                                       .replace(/^([^\s]+)/, that._getcode('tag', '$1'))
                                       .replace(/(\/+\s*)$/, that._getcode('plain', '$1'))
                                v2 = preBlank + v2;
                            }
                            v2 = that._getcode('plain', '&lt;') + v2;
                            if(!istag){
                                v2 += that._getcode('plain', '&gt;');
                            }
                        }
                        else{
                            if(length === 3 && k2 === 1 && /\s*['"]\s*/.test(v2)){
                                v2 = v2.replace(/(\s*['"]\s*)/, that._getcode('plain', '$1')) + that._getcode('plain', '&gt;');
                            }
                            else{
                                v2 = v2.replace(/([^\r\n]+)/g, that._getcode('text', '$1'))
                            }
                        }
                        //注释
                        v2 = v2.replace(/<<\s*![^!]+-\s*>>/g, function(res){
                            return res.replace(/([^\r\n]+)/g, that._getcode('comment', '$1')).replace(/<</g, '&lt;').replace(/>>/g, '&gt;')
                        })
                    }
                    str += v2
                })
            })

            return str
        },
        _css:function(code){
            return code
        },
        _js:function(code){
            return code
        }
    })
})
