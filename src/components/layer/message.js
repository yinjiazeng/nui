Nui.define(['./layer'], function(layer){
    return function(type, content){
        var opts, color = '#f00';
        if(typeof type === 'object'){
            opts = type;
            content = opts.content;
            delete opts.content;
            type = 'success';
        }

        if(type !== 'success' && type !== 'error'){
            content = type;
            type = 'success';
        }

        if(type === 'success' && !content){
            content = '操作成功'
        }
        else if(type === 'error' && !content){
            content = '操作失败'
        }

        if(type === 'success'){
            color = '#39B54A';
        }

        return layer(Nui.extend({
            content:'<div style="padding:10px; color:'+ color +';">'+content+'</div>',
            id:'message',
            width:'auto',
            height:'auto',
            isTips:true,
            timer:1500,
            close:{
                enable:true
            }
        }, opts || {}, {
            isMask:false
        }))
    }
})