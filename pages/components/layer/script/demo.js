var layer = require('{cpns}/layer/layerExt');
var placeholder = require('{cpns}/placeholder');

    

    var lay = layer({
        content:'<input type="text" data-placeholder-options="{animate:true}" placeholder="默认文本"><a>aaa</a>',
        width:300,
        maxWidth:400,
        id:'aaa',
        skin:'aaa',
        title:'',
       //isFull:true,
        //maxWidth:100,
       // isFixed:false,
        close:{
            //enable:false
        },
        cancel:{
            //enable:false
        },
        isCenter:true,
        isMask:false,
        isClickMask:true,
        //maxHeight:300,
        //edge:10,
        //container:'#box',
        isTop:true,
        isMove:true,
        //isMoveMask:true,
        isInnerMove:true,
        isHide:false,
        timer:1000,
        button:[{
            id:'aaaaa',
            text:'111' 
        }],
        /*bubble:{
            enable:true
        },*/
        /*iframe:{
            enable:true,
            src:'http://127.0.0.1/project/haoju/haoju2014/'
        },*/
        position:{
            bottom:'self*-1+30',
            right:0
        },
        scrollbar:true,
        onInit:function(main){ 
            //var lay = this;
            
            main.on('click', 'a', function(){
                //lay.reset()
                main.append('<p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p>');
                lay.resize()
                /*layer({
                    lower:lay,
                    width:100
                })*/
               // lay.hide()
            })
        }
    })

    /*layer.alert({
        content:'1111',
        under:lay
    })*/
    layer.message('')

$('#btn').click(function(){
    lay.element.animate({
        top:lay.data.top - lay.data.outerHeight + 30,
        //left:lay.data.left - lay.data.outerWidth,
    })
})

$('#reset').click(function(){
    layer('reset')
})

//a.destroy()