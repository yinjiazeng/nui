Nui.define(['{com}/placeholder', 'events'], function(placeholder, events){
    events({
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
    })
})