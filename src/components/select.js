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
                        '<%tpl%>'+
                        '<div class="con-select-edit">'+
                            '<input type="text" class="con-select-input">'+
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
                var val = this.target.val();
                var tpl = '';
                if(val !== null && val !== undefined){
                    var data = [];
                    Nui.each([].concat(val), function(v){
                        data.push({
                            text:v
                        })
                    })
                    tpl = Search.data2html(data);
                }
                this.element = $(this._tpl2html({
                    tpl:tpl
                })).insertBefore(this.target)
                var input = this.element.find('input');
                input.placeholder({
                    text:'请输入'
                })
                var that = this;
                var multi = this.target.prop('multiple');
                
                Search({
                    target:that.element.find('input'),
                    container:that.element,
                    field:'text',
                    focus:true,
                    nullable:true,
                    tag:{
                        container:that.element.find('.con-select-combo'),
                        scroll:that.element.find('.con-select-wrap'),
                        multiple:multi,
                        backspace:true
                    },
                    size:{
                        //width:100
                    },
                    offset:{
                        top:-1
                    },
                    match:{
                        field:'text',
                        like:function(data, value){
                            return data.indexOf(value) !== -1
                        }
                    },
                    data:this._optionToData(),
                    toggle:function(elem){
                        if(elem){
                            elem.toggleClass('s-crt')
                        }
                    },
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
                        return '<%if !value && $data.label%>'+
                                    '<li><%$data.label%></li>'+
                                '<%/if%>'+
                                '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>">'+
                                    '<%$data.text%>'+
                                '</li>'
                    },
                    setValue:function(self, data){
                        return {
                            text:data.value
                        }
                    },
                    onSelectBefore:function(self, data){
                        if(multi){
                            this.toggle(self._items[self._activeIndex]);
                            self.value(this.setValue(self, data));
                            var text = [];
                            Nui.each(self.tagData, function(v){
                                Nui.each(self.data, function(val){
                                    if(v.text === val.value){
                                        text.push(val.text)
                                        return false
                                    }
                                })
                            })
                            //self.value(text.join(','))
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
                    },
                    onChange:function(self){
                        var values = [];
                        Nui.each(self.tagData, function(v){
                            values.push(v.text)
                        })
                        //that.target.val(values)
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