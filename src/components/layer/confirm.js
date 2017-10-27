Nui.define(['./layer'], function(layer){
    return function(content, callback, title, width, height){
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
            align:'right',
            confirm:{
                callback:callback||function(){
                    return true
                }
            }
        }, opts||{}, {
            confirm:{
                enable:true
            }
        }))
    }
})