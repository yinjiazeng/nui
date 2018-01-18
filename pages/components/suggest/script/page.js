Nui.define(function(require){
    var suggest = require('{com}/suggest');
    var input = require('{com}/input');
    var util = require('util');
    var data = require('./data');

    $('.search').suggest({
        //url:'http://127.0.0.1:8001/data/?callback=?',
        field:'buname',
        empty:'<%value%> 暂无数据',
        selectContainer:'#box',
        data:data,
        //foot:'<a>aaaaaaaa</a>',
        nullable:true,
        //cache:true,
        focus:true,
        events:{
            'click .item':function(e, elem){
                this.self.value(elem.text())
            }
        },
        match:{
            field:'buname',
            like:function(data, value){
                return data.indexOf(value) !== -1
            }
        },
        offset:{
            
        },
        size:{
            //width:100
        },
        tag:{
            multiple:true,
            close:'<i class="iconfont">x</i>',
            container:'#box',
            dele:true
        },
        tabs:[{
            title:'最近',
            active:true,
            content:
                '<ul>'+
                    '<li class="item">南屏公馆</li>'+
                    '<li class="item">优活公寓</li>'+
                '</ul>',
            onShow:function(self, elem, container){
                container.find('li').each(function(){
                    var $elem = $(this).removeClass('s-crt');
                    var text = $elem.text();
                    Nui.each(self.tagData, function(v){
                        if(text === v){
                            $elem.addClass('s-crt');
                            return false;
                        }
                    })
                })
            }
        }, {
            title:'按用户',
            content:function(){
                return '<s>111111</s>'
            },
            onShow:function(self){
                
            }
        }, {
            title:'按区域',
            onShow:function(self){                      
                
            }
        }],
        // active:function(self, data){
        //     var exist = false;
        //     Nui.each(self.tagData, function(v){
    
        //     })
        // },
        item:function(){    
            return '<li class="suggest-item<%active($data)%>" data-index="<%$index%>"><span title="<%$data.buname%>"><%$data.buname%></span></li>'
        },
        query:function(self, value){
            return {
                keywords:encodeURI(value)
            }
        },
        setValue:function(self, data){
            return {
                text:'1111',
                fields:{
                    'aaa':111,
                    'ccc':'1111'
                }
            }
        },
        onRequest:function(self, res){
            return res.list
        },
        onSelect:function(self, data){
            self.show();
        },
        onBlur:function(self, elem){
            self.value('');
        }
    })
    
})
