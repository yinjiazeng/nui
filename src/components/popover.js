Nui.define(['../core/component', './layer/layer'], function(component, layer){
    var module = this;
    var require = this.require;
    var extend = this.extend;
    return extend(component, {
        _static:{
            _init:function(){
                var self = this;
                Nui.doc.click(function(){
                    Nui.each(self.__instances, function(v){
                        v._hide();
                    })
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
            //显示之前，return false不显示
            onBefore:null
        },
        _exec:function(){
            var opts = this._options;
            if(!this._getTarget()){
                return
            }
            this._event = opts.event;
            if($.inArray(this._event, ['click', 'mouseenter', 'mouseover']) === -1){
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
                        self._isshow = true;
                        self._show(e, elem)
                    }, 100)
                })
                self._on(self.constructor._events[self._event], self.target, function(e, elem){
                    clearTimeout(self._timer);
                    self._isshow = false;
                    self._hide()
                })
            }
            else{
                self._on(self._event, self.target, function(e, elem){
                    self._show(e, elem)
                })
            }
        },
        _show:function(e, elem){
            var self = this, opts = self._options;
            if(this._callback('Before') === false){
                return
            }
            if(!self.layer || !self.layer.element){
                var _opts = extend({
                    container:elem,
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
                self.layer = layer(_opts)
            }
            e.stopPropagation()
        },
        _hide:function(){
            if(this.layer && !this._isshow){
                this.layer.destroy();
                delete this.layer
            }
        },
        _delete:function(){
            this._hide();
            component.exports._delete.call(this);
        }
    })
})