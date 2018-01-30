import input from '{com}/input';

$('#demo').input({
    hover:true,
    clear:'清除',
    reveal:{
        show:true,
        hover:false,
        content:{
            text:'隐藏',
            password:'显示'
        }
    },
    button:[{
        id:'click',
        content:'点我',
        hover:false,
        callback:function(){
            alert('ok')
        }
    }]
})

$('#demo2').input({
    clear:'X',
    text:'请输入...',
    animate:true,
    limit:{
        cn:true
    }
})