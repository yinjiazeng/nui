Nui.define(function(require, imports){
    var search = require('{com}/search');
    var input = require('{com}/input');
    var util = require('util');
    var data = require('./data');

    $('#demo').focus(function(){
        $(this).search({
            field:'buname',
            empty:'<%value%> 暂无数据',
            data:data,
            foot:'<a>点击我</a>',
            nullable:true,
            match:{
                field:'buname',
                like:function(data, value){
                    return data.indexOf(value) !== -1
                }
            },
        }).search('show')
    })

    $('#search').focus(function(){
        $(this).search({
            //url:'http://127.0.0.1:8001/data/?callback=?',
            field:'buname',
            empty:'<%value%> 暂无数据',
            data:data,
            //foot:'<a>aaaaaaaa</a>',
            nullable:true,
            //cache:true,
            //focus:true,
            prompt:'搜索条件为“<%value%>”的用户或区域，匹配到<%count%>条数据',
            events:{
                'click .item':function(e, elem){
                    this.self.value(elem.text())
                },
                'click :checkbox':function(e, elem){
                    this.self.value(elem.val())
                }
            },
            match:{
                field:'buname',
                like:function(data, value){
                    if(value == 1){
                        return true
                    }
                    return data.indexOf(value) !== -1
                }
            },
            offset:{
                
            },
            size:{
                width:80
            },
            tag:{
                multiple:true,
                close:' <i class="iconfont">x</i>',
                container:'#box',
                dele:true
            },
            tabs:[{
                title:'最近',
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
                content:
                    '<div class="">'+
                        '<a>省份</a>'+
                        '<a>城市</a>'+
                        '<a>区域</a>'+
                        '<div>'+
                            '<label><input type="checkbox" value="北京"> 北京</label>'+
                        '</div>'+
                    '</div>',
                onShow:function(self, elem, container){                      
                    container.find(':checkbox').prop('checked', false).each(function(){
                        var $elem = $(this);
                        var text = $elem.val();
                        Nui.each(self.tagData, function(v){
                            if(text === v){
                                $elem.prop('checked', true)
                                return false;
                            }
                        })
                    });
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
            // setValue:function(self, data){
            //     return {
            //         text:'1111',
            //         fields:{
            //             'aaa':111,
            //             'ccc':'1111'
            //         }
            //     }
            // },
            onRequest:function(self, res){
                return res.list
            },
            onSelect:function(self, data){
                self.show();
            },
            onBlur:function(self, elem){
                self.value('');
            }
        }).search('show')
    })
})
