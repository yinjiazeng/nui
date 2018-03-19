Nui.define(['../core/component', './layer/layer'], function(component, layer){
    return this.extend(component, {
        _static:{
            _init:function(){
                var self = this;
                Nui.doc.click(function(){
                    self._hide()
                })
            },
            _hide:function(){
                Nui.each(this.__instances, function(v){
                    if(v._isshow){
                        v.hide()
                    }
                })
            },
            _events:{
                mouseenter:'mouseleave',
                mouseover:'mouseout'
            }
        },
        _options:{
            //click mouseenter mouseover
            event:'mouseenter',
            //显示时在容器上添加类名
            showClass:'',
            //显示之前，return false不显示
            onBefore:null,
            //隐藏时是否销毁
            isDestroy:true,
            //显示时回调
            onShow:null,
            //隐藏是回调
            onHide:null
        },
        _exec:function(){
            var opts = this._options;
            if(!this._getTarget()){
                return
            }
            this._event = opts.event;
            if($.inArray(this._event, ['click', 'mouseenter', 'mouseleave']) === -1){
                this._event = 'mouseenter'
            }
            this._events();
        },
        _events:function(){
            var self = this, opts = self._options;
            if(this._event !== 'click'){
                self._timer = null;
                self._on(self._event, self.target, function(e, elem){
                    self._timer = setTimeout(function(){
                        self.show()
                    }, 100)
                })
                self._on(self.constructor._events[self._event], self.target, function(e, elem){
                    clearTimeout(self._timer);
                    self.hide()
                })
            }
            else{
                self._on(self._event, self.target, function(e, elem){
                    self.constructor._hide();
                    self.show();
                    e.stopPropagation()
                })
            }
        },
        show:function(){
            var self = this, opts = self._options, target = self.target;
            if(this._callback('Before') === false){
                return
            }
            if(!opts.isDestroy && self.layer){
                self.layer.element.show()
            }
            else if(!self.layer || !self.layer.element){
                var _opts = Nui.extend(true, {}, {
                    container:target,
                    isMask:false,
                    scrollbar:false,
                    title:null,
                    events:{
                        'click':function(e){
                            e.stopPropagation()
                        }
                    },
                    close:{
                        enable:false
                    },
                    cancel:{
                        enable:false
                    },
                    bubble:{
                        enable:true,
                        dir:'top'
                    }
                }, opts);
                _opts.id = 'popover';
                self.layer = layer(_opts);
                self.layer.popover = self;
                self.layer.resize = Nui.noop;
            }
            
            if(opts.showClass){
                self.target.addClass(opts.showClass)                
            }

            self._isshow = true;

            if(typeof opts.onShow === 'function' && self.layer){
                opts.onShow.call(self.layer._options, self.layer)
            }
        },
        hide:function(){
            var self = this, opts = self._options;
            if(self.layer){
                if(!opts.isDestroy){
                    if(self.layer.element){
                        self.layer.element.hide()
                    }
                }
                else{
                    self.layer.destroy();
                    delete self.layer
                }
                if(opts.showClass){
                    self.target.removeClass(opts.showClass)                
                }

                delete self._isshow;

                if(typeof opts.onHide === 'function' && self.layer){
                    opts.onHide.call(self.layer._options, self.layer)
                }
            }
        },
        _reset:function(){
            if(this.layer){
                this.layer.destroy();
                delete this.layer
            }
            delete this._isshow
            component.exports._reset.call(this);
        }
    })
})