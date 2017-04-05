/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description 语法高亮组件
 */

Nui.define(function(){
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
        _tpl:renders({
            <div class="ui-highlight{{if type}} ui-highlight-{{type}}{{/if}}{{if theme}} t-highlight-{{theme}}{{/if}}">
                {{if isTitle}}
                <div class="title">
                    <em class="type">{{type}}</em>
                </div>
                {{/if}}
                <div class="inner">
                    <table>
                        {{each list val key}}
                            <tr>
                                {{if isLine === true}}<td class="line" number="{{key+1}}">{{if bsie7}}{{key+1}}{{/if}}</td>{{/if}}
                                <td class="code">{{val}}</td>
                            </tr>
                        {{/each}}
                    </table>
                <div>
            </div>
        }),
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
