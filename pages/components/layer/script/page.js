Nui.define(['{com}/layer/layerExt', 'events'], function(layer, events){
    var renders = this.renders;
    return events({
        element:document,
        events:{
            'click .j-demo':function(){
                layer({
                    content:'<p style="padding:10px; text-align:center;">hello world</p>',
                    width:280,
                    height:140,
                    cancel:{
                        text:'关闭'
                    }
                })
            },
            'click .j-position':function(){
                layer({
                    content:renders({
                        <div style="padding:15px 20px; line-height:20px;">
                            <p>消息标题1</p>
                            <p>消息标题2</p>
                            <p>消息标题3</p>
                        </div>
                    }),
                    title:'系统消息',
                    width:280,
                    isMask:false,
                    cancel:{
                        enable:false
                    },
                    position:{
                        bottom:'self*-1',
                        right:0
                    },
                    onInit:function(self){
                        this.position.bottom = 0;
                        self.element.animate({top:self.data.top - self.data.outerHeight})
                    }
                })
            }
        }
    })
})