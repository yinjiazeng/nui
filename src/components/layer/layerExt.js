/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer扩展
 */

Nui.define(['./layer'], function(layer){

    layer.alert = function(content, title, width, height){
        return layer({
            content:'<div style="padding:10px; line-height:20px;">'+(content||'')+'</div>',
            width:width,
            height:height,
            cancel:{
                text:'关闭'
            }
        })
    }

    layer.confirm = function(content, callback, title, width, height){
        return layer({
            content:'<div style="padding:10px; line-height:20px;">'+(content||'')+'</div>',
            width:width,
            height:height,
            align:'right',
            confirm:{
                enable:true,
                callback:callback||function(){
                    return true
                }
            }
        })
    }

    layer.iframe = function(src, title, width, height){
        return layer({
            iframe:{
                enable:true,
                src:src
            },
            width:width,
            height:height,
            cancel:{
                text:'关闭'
            }
        })
    }

    layer.tip = function(content, dir, position, width, height){
        return layer({
            content:content,
            id:'tip',
            width:'auto',
            height:'auto',
            maxWidth:width,
            maxHeight:height,
            isTip:true,
            isClose:false,
            position:position,
            bubble:{
                enable:true,
                dir:dir||'top'
            }
        })
    }

    layer.loading = function(content, width, height){
        return layer({
            content:'<div style="white-space:nowrap;">'+(content||'正在加载数据...')+'</div>',
            id:'loading',
            width:'auto',
            height:'auto',
            maxWidth:width,
            maxHeight:height,
            isTip:true,
            isFull:false
        })
    }

    layer.message = function(){

    }

    layer.form = function(){

    }

    return layer
})
