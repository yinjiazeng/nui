Nui.define(['./layer'], function(layer){
    return function(content, dir, position, width, height){
        var opts;
        if(typeof content === 'object'){
            opts = content;
            content = opts.content;
            delete opts.content;
        }
        return layer(Nui.extend(true, {
            content:content,
            id:'tips',
            width:width||'auto',
            height:height||'auto',
            position:position,
            bubble:{
                enable:true,
                dir:dir||'top'
            }
        }, opts||{}, {
            isTips:true,
            isMask:false,
            isClose:false,
            close:{
                enable:false
            }
        }))
    }
})