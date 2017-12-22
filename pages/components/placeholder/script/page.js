Nui.define(['{com}/placeholder', 'events'], function(placeholder, events){
    events({
        events:{
            'focus :input':function(e, elem){
                elem.placeholder({
                    text:'19920604',
                    restore:false
                })
            },
            'blur :input':function(e, elem){
                elem.placeholder('destroy')
            }
        }
    })
})