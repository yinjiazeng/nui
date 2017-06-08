/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer弹出层
 */

Nui.define(['component', 'util'], function(component, util){
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
        maxWidth:0,
        maxHeight:0,
        edge:10,
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
            top:null,
            right:null,
            bottom:null,
            left:null
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
            enable:false,
            text:'取消'
        },
        bottom:null,
        button:null,
        onMove:null,
        onResize:null,
        onScroll:null,
        onClick:null
    }

    return this.extend(component, {
        static:statics,
        options:options,
        _template:{
            layout:
                '<div class="<% className %>">'+
                    '<div class="layer-box">'+
                        '<% if close %>'+
                            '<% var btn = close %>'+
                            '<% include "button" %>'+
                        '<% /if %>'+
                        '<% if title %>'+
                        '<div class="layer-head">'+
                            '<span class="layer-title"><% title %></span>'+
                        '</div>'+
                        '<% /if %>'+
                        '<div class="layer-body">'+
                            '<div class="layer-main">'+
                            '<% content %>'+
                            '</div>'+
                        '</div>'+
                        '<% if button && button.length %>'+
                        '<div class="layer-foot">'+
                        '<% each button btn %>'+
                            '<% include "button" %>'+
                        '<% /each %>'+
                        '</div>'+
                        '<% /if %>'+
                    '</div>'+
                '</div>',
            button:
                '<span class="nui-button layer-button layer-button-<% btn.id %>"><% btn.text || "匿名按钮" %></span>',
            iframe:
                '<iframe<% each attr %> <% $index %>="<% $value %>"<% /each %>></iframe>',
            mask:
                '<div class="nui-<% name %><% if skin %> nui-<% name+'-'+skin %><% /if %>" style="z-index:<% zindex %>"><div></div></div>'
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
            var buttons = that._createButton();
            var data = that._tplData({
                content:that._getContent(),
                close:buttons.close,
                button:buttons.button,
                title:opts.title
            });
            that.element = $(that._tpl2html('layout', data)).appendTo(that._container);
            var box = that.element.box = that.element.children('.layer-box');
			that.element.head = box.children('.layer-head');
			that.element.body = box.children('.layer-body');
			that.element.main = that.element.body.children('.layer-main');
			that.element.foot = box.children('.layer-foot');
            if(that._iframe){
                that.element.iframe = that.element.main.children('iframe');
                that._iframeOnload()
            }
            if(opts.isMove === true && opts.title){
                that._move();
            }
            if(that._button.length){
                that._buttonEvent();
            }
            if(opts.isTop){
                that._setTop();
            }
            that._show()
        },
        _getContent:function(){
            var that = this, opts = that.options, content = '';
            if(opts.iframe && opts.iframe.enable === true && opts.iframe.src){
                that._iframe = content = that._createIframe();
            }
            else{
                if(typeof opts.content === 'string'){
                    content = opts.content
                }
                else if(opts.content instanceof jQuery){
                    content = opts.content.prop('outerHTML')
                }
            }
            return content
        },
        _createIframe:function(){
            var that = this, opts = that.options, name = 'layer-iframe'+that.__index;
            if(options.iframe.cache === false){
                src = util.setParam('_', new Date().getTime(), src)
            }
            return that._tpl2html('iframe', {
                frameborder:'0',
                name:name,
                id:name,
                src:src,
                scroll:'hidden',
                style:'width:100%;'
            })
        },
        _iframeOnload:function(){
            var that = this;
            that.element.iframe.load(function(){
                that._resize()
            })
        },
        _createButton:function(){
            var that = this, opts = that.options, defaults = {}, buttons = {}, caches = {};
            that._button = [];
            Nui.each(['confirm', 'cancel'], function(id){
                var btn = opts[id];
                if(btn && btn.enable === true){
                    defaults[id] = {
                        id:id,
                        text:btn.text,
                        callback:btn.callback
                    }
                }
            });
            if(opts.button && opts.button.length){
                Nui.each(opts.button, function(val){
                    var id = val.id;
                    if(!caches[id]){
                        caches[id] = true;
                        if(defaults[id]){
                            delete defaults[id]
                        }
                        that._button[id === 'close' ? 'unshift' : 'push'](val)
                    }
                })
            }
            Nui.each(defaults, function(val){
                that._button.push(val)
            });
            if(!caches.close && opts.close && opts.close.enable === true){
                that._button.unshift({
                    id:'close',
                    text:opts.close.text,
                    callback:opts.close.callback
                })
            }
            if(that._button[0] && that._button[0].id === 'close'){
                buttons.close = that._button[0],
                buttons.button = that._button.slice(1);
            }
            else{
                buttons.button = that._button
            }
            return buttons
        },
        _buttonEvent:function(){
            var that = this;
            Nui.each(that._button, function(val){
                that._on('click', that.element, 'nui-button-'+val.id, function(e, elem){
                    var id = val.id, callback = val.callback;
                    var isCall = typeof callback === 'function' ? callback.call(that, e, elem) : null;
                    if((id === 'confirm' && isCall === true) || (id !== 'confirm' && isCall !== false)){
                        that.destroy()
                    }
                })
            })
        },
        _setTop:function(){
            var that = this;
            that._on('click', that.element, function(){
                that.setzIndex();
            });
        },
        _move:function(){
            var that = this, opts = that.options, element = that.element;
            var self = that.constructor, elem = element, isMove = false, x, y, _x, _y;
            that._on('mousedown', element.head, function(e, ele){
                isMove = true;
                that._setzIndex();
                if(opts.isMoveMask === true){
                    elem = that._moveMask = $(that._tpl2html('mask', {
                        name:'movemask',
                        skin:opts.skin,
                        zindex:that._zIndex+1
                    }));
                    if(opts.isFixed === true && !Nui.bsie6){
                        elem.css('position', 'fixed');
                    }
                    elem.css({
                        width:that._data.width - self.getSize(elem, 'lr'),
                        height:that._data.height - self.getSize(elem),
                        top:that._data.top,
                        left:that._data.left
                    });
                }
                ele.css('cursor','move');
                x = e.pageX - that._data.left;
                y = e.pageY - that._data.top;
                e.stopPropagation();
            });
            that._on('mousemove', Nui.doc, function(e){
                var width = Nui.doc.width(), height = Nui.doc.height();
                if(isMove){
                    _x = e.pageX - x;
                    _y = e.pageY - y;
                    _x < 0 && (_x = 0);
                    _y < 0 && (_y = 0);
                    _x + that._data.width > width && (_x = width - that._data.width);
                    _y + that._data.height > height && (_y = height - that._data.height);
                    that._data.top = _y;
                    that._data.left = _x;
                    elem.css({top:_y, left:_x});
                    return !isMove;
                }
            });
            that._on('mouseup', Nui.doc, function(e){
                if(isMove){
                    isMove = false;
                    element.head.css('cursor','default');
                    _x = _x || that._data.left;
                    _y = _y || that._data.top;
                    if(opts.isMoveMask === true){
                        !element.is(':animated') && element.animate({top:_y, left:_x}, 300);  
                        that._moveMask.remove();
                    }
                    if(Nui.bsie6 && opts.isFixed === true){
                        that._data.winTop = _y - Nui.win.scrollTop();
                        that._data.winLeft = _y - Nui.win.scrollLeft();
                    }
                    if(typeof opts.onMove === 'function'){
                        opts.onMove.call(this)
                    }
                }
            });
        },
        //鼠标点击弹出层将弹出层层级设置最大
        _setzIndex:function(){
            var that = this, self = that.constructor;
            if(!that._downing){
                that._downing = true;
                that._zIndex = ++self._zIndex;
                that.element.css('zIndex', that._zIndex);
                Nui.each(self.__instances, function(val){
                    if(val && val !== that){
                        val._downing = false;
                    }
                });
            }
        },
        _resize:function(){
            var that = this, opts = that.options, element = that.element;
        },
        _show:function(){
            var that = this, opts = that.options, element = that.element, main = that.element.main;
            that._resize();
            component('init', main);
            if(typeof opts.onInit === 'function'){
                opts.onInit.call(this, main, that.__index)
            }
            return that
        },
        resize:function(){
            var that = this, opts = that.options, element = that.element, main = that.element.main;
            that._resize();
            if(typeof opts.onResize === 'function'){
                opts.onResize.call(this, main, that.__index)
            }
            return that
        },
        hide:function(){
            this.destroy()
        },
        destroy:function(){
            var that = this, self = that.constructor, opts = that.options, hasMask = true, main = that.element.main;
            component('destroy', main);
            that._reset();
            that._delete();
            self._zIndex--;
            Nui.each(self.__instances, function(val){
                if(val && val.options.isMask == true && val._container.eq(0).tagName === 'BODY'){
                    return (hasMask = false);
                }   
            });
            if(hasMask && self._mask){
                self._mask.remove();
                self._mask = null;
            }
            if(that._mask){
                that._mask.remove();
            }
            if(options.timer > 0){
                clearTimeout(that._timer);
            }
            if(typeof opts.onDestroy === 'function'){
                opts.onDestroy.call(this, main, that.__index)
            }
        }
    })
})
