Nui.define('events', function(){
    return function(opts){
        var that = opts || this,
            elem = that.element, 
            maps = that.mapping, 
            calls = that.callback || {};
        if(!elem || !maps){
            return that
        }
        if(!(elem instanceof jQuery)){
            elem = jQuery(elem)
        }
        var evt, ele, self = that.constructor, ret;
        var callback = function(e, elem, cbs){
            if(typeof cbs === 'function'){
                cbs.call(that, e, elem);
                return
            }
            Nui.each(cbs, function(cb, i){
                cb = calls[cb];
                if(typeof cb === 'function'){
                    return ret = cb.call(that, e, elem, ret);
                }
            }) 
        }

        Nui.each(maps, function(cbs, arrs){
            if(typeof cbs === 'string'){
                cbs = Nui.trim(cbs).split(/\s+/);
            }
            arrs = Nui.trim(arrs).split(/\s+/);
            // keyup:kupdown:focus a => elem.on('keyup kupdown focus', 'a', callback)
            evt = arrs.shift().replace(/:/g, ' ');
            ele = arrs.join(' ');
            if(self && self.__component_name){
                that._on(evt, elem, ele, function(e){
                    callback(e, $(this), cbs)
                })
            }
            else{
                elem.on(evt, ele, function(e){
                    callback(e, $(this), cbs)
                })
            }
        })
        return that
    }
})