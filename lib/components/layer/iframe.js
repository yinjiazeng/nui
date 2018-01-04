Nui.define(['./layer'], function(layer){
    return function(src, title, width, height){
        return layer({
            iframe:{
                enable:true,
                src:src
            },
            title:title,
            width:width,
            height:height,
            cancel:{
                text:'关闭'
            }
        })
    }
})