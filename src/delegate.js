Nui.define('delegate', function(){
    return function(opts){
        var that = this, elem = opts.elem, maps = opts.maps, calls = opts.calls;
        if(!opts || !elem || !maps || !calls){
            return
        }
        if(!(elem instanceof jQuery)){
            elem = jQuery(elem)
        }
        var evt, ele;
        var callback = function(e, cbs){
            var that = this, $elem = $(that);
            Nui.each(cbs, function(cb, i){
                cb = calls[cb];
                if(typeof cb === 'function'){
                    return cb.call(that, e, $elem)
                }
            }) 
        }
        var isComponent = that.constructor && that.constructor._component_name_;
        Nui.each(maps, function(cbs, arrs){
            cbs = Nui.trim(cbs).split(/\s+/);
            arrs = Nui.trim(arrs).split(/\s+/);
            evt = arrs.shift().replace(/:/g, ' ');
            ele = arrs.join(' ');
            if(isComponent){
                that._on(evt, elem, ele, function(e){
                    callback.call(this, e, cbs)
                })
            }
            else{
                elem.on(evt, ele, function(e){
                    callback.call(this, e, cbs)
                })
            }
        })
        return that
    }
})