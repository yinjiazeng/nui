/**
 * @author Aniu[2017-12-23 16:50]
 * @update Aniu[2018-01-31 11:54]
 * @version 1.0.1
 * @description 选择器组件
 */

Nui.define(function(require, imports){
    imports('../assets/components/select/index');

    var Component = require('../core/component');
    var Placeholder = require('./placeholder');
    var Search = require('./search');

    var Select = this.extend(Component, {
        _static:{

        },
        _options:{

        },
        _template:
            '<div class="nui-select">'+
                '<div class="con-select-wrap">'+
                    '<div class="con-select-combo">'+
                        '<div class="con-select-edit">'+
                            '<input type="text" class="con-select-input" readonly>'+
                        '</div>'+
                    '</div>'+
                    '<div class="con-select-adorn">'+
                        '<span class="con-select-arrow">▼</span>'+
                    '</div>'+
                '</div>'+
            '</div>',
        _exec:function(){
            if(this._getTarget()){
                this.target.hide();
                this.element = $(this._tpl2html({
                
                })).insertBefore(this.target)
                var input = this.element.find('input');
                input.placeholder({
                    text:'请输入'
                })
                var that = this;
                var multi = this.target.prop('multiple')
                Search({
                    target:that.element.find('input'),
                    container:that.element,
                    field:'text',
                    focus:true,
                    nullable:true,
                    tag:{
                        container:that.element.find('.con-select-combo'),
                        scroll:that.element.find('.con-select-wrap'),
                        multiple:multi
                    },
                    size:{
                        //width:100
                    },
                    offset:{
                        top:-1
                    },
                    data:this._optionToData(),
                    selected:function(self, data){
                        var exist = false;
                        Nui.each(self.tagData, function(v){
                            if(v.text === data.value){
                                exist = true;
                                return false
                            }
                        })
                        return exist
                    },
                    item:function(){
                        return '<%if $data.label%>'+
                                    '<li><%$data.label%></li>'+
                                '<%/if%>'+
                                '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>">'+
                                    '<%$data.text%>'+
                                '</li>'
                    },
                    setValue:function(self, data){
                        return {
                            title:data.text,
                            text:data.value
                        }
                    },
                    onSelectBefore:function(self, data){
                        if(multi){
                            self.value(this.setValue(self, data));
                            var text = [];
                            Nui.each(self.tagData, function(v){
                                text.push(v.title)
                            })
                            self.value(text.join(','))
                            return false
                        }
                    },
                    onSelect:function(self, data){
                        self.value(data.text)
                    },
                    onShow:function(){
                        that.element.addClass('s-show')
                    },
                    onHide:function(){
                        that.element.removeClass('s-show')
                    }
                })
            }
        },
        _optionToData:function(){
            var that = this;
            var elem = arguments[0] || this.target;
            var option = elem.children();
            var data = [];
            option.each(function(){
                var $ele = $(this);
                if(this.nodeName === 'OPTGROUP'){
                    var groupData = that._optionToData($ele);
                    if(groupData.length){
                        groupData[0].label = this.label
                    }
                    data = data.concat(groupData)
                }
                else{
                    data.push({
                        text:$ele.text(),
                        value:$ele.attr('value'),
                        disabled:$ele.prop('disabled'),
                        selected:$ele.prop('selected')
                    })
                }
            })
            return data
        }
    })

    return Select
})