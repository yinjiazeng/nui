import '{com}/suggest';
import data from './data';
import './style';

$('.demo').suggest({
    //url:'http://127.0.0.1:8001/data/?callback=?',
    data:data,
    field:'buname',
    empty:'<%value%> 暂无数据',
    //foot:'<a>aaaaaaaa</a>',
    nullable:true,
    //cache:true,
    focus:true,
    tabs:[{
        title:'最近',
        active:true,
        content:'111111',
        onShow:function(self, index, elem){
            console.log(1)
        }
    }, {
        title:'按用户',
        content:function(){
            return ''
        },
        onShow:function(){

        }
    }, {
        title:'按区域',
        onShow:function(){                                  

        }
    }],
    item:function(){    
        return '<span title="<%$data.buname%>"><%$data.buname%></span>'
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
        self.value('');
        self.show();
    },
    onBlur:function(self, elem){
        self.value('');
    }
})

