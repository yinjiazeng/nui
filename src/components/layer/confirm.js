Nui.define(['./layer'], function(layer){
    return function(content, callback, title, width, height, align){        
        var opts;
        if(typeof content === 'object'){
            opts = content;
            content = opts.content;
            delete opts.content;
        }
        return layer(Nui.extend(true, {
            content:'<div style="padding:10px; line-height:20px;">'+(content||'')+'</div>',
            title:title,
            width:width,
            height:height,
            align:align || layer.config('align') || 'right',
            cancel:{
                text:'取消'
            },
            confirm:{
                callback:callback||function(){
                    return true
                }
            }
        }, opts||{}, {
            cancel:{
                enable:true
            },
            confirm:{
                enable:true
            }
        }))
    }
})