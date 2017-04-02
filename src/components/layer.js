/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer弹出层
 */

 Nui.define(function(){
     return this.extend('component', {
         static:{
             maskzIndex:10000,
             zIndex:10000,
             mask:null
         },
         options:{
             //宽度, 整数
            width:0,
            //高度，整数或者auto
            height:'auto',
            //最大高度，height设置为auto时可以使用
            maxHeight:0,
            //内容，字符串或者jQuery对象
            content:'',
            //1.自定义皮肤主题；2.layer标识，隐藏特定的layer：layerHide(theme);
            theme:'',
            //最大尺寸距离窗口边界边距
            padding:50,
            //弹出层容器，默认为body
            container:'body',
            //定时关闭时间，单位/毫秒
            timer:0,
            //是否淡入方式显示
            isFadein:true,
            //是否开启弹出层动画
            isAnimate:true,
            //是否可以移动
            isMove:true,
            //是否有遮罩层
            isMask:true,
            //点击遮罩层是否关闭弹出层
            isClickMask:false,
            //是否有移动遮罩层
            isMoveMask:false,
            //是否能被laierHide()方法关闭，不传参数
            isClose:true,
            //是否居中
            isCenter:false,
            //是否自适应最大尺寸显示
            isMaxSize:false,
            //是否是ui提示层
            isTips:false,
            //点击layer是否置顶
            isSticky:false,
            //是否固定弹出层
            isFixed:false,
            //是否显示滚动条
            scrollbar:true,
            //当前layer显示时，将指定layer对象置底，在遮罩层的下层，传数组或者layer对象，当前layer隐藏时，恢复指定layer层级
            bottoms:null,
            //标题
            title:{
                enable:true,
                text:''
            },
            //载入浮动框架
            iframe:{
                enable:false,
                cache:false,
                //跨域无法自适应高度
                src:''
            },
            //显示位置
            offset:{
                //是否基于前一个层进行偏移
                isBasedPrev:false,
                top:null,
                left:null
            },
            //小箭头，方向：top right bottom left
            arrow:{
                enable:false,
                dir:'top'
            },
            close:{
                enable:true,
                text:'×',
                /**
                 * @func 弹出层关闭前执行函数，
                 * @param main:$('.ui-layer-main')
                 * @param index:弹出层索引
                 * @param event 事件对象
                 */
                callback:null
            },
            //确认按钮，回调函数return true才会关闭弹层
            confirm:{
                enable:false,
                text:'确定',
                /**
                 * @func 回调函数
                 * @param main:$('.ui-layer-main')
                 * @param index:弹出层索引
                 * @param button:当前触发按钮
                 * @param event:事件对象
                 */
                callback:null
            },
            //取消按钮
            cancel:{
                enable:false,
                text:'取消',
                /**
                 * @func 回调函数
                 * @param main:$('.ui-layer-main')
                 * @param index:弹出层索引
                 * @param event 事件对象
                 */
                callback:null
            },
            //按钮配置，会覆盖confirm和cancel
            button:null,
            /**
             * @func 弹出层显示时执行
             * @param main:$('.ui-layer-main')
             * @param index:弹出层索引
             */
            onShow:null,
            /**
             * @func 弹出层关闭时执行
             * @param main:$('.ui-layer-main')
             * @param index:弹出层索引
             */
            onHide:null,
            /**
             * @func 弹出层大小、位置改变后执行函数
             * @param main:$('.ui-layer-main')
             * @param index:弹出层索引
             */
            onResize:null,
            /**
             * @func window窗口改变大小时执行函数
             * @param layer:$('.ui-layer')
             * @param width:窗口宽度
             * @param height:窗口高度
             * @param event 事件对象
             */
            onWinRisize:null,
            /**
             * @func window窗口滚动时执行函数
             * @param layer:$('.ui-layer')
             * @param scrollTop:窗口滚动高度
             * @param event 事件对象
             */
            onWinScroll:null,
            /**
             * @func 遮罩层点击回调函数
             * @param layer:$('.ui-layer')
             * @param mask 遮罩层选择器
             * @param event 事件对象
             */
             onMaskClick:null
         },
         width:410,
         height:220,
         title:'温馨提示',
         _init:function(){
             var that = this;
             that.zIndex = that._self.zIndex++;
             that._exec();
        },
        _exec:function(){
            var that = this, options = that.options;
            that._setWrap();
            that._setBottoms();
            that._create().show()._bindClick();
            if(options.isMove === true && options.title.enable === true){
                that._move();
            }
            if(typeof options.onWinRisize === 'function'){
                that._on(Nui.win, 'resize', function(e){
                    options.onWinRisize.call(that, e, that.layer);
                });
            }
            if(typeof options.onWinScroll === 'function'){
                that._on(Nui.win, 'scroll', function(e){
                    options.onWinScroll.call(that, e, that.layer);
                });
            }
            return that;
        },
        _setWrap:function(){
             var that = this, options = that.options;
             that.wrap = Nui.win;
             if(typeof options.container === 'string'){
                 options.container = $(options.container||'body');
             }
             var dom = options.container.get(0);
             if(dom === undefined){
                 options.container = $('body');
             }
             if(dom.tagName !== 'BODY'){
                 options.isFixed = false;
                 that.wrap = options.container;
                 if(' absolute relative'.indexOf(that.wrap.css('position')) <= 0){
                 	that.wrap.css('position', 'relative')
                 }
             }
         },
        _create:function(){
            var that = this, options = that.options,
                width = options.width ? options.width : that.width,
                height = options.height ? options.height : that.height,
                theme = options.theme ? ' t-layer-'+options.theme : '',
                tips = options.isTips === true ? (function(){
                    if(options.arrow.enable === true){
                        options.isMove = options.isMask = options.title.enable = options.isCenter = options.isMaxSize = false;
                    }
                    return ' ui-layer-tips';
                })() : '',
                html = '<div class="ui-layer'+ theme + tips +'" style="z-index:'+ that.zIndex +';">',
                title = oHeight = oWidth = '';
                html += '<div class="ui-layer-box">';
            if(options.close.enable === true){
                html += '<span class="ui-layer-button ui-layer-close" btnid="close">'+ options.close.text +'</span>';
            }
            if(options.arrow.enable === true){
                html += '<span class="ui-layer-arrow ui-layer-arrow-'+ options.arrow.dir +'"><b></b><i></i></span>';
            }
            if(options.title.enable === true){
                title = options.title.text ? options.title.text : that.title;
                html += '<div class="ui-layer-title"><span>'+ title +'</span></div>';
            }
            html += '<div class="ui-layer-main">';
            if(options.iframe.enable === true){
                html += that.createIframe();
            }
            else{
                if(typeof options.content === 'string'){
                    html += options.content;
                }
            }
            html += '</div>';
            if(!$.isPlainObject(options.button)){
                options.button = {};
            }
            var btns = ['confirm', 'cancel', 'close'];
            $.each(btns, function(key, btnid){
                var optsBtn = options[btnid], btnsBtn = options.button[btnid];
                if(optsBtn.enable === true){
                    if(typeof btnsBtn !== 'undefined'){
                        options.button[btnid] = $.extend(optsBtn, btnsBtn);
                    }
                    else{
                        options.button[btnid] = optsBtn;
                    }
                }
            });
            if(!$.isEmptyObject(options.button)){
            	var foot = '';
                $.each(options.button, function(btnid, opts){
                    if(btnid === 'close'){
                        return true;
                    }
                    if(btnid ==='confirm' || btnid ==='cancel'){
                        opts.text = opts.text || (btnid === 'confirm' ? '确定' : '取消');
                    }
                    else{
                        opts.text = opts.text || btnid;
                    }
                    options.button[btnid].text = opts.text;
                    foot += '<span class="ui-layer-button ui-layer-'+ btnid +'" btnid="'+ btnid +'">'+ opts.text +'</span>';
                });
                if(foot){
                	html += '<div class="ui-layer-foot">' + foot +'</div>';
                }
            }
            html += '</div></div>';
            that.layer = $(html).appendTo(options.container);
			that.layer.box = that.layer.find('.ui-layer-box');
			that.layer.title = that.layer.find('.ui-layer-title');
			that.layer.main = that.layer.find('.ui-layer-main');
			that.layer.foot = that.layer.find('.ui-layer-foot');
			that.layer.button = that.layer.find('.ui-layer-button');
            if(typeof options.content === 'object'){
                that.layer.main.html(options.content);
            }
            if(options.iframe.enable === true){
                that.iframe = that.layer.find('iframe[name="layer-iframe-'+ that.index +'"]');
            }
            oHeight = Layer.getSize(that.layer, 'tb', 'all');
            oWidth = Layer.getSize(that.layer, 'lr', 'all');
            if(options.isMaxSize !== true){
                height = height - oHeight;
                width = width - oWidth;
            }
            else{
                options.isCenter = true;
                height = that.wrap.outerHeight() - options.padding - oHeight;
                width = that.wrap.outerWidth() - options.padding - oWidth;
                options.height = 'auto';
            }
            if(options.height === 'auto' && options.maxHeight > 0 && that.layer.outerHeight() > options.maxHeight){
                options.height = options.maxHeight;
                height = options.height - oHeight;
            }
            that.layer.css({width:width, height:height});
            return that;
        },
        _createIframe:function(){
            var that = this, options = that.options, src = options.iframe.src;
            if(options.iframe.cache === false){
                var flag = '?_=';
                if(src.indexOf('?') !== -1){
                    flag = '&_=';
                }
                src += flag+new Date().getTime();
            }
            return '<iframe frameborder="0" name="layer-iframe-'+ that.index +'" id="layer-iframe-'+ that.index +'" scroll="hidden" style="width:100%;" src="'+ src +'" onload="layerResize('+ that.index +')"></iframe>';
        },
        _createMoveMask:function(){
            var that = this, options = that.options, zIndex = that.zIndex + 1, theme = options.theme ? ' t-movemask-'+options.theme : '';
            return $('<div class="ui-layer-movemask'+ theme +'" style="z-index:'+ zIndex +';"></div>').appendTo(options.container);
        },
        _move:function(){
            var that = this, options = that.options, layer = that.layer, isMove = false, x, y, mx, my;
            that.bindEvent(layer.title, 'mousedown', function(e){
                isMove = true;
                that.setzIndex();
                if(options.isMoveMask === true){
                    layer = that.moveMask = that.createMoveMask();
                    if(options.isFixed === true && !Layer.bsie6){
                        layer.css('position', 'fixed');
                    }
                    layer.css({
                        width:that.size.width - Layer.getSize(layer, 'lr'),
                        height:that.size.height - Layer.getSize(layer),
                        top:that.offset.top,
                        left:that.offset.left
                    });
                }
                $(this).css({cursor:'move'});
                x = e.pageX - that.offset.left;
                y = e.pageY - that.offset.top;
                return false;
            });
            that.bindEvent(doc, 'mousemove', function(e){
                var width = $(this).width(), height = $(this).height();
                if(isMove){
                    mx = e.pageX - x;
                    my = e.pageY - y;
                    mx < 0 && (mx = 0);
                    my < 0 && (my = 0);
                    mx + that.size.width > width && (mx = width - that.size.width);
                    my + that.size.height > height && (my = height - that.size.height);
                    that.offset.top = my;
                    that.offset.left = mx;
                    layer.css({top:my, left:mx});
                    return !isMove;
                }
            });
            that.bindEvent(doc, 'mouseup', function(){
                if(isMove){
                    isMove = false;
                    that.layer.title.css({cursor:'default'});
                    mx = mx || that.offset.left;
                    my = my || that.offset.top;
                    if(options.isMoveMask === true){
                        !that.layer.is(':animated') && that.layer.animate({top:my, left:mx}, options.isAnimate === true ? 450 : 0);
                        layer.remove();
                    }
                    if(Layer.bsie6 && options.isFixed === true){
                        that.offset.winTop = my - win.scrollTop();
                        that.offset.winLeft = my - win.scrollLeft();
                    }
                }
            });
        },
        _bindBtnClick:function(){
            var that = this, layer = that.layer,
                options = that.options;
            layer.on('click', function(){
               options.isSticky === true && that.setzIndex();
            });
            layer.button.on('click', function(e){
                var me = $(this), btnid = me.attr('btnid'), callback = options.button[btnid].callback;
                if(btnid === 'confirm'){
                    if(typeof callback === 'function' && callback(layer.main, that.index, me, e) === true){
                        that.hide();
                    }
                }
                else{
                    if(typeof callback !== 'function' || (typeof callback === 'function' && callback(layer.main, that.index, me, e) !== false)){
                        that.hide();
                    }
                }
                return false;
            });
        },
        _bindClick:function(){
            var that = this;
            $.each(Layer.listArray, function(key, val){
                if(val && val !== that){
                    val.isClick = true;
                }
            });
        },
        _setzIndex:function(){
            var that = this, layer = that.layer, i;
            if(that.isClick){
                that.isClick = false;
                that.zIndex = ++Layer.zIndex;
                layer.css({zIndex:that.zIndex});
                that.bindClick();
            }
        },
        _setBottoms:function(hide){
        	var that = this, options = that.options;
        	if(options.bottoms && typeof options.bottoms === 'object'){
            	if(!$.isArray(options.bottoms)){
            		options.bottoms = [options.bottoms]
            	}
            	$.each(options.bottoms, function(key, object){
            		object.layer.css('z-index', !hide ? Layer.maskzIndex : object.zIndex)
            	})
            }
        },
        layerResize:function(){
            var that = this, options = that.options, layer = that.layer, bodyHeight, contentHeight, height,
                winStop = that.wrap.scrollTop(), winSleft = that.wrap.scrollLeft(), headHeight = layer.title.outerHeight(),
                footHeight = layer.foot.outerHeight(), ptb = Layer.getSize(layer, 'tb', 'padding'), bbd = Layer.getSize(layer.main), bl = Layer.getSize(layer),
                bb = Layer.getSize(layer.box), blt = Layer.getSize(layer, 'lr'), extd = {}, speed = 400, wheight = that.wrap.outerHeight() - options.padding,
                wwidth = that.wrap.outerWidth() - options.padding, isiframe = typeof that.iframe === 'object', outerHeight = headHeight + footHeight + ptb + bbd + bl + bb;

            if(isiframe){
                var iframeDoc = that.iframe.contents(),
                    iframeHtml = iframeDoc.find('html').css({overflow:'auto'});
                that.target = that.layer;
                iframeDoc[0].layer = that; //iframe没有加载完获取不到
                contentHeight = iframeHtml.children('body').outerHeight();
            }
            else{
				//如果内容区域子元素为多个，无法获取准确的高度，因此创建一个div容器来获取高度
				var content = layer.main.children();
				if(content.length > 1){
					layer.main.wrapInner('<div style="position:static; display:block; padding:0; margin:0; height:auto; width:auto; border:none; overflow:hidden; background:none;"></div>')
					contentHeight = layer.main.children().height();
					content.unwrap()
				}
				else{
					contentHeight = content.outerHeight()
				}
            }

            if(options.height === 'auto' && options.maxHeight > 0 && that.maxBodyHeight !== undefined && contentHeight > that.maxBodyHeight){
                that.size.height = options.height = options.maxHeight;
                layer.main.height(that.maxBodyHeight);
            }

            if(isiframe){
                if(options.height === 'auto'){
                    contentHeight += outerHeight;
                    if(contentHeight > wheight){
                        that.size.height = wheight;
                    }
                    else{
                        that.size.height = contentHeight;
                    }
                }
            }
            else{
                if(options.height === 'auto'){
                    contentHeight += outerHeight;
                    if(options.scrollbar === true && contentHeight > wheight){
                        that.size.height = wheight;
                    }
                    else{
                        that.size.height = contentHeight;
                    }
                }
            }

            if(options.isMaxSize === true){
                that.size.width = wwidth - blt;
                that.size.height = wheight;
                extd.width = that.size.width - Layer.getSize(layer, 'lr', 'padding');
                speed = 0;
            }

            if(options.isFixed === true && !Layer.bsie6){
                winStop = 0;
            }

            if(options.scrollbar !== true && that.size.height > wheight){
                that.offset.top =  winStop + options.padding;
            }
            else{
                that.offset.top = (that.wrap.outerHeight() - that.size.height) / 2 + winStop;
            }

            if(options.isCenter === true){
                that.offset.left = (that.wrap.outerWidth() - that.size.width) / 2 + winSleft;
            }
            height = that.size.height - ptb - bl;
            bodyHeight = height - bb - headHeight - footHeight - bbd;
            layer.main.stop(true, false).animate({height:bodyHeight}, options.isAnimate === true ? speed : 0);
            isiframe && that.iframe.stop(true, false).animate({height:bodyHeight}, options.isAnimate === true ? speed : 0);
            layer.stop(true, false).animate($.extend({top:that.offset.top, left:that.offset.left, height:height}, extd), options.isAnimate === true ? speed : 0, function(){
                if(Layer.bsie6 && options.isFixed === true){
                    that.offset.winTop = that.offset.top - winStop;
                    that.offset.winLeft = that.offset.left - winSleft;
                }
				!isiframe && layer.main.css('overflow', options.scrollbar === true ? 'auto' : 'visible');
                typeof options.onResizeEvent === 'function' && options.onResizeEvent(layer.main, that.index);
            });
        },
        show:function(){
            var that = this, options = that.options, layer = that.layer, bodyHeight, winStop = that.wrap.scrollTop(), winSleft = that.wrap.scrollLeft(),
                theme = options.theme ? ' t-mask-'+options.theme : '', showType = options.isFadein === true ? 'fadeIn' : 'show', whieght = that.wrap.outerHeight() - options.padding;
            if(options.isFixed === true && !Layer.bsie6){
                winStop = 0;
                winSleft = 0;
                layer.css('position', 'fixed');
            }
            that.size.width = layer.outerWidth();
            that.size.height = layer.outerHeight();
            if(options.scrollbar === true && options.padding>=0 && layer.outerHeight() > whieght){
                that.size.height = layer.height(whieght - Layer.getSize(layer, 'tb', 'all')).outerHeight();
            }
            that.offset.top = parseInt(options.offset.top);
            that.offset.left = parseInt(options.offset.left);
            if(options.scrollbar !== true && that.size.height > whieght){
                that.offset.top = winStop + options.padding;
            }
            else{
                that.offset.top = (isNaN(that.offset.top) ? ((that.wrap.outerHeight() - that.size.height) / 2) : that.offset.top) + winStop;
            }
            that.offset.left = (isNaN(that.offset.left) ? ((that.wrap.outerWidth() - that.size.width) / 2) : that.offset.left) + winSleft;
            if(!!that.index && options.offset.isBasedPrev === true){
                var index = that.index - 1, prevLayer = Layer.listArray[index];
                that.offset.top = prevLayer.offset.top + 10;
                that.offset.left = prevLayer.offset.left + 10;
            }
            if(options.isMask === true){
                if(!Layer.mask || (that.wrap !== win && !that.mask)){
                    if(that.wrap !== win){
                        that.mask = $('<div class="ui-layer-mask'+ theme +'" style="z-index:'+ Layer.maskzIndex +'"><div></div></div>').appendTo(options.container);
                        that.mask.css({position:'absolute'});
                    }
                    else{
                        Layer.mask = $('<div class="ui-layer-mask'+ theme +'" style="z-index:'+ Layer.maskzIndex +'"><div></div></div>').appendTo(options.container);
                    }
                    that.bindEvent(that.mask||Layer.mask, 'click', function(e){
                        typeof options.onMaskClick === 'function' && options.onMaskClick(layer, $(this), e);
                        options.isClickMask === true && that.hide();
                    });
                    if(Layer.bsie6){
                        that.bindEvent(win, 'resize', function(){
                            (that.mask||Layer.mask).css({position:'absolute', width:that.wrap.outerWidth(), height:that.wrap === win ? doc.height() : that.wrap.outerHeight()});
                        }, true);
                    }
                    (that.mask||Layer.mask)[showType]();
                }
            }
            if(Layer.bsie6){
                if(options.isFixed === true){
                    that.offset.winTop = that.offset.top - winStop;
                    that.offset.winLeft = that.offset.left - winSleft;
                    that.bindEvent(win, 'scroll', function(){
                        var css = {
                            top:that.offset.winTop + win.scrollTop(),
                            left:that.offset.winLeft + win.scrollLeft()
                        }
                        that.offset.top = css.top;
                        that.offset.left = css.left;
                        that.moveMask && that.moveMask.css(css);
                        that.layer.css(css);
                    });
                }
                setTimeout(function(){
                    layer.css('overflow', 'visible')
                })
            }

            layer.css({margin:0, top:that.offset.top, left:that.offset.left})[showType]();
            var innerHeight = Layer.getSize(layer.box, 'tb', 'all') +
                              layer.title.outerHeight() + layer.foot.outerHeight() +
                              Layer.getSize(layer.main, 'tb', 'all');
            bodyHeight = layer.height() - innerHeight;
            if(options.maxHeight > 0 && options.maxHeight < that.wrap.outerHeight() - options.padding){
                that.maxBodyHeight = options.maxHeight - Layer.getSize(layer, 'tb', 'all') - innerHeight;
            }
            layer.main.css({height:bodyHeight});

            if(options.iframe.enable === true){
                layer.main.css('overflow','hidden');
            }
            else{
                layer.main.css('overflow', options.scrollbar === true ? 'auto' : 'visible');
            }

            that.bindBtnClick();
            if(options.isCenter === true){
                that.bindEvent(win, 'resize', function(){
                    that.layerResize();
                });
                if(Layer.bsie6){
                    that.layerResize();
                }
            }
            if(typeof options.onShow === 'function'){
                options.onShow(that, layer.main, that.index);
            }
            if(options.timer > 0){
                that.timer = setTimeout(function(){
                    that.hide();
                }, options.timer);
            }
            return that;
        },
        hide:function(){
            var that = this, options = that.options, layer = that.layer, xMask = true;
            layer.remove();
            that.unbindEvent();
            that.setBottoms(true);
            delete Layer.listArray[that.index];
            Layer.zIndex--;
            $.each(Layer.listArray, function(key, val){
                if(val && val.options.isMask == true && val.wrap === win){
                    return (xMask = false);
                }
            });
            if(xMask && Layer.mask){
                Layer.mask.remove();
                Layer.mask = null;
            }
            if(that.mask){
                that.mask.remove();
            }
            if(options.timer > 0){
                clearTimeout(that.timer);
            }
            if(typeof options.onHideEvent === 'function'){
                options.onHideEvent(layer.main, that.index);
                layer.main.remove();
            }
        }
    })
})
