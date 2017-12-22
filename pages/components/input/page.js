import input from '../../../src/components/input';
import alert from '../../../src/components/layer/alert';

$('#demo').input({
    clear:'清除',
    reveal:{
        content:{
            text:'隐藏',
            password:'显示'
        },
        title:true
    },
    button:[{
        id:'click',
        content:'点我',
        show:true,
        callback:function(){
            alert('让你点你就点，你是不是傻？')
        }
    }]
})