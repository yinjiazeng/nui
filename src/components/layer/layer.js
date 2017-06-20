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
            var self = this;
            Nui.win.on('resize', function(){
                Nui.each(self.__instances, function(val){
                    var opts = val.options;
                    if(opts.position || opts.isCenter === true){
                        val.resize();
                    }
                })
            })
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
        timer:0,
        edge:0,
        container:'body',
        title:'温馨提示',
        animate:'',
        isMove:true,
        isMask:true,
        isInnerMove:false,
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
        position:null,
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
                '<div class="<% className %>" style="<% each style %><%$index%>:<%$value%>;<% /each %>">'+
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
                        '<div class="layer-body" style="overflow:auto;">'+
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
                '<span class="nui-button layer-button layer-button-<% btn.id %>"><% btn.text || "按钮" %></span>',
            iframe:
                '<iframe<% each attr %> <% $index %>="<% $value %>"<% /each %>></iframe>',
            mask:
                '<div class="nui-<% name %><% if skin %> nui-<% name+'-'+skin %><% /if %>" style="z-index:<% zindex %>"><div></div></div>'
        },
        _size:{}, 
        _data:{
            scrolltop:0,
            scrollleft:0
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
                    that._window = that._container;
                    that._isWindow = false;
                    var pos = that._container.css('position');
                    if(pos !== 'absolute' && pos !== 'relative'){
                        that._container.css('position', 'relative')
                    }
                }
                else{
                    that._window = Nui.win;
                    that._isWindow = true;
                }
                that._isFixed = opts.isFixed && !Nui.bsie6 && that._isWindow;
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
                title:opts.title,
                style:{
                    'z-index':that._zIndex,
                    'position':'absolute',
                    'display':'block'
                }
            });
            if(that._isFixed){
                data.style.position = 'fixed';
            }
            that._setTop();
            that.element = $(that._tpl2html('layout', data)).appendTo(that._container);
            that._box = that.element.children('.layer-box');
			that._head = that._box.children('.layer-head');
			that._body = that._box.children('.layer-body');
			that._main = that._body.children('.layer-main');
			that._foot = that._box.children('.layer-foot');
            if(opts.iframe.enable === true){
                that._iframe = that._main.children('iframe');
                that._iframeOnload()
            }
            if(opts.isMove === true && opts.title){
                that._bindMove();
            }
            if(that._button.length){
                that._buttonEvent();
            }
            if(opts.isTop){
                that._bindTop();
            }
            that._show()
        },
        _getContent:function(){
            var that = this, opts = that.options, content = '';
            if(opts.iframe.enable === true){
                content = that._createIframe();
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
            var that = this, opts = that.options, name = 'layer-iframe'+that.__index, src = opts.iframe.src;
            if(options.iframe.cache === false){
                src = util.setParam('_', new Date().getTime(), src)
            }
            return that._tpl2html('iframe', {
                attr:{
                    frameborder:'0',
                    name:name,
                    id:name,
                    src:src,
                    scroll:'hidden',
                    style:'width:100%;'
                }
            })
        },
        _iframeOnload:function(){
            var that = this;
            that._iframe.load(function(){
                that._iframeDocument = that._iframe.contents();
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
                            if(!val.text){
                                if(id === 'cancel'){
                                    val.text = '取消'
                                }
                                else if(id === 'confirm'){
                                    val.text = '确定'
                                }
                            }
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
                that._on('click', that.element, '.layer-button-'+val.id, function(e, elem){
                    var id = val.id, callback = val.callback;
                    var isCall = typeof callback === 'function' ? callback.call(that, e, elem) : null;
                    if((id === 'confirm' && isCall === true) || (id !== 'confirm' && isCall !== false)){
                        that.destroy()
                    }
                })
            })
        },
        _bindTop:function(){
            var that = this;
            that._on('click', that.element, function(){
                that.setzIndex();
            });
        },
        _bindMove:function(){
            var that = this, opts = that.options, element = that.element;
            var self = that.constructor, elem = element, isMove = false, x, y, _x, _y;
            that._on('mousedown', that._head, function(e, ele){
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
                        width:that._data.width - self._getSize(elem, 'lr'),
                        height:that._data.height - self._getSize(elem),
                        top:that._size.top,
                        left:that._size.left
                    });
                }
                ele.css('cursor','move');
                x = e.pageX - that._size.left;
                y = e.pageY - that._size.top;
                e.stopPropagation();
            });
            that._on('mousemove', Nui.doc, function(e){
                var width = that._container.outerWidth(), height = that._container.outerHeight();
                if(isMove){
                    _x = e.pageX - x;
                    _y = e.pageY - y;
                    _x < 0 && (_x = 0);
                    _y < 0 && (_y = 0);
                    if(opts.isInnerMove === true){
                        _x + that._data.width > width && (_x = width - that._data.width);
                        _y + that._data.height > height && (_y = height - that._data.height);
                    }
                    that._size.top = _y;
                    that._size.left = _x;
                    elem.css({top:_y, left:_x});
                    return !isMove;
                }
            });
            that._on('mouseup', Nui.doc, function(e){
                if(isMove){
                    isMove = false;
                    that._head.css('cursor','default');
                    if(opts.isMoveMask === true){
                        element.css(that._size);
                        that._moveMask.remove();
                    }
                    if(!that._isFixed){
                        that._data.scrolltop = _y - Nui._window.scrollTop();
                        that._data.scrollleft = _y - Nui._window.scrollLeft();
                    }
                    if(typeof opts.onMove === 'function'){
                        opts.onMove.call(this)
                    }
                }
            });
        },
        _bindScroll:function(){
            var that = this;
            that._on('scroll', that._window, function(){

            })
        },
        //鼠标点击弹出层将弹出层层级设置最大
        _setzIndex:function(){
            var that = this, self = that.constructor;
            if(that._isTop){
                that._isTop = false;
                that._zIndex = ++self._zIndex;
                that.element.css('zIndex', that._zIndex);
                that._setTop();
            }
        },
        _setTop:function(){
            var that = this, self = that.constructor;
            Nui.each(self.__instances, function(val){
                if(val && val !== that && val.options.isTop === true){
                    val._isTop = true;
                }
            });
        },
        _resize:function(type){
            var that = this, self = that.constructor, opts = that.options, element = that.element;
            var wWidth = that._window.outerWidth();
            var wHeight = that._window.outerHeight();
            
            that._setSize();
            
            if(opts.position){
                var pos = opts.position;
                that._position = {
                    top:pos.top,
                    right:pos.right,
                    bottom:pos.bottom,
                    left:pos.left
                }
                var _pos = element.css(that._position).position();
                that._size.left = _pos.left;
                that._size.top = _pos.top;
            }
            else{
                if(type === 'init' || opts.isCenter === true){
                    var left = (wWidth - that._data.width) / 2 + that._data.scrollleft;
                    var top = (wHeight - that._data.height) / 2 + that._data.scrolltop;
                    var edge = opts.edge > 0 ? opts.edge : 0;
                    that._size.left = left > 0 ? left : edge;
                    that._size.top = top > 0 ? top : edge;
                }
                element.css(that._size);
            }
            var height = that._size.height - that._data.edgeSize;
            if(that._iframe){
                that._iframe.height(height);
            }
            that._body.height(height)
        },
        _setSize:function(){
            var that = this, self = that.constructor, opts = that.options, element = that.element;
            var edge = opts.edge > 0 ? opts.edge*2 : 0;
            var wWidth = that._window.outerWidth() - edge;
            var wHeight = that._window.outerHeight() - edge;
            var width = wWidth;
            var height = wHeight;

            that._body.css({height:'auto'});
            element.css({width:'auto', height:'auto'});
            that._data.edgeSize = self._getSize(that._box, 'tb', 'all') +
                that._head.outerHeight() + 
                self._getSize(that._head, 'tb', 'margin') + 
                self._getSize(that._body, 'tb', 'all') + 
                that._foot.outerHeight() + 
                self._getSize(that._foot, 'tb', 'margin');

            var _width = element.outerWidth();
            var _height = element.outerHeight();
            
            if(that._iframeDocument){
                that._iframeDocument[0].layer = that;
                _height = that._data.edgeSize + that._iframeDocument.find('body').outerHeight();
            }

            if(opts.isFull !== true){
                width = opts.width > 0 ? opts.width : _width;
                height = opts.height > 0 ? opts.height : _height;
                if(opts.maxWidth > 0 && _width > opts.maxWidth){
                    width = opts.maxWidth
                }
                if(opts.maxHeight > 0 && _height > opts.maxHeight){
                    height = opts.maxHeight
                }
                if(opts.scrollbar === true || that._iframeDocument){
                    if(_width > wWidth){
                        width = wWidth
                    }
                    if(_height > wHeight){
                        height = wHeight
                    }
                }
            }
            that._data.width = width;
            that._data.height = height;
            that._size.width = width - self._getSize(element, 'lr', 'all');
            that._size.height = height - self._getSize(element, 'tb', 'all');
            element.css(that._size);
        },
        _show:function(){
            var that = this, opts = that.options;
            component('init', that._main);
            if(that._iframe || opts.scrollbar !== true){
                that._body.css('overflow', 'visible')
            }
            that._resize('init');
            if(typeof opts.onInit === 'function'){
                opts.onInit.call(this, that._main, that.__index)
            }
            return that
        },
        _reset:function(){
            var self = this.constructor, hasMask = true;
            component.exports._reset.call(this);
            component('destroy', this._main);
            Nui.each(self.__instances, function(val){
                if(val && val.options.isMask == true && val._container.eq(0).tagName === 'BODY'){
                    return (hasMask = false);
                }   
            });
            if(hasMask && self._mask){
                self._mask.remove();
                self._mask = null;
            }
            if(this._mask){
                this._mask.remove();
            }
            if(this.options.timer > 0){
                clearTimeout(this._timer);
            }
        },
        resize:function(){
            var that = this, opts = that.options, element = that.element;
            that._resize();
            if(typeof opts.onResize === 'function'){
                opts.onResize.call(this, that._main, that.__index)
            }
            return that
        },
        hide:function(){
            this.destroy()
        },
        destroy:function(){
            var that = this, self = that.constructor, opts = that.options;
            that._reset();
            that._delete();
            self._zIndex--;
            if(typeof opts.onDestroy === 'function'){
                opts.onDestroy.call(this, that._main, that.__index)
            }
        }
    })
})
