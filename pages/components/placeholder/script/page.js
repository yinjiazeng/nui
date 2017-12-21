Nui.define(['{com}/placeholder', '{com}/input', 'events'], function(placeholder, input, events){
    $('.ui-input').input({
        text:'19920604',
        restore:false,
        iconfont:true,
        //animate:true,
        equal:false,
        clear:{
            content:'11',
            callback:function(self, e, elem){
                
            }
        },
        reveal:{
            content:'11111',
            title:{
                text:'22',
                password:'33'
            },
            callback:function(){

            }
        },
        button:[{
            id:'aaa',
            content:'aaa',
            show:true,
            callback:function(self){
                self.target.prop('readonly', false);
                self.value('1111111')
            }
        }]
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