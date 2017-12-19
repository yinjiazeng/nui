Nui.define(['{com}/placeholder', '{com}/input', 'events'], function(placeholder, input, events){
    $(':text').css('padding-right', '55px').input({
        text:'19920604',
        restore:false,
        color:'#f00',
        iconfont:true,
        clear:{
            content:'11',
            callback:function(){

            }
        },
        reveal:{
            content:{
                text:'22',
                password:'33'
            },
            value:false,
            title:true,
            callback:function(){

            }
        }
    })
    /*events({
        events:{
            'focus :text':function(e, elem){
                elem.placeholder({
                    text:'19920604',
                    restore:false
                })
            },
            'blur :text':function(e, elem){
                elem.placeholder('destroy')
            }
        }
    })*/
})