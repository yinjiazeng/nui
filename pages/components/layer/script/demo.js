var layer = require('{cpns}/layer/layer');
var placeholder = require('{cpns}/placeholder');


$('#btn').click(function(){
    layer({
        content:'<input type="text" data-placeholder-options="{animate:true}" placeholder="默认文本"><a>aaa</a>',
        width:300,
        //title:null,
        edge:0,
        //container:'#box',
        //isMove:false,
        isInnerMove:true,
    /* iframe:{
            enable:true,
            src:'http://127.0.0.1/zjaisino.github.io/plugin.html'
        },*/
        position:null,
        scrollbar:false,
        onInit:function(main){
            main.on('click', 'a', function(){
                main.append('<p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p>');
                lay.resize()
            })
        }
    })
})

//a.destroy()