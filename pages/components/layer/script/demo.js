var layer = require('{cpns}/layer/layer');
var placeholder = require('{cpns}/placeholder');


$('#btn').click(function(){
    layer({
        content:'<input type="text" data-placeholder-options="{animate:true}" placeholder="默认文本"><a>aaa</a>',
        width:300,
        //title:null,
        //isFull:true,
        isFixed:false,
        isCenter:true,
        isMask:true,
        isClickMask:true,
        //maxHeight:300,
        //edge:10,
        container:'#box',
        isTop:true,
        //isMove:false,
        isMoveMask:true,
        isInnerMove:true,
        isHide:false,
        timer:1000,
        /*iframe:{
            enable:true,
            src:'http://172.30.5.28/zjaisino.github.io/plugin.html'
        },*/
        /*position:{
            top:'40%',
            left:100
        },*/
        scrollbar:true,
        onInit:function(main){ 
            var lay = this;
            main.on('click', 'a', function(){
                /*main.append('<p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p>');
                lay.resize()*/
                /*layer({
                    lower:lay,
                    width:100
                })*/
                lay.hide()
            })
        }
    })
})

$('#reset').click(function(){
    layer('reset')
})

//a.destroy()