Nui.define(['./layer'], function(layer){
    return function(content, width, height){
        var opts;
        if(typeof content === 'object'){
            opts = content;
            content = opts.content;
            delete opts.content;
        }
        if(Nui.type(content, 'Number')){
            height = width;
            width = content;
            content = '';
        }
        return layer(Nui.extend({
            content:'<div>'+(content||'正在加载数据...')+'</div>',
            width:width||'auto',
            height:height||'auto'
        }, opts || {}, {
            id:'loading',
            isTips:true,
            close:{
                enable:false
            }
        }))
    }
})