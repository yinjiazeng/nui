Nui.define(['{com}/placeholder', '{com}/input', 'events'], function(placeholder, input, events){
    $('.ui-input').input({
        text:'19920604',
        restore:false,
        clear:{
            content:'清空',
            style:{
                'margin-left':'5px;'
            },
            callback:function(self, e, elem){
                
            }
        },
        reveal:{
            content:{
                text:'隐藏',
                password:'显示'
            },
            title:{
                text:'隐藏',
                password:'显示'
            },
            style:{
                'margin-left':'5px;'
            },
            callback:function(){
            }
        },
        button:[{
            id:'auto',
            content:'自定义',
            style:{
                'margin-left':'5px;'
            },
            callback:function(self){
                self.value('阿牛真帅')
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