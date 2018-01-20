/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description 语法高亮组件
 */

Nui.define(function(){
    this.imports('../../assets/components/highlight/index');
    return this.extend('../../core/component', {
        _static:{
            _init:function(){
                var self = this;
                Nui.doc.on('click', function(){
                    if(self._active){
                        Nui.each(self.__instances, function(val){
                            if(val._active){
                                val.element.find('.con-highlight-tr.s-crt').removeClass('s-crt');
                                val._active = false;
                            }
                        })
                    }
                    self._active = false;
                })
            },
            _getcode:function(type, text){
                return '<code class="con-highlight-'+ type +'">'+ text +'</code>'
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
        _options:{
            //工具栏
            tools:{
                //复制
                copy:false
            },
            //点击代码那一行高亮
            isLight:true,
            //是否显示行号
            isLine:true,
            //是否显示语法标题
            isTitle:true
        },
        _exec:function(){
            var self = this, target = self._getTarget();
            if(target){
                var dom = target.get(0);
                if(dom.tagName === 'SCRIPT' && dom.type == 'text/highlight'){
                    self.code = target.html()
                                .replace(/^[\r\n]+|[\r\n]+$/g, '')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;');
                    self._create();
                    self._event();
                }
            }
        },
        _title:'',
        _template:
            '<div class="<% className %>">'
                +'<%if tools%>'
                +'<div class="con-highlight-tools">'
                    +'<%if tools.copy%>'
                    +'<em class="copy">复制</em>'
                    +'<%/if%>'
                +'</div>'
                +'<%/if%>'
                +'<div class="con-highlight-body">'
                    +'<table class="con-highlight-table">'
                        +'<%each list val key%>'
                            +'<tr class="con-highlight-row">'
                                +'<%if isLine === true%><td class="con-highlight-cell con-highlight-line" number="<%key+1%>"><%if bsie7%><%key+1%><%/if%></td><%/if%>'
                                +'<td class="con-highlight-cell con-highlight-code"><%val%></td>'
                            +'</tr>'
                        +'<%/each%>'
                    +'</table>'
                +'</div>'
                +'<%if isTitle%>'
                +'<em class="con-highlight-title"><%title%></em>'
                +'<%/if%>'
            +'</div>',
        _events:{
            'click .con-highlight-row':function(e, elem){
                if(this._options.isLight === true){
                    this.constructor._active = this._active = true;
                    elem.addClass('s-crt').siblings().removeClass('s-crt');
                    e.stopPropagation()
                }
            },
            'click .copy':function(){
                alert('傻帽！逗你玩呢。')
            }
        },
        _create:function(){
            var self = this;
            var opts = self._options;
            var data = $.extend({
                bsie7:Nui.bsie7,
                list:self._list(),
                title:self._title,
                isLine:opts.isLine,
                tools:opts.tools,
                isTitle:opts.isTitle
            }, self._tplData())
            self.element = $(self._tpl2html(data)).insertAfter(self.target);
        },
        _getCode:function(){
            return this.code
        },
        _list:function(){
            return this._getCode().split('\n')
        }
    })
})
