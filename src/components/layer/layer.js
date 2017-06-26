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
        _init:function(){
            var self = this;
            Nui.win.on('resize', function(){
                Nui.each(self.__instances, function(val){
                    var opts = val.options;
                    if(opts.position || opts.isCenter === true){
                        setTimeout(function(){
                            val.resize();
                        })
                    }
                })
            })
        },
        $fn:null,
        $ready:null,
        init:null
    }

    var options = {
        //主体内容
        content:'',
        //高度
        width:320,
        //宽度
        height:'auto',
        //最大宽度
        maxWidth:0,
        //最大高度
        maxHeight:0,
        //定时器，N毫秒后自动关闭
        timer:0,
        //弹窗四周距离窗口边缘距离
        edge:0,
        //弹窗容器
        container:'body',
        //弹窗标题
        title:'温馨提示',
        //是否可以拖动
        isMove:false,
        //是否有遮罩
        isMask:true,
        //是否只能在窗口内拖动
        isInnerMove:false,
        //点击遮罩是否关闭弹窗
        isClickMask:false,
        //是否使用遮罩拖动
        isMoveMask:false,
        //是否能用hide方法关闭遮罩
        isHide:true,
        //弹窗是否浏览器改变大小时显示在窗口中央
        isCenter:false,
        //是否全屏显示
        isFull:false,
        //是否在点击弹窗时将其置顶
        isTop:false,
        //是否以提示框展示，没有标题，按钮
        isTips:false,
        //是否拖动滚动条固定位置
        isFixed:true,
        //当内容超过弹出层容器，是否显示滚动条
        scrollbar:true,
        //按钮对齐方式
        align:'center',
        //是否以气泡形式展示，弹出层边缘会多出箭头
        bubble:{
            enable:false,
            dir:'top'
        },
        //弹出层内容展示iframe，不建议跨域使用
        iframe:{
            enable:false,
            cache:false,
            src:''
        },
        //关闭按钮
        close:{
            enable:true,
            text:'×'
        },
        //确定按钮
        confirm:{
            enable:false,
            name:'normal',
            text:'确定',
            callback:function(){
                return true
            }
        },
        //取消按钮
        cancel:{
            enable:true,
            text:'取消'
        },
        /*弹出层定位 top/left/right/bottom
        position:{
            top:10,
            left:10
        }
        */
        position:null,
        /*将弹出层置于遮罩层底部
        under:[layer1, layer2]
        */
        under:null,
        /*配置按钮，若id为confirm/cancel/close将会覆盖内置按钮参数
        button:[{
            id:'confirm',
            text:'确定',
            name:'normal',
            callback:function(){

            }
        }]
        */
        button:null,
        //onInit：弹出层显示时回调
        //onDestroy：弹出层注销时回调
        //当拖动弹出层移动后回调
        onMove:null,
        //窗口改变大小位置时回调
        onResize:null,
        //容器滚动时回调
        onScroll:null
    }

    return this.extend(component, {
        static:statics,
        options:options,
        _template:{
            layout:
                '<div class="<% className %>" style="<% include \'style\' %>">'+
                    '<div class="layer-box">'+
                        '<%if close%>'+
                            '<% var btn = close %>'+
                            '<% include "button" %>'+
                        '<%/if%>'+
                        '<%if bubble%>'+
                        '<span class="layer-bubble layer-bubble-<%bubble%>"><b></b><i></i></span>'+
                        '<%/if%>'+
                        '<%if title%>'+
                        '<div class="layer-head">'+
                            '<span class="layer-title"><%title%></span>'+
                        '</div>'+
                        '<%/if%>'+
                        '<div class="layer-body">'+
                            '<div class="layer-main">'+
                            '<%content%>'+
                            '</div>'+
                        '</div>'+
                        '<%if button && button.length%>'+
                        '<div class="layer-foot" style="text-align:<%align%>">'+
                        '<%each button btn%>'+
                            '<%include "button"%>'+
                        '<%/each%>'+
                        '</div>'+
                        '<%/if%>'+
                    '</div>'+
                '</div>',
            button:
                '<button class="ui-button'+
                    '<%if btn.name%>'+
                    '<%each [].concat(btn.name) name%> ui-button-<%name%><%/each%>'+
                    '<%/if%>'+
                    ' layer-button-<%btn.id%>"><%btn.text || "按钮"%></button>',
            iframe:
                '<iframe<%each attr%> <%$index%>="<%$value%>"<%/each%>></iframe>',
            mask:
                '<div class="nui-layer-mask'+
                    '<%if skin%> nui-layer-mask-<%skin%><%/if%>" style="<%include \'style\'%>">'+
                    '<div class="layer-mask"></div>'+
                '</div>',
            movemask:
                '<div class="nui-layer-movemask'+
                    '<%if skin%> nui-layer-movemask-<%skin%><%/if%>" style="<%include \'style\'%>">'+
                '</div>',
            style:
                '<%each style%><%$index%>: <%$value%>; <%/each%>'
        },
        /*
        top:弹窗距离窗口顶部距离
        left:弹窗距离窗口左边距离
        width:弹窗宽度
        height:弹窗高度
        */
        data:{},
        _init:function(){
            this._zIndex = ++this.constructor._zIndex;
            this._exec()
        },
        _exec:function(){
            var that = this, opts = that.options, self = that.constructor;
            that._container = self._jquery(opts.container);
            if(that._container.length){
                that._containerDOM = that._container.get(0);
                if(that._containerDOM.tagName !== 'BODY'){
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
            var buttons = that._createButton(), isTitle = false;
            if(opts.isTips !== true){
                isTitle = typeof opts.title === 'string';
            }
            var data = that._tplData({
                content:that._getContent(),
                close:buttons.close,
                button:buttons.button,
                title:isTitle ? (opts.title||'温馨提示') : null,
                bubble:opts.bubble.enable === true ? opts.bubble.dir : null,
                align:opts.align || 'center',
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
            if(opts.isTips !== true){
                if(opts.iframe.enable === true){
                    that._iframe = that._main.children('iframe');
                    that._iframeOnload()
                }
                if(opts.isMove === true && isTitle){
                    that._bindMove();
                }
                if(opts.isTop === true){
                    that._bindTop();
                }
            }
            if(that._button.length){
                that._buttonEvent();
            }
            if(opts.isFixed === true && !that._isFixed === true){
                that._bindScroll()
            }
            that._show()
        },
        _getContent:function(){
            var that = this, opts = that.options, content = '';
            if(opts.isTips !== true && opts.iframe.enable === true){
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
            var that = this, opts = that.options, name = 'layer-iframe'+that.__id, src = opts.iframe.src;
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
            if(opts.isTips !== true){
                Nui.each(['confirm', 'cancel'], function(id){
                    var btn = opts[id];
                    if(btn && btn.enable === true){
                        defaults[id] = {
                            id:id,
                            name:btn.name,
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
            }
            if(!caches.close && opts.close && opts.close.enable === true){
                that._button.unshift({
                    id:'close',
                    name:opts.close.name,
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
                    if(!elem.hasClass('nui-button-disabled')){
                        var id = val.id, callback = val.callback;
                        var isCall = typeof callback === 'function' ? callback.call(that, that._main, that.__id, elem) : null;
                        if((id === 'confirm' && isCall === true) || (id !== 'confirm' && isCall !== false)){
                            that.destroy()
                        }
                    }
                })
            })
        },
        _bindTop:function(){
            var that = this;
            that._on('click', that.element, function(){
                that._setzIndex();
            });
        },
        _bindMove:function(){
            var that = this, opts = that.options, element = that.element;
            var self = that.constructor, elem = element, isMove = false, x, y, _x, _y;
            that._on('mousedown', that._head, function(e, ele){
                isMove = true;
                that._setzIndex();
                if(opts.isMoveMask === true){
                    elem = that._moveMask = $(that._tpl2html('movemask', {
                        skin:opts.skin,
                        style:{
                            'z-index':that._zIndex+1,
                            'cursor':'move',
                            'position':that._isFixed ? 'fixed' : 'absolute'
                        }
                    })).appendTo(that._container);
                    elem.css({
                        width:that.data.outerWidth - self._getSize(elem, 'lr', 'all'),
                        height:that.data.outerHeight - self._getSize(elem, 'tb', 'all'),
                        top:that.data.top,
                        left:that.data.left
                    });
                }
                ele.css('cursor','move');
                x = e.pageX - that.data.left;
                y = e.pageY - that.data.top;
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
                        _x + that.data.outerWidth > width && (_x = width - that.data.outerWidth);
                        _y + that.data.outerHeight > height && (_y = height - that.data.outerHeight);
                    }
                    that.data.top = _y;
                    that.data.left = _x;
                    elem.css({top:_y, left:_x});
                    return !isMove;
                }
            });
            that._on('mouseup', Nui.doc, function(e){
                if(isMove){
                    isMove = false;
                    that._head.css('cursor','default');
                    if(opts.isMoveMask === true){
                        element.css(that.data);
                        that._moveMask.remove();
                        that._moveMask = null;
                    }
                    if(typeof opts.onMove === 'function'){
                        opts.onMove.call(that, that._main, that.__id)
                    }
                    that.data.offsetTop = that.data.top - that._window.scrollTop();
                    that.data.offsetLeft = that.data.left - that._window.scrollLeft();
                }
            });
        },
        _bindScroll:function(){
            var that = this, opts = that.options;
            that._on('scroll', that._window, function(){
                var top = that.data.offsetTop + that._window.scrollTop();
                var left = that.data.offsetLeft + that._window.scrollLeft();
                that.data.top = top;
                that.data.left = left;
                that.element.css(that.data);
                if(typeof opts.onScroll === 'function'){
                    opts.onScroll.call(that, that._main, that.__id)
                }
            })
        },
        //鼠标点击弹出层将弹出层层级设置最大
        _setzIndex:function(){
            var that = this, self = that.constructor;
            if(that._isTop && that.element){
                that._isTop = false;
                that._zIndex = ++self._zIndex;
                that.element.css('zIndex', that._zIndex);
                that._setTop();
            }
        },
        _setLower:function(destroy){
            var that = this, self = that.constructor, opts = that.options, unders = [];
            if(opts.under){
                if(Nui.type(opts.under, 'Object')){
                    unders.push(opts.under)
                }
                else if(Nui.isArray(opts.under)){
                    unders = opts.under
                }
                if(unders.length){
                    Nui.each(unders, function(obj, k){
                        if(obj && obj.element){
                            obj.element.css('z-index', destroy ? obj._zIndex : self._maskzIndex-1)
                        }
                    })
                }
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
        _position:function(){
            var that = this, data = that.data, pos = that.options.position;
            var _pos = {
                top:pos.top,
                left:pos.left,
                right:pos.right,
                bottom:pos.bottom
            }, _v;

            if(_pos.top !== undefined && _pos.bottom !== undefined){
                delete _pos.bottom
            }

            if(_pos.left !== undefined && _pos.right !== undefined){
                delete _pos.right
            }

            Nui.each(_pos, function(v, k){
                if(v === undefined){
                    delete _pos[k];
                    return true;
                }
                _v = v;
                if(typeof v === 'string'){
                    if(!v){
                        _v = 0
                    }
                    else{
                        if(k === 'top' || k === 'bottom'){
                            if(v === 'self'){
                                _v = data.outerHeight
                            }
                            else if(/[\+\-\*\/]/.test(v)){
                                _v = (new Function('var self = '+data.outerHeight+'; return '+v))()
                            }
                        }
                        else{
                            if(v === 'self'){
                                _v = data.outerWidth
                            }
                            else if(/[\+\-\*\/]/.test(v)){
                                _v = (new Function('var self = '+data.outerWidth+'; return '+v))()
                            }
                        }
                    }
                }
                _pos[k] = _v === 'auto' ? 'auto' : parseFloat(_v)+'px'
            })

            return _pos
        },
        _resize:function(type){
            var that = this, self = that.constructor, opts = that.options, element = that.element;
            var wWidth = that._window.outerWidth();
            var wHeight = that._window.outerHeight();
            var stop = 0;
            var sleft = 0;
            if(!that._isFixed){
                sleft = that._window.scrollLeft();
                stop = that._window.scrollTop();
            }
            that._setSize();
            if(opts.position){
                var pos = element.css(that._position()).position();
                if(Nui.bsie6){
                    sleft = 0;
                    stop = 0;
                }
                that.data.left = pos.left + sleft;
                that.data.top = pos.top + stop;
            }
            else{
                if(type === 'init' || opts.isCenter === true){
                    var left = (wWidth - that.data.outerWidth) / 2 + sleft;
                    var top = (wHeight - that.data.outerHeight) / 2 + stop;
                    var edge = opts.edge > 0 ? opts.edge : 0;
                    that.data.left = left > 0 ? left : edge;
                    that.data.top = top > 0 ? top : edge;
                }
            }
            that.data.offsetTop = that.data.top - that._window.scrollTop();
            that.data.offsetLeft = that.data.left - that._window.scrollLeft();
            element.css(that.data);
        },
        _setSize:function(){
            var that = this, self = that.constructor, opts = that.options, element = that.element;
            var edge = opts.edge > 0 ? opts.edge*2 : 0;
            var wWidth = that._window.outerWidth() - edge;
            var wHeight = that._window.outerHeight() - edge;

            that._body.css({height:'auto', overflow:'visible'});
            element.css({top:'auto', left:'auto', width:'auto', height:'auto'});
            
            var edgeSize = self._getSize(that._box, 'tb', 'all') +
                that._head.outerHeight() + 
                self._getSize(that._head, 'tb', 'margin') + 
                self._getSize(that._body, 'tb', 'all') + 
                that._foot.outerHeight() + 
                self._getSize(that._foot, 'tb', 'margin');

            var width = element.outerWidth();
            if(opts.isFull !== true){
                if(opts.width > 0){
                    width = opts.width
                }
                if(opts.maxWidth > 0 && width >= opts.maxWidth){
                    width = opts.maxWidth
                }
                if(opts.scrollbar === true && width > wWidth){
                    width = wWidth
                }
            }
            else{
                width = wWidth;
            }

            var ws = 'nowrap';
            if(opts.width > 0 || width == opts.maxWidth || width == wWidth){
                ws = 'normal';
            }

            that.data.width = width - self._getSize(element, 'lr', 'all');
            that._main.css('white-space', ws);
            element.width(that.data.width);

            var height = element.outerHeight();
            if(that._iframeDocument){
                that._iframeDocument[0].layer = that;
                height = edgeSize + that._iframeDocument.find('body').outerHeight();
            }

            if(opts.isFull !== true){
                height = opts.height > 0 ? opts.height : height;
                if(opts.maxHeight > 0 && height >= opts.maxHeight){
                    height = opts.maxHeight
                }
                if(opts.scrollbar === true || that._iframeDocument){
                    if(height > wHeight){
                        height = wHeight
                    }
                }
            }
            else{
                height = wHeight
            }

            that.data.outerWidth = width;
            that.data.outerHeight = height;
            that.data.height = height - self._getSize(element, 'tb', 'all');
            element.height(that.data.height);
            var _height = that.data.height - edgeSize;
            if(that._main.outerHeight() > _height && !that._iframe && opts.scrollbar === true){
                that._body.css('overflow', 'auto')
            }
            if(that._iframe){
                that._iframe.height(_height);
            }
            that._body.height(_height)
        },
        _showMask:function(){
            var that = this, self = that.constructor, opts = that.options;
            if(!that._containerDOM.__layermask__){
                that._containerDOM.__layermask__ = $(that._tpl2html('mask', {
                    skin:opts.skin,
                    style:{
                        'z-index':self._maskzIndex,
                        'position':that._isFixed ? 'fixed' : 'absolute',
                        'top':'0px',
                        'left':'0px',
                        'width':'100%',
                        'height':that._isFixed ? '100%' : that._container.outerHeight()+'px'
                    }
                })).appendTo(that._container);
            }
            if(opts.isClickMask === true){
                that._on('click', that._containerDOM.__layermask__, function(){
                    that.hide()
                })
            }
        },
        _show:function(){
            var that = this, opts = that.options;
            component('init', that._main);
            that._resize('init');
            that._setLower();
            if(opts.isMask === true){
                that._showMask()
            }
            if(opts.timer > 0){
                that._timer = setTimeout(function(){
                    that.hide();
                }, opts.timer);
            }
            if(typeof opts.onInit === 'function'){
                opts.onInit.call(this, that._main, that.__id)
            }
            return that
        },
        _reset:function(){
            var that = this, self = that.constructor, noMask = true;
            component.exports._reset.call(this);
            component('destroy', that._main);
            Nui.each(self.__instances, function(val){
                if(val && val.options.isMask === true && val !== that && val._containerDOM === that._containerDOM){
                    return (noMask = false);
                }   
            });
            if(noMask && that._containerDOM.__layermask__){
                that._containerDOM.__layermask__.remove();
                that._containerDOM.__layermask__  = null;
            }
            if(that.options.timer > 0){
                clearTimeout(that._timer);
            }
        },
        resize:function(){
            var that = this, opts = that.options, element = that.element;
            that._resize();
            if(typeof opts.onResize === 'function'){
                opts.onResize.call(this, that._main, that.__id)
            }
            return that
        },
        hide:function(){
            if(this.options.isHide === true){
                this.destroy()
            }
        },
        destroy:function(){
            var that = this, self = that.constructor, opts = that.options;
            that._delete();
            that._reset();
            that._setLower(true);
            self._zIndex--;
            if(typeof opts.onDestroy === 'function'){
                opts.onDestroy.call(this, that._main, that.__id)
            }
        }
    })
});