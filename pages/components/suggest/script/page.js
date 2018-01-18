import '{com}/suggest';
import data from './data';
import './style';
import util from 'util';

$('.search').suggest({
    url:'http://127.0.0.1:8001/data/?callback=?',
    data:data,
    field:'buname',
    empty:'<%value%> 暂无数据',
    selectContainer:'#box',
    //foot:'<a>aaaaaaaa</a>',
    nullable:true,
    //cache:true,
    focus:true,
    events:{
        'click .item':function(e, elem){
            this.self.value(elem.text())
        }
    },
    tag:{
        multiple:true,
        close:'<i class="iconfont">x</i>',
        container:'#box'
    },
    tabs:[{
        title:'最近',
        active:true,
        content:renders({
            <ul>
                <li class="item">南屏公馆</li>
                <li class="item">优活公寓</li>
            </ul>
        }),
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

