/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer弹出层
 */

Nui.define(['component', 'dalegate'], function(component, dalegate){
    var module = this;

    var statics = {
        _maskzIndex:10000,
        _zIndex:10000,
        _mask:null,
        _init:function(){

        },
        $fn:null,
        $ready:null,
        init:null
    }

    var options = {
        content:'',
        width:300,
        height:'auto',
        maxHeight:0,
        padding:20,
        timer:0,
        container:'body',
        animate:'',
        isMove:true,
        isMask:true,
        isClickMask:false,
        isMoveMask:false,
        isClose:true,
        isCenter:true,
        isFull:false,
        isTop:false,
        isFixed:true,
        scrollbar:true,
        bubble:{
            enable:false,
            dir:'top'
        },
        iframe:{
            enable:false,
            cache:false,
            src:''
        },
        offset:{
            top:'center',
            left:'center'
        },
        title:{
            enable:true,
            text:'温馨提示'
        },
        close:{
            enable:true,
            text:'×'
        },
        confirm:{
            enable:false,
            text:'确定',
            callback:function(){
                return true
            }
        },
        cancel:{
            enable:true,
            text:'取消'
        },
        bottom:null,
        button:null,
        onShow:null,
        onHide:null,
        onMove:null,
        onResize:null,
        onScroll:null,
        onMaskClick:null
    }

    return this.extend(component, {
        static:statics,
        options:options,
        _template:
            '<div class="<% className %>">'+
                '<div class="layer-box">'+
                    '<div class="layer-head">'+
                    
                    '</div>'+
                    '<div class="layer-body"><% content %></div>'+
                    '<div class="layer-foot">'+

                    '</div>'+
                '</div>'+
            '</div>',
        _confirm:{
            
        },
        _init:function(){
            var self = this.constructor;
            this._zIndex = ++self._zIndex;
            this._exec()
        },
        _exec:function(){
            var that = this, opts = that.options, self = that.constructor;
            that._container = self._jquery(opts.container);
            if(that._container.length){
                if(that._container.get(0).tagName !== 'BODY'){
                    opts.isFixed = false;
                    var pos = that._container.css('position');
                    if(pos !== 'absolute' && pos !== 'relative'){
                        that._container.css('position', 'relative')
                    }
                }
                that._create();
            }
        },
        _create:function(){
            var that = this, opts = that.options;
            that._createButton();
            var data = that._tplData({
                content:that._getContent(),
                button:[]
            });
            that.element = $(that._tpl2html(data)).appendTo(that._container);
            if(opts.isMove === true && opts.title){
                that._move();
            }
            if(that._button.length){
                that._event();
            }
        },
        _getContent:function(){
            var that = this, opts = that.options, str = '';
            if(typeof opts.content === 'string'){
                str = opts.content
            }
            else if(opts.content instanceof jQuery){
                str = opts.content.prop('outerHTML')
            }
            return str
        },
        _createButton:function(){
            var that = this, opts = that.options, button = ['confirm', 'cancel', 'close'];
            that._button = {};
            if(!opts.button){
                
            }
            Nui.each(button, function(type){
                var btn = opts[type];
                
            });
            if(opts.button){
                Nui.each(opts.button, function(val, key){
                    that._button.push({
                        type:key,
                        text:val.text
                    })
                })
                if(!opts.button.confirm){

                }
            }
        },
        _createIframe:function(){

        },
        _event:function(){

        },
        _move:function(){

        }
    })
})
