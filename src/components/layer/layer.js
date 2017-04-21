/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer弹出层
 */

Nui.define(['component'], function(component){
    var statics = {
        _maskzIndex:10000,
        _zIndex:10000,
        _mask:null,
        _init:function(){

        },
        $fn:null,
        $ready:null,
        init:null,
        resize:function(){

        },
        hide:function(){

        }
    }

    var options = {
        content:'',
        width:300,
        height:'auto',
        maxHeight:0,
        padding:20,
        timer:0,
        container:'body',
        title:'温馨提示',
        animate:'',
        isMove:true,
        isMask:true,
        isClickMask:false,
        isMoveMask:false,
        isClose:true,
        isCenter:true,
        isMaxSize:false,
        isTop:false,
        isFixed:true,
        scrollbar:true,
        tips:null,
        iframe:null,
        offset:null,
        close:{
            text:'×',
            callback:null
        },
        confirm:{
            text:'确定',
            callback:null
        },
        cancel:{
            text:'取消',
            callback:null
        },
        bottoms:null,
        buttons:null,
        onShow:null,
        onHide:null,
        onResize:null,
        onScroll:null,
        onMaskClick:null
    }

    return this.extend(component, {
        static:statics,
        options:options,
        _init:function(){
            var that = this, layer = that.constructor;
            that.zIndex = ++layer.zIndex;
            this._exec()
         },
        _exec:function(){
             var that = this, opts = that.options, layer = that.constructor;
             that._container = layer._jquery(opts.container);
             if(opts.content && that._container){
                
             }
         }
     })
})
