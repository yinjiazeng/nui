var layer = require('{cpns}/layer/layerExt');
var placeholder = require('{cpns}/placeholder');



$('#btn').click(function(){
    layer.loading('')
    // layer({
    //     content:'<input type="text" data-placeholder-options="{animate:true}" placeholder="默认文本"><a>aaa</a>',
    //     width:500,
    //     maxWidth:400,
    //     id:'aaa',
    //     skin:'aaa',
    //     title:'',
    //    isFull:true,
    //     //maxWidth:100,
    //     isFixed:false,
    //     close:{
    //         //enable:false
    //     },
    //     cancel:{
    //         //enable:false
    //     },
    //     isCenter:true,
    //     isMask:true,
    //     isClickMask:true,
    //     //maxHeight:300,
    //     //edge:10,
    //     //container:'#box',
    //     isTop:true,
    //     //isMove:false,
    //     isMoveMask:true,
    //     isInnerMove:true,
    //     isHide:false,
    //     timer:1000,
    //     button:[{
    //         id:'aaaaa',
    //         text:'111'
    //     }],
    //     /*bubble:{
    //         enable:true
    //     },*/
    //     iframe:{
    //         enable:true,
    //         src:'http://127.0.0.1/project/haoju/haoju2014/'
    //     },
    //     /*position:{
    //         top:'40%',
    //         left:100
    //     },*/
    //     scrollbar:true,
    //     onInit:function(main){ 
    //         var lay = this;
    //         main.on('click', 'a', function(){
    //             main.append('<p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p><p>aaaa</p>');
    //             lay.resize()
    //             /*layer({
    //                 lower:lay,
    //                 width:100
    //             })*/
    //            // lay.hide()
    //         })
    //     }
    // })
})

$('#reset').click(function(){
    layer('reset')
})

//a.destroy()