var layer = require('{cpns}/layer/layer');
var placeholder = require('{cpns}/placeholder');


$('#btn').click(function(){
    layer({
        content:'<input type="text" data-placeholder-options="{animate:true}" placeholder="默认文本"><a>aaa</a>',
        width:300,
        //title:null,
        isFull:true,
        isFixed:false,
        isCenter:true,
        //maxHeight:300,
        edge:0,
        //container:'#box',
        //isMove:false,
        isInnerMove:true,
        iframe:{
            enable:true,
            src:'http://172.30.5.28/zjaisino.github.io/plugin.html'
        },
        position:{
            bottom:0,
            right:0
        },
        scrollbar:true,
        onInit:function(main){ 
            var lay = this;
            main.on('click', 'a', function(){
                main.append('<p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p>');
                lay.resize()
            })
        }
    })
})

//a.destroy()