Nui.define(['{com}/layer/layerExt', 'events'], function(layer, events){
    events({
        element:document,
        mapping:{
            'click .j-demo':function(){
                layer({
                    content:'<p style="padding:10px; text-align:center;">hello world</p>',
                    width:280,
                    height:140,
                    cancel:{
                        text:'关闭'
                    }
                })
            }
        }
    })
})