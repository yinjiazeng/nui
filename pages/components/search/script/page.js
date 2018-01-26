Nui.define(function(require, imports){
    imports('../style/page.less');
    var search = require('{com}/search');
    var input = require('{com}/input');
    var data = require('./data');
    var template = require('template');
    var emps = [];
    var depts = [];

    Nui.each(data.empList, function(val){
        Nui.each(val.list, function(v){
            emps.push(v)
        })
    })

    Nui.each(data.deptList, function(val){
        Nui.each(val.list, function(v){
            depts.push(v)
        })
    })

    var all = [].concat(emps, depts);

    $('#demo1').focus(function(){
        $(this).search({
            field:'name',
            empty:'<p class="f-lh20 e-pl5 e-pr5">搜索条件为“<%value%>”未能匹配到数据</p>',
            data:emps,
            nullable:true,
            match:[{
                field:'name',
                like:function(data, value){
                    return data.indexOf(value) !== -1
                }
            }]
        }).search('show')
    })

    $('#demo2').search({
        field:'name',
        empty:'没有搜索结果，请变换搜索条件',
        nullable:true,
        focus:true,
        prompt:'搜索条件为“<%value%>”的员工或部门，匹配到<%count%>条数据',
        events:{
            'click .item-history':function(e, elem){
                this.self.value(elem.text())
            },
            'click :checkbox':function(e, elem){
                this.self.value(elem.val())
            }
        },
        match:{
            field:'name',
            like:function(data, value){
                return data.indexOf(value) !== -1
            }
        },
        size:{
            width:100
        },
        tag:{
            multiple:true,
            focus:true,
            backspace:true,
            container:'#demo2Tags > div',
            scroll:'#demo2Tags'
        },
        tabs:[{
            title:'最近',
            content:function(){
                return template.render(
                    '<ul class="con-search-list e-pt5 item-history">'+
                    '<%each $list%>'+
                        '<li class="con-search-item" data-name="<%$value.name%>"><%$value.name%></li>'+
                    '<%/each%>'+
                    '</ul>'
                    , 
                    data.historyList
                )
            },
            onShow:function(self, elem, container){
                
            }
        }, {
            title:'按员工',
            content:function(){
                
            },
            onShow:function(self){
                
            }
        }, {
            title:'按部门',
            content:function(){

            },
            onShow:function(){                      
                
            }
        }],
        selected:function(self, data){
            var exist = false;
            Nui.each(self.tagData, function(v){
    
            })
        },
        item:function(){    
            return '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>"><span title="<%$data.buname%>"><%$data.buname%></span></li>'
        },
        query:function(self, value){
            return {
                keywords:encodeURI(value)
            }
        },
        onSelectBefore:function(self, data){
            self.value(data[this.field])
            return false
        },
        onBlur:function(self, elem){
            self.value('');
        },
        onChange:function(self){
            self.activeTab.$container.find(':checkbox').prop('checked', false).each(function(){
                var $elem = $(this);
                var text = $elem.val();
                Nui.each(self.tagData, function(v){
                    if(text === v.text){
                        $elem.prop('checked', true)
                        return false;
                    }
                })
            });
        }
    })
})
