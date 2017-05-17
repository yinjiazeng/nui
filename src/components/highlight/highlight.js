/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description 语法高亮组件
 */

Nui.define(function(){
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
        _tpl:'<div class="<% className %>">'
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
            +'</div>',
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
            var html = that._tpl2html.call(that, that._tpl, data);
            that.element = $(html).insertAfter(that.target);
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
